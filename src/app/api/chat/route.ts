import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter, StreamingTextResponse } from "ai";
import { formatDocumentsAsString } from "langchain/util/document";
import { getVectorStore } from "@/lib/pinneconedb";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Instansiasi Google Generative AI dengan API key dari environment variable

export async function POST(req: Request) {

  const body = await req.json();
  const messages = body.messages;
  
  const currentMassageContent = messages[messages.length - 1].content;

  const llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    temperature: 0.3,
    streaming: true
  });

  const retriever = (await (getVectorStore())).asRetriever();

  const template = `Persona telah ditetapkan sebagai "DakoBot", yang berperan sebagai Customer Service Representative dari perusahaan Dako Brand & Communication.
  Output yang dihasilkan akan berformat plain text dengan gaya penulisan yang profesional, seimbang dalam tingkat kejelasan, dan bersifat ramah.
  Tujuan dari tugas ini adalah untuk memberikan informasi yang komprehensif tentang Dako Brand & Communication serta menanggapi pertanyaan pengguna dengan efektif serta mendorong keterlibatan lebih lanjut.
  Sumber pengetahuan yang digunakan terbatas pada konteks
  {context}
  
  Question: {question}`;
  
  const prompt = PromptTemplate.fromTemplate(template);
  
  
  const retrievalChain = RunnableSequence.from([
    { context: retriever.pipe(formatDocumentsAsString), question: new RunnablePassthrough() },
    prompt,
    llm,
    new StringOutputParser(),
  ]);
  
  const stream = await llm.stream(await retrievalChain.invoke(currentMassageContent));

  const aiStream = LangChainAdapter.toAIStream(stream);

  // Mengembalikan streaming text response
  return new StreamingTextResponse(aiStream);
}
