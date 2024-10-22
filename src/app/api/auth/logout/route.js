// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Clear the auth cookie by setting it with an expired date
        const response = NextResponse.json({ message: "Logout successful" });

        // Set the cookie to expire immediately
        response.headers.set(
            "Set-Cookie",
            "auth=; Max-Age=0; path=/; HttpOnly; secure; SameSite=strict"
        );

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Error during logout" },
            { status: 500 }
        );
    }
}
