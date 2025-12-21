
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: 'multi-agent-creative-studio/.env' });

async function test() {
    const key = process.env.GOOGLE_API_KEY;
    const modelName = process.env.GENAI_MODEL || 'gemini-1.5-flash';
    console.log(`Testing with model: ${modelName}`);
    if (!key) {
        console.error('No API key found');
        process.exit(1);
    }
    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

test();
