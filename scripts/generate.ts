import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getVectorStore } from "../src/lib/supabase";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Fungsi utama untuk menghasilkan embeddings
async function generateEmbeddings() {
  // Mengambil vector store dari Supabase
  const vectorStore = await getVectorStore();

  // Membuat loader untuk mengambil konten dari URL menggunakan CheerioWebBaseLoader
  const loader = new CheerioWebBaseLoader(
    "https://lp.dakobc.com/d4eq7almn2kkxyz12o3abcbots/",
    {
      selector: "article", // Selector untuk menentukan elemen HTML yang akan diambil
    }
  );

  // Memuat dokumen dari URL yang ditentukan
  const docs = await loader.load();

  // Membuat splitter untuk memecah dokumen berdasarkan karakter, disesuaikan dengan bahasa HTML
  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");

  // Memecah dokumen yang telah diambil menjadi potongan-potongan yang lebih kecil
  const splitDocs = await splitter.splitDocuments(docs);

  // Menambahkan dokumen yang telah dipecah ke dalam vector store
  await vectorStore.addDocuments(splitDocs);
}

// Memanggil fungsi generateEmbeddings untuk memulai proses
generateEmbeddings();
