// app/api/auth/session/route.js
import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
    const token = req.cookies.get("auth")?.value; // Get the token from cookies

    if (!token) {
        return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    try {
        const decoded = verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        ); // Verify the token

        return NextResponse.json(
            {
                isLoggedIn: true,
                email: decoded.email,
                isAdmin: decoded.isAdmin,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Session verification error:", error);
        return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }
}
