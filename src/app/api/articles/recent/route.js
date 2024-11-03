export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch recent 6 articles from the database
        const result = await query(
            "SELECT * FROM article ORDER BY id DESC LIMIT 6"
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching recent articles:", error);
        return NextResponse.json(
            { message: "Error fetching recent articles" },
            { status: 500 }
        );
    }
}
