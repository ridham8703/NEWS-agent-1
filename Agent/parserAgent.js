

import { groq } from "../services/openAiServices.js";

function cleanJsonResponse(text) {
  let cleaned = text.trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Extract first JSON object found
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return cleaned;
}

export async function parseUserQuery(query) {
  const prompt = `Extract topic and date from: "${query}"

Rules for date extraction:
- "today" or "today's" → return "today"
- "yesterday" or "yesterday's" → return "yesterday"
- "latest" or "recent" → return "latest"
- Specific date like "2025-10-09" → return exact date "YYYY-MM-DD"
- "last week", "past week" → return "last_week"
- No date mentioned → return null

Return ONLY this JSON format (no extra text):
{"topic": "string", "date": "today/yesterday/latest/YYYY-MM-DD/null"}

Examples:
"Tell me today's cricket news" → {"topic": "cricket", "date": "today"}
"India news on 2025-10-09" → {"topic": "India", "date": "2025-10-09"}
"Latest AI news" → {"topic": "AI", "date": "latest"}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a JSON parser. Return ONLY valid JSON with no markdown, no explanations, no extra text. Be precise with date extraction."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Lower temperature for more consistent parsing
    });

    const rawContent = completion.choices[0].message.content;
    console.log(" AI Raw Response:", rawContent);
    
    const cleanedContent = cleanJsonResponse(rawContent);
    console.log(" Cleaned Response:", cleanedContent);
    
    const parsed = JSON.parse(cleanedContent);
    
    // Fallback: If AI doesn't detect "today" properly, do manual check
    const queryLower = query.toLowerCase();
    if (!parsed.date || parsed.date === null || parsed.date === "null") {
      if (queryLower.includes("today") || queryLower.includes("today's")) {
        parsed.date = "today";
        console.log(" Manual override: Set date to 'today'");
      } else if (queryLower.includes("yesterday") || queryLower.includes("yesterday's")) {
        parsed.date = "yesterday";
        console.log(" Manual override: Set date to 'yesterday'");
      } else if (queryLower.includes("latest") || queryLower.includes("recent")) {
        parsed.date = "latest";
        console.log(" Manual override: Set date to 'latest'");
      }
    }
    
    console.log(" Final Parsed:", parsed);
    return parsed;
    
  } catch (error) {
    console.error(" Error parsing query:", error.message);
    console.error(" Raw response:", completion?.choices[0]?.message?.content);
    
    // Fallback parsing
    const queryLower = query.toLowerCase();
    let fallbackDate = null;
    
    if (queryLower.includes("today") || queryLower.includes("today's")) {
      fallbackDate = "today";
    } else if (queryLower.includes("yesterday") || queryLower.includes("yesterday's")) {
      fallbackDate = "yesterday";
    } else if (queryLower.includes("latest") || queryLower.includes("recent")) {
      fallbackDate = "latest";
    }
    
    // Extract topic (simple word extraction)
    const words = query.toLowerCase().split(' ');
    const stopWords = ['tell', 'me', 'about', 'news', 'the', 'get', 'give', 'show', 'find', 'search'];
    const topic = words.find(w => !stopWords.includes(w) && w.length > 2) || "general";
    
    console.log(" Using fallback parsing:", { topic, date: fallbackDate });
    return { topic, date: fallbackDate };
  }
}