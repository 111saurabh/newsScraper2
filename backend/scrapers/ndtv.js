const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

/**
 * NDTV News Scraper
 * Scrapes articles from NDTV news website
 */
class NDTVScraper {
  constructor() {
    this.baseUrl = "https://www.ndtv.com";
    this.categories = {
      tech: "/gadgets/news",
      politics: "/india/politics",
      sports: "/sports",
      business: "/business",
      entertainment: "/entertainment",
      health: "/health",
      science: "/science",
      world: "/world-news",
    };
  }

  /**
   * Get articles from a specific category
   * @param {string} category - Category to scrape
   * @param {number} limit - Maximum number of articles to scrape
   * @returns {Promise<Array>} - Array of article objects
   */
  async getArticlesByCategory(category, limit = 10) {
    try {
      const categoryUrl = this.categories[category.toLowerCase()];
      if (!categoryUrl) {
        throw new Error(`Invalid category: ${category}`);
      }

      const url = `${this.baseUrl}${categoryUrl}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const articles = [];

      // Select article containers
      $(".news_Itm").each((i, element) => {
        if (i >= limit) return false;

        const title = $(element).find(".newsHdng").text().trim();
        const summary = $(element).find(".newsCont").text().trim();
        const articleUrl = $(element).find("a").attr("href");
        const fullUrl = articleUrl.startsWith("http")
          ? articleUrl
          : `${this.baseUrl}${articleUrl}`;
        //
        let imageUrl = $(element).find("img").attr("src") || "";

        if (imageUrl.startsWith("//")) {
          imageUrl = "https:" + imageUrl;
        } else if (imageUrl.startsWith("/")) {
          imageUrl = this.baseUrl + imageUrl;
        } else if (!imageUrl.startsWith("http")) {
          imageUrl = "";
        }
        const publishedAt = $(element).find(".posted-by").text().trim();

        articles.push({
          title,
          summary,
          url: fullUrl,
          imageUrl,
          source: "NDTV",
          category: this.mapCategory(category),
          publishedAt: this.parseDate(publishedAt),
          scrapedAt: new Date(),
        });
      });

      return articles;
    } catch (error) {
      console.error(`Error scraping NDTV ${category}:`, error);
      return [];
    }
  }

  /**
   * Get full article content
   * @param {string} url - Article URL
   * @returns {Promise<Object>} - Article object with content
   */
  async getArticleContent(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const content = $(".story__content").text().trim();
      const author = $(".pst-by-txt a").text().trim() || "NDTV Staff";
      const keywords = [];

      // Extract keywords/tags
      $(".tg_wrp a").each((i, element) => {
        keywords.push($(element).text().trim());
      });

      return { content, author, keywords };
    } catch (error) {
      console.error(`Error scraping article content from ${url}:`, error);
      return { content: "", author: "Unknown", keywords: [] };
    }
  }

  /**
   * Save articles to database
   * @param {Array} articles - Array of article objects
   * @returns {Promise<number>} - Number of articles saved
   */
  async saveArticles(articles) {
    let savedCount = 0;

    for (const article of articles) {
      try {
        // Check if article already exists
        const existingArticle = await Article.findOne({ url: article.url });
        if (existingArticle) continue;

        // Get full article content
        const { content, author, keywords } = await this.getArticleContent(
          article.url
        );

        // Create new article
        const newArticle = new Article({
          ...article,
          content,
          author,
          keywords,
        });

        await newArticle.save();
        savedCount++;
      } catch (error) {
        console.error(`Error saving article ${article.url}:`, error);
      }
    }

    return savedCount;
  }

  /**
   * Parse date string to Date object
   * @param {string} dateStr - Date string
   * @returns {Date} - Date object
   */
  parseDate(dateStr) {
    try {
      if (!dateStr) return new Date();

      // Extract date part from string like "Updated: April 10, 2023 10:30 IST"
      const dateMatch = dateStr.match(/\w+ \d+, \d{4}/);
      if (dateMatch) {
        return new Date(dateMatch[0]);
      }

      return new Date();
    } catch (error) {
      return new Date();
    }
  }

  /**
   * Map category to standardized format
   * @param {string} category - Category string
   * @returns {string} - Standardized category
   */
  mapCategory(category) {
    const categoryMap = {
      tech: "Tech",
      gadgets: "Tech",
      politics: "Politics",
      sports: "Sports",
      business: "Business",
      entertainment: "Entertainment",
      health: "Health",
      science: "Science",
      world: "World",
      "world-news": "World",
    };

    return categoryMap[category.toLowerCase()] || "World";
  }
}

module.exports = NDTVScraper;
