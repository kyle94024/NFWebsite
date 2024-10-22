// app/api/auth/signup/route.js
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into database
        const result = await query(
            "INSERT INTO email_credentials (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email",
            [firstName, lastName, email, passwordHash]
        );

        return NextResponse.json(
            {
                message: "Account created successfully",
                user: result.rows[0],
            },
            { status: 201 }
        );
    } catch (error) {
        if (error.code === "23505") {
            // Unique violation error code
            return NextResponse.json(
                { message: "Email already in use." },
                { status: 409 }
            );
        }
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Error creating account" },
            { status: 500 }
        );
    }
}
