import RegisterPage from "@/app/register/page";
import { cookies } from "next/headers";
import {jwtVerify} from "jose";
import {CookiePayload} from "@/lib/types/cookie-payload";
import {redirect} from "next/navigation";

export default async function () {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
        redirect("/login");
    }
    const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || "fallback-secret"
    );
    const decoded = await jwtVerify(token, secret);
    const payload = decoded.payload as CookiePayload
    if (payload.role=="SUB_ADMIN" || payload.role=="MASTER_ADMIN") {
        return (<RegisterPage/>)
    } else {
        return redirect("/not-found");
    }
}
