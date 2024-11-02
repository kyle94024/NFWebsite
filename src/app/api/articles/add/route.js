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
        } = await req.json();

        // Generate the summary and simplified content
        const summary = await summarizeArticle(innertext);
        const simplified = await simplifyArticle(innertext, simplifyLength);

        // Use the query helper to insert into the database, including the publisher
        const result = await query(
            "INSERT INTO pending_article (title, tags, innertext, summary, article_link, publisher) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [title, tags, simplified, summary, article_link, publisher]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error adding article:", error);
        return NextResponse.json(
            { error: "Error adding article" },
            { status: 500 }
        );
    }
}
