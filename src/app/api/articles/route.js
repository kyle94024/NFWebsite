export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
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
            `
        );

        return NextResponse.json(result.rows); // Return articles with user photos and names
    } catch (error) {
        console.error("Error executing query", error);

        return NextResponse.json(
            { message: "Error executing query" },
            { status: 500 }
        );
    }
}
