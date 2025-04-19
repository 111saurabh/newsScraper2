# The News Scraper - MERN Stack News Aggregator

A complete MERN stack news aggregator application that scrapes news from multiple sources, allows users to filter by category/source, and provides a note-taking interface with PDF export functionality.

## Features

- **Web Scrapers**: Automated scrapers for 4 news sites (WION, Firstpost, NDTV, The Wire)
- **Authentication**: JWT-based user authentication system
- **News Feed**: Browse news articles with category and source filters
- **Note Taking**: Create, edit, and organize notes for any article
- **PDF Export**: Export your notes as PDF documents
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Integration**: Complete database setup with Docker

## Project Structure

```
news-aggregator/
├── backend/               # Node.js/Express backend
│   ├── scrapers/          # Web scrapers for news sites
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── server.js          # Express server setup
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # React components and logic
│   └── package.json       # Frontend dependencies
├── database/              # MongoDB setup
│   ├── mongo-init.js      # Database initialization script
│   └── docker-compose.yml # Docker configuration for MongoDB
├── scripts/               # Utility scripts
│   ├── install.sh         # Dependency installation script
│   └── run.sh             # Application startup script
└── README.md              # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose
- Git (optional, for version control)

## Installation

1. Clone the repository (if using Git):

   ```
   git clone https://github.com/yourusername/news-aggregator.git
   cd news-aggregator
   ```

2. Run the installation script:

   ```
   chmod +x scripts/install.sh
   ./scripts/install.sh
   ```

   This script will:

   - Check for prerequisites
   - Create necessary .env files
   - Install backend dependencies
   - Install frontend dependencies

## Running the Application

1. Start all services (MongoDB, backend, frontend):

   ```
   chmod +x scripts/run.sh
   ./scripts/run.sh
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Default Users

The application comes with two pre-configured users:

1. Admin User:

   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. Regular User:
   - Email: user@example.com
   - Password: user123
   - Role: user

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Articles

- `GET /api/articles` - Get all articles (with optional filtering)
- `GET /api/articles/:id` - Get article by ID
- `GET /api/articles/categories/list` - Get available categories
- `GET /api/articles/sources/list` - Get available sources

### Notes

- `GET /api/notes` - Get all notes for current user
- `GET /api/notes/:id` - Get note by ID
- `GET /api/notes/article/:articleId` - Get notes for a specific article
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/export/pdf` - Export notes as PDF

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://news-app-user:news-app-password@localhost:27017/news-scraper
JWT_SECRET=your_jwt_secret_change_this_in_production
NODE_ENV=development
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Acknowledgments

- News data provided by WION, Firstpost, NDTV, and The Wire
- Built with MongoDB, Express, React, and Node.js
