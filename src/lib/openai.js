// lib/openai.js
import OpenAI from "openai";

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
