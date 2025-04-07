export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    try {
        if (!userId || isNaN(parseInt(userId, 10))) {
            return NextResponse.json(
                { message: "Valid userId query parameter is required" },
                { status: 400 }
            );
        }

        const result = await query(
            `
            SELECT 
                a.*, 
                p.photo,
                p.name
            FROM article_likes al
            JOIN article a ON al.article_id = a.id
            LEFT JOIN profile p ON (a.certifiedby->>'userId')::INTEGER = p.user_id
            WHERE al.user_id = $1
            ORDER BY al.created_at DESC
            `,
            [parseInt(userId, 10)]
        );

        return NextResponse.json(result.rows); // Return articles with user photos and names
    } catch (error) {
        console.error("Error executing query:", error);
        return NextResponse.json(
            { message: "Error executing query" },
            { status: 500 }
        );
    }
}
