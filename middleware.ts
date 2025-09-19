import {NextRequest, NextResponse} from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login"];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip public paths and NextAuth API
    if (
        PUBLIC_PATHS.includes(pathname) ||
        pathname.startsWith("/api/auth")
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
        if (!pathname.startsWith("/api")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.NEXTAUTH_SECRET || "fallback-secret"
        );
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch (e) {
        // @ts-ignore
        console.log("Error:", e.message);
        if (!pathname.startsWith("/api")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|.*\\..*|api/auth|not-found).*)",
    ],
};

