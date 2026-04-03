import "dotenv/config";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}


const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: requireEnv("OPENAI_API_KEY"),
});

const pinecone = new PineconeClient({ apiKey: requireEnv("PINECONE_API_KEY") });
const pineconeIndex = pinecone.Index(requireEnv("PINECONE_INDEX_NAME"));

export const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
    pineconeIndex,
        // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
        // You can pass a namespace here too
        // namespace: "foo",
    }
);

export async function indexTheDocument(filePath) {
    const loader = new PDFLoader(filePath, { splitPages: false });

    const doc = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 100
    });

    const texts = await textSplitter.splitText(doc[0].pageContent);

    const documents = texts.map((chunk) => {
        return {
            pageContent: chunk,
            metadata: doc[0].metadata
        }
    });

    // console.log(documents);

    await vectorStore.addDocuments(documents);
}