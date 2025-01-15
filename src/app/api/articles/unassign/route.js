// app/api/articles/unassign/route.js
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { articleId, editorId } = await request.json();

        await query(
            `DELETE FROM article_assignments WHERE article_id = $1 AND editor_id = $2`,
            [articleId, editorId]
        );

        return NextResponse.json({
            message: "Article unassigned successfully",
        });
    } catch (error) {
        console.error("Error unassigning article:", error);
        return NextResponse.json(
            { message: "Error unassigning article" },
            { status: 500 }
        );
    }
}
