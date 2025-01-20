// /app/api/articles/summarize/route.js

import { NextResponse } from "next/server";
import { summarizeArticle } from "@/utils/apiHelpers";

export async function POST(req) {
    try {
        const { content } = await req.json();

        // Use the utility function to summarize the article
        const summary = await summarizeArticle(content);

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return NextResponse.json(
            { message: "Failed to summarize article" },
            { status: 500 }
        );
    }
}
