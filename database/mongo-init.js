db = db.getSiblingDB('news-scraper');

// Create user for application
db.createUser({
  user: 'news-app-user',
  pwd: 'news-app-password',
  roles: [
    { role: 'readWrite', db: 'news-scraper' }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('articles');
db.createCollection('notes');

// Sample users
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'admin123'
    role: 'admin',
    preferences: {
      categories: ['Tech', 'Politics', 'Business'],
      sources: ['WION', 'Firstpost']
    },
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'user123'
    role: 'user',
    preferences: {
      categories: ['Sports', 'Entertainment'],
      sources: ['NDTV', 'The Wire']
    },
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

db.users.insertMany(users);

// Sample articles
const articles = [
  {
    title: 'The Future of Artificial Intelligence',
    content: 'Artificial intelligence (AI) is transforming industries and societies around the world. From healthcare to transportation, AI technologies are being deployed to solve complex problems and create new opportunities.\n\nRecent advances in machine learning, particularly deep learning, have enabled AI systems to perform tasks that were once thought to be the exclusive domain of human intelligence. These include image and speech recognition, natural language processing, and even creative endeavors like art and music composition.\n\nHowever, the rapid development of AI also raises important ethical and societal questions. Issues of bias, privacy, security, and the impact on employment are at the forefront of discussions about how AI should be developed and regulated.\n\nAs we look to the future, it\'s clear that AI will continue to play an increasingly important role in our lives. The challenge will be to harness its potential while addressing the risks and ensuring that the benefits are widely shared.',
    summary: 'Exploring the latest developments in AI technology and their implications for society and industry.',
    url: 'https://example.com/tech/ai-future',
    imageUrl: 'https://example.com/images/ai-future.jpg',
    source: 'WION',
    category: 'Tech',
    author: 'Dr. Sarah Chen',
    publishedAt: new Date('2025-04-01'),
    scrapedAt: new Date(),
    keywords: ['AI', 'Machine Learning', 'Technology', 'Ethics']
  },
  {
    title: 'Global Climate Summit Reaches Historic Agreement',
    content: 'In a landmark moment for international climate policy, representatives from 195 countries have reached a consensus on a new framework to address climate change. The agreement, which was finalized after two weeks of intense negotiations, sets ambitious targets for reducing greenhouse gas emissions and provides financial support for developing nations.\n\nThe new framework builds on the Paris Agreement but goes further in several key areas. It includes legally binding commitments to achieve net-zero emissions by 2050, a significant increase in climate finance, and a mechanism for addressing loss and damage caused by climate impacts.\n\n"This is a historic day for our planet," said UN Secretary-General António Guterres. "For the first time, we have a truly global commitment to tackle the climate crisis with the urgency it demands."\n\nEnvironmental groups have cautiously welcomed the agreement, though many stress that implementation will be crucial. "The real test will be whether countries follow through on these commitments with concrete action," said Greenpeace International Director Jennifer Morgan.',
    summary: 'World leaders agree on ambitious new climate targets at global summit, with binding commitments to reach net-zero emissions by 2050.',
    url: 'https://example.com/politics/climate-summit',
    imageUrl: 'https://example.com/images/climate-summit.jpg',
    source: 'Firstpost',
    category: 'Politics',
    author: 'James Wilson',
    publishedAt: new Date('2025-03-28'),
    scrapedAt: new Date(),
    keywords: ['Climate Change', 'Global Summit', 'Environment', 'Politics']
  },
  {
    title: 'India Wins Cricket World Cup in Thrilling Final',
    content: 'India has won the Cricket World Cup after a nail-biting final against Australia at the Melbourne Cricket Ground. In a match that will go down in cricket history, India chased down Australia\'s formidable total of 328 with just two balls to spare.\n\nThe hero of the hour was Rohit Sharma, whose masterful 142 not out guided India to victory. His partnership with Virat Kohli, who contributed a vital 89, was the backbone of India\'s successful run chase.\n\n"This is a dream come true for me and the entire team," said Indian captain Rohit Sharma at the post-match presentation. "We\'ve worked so hard for this moment, and to win in such a dramatic fashion makes it even more special."\n\nThe victory marks India\'s third World Cup triumph, following their successes in 1983 and 2011. The celebrations in India are expected to continue for days, with millions of fans taking to the streets to celebrate their team\'s achievement.',
    summary: 'India defeats Australia in a thrilling Cricket World Cup final, with Rohit Sharma scoring an unbeaten 142 to secure the victory.',
    url: 'https://example.com/sports/india-wins-world-cup',
    imageUrl: 'https://example.com/images/cricket-final.jpg',
    source: 'NDTV',
    category: 'Sports',
    author: 'Rahul Patel',
    publishedAt: new Date('2025-03-25'),
    scrapedAt: new Date(),
    keywords: ['Cricket', 'World Cup', 'India', 'Australia', 'Sports']
  },
  {
    title: 'Tech Giant Unveils Revolutionary Quantum Computer',
    content: 'In a major breakthrough for quantum computing, tech giant QuantumTech has unveiled a new quantum processor that achieves quantum supremacy for a range of practical applications. The Q-5000 processor, with its 500 qubits, can solve certain problems in minutes that would take traditional supercomputers thousands of years.\n\n"This is a watershed moment for quantum computing," said Dr. Lisa Zhang, Chief Quantum Officer at QuantumTech. "We\'ve moved beyond theoretical quantum supremacy to practical quantum advantage for real-world problems."\n\nThe new processor excels at optimization problems, which have applications in finance, logistics, drug discovery, and materials science. In a demonstration, the Q-5000 optimized a complex supply chain problem for a major retailer, potentially saving millions in operational costs.\n\nIndustry analysts see this as a turning point for quantum computing. "Until now, quantum computers have been primarily research tools," said quantum computing analyst Marcus Chen. "The Q-5000 changes that paradigm by delivering tangible business value."',
    summary: 'QuantumTech unveils a 500-qubit quantum processor that solves complex problems exponentially faster than traditional supercomputers.',
    url: 'https://example.com/tech/quantum-computer',
    imageUrl: 'https://example.com/images/quantum-computer.jpg',
    source: 'The Wire',
    category: 'Tech',
    author: 'Michael Chang',
    publishedAt: new Date('2025-04-05'),
    scrapedAt: new Date(),
    keywords: ['Quantum Computing', 'Technology', 'Innovation']
  }
];

db.articles.insertMany(articles);

// Get user and article IDs
const userId1 = db.users.findOne({ username: 'admin' })._id;
const userId2 = db.users.findOne({ username: 'user' })._id;
const articleId1 = db.articles.findOne({ title: 'The Future of Artificial Intelligence' })._id;
const articleId2 = db.articles.findOne({ title: 'Global Climate Summit Reaches Historic Agreement' })._id;

// Sample notes
const notes = [
  {
    title: 'AI Ethics Considerations',
    content: 'Need to research more about the ethical implications of AI development. Key points to consider:\n- Bias in AI algorithms\n- Privacy concerns with data collection\n- Impact on employment\n- Regulatory frameworks\n\nPossible sources for further reading: MIT Technology Review, AI Ethics Lab, Stanford HAI',
    articleId: articleId1,
    userId: userId1,
    tags: ['AI', 'Ethics', 'Research'],
    createdAt: new Date(),
    updatedAt: new Date(),
    color: '#f0f8ff',
    isPinned: true
  },
  {
    title: 'Climate Policy Analysis',
    content: 'The new climate agreement represents a significant step forward, but implementation will be challenging. Key aspects to monitor:\n\n1. How countries translate commitments into national policies\n2. Financing mechanisms for developing nations\n3. Verification and accountability systems\n4. Role of private sector in achieving targets',
    articleId: articleId2,
    userId: userId2,
    tags: ['Climate', 'Policy', 'International'],
    createdAt: new Date(),
    updatedAt: new Date(),
    color: '#e6fffa',
    isPinned: false
  }
];

db.notes.insertMany(notes);

// Create indexes
db.articles.createIndex({ title: 'text', content: 'text', keywords: 'text' });
db.notes.createIndex({ title: 'text', content: 'text', tags: 'text' });
db.articles.createIndex({ category: 1 });
db.articles.createIndex({ source: 1 });
db.articles.createIndex({ publishedAt: -1 });
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ articleId: 1 });

print('Database initialization completed successfully!');
