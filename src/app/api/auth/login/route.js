// app/api/auth/login/route.js
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Get user from the database
        const userResult = await query(
            "SELECT * FROM email_credentials WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const adminResult = await query(
            "SELECT * FROM admin_users WHERE email = $1",
            [email]
        );
        const isAdmin = adminResult.rows.length > 0;

        // Create JWT token
        const token = sign(
            {
                email: user.email,
                isAdmin,
                role: user.role,
                id: user.id,
                name: user.first_name + " " + user.last_name,
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1d" }
        );

        // Set JWT cookie
        const cookie = serialize("auth", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400,
            path: "/",
        });

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                email: user.email,
                userId: user.id,
                name: user.first_name + " " + user.last_name,
                isAdmin,
            },
        });

        response.headers.set("Set-Cookie", cookie);
        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Error during login" },
            { status: 500 }
        );
    }
}
