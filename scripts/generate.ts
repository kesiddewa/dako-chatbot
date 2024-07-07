import dotenv from "dotenv"
dotenv.config({path: ".env.local"})
import { getVectorStore } from "../src/lib/supabase";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

async function generateEmbeddings() {
  const vectorStore = await getVectorStore();

  const loader = new CheerioWebBaseLoader(
      "https://lp.dakobc.com/d4eq7almn2kkxyz12o3abcbots/",
      {
        selector: "article"
      }
  );
    
  const docs = await loader.load();
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const splitDocs = await splitter.splitDocuments(docs);
  await vectorStore.addDocuments(splitDocs);
}

generateEmbeddings();