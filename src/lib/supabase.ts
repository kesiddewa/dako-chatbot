import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

// Mengambil URL dan key Supabase dari environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Membuat instance client untuk Supabase
export const client = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk mendapatkan vector store dari Supabase
export async function getVectorStore() {
  return SupabaseVectorStore.fromExistingIndex(
    new GoogleGenerativeAIEmbeddings(), // Menggunakan embeddings dari Google Generative AI
    {
      client, // Menggunakan client Supabase yang telah dibuat
      tableName: "documents", // Nama tabel di Supabase untuk menyimpan dokumen
      queryName: "match_documents", // Nama query untuk mencocokkan dokumen
    }
  );
}
