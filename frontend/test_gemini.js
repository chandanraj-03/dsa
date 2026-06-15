import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Explain how AI works in a few words");
    console.log(result.response.text());
  } catch (e) {
    console.error("SDK ERROR MESSAGE:", e.message);
  }
}
run();
