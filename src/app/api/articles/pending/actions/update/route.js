import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// Only allow POST method
export async function POST(req) {
    const { id, title, tags, innertext, summary, article_link } =
        await req.json(); // Parse JSON body from the request

    try {
        // Execute the update query
        await query(
            "UPDATE pending_article SET title = $1, tags = $2, innertext = $3, summary = $4, article_link = $5 WHERE id = $6",
            [title, tags, innertext, summary, article_link, id]
        );

        return NextResponse.json({
            success: true,
            message: "Pending article updated successfully!",
        });
    } catch (error) {
        console.error("Error updating pending article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
