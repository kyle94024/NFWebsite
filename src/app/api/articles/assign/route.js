// app/api/articles/assign/route.js
export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { editorIds, articleIds } = await request.json();

        // Start a transaction
        await query("BEGIN");

        for (const editorId of editorIds) {
            for (const articleId of articleIds) {
                // Delete the old assignment if it exists
                await query(
                    "DELETE FROM article_assignments WHERE article_id = $1",
                    [articleId]
                );

                // Insert the new assignment
                await query(
                    "INSERT INTO article_assignments (editor_id, article_id) VALUES ($1, $2)",
                    [editorId, articleId]
                );
            }
        }

        // Commit the transaction
        await query("COMMIT");

        return NextResponse.json({ message: "Articles assigned successfully" });
    } catch (error) {
        // Rollback the transaction in case of error
        await query("ROLLBACK");
        console.error("Error assigning articles:", error);
        return NextResponse.json(
            { message: "Error assigning articles" },
            { status: 500 }
        );
    }
}
