const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("../models/Article");

/**
 * WION News Scraper
 * Scrapes articles from WION news website
 */
class WIONScraper {
  constructor() {
    this.baseUrl = "https://www.wionews.com";
    this.categories = {
      tech: "/technology",
      politics: "/world/politics",
      sports: "/sports",
      business: "/business-economy",
      entertainment: "/entertainment",
      health: "/life-fun/health-and-wellness",
      science: "/science",
      world: "/world",
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
      $(".article-list .article-item").each((i, element) => {
        if (i >= limit) return false;

        const title = $(element).find(".article-title").text().trim();
        const summary = $(element).find(".article-summary").text().trim();
        const articleUrl = $(element).find("a").attr("href");
        const fullUrl = articleUrl.startsWith("http")
          ? articleUrl
          : `${this.baseUrl}${articleUrl}`;
        // const imageUrl = $(element).find('img').attr('src') || '';

        let imageUrl = $(element).find("img").attr("src") || "";

        if (imageUrl.startsWith("//")) {
          imageUrl = "https:" + imageUrl;
        } else if (imageUrl.startsWith("/")) {
          imageUrl = this.baseUrl + imageUrl;
        } else if (!imageUrl.startsWith("http")) {
          imageUrl = "";
        }

        const publishedAt = $(element).find(".article-date").text().trim();

        articles.push({
          title,
          summary,
          url: fullUrl,
          imageUrl,
          source: "WION",
          category: this.mapCategory(category),
          publishedAt: this.parseDate(publishedAt),
          scrapedAt: new Date(),
        });
      });

      return articles;
    } catch (error) {
      console.error(`Error scraping WION ${category}:`, error);
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

      const content = $(".article-content").text().trim();
      const author = $(".article-author").text().trim() || "WION Staff";
      const keywords = [];

      // Extract keywords/tags
      $(".article-tags a").each((i, element) => {
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
      return new Date(dateStr);
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
      technology: "Tech",
      politics: "Politics",
      sports: "Sports",
      business: "Business",
      "business-economy": "Business",
      entertainment: "Entertainment",
      health: "Health",
      "health-and-wellness": "Health",
      science: "Science",
      world: "World",
    };

    return categoryMap[category.toLowerCase()] || "World";
  }
}

module.exports = WIONScraper;
