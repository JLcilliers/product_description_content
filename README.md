# Product Page Description Creator

An AI-powered tool that automatically generates professional, SEO-optimized product descriptions from any URL.

## Features

- **Web Scraping**: Automatically extract product data from any URL
- **AI Content Generation**: Generate 10 types of optimized content using Claude AI
- **Bulk Processing**: Process single URLs or upload Excel/CSV files
- **Word Export**: Export all descriptions to formatted Word documents
- **SEO Optimization**: Generate meta descriptions, keywords, and structured data

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JLcilliers/product_description_content.git
cd product_description_content
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your-api-key-here
```

4. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy!

Your app will be live at: `https://your-app.vercel.app`

## Usage

1. **Add URLs**: Either enter URLs manually or upload an Excel/CSV file
2. **Generate**: Click "Generate Product Descriptions" to process all URLs
3. **Review**: Check the generated content for each product
4. **Export**: Download all descriptions as a Word document

## Generated Content Types

1. **Product Title** - SEO-optimized, under 60 characters
2. **Meta Description** - 150-160 characters with CTA
3. **Introduction** - Authority-building paragraph
4. **Features & Benefits** - Customer-focused bullet points
5. **Technical Specifications** - Structured data table
6. **Use Cases** - Industry-specific applications
7. **SEO Keywords** - Primary, secondary, and long-tail
8. **Structured Data** - JSON-LD for rich snippets
9. **FAQs** - Search-optimized Q&As
10. **Call to Actions** - Multiple options for different personas

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API
- **Web Scraping**: Cheerio, Axios
- **Document Generation**: docx library

## API Endpoints

- `POST /api/scrape` - Extract data from URL
- `POST /api/generate-content` - Generate AI content
- `POST /api/export-word` - Create Word document

## Environment Variables

```env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Project Structure

```
product-description-creator/
├── components/
│   └── ProductDescriptionCreator.js
├── pages/
│   ├── api/
│   │   ├── scrape.js
│   │   ├── generate-content.js
│   │   └── export-word.js
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
├── .env.local
├── package.json
├── next.config.js
└── README.md
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.