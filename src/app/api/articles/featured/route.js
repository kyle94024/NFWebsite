export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch article IDs from the featured table
        const featuredResult = await query(
            "SELECT article_ids FROM featured LIMIT 1"
        );
        const articleIds = featuredResult.rows[0]?.article_ids;

        let articles = [];
        if (articleIds && articleIds.length) {
            // Fetch articles along with profile photos and names based on the fetched IDs
            const articlesResult = await query(
                `
                SELECT 
                    a.*, 
                    p.photo, 
                    p.name 
                FROM article a
                LEFT JOIN profile p 
                ON (a.certifiedby->>'userId')::INTEGER = p.user_id
                WHERE a.id = ANY($1)
                `,
                [articleIds]
            );
            articles = articlesResult.rows;
        }

        return NextResponse.json(articles); // Return articles with user photos and names
    } catch (error) {
        console.error("Error fetching featured articles:", error);
        return NextResponse.json(
            { message: "Error fetching featured articles" },
            { status: 500 }
        );
    }
}