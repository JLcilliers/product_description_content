import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the page content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Extract various data points
    const extractedData = {
      title: $('h1').first().text().trim() ||
             $('title').text().trim() ||
             'Product',

      description: $('meta[name="description"]').attr('content') ||
                  $('meta[property="og:description"]').attr('content') ||
                  $('.product-description').first().text().trim() ||
                  $('p').first().text().trim() ||
                  '',

      price: $('.price').first().text().trim() ||
             $('[itemprop="price"]').first().text().trim() ||
             $('[class*="price"]').first().text().trim() ||
             '',

      images: [],
      features: [],
      specifications: {}
    };

    // Extract images
    $('img').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src && extractedData.images.length < 5) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, url).href;
        extractedData.images.push(fullUrl);
      }
    });

    // Extract features (from lists)
    $('ul li, .features li, .product-features li').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 10 && text.length < 200 && extractedData.features.length < 10) {
        extractedData.features.push(text);
      }
    });

    // Extract specifications (from tables)
    $('table tr, .specifications tr, .specs tr').each((i, elem) => {
      const key = $(elem).find('td:first-child, th:first-child').text().trim();
      const value = $(elem).find('td:last-child').text().trim();
      if (key && value && Object.keys(extractedData.specifications).length < 20) {
        extractedData.specifications[key] = value;
      }
    });

    // Extract additional content
    extractedData.additionalContent = [];
    $('p, .content p, .description p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 50 && extractedData.additionalContent.length < 5) {
        extractedData.additionalContent.push(text);
      }
    });

    return res.status(200).json(extractedData);

  } catch (error) {
    console.error('Scraping error:', error);

    // Return basic fallback data
    return res.status(200).json({
      title: 'Product',
      description: '',
      price: '',
      images: [],
      features: [],
      specifications: {},
      additionalContent: [],
      error: 'Limited data extracted',
      fallback: true
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}