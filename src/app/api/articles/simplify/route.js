// /app/api/articles/simplify/route.js

import { NextResponse } from "next/server";
import { simplifyArticle } from "@/utils/apiHelpers";

export async function POST(req) {
    try {
        const { content, lengthString } = await req.json();

        // Use the utility function to simplify the article
        const simplified = await simplifyArticle(content, lengthString);

        return NextResponse.json({ simplified });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return NextResponse.json(
            { message: "Failed to simplify article" },
            { status: 500 }
        );
    }
}
