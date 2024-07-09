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

// Fungsi untuk mengambil data dari tabel 'documents' di Supabase
export const fetchData = async () => {
  const { data, error } = await client.from("documents").select("*"); // Memilih semua kolom. Anda dapat menyesuaikan ini untuk memilih kolom tertentu.

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (data) {
    let dataIds: Array<string>;
    // Mengasumsikan setiap baris memiliki field 'id'
    dataIds = data.map((row) => row.id);

    // Jika Anda perlu bekerja dengan ID spesifik
    var firstId = "";
    if (dataIds.length > 0) {
      firstId = dataIds[0];
    }

    // Menghapus data dari vector store berdasarkan ID
    (await getVectorStore()).delete({ ids: dataIds });
  }
};

// Memanggil fungsi fetchData untuk mengambil dan menghapus data dari Supabase
fetchData();
