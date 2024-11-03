// app/api/articles/[id]/route.js
export const fetchCache = "force-no-store";

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params; // Extract the article ID from the URL parameters

    try {
        // Fetch the article from the database using the provided ID
        const articleResult = await query(
            "SELECT * FROM article WHERE id = $1",
            [id]
        );

        // Check if the article exists
        if (articleResult.rows.length > 0) {
            return NextResponse.json(articleResult.rows[0]); // Send the article as a JSON response
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
