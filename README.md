# RAG ChatBot

A Retrieval-Augmented Generation (RAG) chatbot built with Node.js that answers questions based on the contents of PDF documents. It indexes documents into a Pinecone vector database and uses Groq-hosted Llama 3.3 for conversational responses grounded in your data.

## How It Works

The chatbot operates in two stages:

### Stage 1 — Document Indexing (`npm run prepare`)
1. Loads a PDF document using LangChain's `PDFLoader`
2. Splits the document into chunks (500 characters, 100 overlap) with `RecursiveCharacterTextSplitter`
3. Generates vector embeddings using OpenAI's `text-embedding-3-small` model
4. Stores the embeddings in a Pinecone vector database

### Stage 2 — Interactive Chat (`npm start`)
1. Accepts user questions via an interactive CLI
2. Performs a similarity search against the vector store to retrieve the 3 most relevant chunks
3. Passes the question and retrieved context to Llama 3.3 70B (via Groq) to generate an answer
4. Type `/bye` to exit the chat

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **LLM:** Llama 3.3 70B Versatile (via [Groq](https://groq.com/))
- **Embeddings:** OpenAI `text-embedding-3-small`
- **Vector Store:** [Pinecone](https://www.pinecone.io/)
- **Framework:** [LangChain.js](https://js.langchain.com/)
- **PDF Parsing:** pdf-parse

## Prerequisites

- Node.js v18+
- A [Groq](https://console.groq.com/) API key
- An [OpenAI](https://platform.openai.com/) API key
- A [Pinecone](https://www.pinecone.io/) account with an index created

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AMARTYA149/RAG-Chatbot.git
   cd RAG-Chatbot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root with the following variables:

   ```
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_pinecone_index_name
   ```

4. **Add your PDF document**

   Place the PDF you want to index in the project root. Update the file path in [rag.js](rag.js) if your file is named differently:

   ```js
   const filePath = './your-document.pdf';
   ```

## Usage

### Index a document

```bash
npm run prepare
```

This reads the PDF, splits it into chunks, generates embeddings, and stores them in Pinecone.

### Start the chatbot

```bash
npm start
```

Ask questions and get answers based on the indexed document content. Type `/bye` to exit.

```
You: What is the company's refund policy?
Assistant: Based on the internal documentation, the refund policy states that...
You: /bye
```

## Project Structure

```
├── chat.js       # Interactive CLI chatbot with RAG retrieval
├── prepare.js    # PDF loading, chunking, embedding, and Pinecone setup
├── rag.js        # Entry point for document indexing
├── package.json  # Dependencies and scripts
└── .gitignore    # Ignores node_modules and .env
```

## License

ISC
