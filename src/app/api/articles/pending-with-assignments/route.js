// app/api/articles/pending-with-assignments/route.js
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Query to fetch pending articles and their assigned editors
        const articlesWithAssignments = await query(`
            SELECT 
                pa.id AS article_id,
                pa.title,
                pa.tags,
                pa.innertext,
                pa.summary,
                pa.article_link,
                pa.created_at,
                pa.certifiedby,
                pa.publisher,
                pa.image_url,
                ec.id AS editor_id,
                ec.first_name || ' ' || ec.last_name AS editor_name,
                ec.email AS editor_email
            FROM pending_article pa
            LEFT JOIN article_assignments aa ON pa.id = aa.article_id
            LEFT JOIN email_credentials ec ON aa.editor_id = ec.id
            WHERE pa.certifiedby IS NULL
        `);

        // Format the response to match the structure of other endpoints
        const formattedResponse = articlesWithAssignments.rows.map(
            (article) => ({
                id: article.article_id,
                title: article.title,
                tags: article.tags,
                innertext: article.innertext,
                summary: article.summary,
                article_link: article.article_link,
                created_at: article.created_at,
                certifiedby: article.certifiedby,
                publisher: JSON.parse(article.publisher || "{}"),
                image_url: article.image_url,
                assigned_editor: article.editor_id
                    ? {
                          id: article.editor_id,
                          name: article.editor_name,
                          email: article.editor_email,
                      }
                    : null,
            })
        );

        return NextResponse.json(formattedResponse);
    } catch (error) {
        console.error("Error fetching articles with assignments:", error);
        return NextResponse.json(
            { message: "Error fetching articles with assignments" },
            { status: 500 }
        );
    }
}
