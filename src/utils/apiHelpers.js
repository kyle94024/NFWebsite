// /utils/apiHelpers.js
import openai from "@/lib/openai";

export async function summarizeArticle(content) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You read long scientific articles and state the main point or conclusion from the article, in one sentence. HARD Maximum of 280 characters",
                },
                { role: "user", content },
            ],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error summarizing article:", error);
        throw error;
    }
}

export async function simplifyArticle(content, lengthString) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You read long scientific articles and simplify them to ${lengthString}.`,
                },
                { role: "user", content },
            ],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error simplifying article:", error);
        throw error;
    }
}
