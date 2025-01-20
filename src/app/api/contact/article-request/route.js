// /app/api/contact/article-request/route.js

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
    try {
        const { article_link, submitted_by, anonymous } = await req.json();

        // Insert article request; conditionally include 'requested_by' based on anonymity
        const result = await query(
            `INSERT INTO requested_articles (article_link${
                anonymous ? "" : ", requested_by"
            }) 
            VALUES ($1${anonymous ? "" : ", $2"}) RETURNING *;`,
            anonymous ? [article_link] : [article_link, submitted_by]
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error adding article request:", error);
        return NextResponse.json(
            { error: "Error adding article request" },
            { status: 500 }
        );
    }
}
