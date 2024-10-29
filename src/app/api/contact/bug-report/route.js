// /app/api/contact//route.js

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req) {
    try {
        const { report, submitted_by, anonymous } = await req.json();
        const submittedAt = new Date().toISOString();

        // Insert bug report; conditionally include 'submitted_by' based on anonymity
        const result = await query(
            `INSERT INTO bug_reports (report, submitted_at${
                anonymous ? "" : ", submitted_by"
            }) 
            VALUES ($1, $2${anonymous ? "" : ", $3"}) RETURNING *;`,
            anonymous
                ? [JSON.stringify(report), submittedAt] // Save report as JSON if needed
                : [JSON.stringify(report), submittedAt, submitted_by] // Use the submitted_by variable
        );

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error adding bug report:", error);
        return NextResponse.json(
            { error: "Error adding bug report" },
            { status: 500 }
        );
    }
}
