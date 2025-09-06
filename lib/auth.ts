import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
// import { generateToken } from "@/lib/utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Custom email sending logic - temporarily disabled
        console.log('Email verification requested for:', identifier);
        console.log('Verification URL:', url);
        // const { host } = new URL(url);
        // const transport = await provider.createTransport();
        // await transport.sendMail({
        //   to: identifier,
        //   from: provider.from,
        //   subject: `Sign in to ${host}`,
        //   text: `Sign in to ${host}\n\n${url}\n\nThis link will expire in 24 hours.`,
        //   html: `
        //     <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        //       <h2 style="color: #0D9488;">Sign in to Studiio</h2>
        //       <p>Click the button below to sign in to your account:</p>
        //       <a href="${url}" style="display: inline-block; background-color: #0D9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
        //         Sign In
        //     </a>
        //       <p style="color: #666; font-size: 14px;">
        //         This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
        //       </p>
        //     </div>
        //   `,
        // });
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `studiio-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Get user's tenant memberships
        const userTenants = await prisma.userTenant.findMany({
          where: { userId: user.id, isActive: true },
          include: { tenant: true },
        });
        
        session.user.tenants = userTenants.map(ut => ({
          id: ut.tenant.id,
          name: ut.tenant.name,
          slug: ut.tenant.slug,
          role: ut.role,
        }));
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/auth/error",
  },
  events: {
    async signIn({ user }) {
      // Update last sign in
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });
    },
  },
};

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      tenants: Array<{
        id: string;
        name: string;
        slug: string;
        role: string;
      }>;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

