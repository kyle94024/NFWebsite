import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// Only allow POST method
export async function POST(req) {
    const { id } = await req.json(); // Parse JSON body from the request

    try {
        // Step 1: Retrieve the article
        const result = await query("SELECT * FROM article WHERE id = $1", [id]);
        const article = result.rows[0];

        // Check if article exists
        if (!article) {
            return NextResponse.json(
                { success: false, message: "Article not found" },
                { status: 404 }
            );
        }

        // Step 2: Insert article into pending_article table
        await query(
            "INSERT INTO pending_article (title, tags, innertext, summary, article_link) VALUES ($1, $2, $3, $4, $5)",
            [
                article.title,
                article.tags,
                article.innertext,
                article.summary,
                article.article_link,
            ]
        );

        // Step 3: Delete the article from the article table
        await query("DELETE FROM article WHERE id = $1", [id]);

        return NextResponse.json({
            success: true,
            message: "Article retracted successfully!",
        });
    } catch (error) {
        console.error("Error retracting article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
