import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', ec.id,
                            'name', ec.first_name || ' ' || ec.last_name,
                            'email', ec.email
                        )
                    ) FILTER (WHERE ec.id IS NOT NULL),
                    '[]'
                ) AS assigned_editors
            FROM pending_article pa
            LEFT JOIN article_assignments aa ON pa.id = aa.article_id
            LEFT JOIN email_credentials ec ON aa.editor_id = ec.id
            WHERE pa.certifiedby IS NULL
            GROUP BY pa.id
        `);

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
                publisher: article.publisher
                    ? JSON.parse(article.publisher)
                    : null,
                image_url: article.image_url,
                assigned_editors: Array.isArray(article.assigned_editors)
                    ? article.assigned_editors
                    : [],
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
