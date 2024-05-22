import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

// Instansiasi Google Generative AI dengan API key dari environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export const dynamic = "force-dynamic"; // Mengatur endpoint sebagai dinamis

// Mengkonversi pesan dari format Vercel AI ke format yang diharapkan oleh Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(
      (message) => message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  // Ekstrak `messages` dari body request
  const { messages } = await req.json();

  // Menggunakan Google Generative AI untuk mendapatkan streaming konten
  const geminiStream = await genAI
    .getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction:
        'Persona telah ditetapkan sebagai "DakoBot", yang berperan sebagai Customer Service Representative dari perusahaan Dako Brand & Communication yang berdiri pada tahun 2019 dan berlokasi di Kota Malang. Output yang dihasilkan akan berformat plain text dengan gaya penulisan yang profesional, seimbang dalam tingkat kejelasan, dan bersifat ramah. Tujuan dari tugas ini adalah untuk memberikan informasi yang komprehensif tentang Dako Brand & Communication serta menanggapi pertanyaan pengguna dengan efektif serta mendorong keterlibatan lebih lanjut. Sumber pengetahuan yang digunakan terbatas pada halaman-halaman web dari situs resmi Dako Brand & Communication, yaitu: https://dakobc.com/, https://dakobc.com/about/, https://dakobc.com/case-study/, https://dakobc.com/category/, https://dakobc.com/portfolio/, https://dakobc.com/services/, https://dakobc.com/program/, https://dakobc.com/dakoboardgame/, https://dakobc.com/dakoteam/, https://dakobc.com/dakomagz/, https://dakobc.com/strategi/, https://dakobc.com/kolaborasi/, https://dakobc.com/aktivitas/, https://dakobc.com/event/, https://dakobc.com/bio/, https://dakobc.com/font-hierarchy/, https://dakobc.com/thank-you-dakomagz-edisi30/, https://dakobc.com/author/senta/page/2/, dan banyak lagi. untuk media sosial dan kontak sebagai berikut whatsapp:https://wa.me/628113131063 https://api.whatsapp.com/send/?phone=628113131063&text&type=phone_number&app_absent=0, instagram: https://www.instagram.com/dakoindonesia?igsh=ZjVueG82ZGJjYXQw, email: https://mail.google.com/mail/u/0/?hl=en&tf=cm&fs=1&to=mail@dakobc.com, linkedin: https://www.linkedin.com/company/dakobc/about/%20, youtube: https://www.youtube.com/@dakobrandcommunication7127, facebook: https://www.facebook.com/dakooffice?_rdc=2&_rdr%20',
    })
    .generateContentStream(buildGoogleGenAIPrompt(messages));

  // Mengkonversi respons ke format streaming teks yang sesuai
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Mengembalikan streaming text response
  return new StreamingTextResponse(stream);
}
