export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch recent 6 articles along with profile photos and names
        const result = await query(
            `
            SELECT 
                a.*, 
                p.photo, 
                p.name 
            FROM article a
            LEFT JOIN profile p 
            ON (a.certifiedby->>'userId')::INTEGER = p.user_id
            ORDER BY a.id DESC
            LIMIT 6
            `
        );

        return NextResponse.json(result.rows); // Return recent articles with user photos and names
    } catch (error) {
        console.error("Error fetching recent articles:", error);
        return NextResponse.json(
            { message: "Error fetching recent articles" },
            { status: 500 }
        );
    }
}