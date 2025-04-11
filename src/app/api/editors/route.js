// app/api/editors/route.js
export const revalidate = 0; // Disable caching for this API route

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Join the `email_credentials` and `profile` tables on the `user_id` column
        const result = await query(
            `
            SELECT
                ec.id,
                ec.email,
                p.name,
                p.photo,
                p.title,
                p.degree,
                p.university
            FROM
                email_credentials ec
            LEFT JOIN
                profile p
            ON
                ec.id = p.user_id
            WHERE
                ec.role = 'editor'
            `
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching editors:", error);
        return NextResponse.json(
            { message: "Error fetching editors" },
            { status: 500 }
        );
    }
}
