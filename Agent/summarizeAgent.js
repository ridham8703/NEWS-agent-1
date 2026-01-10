


// agents/summarizeNews.js
import { groq } from "../services/openAiServices.js";

export async function summarizeNews(newsText, topic, date) {
  const prompt = `
  You are a friendly AI news assistant.
  Summarize this ${topic} news ${date ? "from " + date : "recently"} 
  into 5 short conversational bullet points. Be natural and clear.

  News:
  ${newsText}
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(" Error summarizing news:", error.message);
    return "Sorry, I couldn't summarize the news right now.";
  }
}