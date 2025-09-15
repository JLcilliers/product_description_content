import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, scrapedData } = req.body;

  if (!url || !scrapedData) {
    return res.status(400).json({ error: 'URL and scraped data are required' });
  }

  try {
    const productInfo = `
      Product URL: ${url}
      Title: ${scrapedData.title || 'Unknown Product'}
      Description: ${scrapedData.description || 'No description available'}
      Price: ${scrapedData.price || 'Price not available'}
      Features: ${scrapedData.features?.join(', ') || 'No features listed'}
      Specifications: ${JSON.stringify(scrapedData.specifications) || '{}'}
      Additional Content: ${scrapedData.additionalContent?.join(' ') || ''}
    `;

    const systemPrompt = `You are an expert e-commerce content writer specializing in creating high-converting, SEO-optimized product descriptions. Generate content that:
    - Ranks well in search engines
    - Converts browsers into buyers
    - Builds trust and authority
    - Addresses customer pain points
    - Highlights unique value propositions`;

    const userPrompt = `Based on the following product information, generate comprehensive product page content:

${productInfo}

Generate the following content sections:

1. **Product Title**: SEO-optimized, under 60 characters, includes primary keyword
2. **Meta Description**: 150-160 characters, compelling, includes call-to-action
3. **Introduction Paragraph**: 100-150 words establishing authority and value
4. **Features & Benefits**: 5-7 bullet points focusing on customer benefits
5. **Technical Specifications**: Formatted table of key specs
6. **Use Cases**: 3-4 specific scenarios where this product excels
7. **SEO Keywords**: Primary, secondary, and long-tail keywords
8. **Structured Data**: JSON-LD markup for rich snippets
9. **FAQs**: 3-5 frequently asked questions with answers
10. **Call to Action Options**: 3 different CTAs for different buyer personas

Format the response as a JSON object with these exact keys:
productTitle, metaDescription, introduction, featuresAndBenefits, technicalSpecs, useCases, seoKeywords, structuredData, faqs, callToActions`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    });

    // Parse the response
    let content;
    try {
      const responseText = response.content[0].text;
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: structure the response manually
        content = generateFallbackContent(scrapedData, responseText);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      content = generateFallbackContent(scrapedData, response.content[0].text);
    }

    return res.status(200).json(content);

  } catch (error) {
    console.error('Content generation error:', error);

    // Return fallback content
    return res.status(200).json(generateFallbackContent(scrapedData));
  }
}

function generateFallbackContent(scrapedData, aiText = '') {
  return {
    productTitle: scrapedData.title || 'Premium Product - High Quality & Best Value',
    metaDescription: `Discover ${scrapedData.title || 'our premium product'}. ${scrapedData.description?.substring(0, 100) || 'Best quality and value'}. Shop now!`,
    introduction: scrapedData.description || 'This exceptional product delivers outstanding value and quality, designed to meet your needs and exceed expectations.',
    featuresAndBenefits: scrapedData.features || [
      'Premium quality construction',
      'Exceptional value for money',
      'Trusted by thousands of customers',
      'Industry-leading performance',
      'Comprehensive warranty included'
    ],
    technicalSpecs: scrapedData.specifications || {
      'Quality': 'Premium',
      'Warranty': 'Included',
      'Support': '24/7 Available'
    },
    useCases: [
      'Perfect for everyday use',
      'Ideal for professional applications',
      'Great for both beginners and experts'
    ],
    seoKeywords: {
      primaryKeywords: [scrapedData.title?.split(' ')[0] || 'product', 'buy', 'online', 'best', 'premium'],
      secondaryKeywords: ['quality', 'value', 'professional', 'trusted', 'reliable'],
      longTailKeywords: [`best ${scrapedData.title || 'product'} online`, `buy ${scrapedData.title || 'product'} with warranty`]
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": scrapedData.title || 'Product',
      "description": scrapedData.description || '',
      "image": scrapedData.images?.[0] || '',
      "offers": {
        "@type": "Offer",
        "price": scrapedData.price || '',
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    faqs: [
      {
        question: 'Is this product in stock?',
        answer: 'Yes, this product is currently available and ready to ship.'
      },
      {
        question: 'What warranty is included?',
        answer: 'This product comes with our comprehensive warranty for your peace of mind.'
      },
      {
        question: 'How quickly will it ship?',
        answer: 'Orders typically ship within 1-2 business days.'
      }
    ],
    callToActions: [
      'Buy Now - Fast Shipping Available',
      'Add to Cart - Limited Stock',
      'Get Yours Today - Satisfaction Guaranteed'
    ]
  };
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '4mb',
  },
}