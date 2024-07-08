<div align="center">
  <h1>📕 Dokumentasi DakoBot</h1>
  <strong>Panduan Instalasi dan Penggunaan dari Website DakoBot</strong><br>
  <strong>Built for Dako Brand & Communication</strong>
</div>
<br>

## Pendahuluan
![image](https://github.com/kesiddewa/dako-chatbot/assets/87534128/fe9acf27-0fb2-4164-94d3-2e9d4f8766cd)

### Nama Proyek: DakoBot

### Deskripsi Singkat
DakoBot adalah chatbot berbasis web yang dirancang untuk membantu pelanggan dan calon pelanggan mendapatkan informasi tentang perusahaan Dako Brand & Communication. DakoBot menggunakan kecerdasan buatan (AI) untuk memberikan jawaban yang relevan dan tepat waktu atas pertanyaan-pertanyaan mengenai layanan, produk, dan informasi umum tentang perusahaan.

### Fitur Utama
1. **Pengenalan Perusahaan**: Memberikan informasi dasar tentang Dako Brand & Communication.
2. **Informasi Produk dan Layanan**: Menyediakan detail tentang berbagai produk dan layanan yang ditawarkan oleh perusahaan.
3. **Dukungan Pelanggan**: Menjawab pertanyaan umum dan memberikan solusi atas masalah yang sering dihadapi pelanggan.
4. **Kontak dan Lokasi**: Menyediakan informasi kontak dan lokasi kantor perusahaan.

### Teknologi yang Digunakan
* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![GeminiAPI][Gemini]][Gemini-url]
* [![AISDK][VercelAISDK]][AISDK-url]
* [![Tailwind][TailwindCSS]][Tailwind-url]
* [![Shadcn][ShadcnUI]][Shadcn-url]

## Instalasi

### Prasyarat
- Node.js (versi terbaru)
- npm atau yarn
- API Key dari Google Gemini
- URL dan ANON Key dari Supabase database

### Langkah Instalasi

#### 1. Clone Repository:
```bash
git clone https://github.com/kesiddewa/dako-chatbot.git
cd dako-chatbot
```
#### 2. Instalasi Dependensi:

Menggunakan npm:
```bash
npm install
```

Menggunakan yarn:
```bash
yarn install
```

#### 3. Mendaftar dan Membuat Proyek di Supabase

- Daftar atau masuk ke [Supabase](https://supabase.io/).
- Buat proyek baru dan catat URL dan API Key proyek tersebut.

#### 4. Membuat Tabel dan Fungsi di Supabase
- Buka Supabase dashboard, masuk ke proyek Anda.
- Navigasikan ke bagian "SQL Editor" dan masukkan query berikut untuk membuat tabel dan fungsi yang diperlukan:
```bash
-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(768) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(768),
  match_count int default null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

#### 5. Melakukan Konfigurasi Environment
Di dalam file .env.local, tambahkan konfigurasi berikut:
```bash
GOOGLE_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_api_key
```

#### 7. Menjalankan Aplikasi

Menggunakan npm:
```bash
npm run dev
```

Menggunakan yarn:
```bash
yarn dev
```

## Panduan Penggunaan

#### 1. Mengakses Chatbot 
Buka browser dan akses http://localhost:3000 untuk melihat aplikasi chatbot.

#### 2. Berinteraksi dengan Chatbot 
- Ketikkan pesan Anda di kotak input dan tekan enter.
- Chatbot akan merespons menggunakan Google Gemini API.



[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Gemini]: https://img.shields.io/badge/Google%20Gemini-black?style=for-the-badge&logo=googlegemini&logoColor=%238E75B2
[Gemini-url]:https://ai.google.dev/gemini-api
[VercelAISDK]: https://img.shields.io/badge/Vercel%20AI%20SDK-black?style=for-the-badge&logo=vercel&logoColor=white
[AISDK-url]: https://sdk.vercel.ai/docs/introduction
[TailwindCSS]: https://img.shields.io/badge/Tailwind%20CSS-black?style=for-the-badge&logo=tailwindcss&logoColor=%2306B6D4
[Tailwind-url]: https://tailwindcss.com/docs/flex
[ShadcnUI]: https://img.shields.io/badge/Shadcn%2Fui-black?style=for-the-badge&logo=shadcnui&logoColor=white
[Shadcn-url]: https://ui.shadcn.com/
