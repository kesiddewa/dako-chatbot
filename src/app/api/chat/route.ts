import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter, StreamingTextResponse } from "ai";
import { formatDocumentsAsString } from "langchain/util/document";
import { getVectorStore } from "@/lib/supabase";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Instansiasi Google Generative AI dengan API key dari environment variable

export async function POST(req: Request) {
  // Mengambil body dari request
  const body = await req.json();

  // Mengambil pesan terakhir dari array messages
  const messages = body.messages;
  const currentMassageContent = messages[messages.length - 1].content;

  // Membuat instance dari ChatGoogleGenerativeAI dengan konfigurasi tertentu
  const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    temperature: 0.1,
    streaming: true,
  });

  // Mengambil retriever dari vector store menggunakan Supabase
  const retriever = (await getVectorStore()).asRetriever();

  // Template prompt yang digunakan untuk berinteraksi dengan model
  const template = `Persona telah ditetapkan sebagai "DakoBot", yang berperan sebagai Customer Service Representative dari perusahaan Dako Brand & Communication.
  Output yang dihasilkan akan berformat plain text dengan gaya penulisan yang profesional, seimbang dalam tingkat kejelasan, dan bersifat ramah.
  Tujuan dari tugas ini adalah untuk memberikan informasi yang komprehensif tentang Dako Brand & Communication serta menanggapi pertanyaan pengguna dengan efektif serta mendorong keterlibatan lebih lanjut.
  Sumber pengetahuan yang digunakan terbatas pada konteks, jangan memberikan jawaban diluar konteks
  {context}
  
  Question: {question}`;

  // Membuat instance PromptTemplate dari template yang sudah didefinisikan
  const prompt = PromptTemplate.fromTemplate(template);

  // Membuat retrieval chain menggunakan RunnableSequence
  const retrievalChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  // Mendapatkan stream dari llm setelah menjalankan retrieval chain
  const stream = await llm.stream(
    await retrievalChain.invoke(currentMassageContent)
  );

   // Mengubah stream menjadi AI stream menggunakan LangChainAdapter
  const aiStream = LangChainAdapter.toAIStream(stream);

  // Mengembalikan streaming text response
  return new StreamingTextResponse(aiStream);
}
