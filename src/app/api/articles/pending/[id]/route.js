// File: api/articles/pending/[id]/route.js
export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

    try {
        // Fetch a single pending article by ID
        const result = await query(
            "SELECT * FROM pending_article WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { message: "Article not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching article by ID:", error);
        return NextResponse.json(
            { message: "Error fetching article" },
            { status: 500 }
        );
    }
}
