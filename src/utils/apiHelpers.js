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
                        "Can you write this as 2-3 sentence teaser summary for a Scientific American article for a lay person. Please define key medical terms. Maximum of 280 characters",
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
    //Emphasize innovation, significance, findings and impact as well as any relevance to persons with neurofibromatosis or schwannomatosis.Please explain key medical terms if they show up and include limitations of the study, and
    try {
        var prompt = `You simplify scientific articles into a science article that would be understandable to an 8th grader, but with medical terms explained. Briefly mention the authors of the study, with "Original article by [...]" as the first line, but dont include the title. However, this should still be structured as an casual science article, but each paragraph should be medium length.
                             Respond using html formatting, with inline css (colors, bolding, format) to make it beautiful, and add in headers sized and different sized text to be visually appealing, but still in article style. Use different styles to make it look really nice, like paragraph headings, etc. Any css should start with "apicss-[name]" as to not interfere with existing css. "Make sure to add in sufficient whitespace for clarity, such as lines after paragraphs, bigger headers for broader section titles, etc. This will be on a HTML page, but dont start your response with ''' html. Likely, these will be multiple long paragraphs of text.`;
        var exampleoutput = `Here is an example output:
        Improving the Quality of Life for People with NF1: A New Approach to Addressing Appearance Concerns in Clinical Trials
        For people living with Neurofibromatosis type 1 (NF1), the visible impact of the condition can be as challenging as its physical symptoms. Tumors like cutaneous and plexiform neurofibromas, while non-cancerous, often lead to visible differences that can deeply affect confidence, emotional well-being, and quality of life.

        Despite these significant impacts, most clinical trials for NF1 treatments focus on reducing tumor size, often overlooking how patients feel about their appearance. A recent study led by Dr. Vanessa Merker and the REiNS International Collaboration sought to change this by identifying tools to measure appearance-related concerns in NF1 clinical trials. The goal? To ensure new treatments don’t just shrink tumors but also improve the lives of those affected.

        Why This Matters
        NF1 tumors can cause visible disfigurements, leading many individuals to feel self-conscious, unhappy, or socially isolated. While reducing tumor size is a step forward, it doesn’t always correlate with how a person feels about their appearance. This gap can hinder the full understanding of a treatment's impact.
        The U.S. Food and Drug Administration (FDA) has emphasized the need for clinical trials to measure not just physical changes but also improvements in how patients feel and function. This is where patient-reported outcome (PRO) measures come in—tools that capture patients' perspectives on their experiences.

        A Tool for the Job
        The REiNS team reviewed over 30 existing PRO measures to find one suitable for assessing appearance concerns in NF1. Their top recommendation? The FACE-Q Craniofacial Module - Appearance Distress Scale.
        This scale evaluates social and psychological concerns tied to appearance, such as feeling self-conscious, avoiding social situations, or being unhappy about how one looks. Although originally developed for individuals with facial differences, it could potentially be adapted for NF1 patients with tumors on various parts of the body. It is brief, easy to use, and suitable for both children and adults.

        Strengths and Limitations
        The FACE-Q scale offers several advantages:
        Ease of Use: It takes only five minutes to complete.
        Proven Reliability: It has undergone rigorous testing and includes NF1 patients in its validation sample.
        Inclusive Design: It is appropriate for a wide age range and has versions in multiple languages.
        However, the scale isn’t without limitations. It hasn’t been tested extensively in older adults or patients with non-facial tumors. Additionally, its sensitivity to changes over time, such as those resulting from treatment, remains unproven. Further research is needed to adapt and validate the scale specifically for NF1 clinical trials.

        A Step Toward Patient-Centered Care
        This study marks an important shift in NF1 research. By focusing on appearance-related concerns, researchers can better address the needs of patients, ensuring that treatments don’t just target tumors but also improve self-esteem and emotional well-being.
        Involving patients in the research process was key to the study’s success. Patient representatives played a crucial role in identifying meaningful ways to measure appearance concerns and ensuring that tools like the FACE-Q scale reflect the lived experiences of those with NF1.

        Looking Forward
        The FACE-Q Craniofacial Module - Appearance Distress Scale is a promising starting point for capturing the psychosocial impacts of NF1-related tumors. Future research will refine and validate this tool while exploring additional ways to measure how NF1 affects quality of life.

        For individuals with NF1, this focus on appearance and well-being represents an important step toward treatments that address their full range of needs, offering hope for a brighter, more confident future.`
        content = prompt + exampleoutput + ". Here is what you need to simplify: " + content;
        const response = await openai.chat.completions.create({
            model: "o1-mini", //GPT Model
            messages: [
                // {
                //     role: "system", //You read long scientific articles and simplify them to ${lengthString}. 
                //     //Here s how to handle each length unit:
                //     // - If it's "paragraphs", limit the response to the specified number of paragraphs.
                //     // - If it's "words", simplify the content to the specified number of words.
                //     // - If it's "percent", reduce the content by the specified percentage of the original content's length.
                //     // - If it's "characters", shorten the content to the specified number of characters.
                //     // - If it's "sentences", condense the content to the specified number of sentences.
                //     content: "You summarize scientific articles into a full article in Scientific American style that would be understandable to an 8th grader. Write sections on innovation, significance, findings and  impact as well as any relevance to persons with neurofibromatosis or schwannomatosis. Define key medical terms when needed and include limitations of the study."
                // },
                // { role: "user", content: `Finish every sentence with the word "duck".
                //                 You simplify scientific articles into a full article in Scientific American style that would be understandable to an 8th grader. In multiple paragraphs, emphasize innovation, significance, findings and impact as well as any relevance to persons with neurofibromatosis or schwannomatosis. Please explain key medical terms if they show up and include limitations of the study, and briefly mention the authors of the study, with "Original article by [...]" under the title. However, this should still be structured as an scientific essay/article.
                //                 Do not use bullet points.
                //               Respond using Markdown formatting, and add in headers sized and different sized text to be visually appealing, but still in scientific american style. Use different styles to make it look really nice, like paragraph headings, etc. Make sure to add in sufficient whitespace for clarity, such as two blank lines after paragraphs, bigger headers for broader section titles, etc. This will be on a HTML page. Likely, these will be multiple paragraphs of text.`},
                { role: "user", content},
            ],
        });

        // Convert Markdown to HTML
        // const markdown = response.choices[0].message.content.replace(
        //     /^[\s\n]+|[\s\n]+$/g,
        //     ""
        // );
        // const html = markdownToHtml(markdown); // Converts markdown to HTML

        let html = response.choices[0].message.content

        if (html.startsWith("```html")) {
            html = html.slice(7); // Remove the first 7 characters
        }

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
