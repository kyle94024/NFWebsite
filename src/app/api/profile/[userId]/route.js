export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { userId } = params; // Extract the userId from the URL parameters

    try {
        // Fetch the profile from the database using the provided userId
        const profileResult = await query(
            `SELECT user_id, name, email, photo, bio, degree, title, university, linkedin, lablink
             FROM profile
             WHERE user_id = $1`,
            [userId]
        );

        // Check if the profile exists
        if (profileResult.rows.length > 0) {
            return NextResponse.json(profileResult.rows[0]); // Send the profile as a JSON response
        } else {
            return NextResponse.json(
                { message: "Profile not found" },
                { status: 404 }
            ); // Profile not found
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { message: "Error fetching profile" },
            { status: 500 }
        ); // Handle any other errors
    }
}