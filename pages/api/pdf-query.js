import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
	try {
		if (req.method !== "POST") {
			throw new Error("Method not allowed");
		}

		console.log("Query PDF");

		// Grab the user prompt
		const { input } = req.body;

		if (!input) {
			throw new Error("No input");
		}

		console.log("input received:", input);

		const client = new PineconeClient();
		await client.init({
			apiKey: process.env.PINECONE_API_KEY,
			environment: process.env.PINECONE_ENVIRONMENT,
		});
		const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

		const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), { pineconeIndex });

		// Alternative: use Supabase instead of Pinecone if you're on waitlist (see this video for explanation: https://www.udemy.com/course/langchain-develop-ai-web-apps-with-javascript-and-langchain/learn/lecture/38362160)

		// const privateKey = process.env.SUPABASE_PRIVATE_KEY;
		// if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

		// const url = process.env.SUPABASE_URL;
		// if (!url) throw new Error(`Expected env var SUPABASE_URL`);

		// const client = createClient(url, privateKey);

		// const vectorStore = await SupabaseVectorStore.fromExistingIndex(
		//   new OpenAIEmbeddings(),
		//   { client, tableName: "documents", queryName: "match_documents" }
		// );

		/* Part Two: Use as part of a chain (currently no metadata filters) */
		const model = new OpenAI();
		const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
			k: 1,
			returnSourceDocuments: true,
		});
		const response = await chain.call({ query: input });

		console.log(response);

		return res.status(200).json({ result: response });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message });
	}
}
