import { query } from "@/lib/db";
import { NextResponse } from "next/server";

// Only allow DELETE method
export async function DELETE(req) {
    const { id } = await req.json(); // Parse JSON body from the request

    try {
        // Execute delete query
        await query("DELETE FROM article WHERE id = $1", [id]);

        return NextResponse.json({
            success: true,
            message: "Article deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
