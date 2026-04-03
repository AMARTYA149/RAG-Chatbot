import "dotenv/config";
import OpenAI from "openai";
import readline from 'node:readline/promises';
import { vectorStore } from "./prepare.js";


const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const messages = [
    {
        //Setting persona of the llm agent
        role: "user",
        content: 'Explain the importance of fast language models'
    }

];

export async function chat() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
        const question = await rl.question('You: ');
        if (question === '/bye') {
            break;
        }

        //Retrieval
        const relevantChunks = await vectorStore.similaritySearch(question, 3);
        const context = relevantChunks.map(chunk => {
            return chunk.pageContent
        }).join('\n\n');

        const SYSTEM_PROMPT = `You are an assistant for question answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know`;

        const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer: `;

        const completion = await client.chat.completions.create({

            model: "llama-3.3-70b-versatile",
            messages: [{ role: 'system', content: SYSTEM_PROMPT },
            {
                //Setting persona of the llm agent
                role: "user",
                content: userQuery
            }

            ],
        });

        console.log(`Assistant: ${completion.choices[0].message.content}`);
    }
    rl.close();
}

chat();