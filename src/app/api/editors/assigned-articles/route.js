export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    const editorId = request.nextUrl.searchParams.get("editorId");

    if (!editorId) {
        return NextResponse.json(
            { message: "Editor ID is required" },
            { status: 400 }
        );
    }

    try {
        const result = await query(
            `
            SELECT pa.* 
            FROM pending_article pa
            JOIN article_assignments aa ON pa.id = aa.article_id
            WHERE aa.editor_id = $1
            ORDER BY pa.created_at DESC
        `,
            [editorId]
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching assigned articles:", error);
        return NextResponse.json(
            { message: "Error fetching assigned articles" },
            { status: 500 }
        );
    }
}
