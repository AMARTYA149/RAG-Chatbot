// Implementation Plan
// Stage 1: Indexing
// 1. Load the document - pdf, Text completed
// 2. Chunk the document - completed
// 3. Generate vector embeddings - completed
// 4. Store the vector embeddings - vector database - completed

// Stage 2: Using the chatbot
// 1. Setup LLM - Completed
// 2. Add retrieval step - Completed
// 3. Pass input + relevant information to LLM - completed
// 4. Congratulations - Done

import { indexTheDocument } from "./prepare.js";

const filePath = './cg-internal-docs.pdf';

indexTheDocument(filePath);