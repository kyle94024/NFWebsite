import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { currentPassword, newPassword, email } = await req.json();

        // Get user from the database (replace with session user info)
        const userResult = await query(
            "SELECT * FROM email_credentials WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password_hash
        );

        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Current password is incorrect" },
                { status: 401 }
            );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password in the database
        await query(
            "UPDATE email_credentials SET password_hash = $1 WHERE email = $2",
            [newPasswordHash, email]
        );

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update password error:", error);
        return NextResponse.json(
            { message: "Error updating password" },
            { status: 500 }
        );
    }
}
