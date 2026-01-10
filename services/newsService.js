import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function fetchNews(topic, date) {
  try {
    console.log(" Fetching news for:", topic);
    console.log("Date filter:", date);

    const searchQuery = encodeURIComponent(topic);

    // NewsAPI.org endpoint
    let url = `https://newsapi.org/v2/everything?q=${searchQuery}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWSAPI_KEY}`;

    // Add date filter if provided
    if (date && date !== "null" && date !== null) {
      const dateObj = parseDateString(date);

      if (dateObj) {
        // NewsAPI accepts date in YYYY-MM-DD format
        const targetDate = dateObj.toISOString().split("T")[0];
        url += `&from=${targetDate}&to=${targetDate}`;
        console.log(" API date filter:", targetDate);
      }
    } else {
      // For latest news, get from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fromDate = sevenDaysAgo.toISOString().split("T")[0];
      url += `&from=${fromDate}`;
      console.log(" Latest news from:", fromDate);
    }

    console.log("Fetching from NewsAPI.org...");
    console.log(" URL:", url.replace(process.env.NEWSAPI_KEY, "***"));

    const response = await axios.get(url, {
      timeout: 15000,
      timeoutErrorMessage: "Request timed out after 15 seconds",
    });

    const data = response.data;

    console.log("Response received, status:", response.status);

    // Check if articles exist
    if (!data.articles || data.articles.length === 0) {
      console.warn(" No articles in response");
      return `No news found for "${topic}" ${
        date ? `on ${date}` : "recently"
      }.`;
    }

    const articles = data.articles;
    console.log(` Received ${articles.length} articles`);

    // Log what we got
    console.log(" Articles:");
    articles.slice(0, 3).forEach((a, i) => {
      const pubDate = a.publishedAt
        ? new Date(a.publishedAt).toISOString().split("T")[0]
        : "N/A";
      console.log(`  ${i + 1}. [${pubDate}] ${a.title.substring(0, 60)}...`);
    });

    // Format articles
    const formattedNews = articles
      .slice(0, 10) // Get top 10 articles
      .map((article, index) => {
        const pubDate = article.publishedAt
          ? new Date(article.publishedAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "Date not available";

        return `
Article ${index + 1}:
Title: ${article.title}
Description: ${article.description || "No description available"}
Source: ${article.source.name}
Author: ${article.author || "Unknown"}
Published: ${pubDate}
URL: ${article.url}
        `.trim();
      })
      .join("\n\n---\n\n");

    return formattedNews;
  } catch (error) {
    console.error(" Full Error:", error);
    console.error(" Error Message:", error.message);

    // Enhanced error handling
    if (error.response) {
      console.error(" API Response Status:", error.response.status);
      console.error(" API Response Data:", error.response.data);

      if (error.response.status === 401) {
        return "Invalid NewsAPI key. Please check your NEWSAPI_KEY in .env file.";
      }
      if (error.response.status === 429) {
        return "API rate limit exceeded (100 requests/day on free plan). Please try again later.";
      }
      if (error.response.status === 426) {
        return "Your API plan doesn't support this request. Please upgrade or adjust query parameters.";
      }
      if (error.response.status === 400) {
        return `Bad request: ${
          error.response.data?.message || "Invalid parameters"
        }`;
      }
    } else if (error.code === "ENOTFOUND") {
      return "Network error: Cannot reach NewsAPI. Check your internet connection.";
    } else if (error.code === "ECONNREFUSED") {
      return "Connection refused. NewsAPI may be down.";
    } else if (
      error.code === "ETIMEDOUT" ||
      error.message.includes("timeout")
    ) {
      return "Request timed out. Please try again.";
    }

    return `Error fetching news: ${error.message}`;
  }
}

function parseDateString(dateStr) {
  if (!dateStr) return null;

  const today = new Date();

  // Handle "today"
  if (dateStr.toLowerCase() === "today") {
    return today;
  }

  // Handle "yesterday"
  if (dateStr.toLowerCase() === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  // Handle YYYY-MM-DD format
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(dateStr + "T00:00:00Z");
  }

  // Try parsing as general date string
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}
