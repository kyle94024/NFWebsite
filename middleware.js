import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Allow access to the home page, login, and signup
    if (
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup")
    ) {
        const response = NextResponse.next();
        response.headers.set("Cache-Control", "no-store");
        return response;
    }

    const token = req.cookies.get("auth");

    if (!token) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.headers.set("Cache-Control", "no-store");
        return response;
    }

    try {
        const decoded = verify(
            token.value,
            process.env.JWT_SECRET || "your-secret-key"
        );
        req.user = decoded;

        const response = NextResponse.next();
        response.headers.set("Cache-Control", "no-store"); // Disable caching for authenticated routes
        return response;
    } catch (error) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.headers.set("Cache-Control", "no-store"); // Disable caching on redirect
        return response;
    }
}

// This will protect all routes except /, /login, and /signup
export const config = {
    matcher: ["/((?!login|signup).*)"],
};
