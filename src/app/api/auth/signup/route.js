// app/api/auth/signup/route.js
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user into the email_credentials table
        const result = await query(
            `INSERT INTO email_credentials (first_name, last_name, email, password_hash) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, email`,
            [firstName, lastName, email, passwordHash]
        );

        const userId = result.rows[0].id; // Get the ID of the newly created user
        const userEmail = result.rows[0].email; // Get the email of the newly created user

        // Create a blank profile for the user
        await query(
            `INSERT INTO profile (user_id, name, email, photo, bio) 
            VALUES ($1, $2, $3, $4, $5)`,
            [userId, `${firstName} ${lastName}`, userEmail, null, null] // Include email
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
            // Unique violation error code (e.g., duplicate email)
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