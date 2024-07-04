import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";

const pinecone = new Pinecone();

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

export async function getVectorStore() {
    return PineconeStore.fromExistingIndex(
      new GoogleGenerativeAIEmbeddings(),
      { pineconeIndex}
    );
}

