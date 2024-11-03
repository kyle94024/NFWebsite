// middleware.js
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
        return NextResponse.next();
    }

    const token = req.cookies.get("auth");

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const decoded = verify(
            token.value,
            process.env.JWT_SECRET || "your-secret-key"
        );
        req.user = decoded;
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// This will protect all routes except /, /login, and /signup
export const config = {
    matcher: ["/((?!login|signup).*)"],
};
