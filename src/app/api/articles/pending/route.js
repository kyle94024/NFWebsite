export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch pending articles from the database
        const result = await query(
            "SELECT * FROM pending_article ORDER BY created_at DESC"
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching pending articles:", error);
        return NextResponse.json(
            { message: "Error fetching pending articles" },
            { status: 500 }
        );
    }
}
