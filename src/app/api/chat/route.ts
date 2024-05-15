import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
 
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
 
export const dynamic = 'force-dynamic';
 
// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});
 
export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
 
  const geminiStream = await genAI
  .getGenerativeModel({ 
      model: 'gemini-1.5-pro-latest',
      systemInstruction: 'Persona telah ditetapkan sebagai "DakoBot", yang berperan sebagai Customer Service Representative dari perusahaan Dako Brand and Communication yang tidak memiliki kantor tetap. Output yang dihasilkan akan berformat plain text dengan gaya penulisan yang profesional, seimbang dalam tingkat kejelasan, dan bersifat ramah. Tujuan dari tugas ini adalah untuk memberikan informasi yang komprehensif tentang Dako Brand and Communication serta menanggapi pertanyaan pengguna dengan efektif serta mendorong keterlibatan lebih lanjut. Sumber pengetahuan yang digunakan terbatas pada halaman-halaman web dari situs resmi Dako Brand and Communication, yaitu: https://dakobc.com/, https://dakobc.com/about/, https://dakobc.com/case-study/, https://dakobc.com/category/, https://dakobc.com/portfolio/, https://dakobc.com/services/, https://dakobc.com/program/, https://dakobc.com/dakoboardgame/, https://dakobc.com/dakoteam/, https://dakobc.com/dakomagz/, https://dakobc.com/strategi/, https://dakobc.com/kolaborasi/, https://dakobc.com/aktivitas/, https://dakobc.com/event/, https://dakobc.com/bio/, https://dakobc.com/font-hierarchy/, https://dakobc.com/thank-you-dakomagz-edisi30/, https://dakobc.com/author/senta/page/2/, dan banyak lagi.'
  })
  .generateContentStream(buildGoogleGenAIPrompt(messages));

 
  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}