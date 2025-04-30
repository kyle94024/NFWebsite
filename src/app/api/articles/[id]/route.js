export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params; // Extract the article ID from the URL parameters

    try {
        // Validate article ID
        const articleId = parseInt(id, 10);
        if (isNaN(articleId)) {
            return NextResponse.json(
                { success: false, message: "Invalid article ID" },
                { status: 400 }
            );
        }

        // Fetch the article, selected profile fields, and like count
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
                p.lablink,
                (SELECT COUNT(*) FROM article_likes al WHERE al.article_id = a.id) AS like_count
            FROM article a
            LEFT JOIN profile p ON (a.certifiedby->>'userId')::INTEGER = p.user_id
            WHERE a.id = $1
            `,
            [articleId]
        );

        // Check if the article exists
        if (articleResult.rows.length > 0) {
            return NextResponse.json(articleResult.rows[0]); // Send article with profile data and like count
        } else {
            return NextResponse.json(
                { success: false, message: "Article not found" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching article" },
            { status: 500 }
        );
    }
}
