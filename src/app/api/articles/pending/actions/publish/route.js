import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// Only allow POST method
export async function POST(req) {
    const { id, certifiedby } = await req.json(); // Parse JSON body from the request

    try {
        // Fetch the article from the pending_article table, including image_url
        const result = await query(
            "SELECT * FROM pending_article WHERE id = $1",
            [id]
        );
        const article = result.rows[0];

        // Check if the article exists
        if (!article) {
            return NextResponse.json(
                { success: false, message: "Article not found" },
                { status: 404 }
            );
        }

        // Insert the article into the article table, including the certifiedby and image_url fields
        await query(
            "INSERT INTO article (title, tags, innertext, summary, article_link, publisher, certifiedby, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)",
            [
                article.title,
                article.tags,
                article.innertext,
                article.summary,
                article.article_link,
                article.publisher,
                JSON.stringify(certifiedby),
                article.image_url, // Include image_url in the insertion
            ]
        );

        // Delete the article from the pending_article table
        await query("DELETE FROM pending_article WHERE id = $1", [id]);

        return NextResponse.json({
            success: true,
            message: "Article published successfully!",
        });
    } catch (error) {
        console.error("Error publishing article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
