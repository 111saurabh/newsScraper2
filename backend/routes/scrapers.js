const express = require('express');
const router = express.Router();

const WIONScraper = require('../scrapers/wion');
const NDTVScraper = require('../scrapers/ndtv');
const FirstPostScraper = require('../scrapers/firstpost');
const TheWireScraper = require('../scrapers/thewire');

const scrapers = {
  wion: new WIONScraper(),
  ndtv: new NDTVScraper(),
  firstpost: new FirstPostScraper(),
  thewire: new TheWireScraper()
};

// Route: GET /api/scrapers/:source/:category
router.get('/:source/:category', async (req, res) => {
  const { source, category } = req.params;

  const scraper = scrapers[source.toLowerCase()];
  if (!scraper) {
    return res.status(400).json({ message: `Unsupported news source: ${source}` });
  }

  try {
    const articles = await scraper.getArticlesByCategory(category, 10);
    const savedCount = await scraper.saveArticles(articles);
    res.status(200).json({ savedCount, articles });
  } catch (error) {
    console.error(`Error scraping ${source} - ${category}:`, error);
    res.status(500).json({ message: 'Scraping failed' });
  }
});

module.exports = router;
