// app/api/articles/[id]/route.js
export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params; // Extract the article ID from the URL parameters

    try {
        // Fetch the article along with selected profile fields from the database
        const articleResult = await query(
            `
            SELECT 
                a.*, 
                p.email, 
                p.name, 
                p.photo, 
                p.bio, 
                p.degree, 
                p.university, 
                p.linkedin, 
                p.lablink
            FROM article a
            LEFT JOIN profile p ON (a.certifiedby->>'userId')::INTEGER = p.user_id
            WHERE a.id = $1
            `,
            [id]
        );

        // Check if the article exists
        if (articleResult.rows.length > 0) {
            return NextResponse.json(articleResult.rows[0]); // Send the article with selected profile data as a JSON response
        } else {
            return NextResponse.json(
                { message: "Article not found" },
                { status: 404 }
            ); // Article not found
        }
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json(
            { message: "Error fetching article" },
            { status: 500 }
        ); // Handle any other errors
    }
}