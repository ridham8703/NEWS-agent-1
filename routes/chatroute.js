


import express from "express";
import { parseUserQuery } from "../Agent/parserAgent.js";
import { fetchNews } from "./../services/newsService.js";
import { summarizeNews } from "../Agent/summarizeAgent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required." });
    }

    console.log(` User Query: ${query}`);

    // Parse user query
    const { topic, date } = await parseUserQuery(query);
    
    // Enhanced date detection - override if user explicitly asks for today/yesterday
    let finalDate = date;
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes("today") || queryLower.includes("today's")) {
      finalDate = "today";
      console.log(" Detected 'today' request - setting date to today");
    } else if (queryLower.includes("yesterday") || queryLower.includes("yesterday's")) {
      finalDate = "yesterday";
      console.log(" Detected 'yesterday' request - setting date to yesterday");
    } else if (queryLower.includes("latest") || queryLower.includes("recent")) {
      finalDate = "latest";
      console.log(" Detected 'latest' request - fetching recent news");
    }
    
    // Fetch news with the correct date
    const newsText = await fetchNews(topic, finalDate);
  const isErrorResponse = !newsText.includes("Article 1:") && !newsText.includes("Title:");
    
    if (!newsText || isErrorResponse) {
      console.warn(" No articles found or error occurred:", newsText);
      return res.status(400).json({ 
        success: false, 
        message: newsText || "No news found for this query."
      });
    }
 

    // Summarize with proper date context
    const summary = await summarizeNews(newsText, topic, finalDate);
    console.log(" Summary generated", summary);
    
    res.json({
      success: true,
      topic,
      date: finalDate || "latest",
      summary,
    });
  } catch (error) {
    console.error(" Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;