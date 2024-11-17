import openai from "@/lib/openai";
import { marked } from "marked"; // You may need to install this package

export async function summarizeArticle(content) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", //GPT model
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
            model: "gpt-4o", //GPT Model
            messages: [
                {
                    role: "system",
                    content: `You read long scientific articles and simplify them to ${lengthString}. 
                              Please maintain paragraph breaks, bullet points, and list formatting where relevant.
                              
                              Here’s how to handle each length unit:
                              - If it's "paragraphs", limit the response to the specified number of paragraphs.
                              - If it's "words", simplify the content to the specified number of words.
                              - If it's "percent", reduce the content by the specified percentage of the original content's length.
                              - If it's "characters", shorten the content to the specified number of characters.
                              - If it's "sentences", condense the content to the specified number of sentences.
                              
                              Respond using Markdown formatting.`,
                },
                { role: "user", content },
            ],
        });

        // Convert Markdown to HTML
        const markdown = response.choices[0].message.content.replace(
            /^[\s\n]+|[\s\n]+$/g,
            ""
        );
        const html = markdownToHtml(markdown); // Converts markdown to HTML

        return html;
    } catch (error) {
        console.error("Error simplifying article:", error);
        throw error;
    }
}

// Utility function to convert Markdown to HTML
function markdownToHtml(markdown) {
    return marked(markdown);
}
