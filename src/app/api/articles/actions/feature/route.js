import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { articleId, shouldBeFeatured } = await req.json();

    try {
        // Fetch the current array of featured article IDs
        const fetchResult = await query(
            "SELECT article_ids FROM featured LIMIT 1"
        );
        let currentFeaturedIds = fetchResult.rows[0]?.article_ids || [];

        if (shouldBeFeatured) {
            if (!currentFeaturedIds.includes(articleId)) {
                currentFeaturedIds.push(articleId);
            }
        } else {
            currentFeaturedIds = currentFeaturedIds.filter(
                (id) => id !== articleId
            );
        }

        // Update the featured article IDs in the database
        await query("UPDATE featured SET article_ids = $1 WHERE id = 1", [
            currentFeaturedIds,
        ]);

        return NextResponse.json({
            message: "Featured articles updated successfully.",
        });
    } catch (error) {
        console.error("Error updating featured articles:", error.stack);
        return NextResponse.json(
            { error: "Error updating featured articles" },
            { status: 500 }
        );
    }
}
