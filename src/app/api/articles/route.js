export const fetchCache = "force-no-store";

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await query("SELECT * FROM article;");

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error executing query", error);

        return NextResponse.json(
            { message: "Error executing query" },
            { status: 500 }
        );
    }
}
