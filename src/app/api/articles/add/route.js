import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { summarizeArticle, simplifyArticle } from "@/utils/apiHelpers"; // Utility functions for OpenAI API calls

export async function POST(req) {
    try {
        const {
            title,
            tags,
            innertext,
            article_link,
            simplifyLength,
            publisher,
            image_url,
            role,
            userId,
        } = await req.json();

        // Generate the summary and simplified content
        const summary = await summarizeArticle(innertext);
        const simplified = await simplifyArticle(innertext, simplifyLength);

        // Start a transaction to ensure consistency
        await query("BEGIN");

        // Insert into the database, including the publisher and image URL
        const result = await query(
            `INSERT INTO pending_article 
                (title, tags, innertext, summary, article_link, publisher, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, title, tags, innertext, summary, article_link, publisher, image_url;`,
            [
                title,
                tags,
                simplified,
                summary,
                article_link,
                publisher,
                image_url,
            ]
        );

        const insertedArticle = result.rows[0];
        const articleId = insertedArticle.id;

        // Auto-assign the article if the role is 'editor'
        if (role === "editor") {
            await query(
                `INSERT INTO article_assignments (editor_id, article_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT DO NOTHING`,
                [userId, articleId]
            );
        }

        // Commit transaction
        await query("COMMIT");

        return NextResponse.json(insertedArticle);
    } catch (error) {
        // Rollback in case of error
        await query("ROLLBACK");
        console.error("Error adding article:", error);
        return NextResponse.json(
            { error: "Error adding article" },
            { status: 500 }
        );
    }
}
