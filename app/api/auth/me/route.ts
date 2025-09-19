import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client/edge'
import {withAccelerate} from '@prisma/extension-accelerate'
import {jwtVerify} from "jose";
import {CookiePayload} from "@/lib/types/cookie-payload";

const prisma = new PrismaClient().$extends(withAccelerate())

export async function GET(request: NextRequest) {
    try {
        // Get the auth token from cookies
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json(
                {error: 'No authentication token found'},
                {status: 401}
            );
        }

        // Verify the JWT token
        const secret = new TextEncoder().encode(
            process.env.NEXTAUTH_SECRET || "fallback-secret"
        );
        const decoded = await jwtVerify(token, secret);
        const payload = decoded.payload as CookiePayload

        // Get user information
        const user = await prisma.user.findUnique({
            where: {id: payload.userId},
            include: {
                userTenants: {
                    include: {
                        tenant: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                {error: 'User not found'},
                {status: 404}
            );
        }

        // Get the current tenant (from the token)
        const currentTenant = user.userTenants.find(ut =>
            ut.tenantId === payload.tenantId);

        const responseData: any = {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: payload.role,
                tenant: {
                    id: payload.tenantId,
                    name: currentTenant?.tenant.name,
                    slug: payload.tenantSlug
                }
            }
        };

        // Add client information if this is a client user
        if (payload.role === "CLIENT" && payload.clientId) {
            const client = await prisma.client.findUnique({
                where: {id: payload.clientId}
            });
            if (client) {
                responseData.client = {
                    id: client.id,
                    name: client.name
                };
            }
        }

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error fetching user info:', error);
        return NextResponse.json(
            {error: 'Invalid token or server error'},
            {status: 401}
        );
    } finally {
        await prisma.$disconnect();
    }
}
