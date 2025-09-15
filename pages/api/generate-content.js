import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Gerald McDonald Ltd prompts from the prompts folder
const PROMPTS = {
  productTitle: {
    system: "You are an expert e-commerce SEO specialist and product copywriter specializing in construction materials, building supplies, and industrial products for Gerald McDonald Ltd, a UK-based supplier. Your sole task is to generate optimized product titles that maximize visibility in both traditional search engines and AI-powered search systems. Prioritize accuracy and SEO effectiveness over speed. Generate only the final product title with no additional text.",
    user: `**Task**: Generate a single, SEO-optimized product title for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK construction/building materials supplier)
- Target Audience: Construction professionals, contractors, builders, DIY enthusiasts
- Market: UK and Ireland
- Product Categories: Building materials, construction supplies, industrial equipment
- URL to analyze: {URL}

**Requirements**:
1. Title length: 50-70 characters (optimal for search engines)
2. Include primary product name/type
3. Include key specifications (size, material, capacity) if visible
4. Include brand name if premium/recognized
5. Use natural language that customers actually search for
6. Front-load most important keywords
7. Include relevant modifiers (professional, heavy-duty, industrial) where appropriate
8. Follow this structure: [Product Type] - [Key Specification] - [Brand/Quality Indicator] - [Unique Attribute]

**Output Contract**:
Return ONLY the product title text. No explanations, no alternatives, no metadata. Single line of text.`
  },

  metaDescription: {
    system: "You are an expert SEO copywriter specializing in meta descriptions for e-commerce construction and building supply websites. You write for Gerald McDonald Ltd, a trusted UK supplier of professional construction materials. Your sole task is to generate compelling meta descriptions that maximize click-through rates from both traditional search engines and AI-powered search systems. Prioritize conversion-driving copy and SEO effectiveness. Generate only the final meta description with no additional text.",
    user: `**Task**: Generate a single, optimized meta description for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Established UK construction materials supplier)
- Target Audience: Professional contractors, builders, tradespeople, serious DIY enthusiasts
- Market: UK and Ireland construction industry
- Value Propositions: Quality products, competitive pricing, expert knowledge, reliable delivery
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}

**Requirements**:
1. Length: 150-160 characters (optimal for SERP display)
2. Include primary keyword naturally within first 120 characters
3. Include one compelling action verb (Shop, Discover, Buy, Get, Find)
4. Mention one specific benefit or feature
5. Include trust signal (professional-grade, certified, genuine, etc.)
6. End with soft call-to-action
7. Use active voice and present tense
8. Create urgency or value proposition
9. Complement the title without duplicating it

**Structure Template**:
[Action verb] [product] at Gerald McDonald. [Key benefit/feature]. [Trust signal]. [Call-to-action].

**Output Contract**:
Return ONLY the meta description text. No explanations, no alternatives, no HTML tags. Single line of text.`
  },

  introduction: {
    system: "You are an expert content strategist and SEO copywriter specializing in product descriptions for construction and building supply e-commerce sites. You write for Gerald McDonald Ltd, a respected UK supplier serving professional builders and contractors since establishment. Your sole task is to generate compelling introductory paragraphs that establish expertise, build trust, and optimize for both traditional SEO and AI-powered search. Generate only the final paragraph with no additional text.",
    user: `**Task**: Generate a single, SEO-optimized introductory paragraph for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Professional UK construction materials supplier)
- Audience Segments: Professional contractors (60%), experienced builders (25%), serious DIY (15%)
- Market Position: Quality-focused supplier with expert knowledge and reliable service
- Content Purpose: First paragraph users read, often pulled for featured snippets
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Meta Description: {META_DESCRIPTION}

**Requirements**:
1. Length: 60-80 words (optimal for readability and featured snippets)
2. Opening sentence must include primary keyword naturally
3. Include one specific use case or application
4. Mention one technical specification or quality indicator
5. Include trust/authority signal related to Gerald McDonald
6. Use customer-centric language ("you", "your project")
7. Create natural flow to rest of description
8. Include semantic variations of main keyword
9. Answer the implicit "what is this?" question immediately

**Structure Template**:
[Product definition with keyword]. [Specific use case/application]. [Technical detail or quality point]. [Gerald McDonald authority/trust statement]. [Bridge to detailed information].

**Output Contract**:
Return ONLY the paragraph text. No headings, no HTML, no explanations. Plain text paragraph format.`
  },

  featuresAndBenefits: {
    system: "You are an expert product copywriter specializing in construction and building materials for Gerald McDonald Ltd. You create compelling feature-benefit pairs that drive purchasing decisions for professional contractors and builders. Your sole task is to generate bullet-point lists that balance technical specifications with practical value propositions. Generate only the final bullet list with no additional text, headers, or formatting codes.",
    user: `**Task**: Generate a Features & Benefits bullet list for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK construction materials specialist)
- Audience Priority: Professional contractors > Builders > Advanced DIY
- Decision Factors: Durability, efficiency, compliance, ROI, time-saving
- Competitive Landscape: Quality and reliability over price alone
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Intro Paragraph: {INTRO_PARAGRAPH}

**Requirements**:
1. Generate exactly 5-7 bullet points
2. Each bullet: 15-25 words maximum
3. Start each with a strong feature, follow with specific benefit
4. Use action-oriented language
5. Include mix of: technical specs (2-3), practical benefits (2-3), compliance/safety (1-2)
6. Incorporate power words (professional, certified, reduces, maximizes, ensures)
7. Quantify benefits where possible (saves 30% time, 25% stronger)
8. Address common pain points in construction
9. Use bullet point format: • (bullet character)

**Structure Template Per Bullet**:
• [Feature/Specification] - [Specific benefit to user's work]

**Output Contract**:
Return ONLY the bullet points. Use • character. No headers, no numbers, no additional formatting. Plain text bullets only.`
  },

  technicalSpecs: {
    system: "You are a technical documentation specialist for construction equipment and building materials at Gerald McDonald Ltd. You extract and organize precise technical specifications for professional buyers who require accurate data for project planning and compliance. Your sole task is to generate structured specification tables with verified technical data. Generate only the final table data with no additional text or explanations.",
    user: `**Task**: Generate a comprehensive specifications table for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Professional UK construction supplier)
- Users: Quantity surveyors, project managers, contractors, architects
- Purpose: Technical reference for purchasing decisions and project specifications
- Compliance: UK/EU standards and building regulations
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}

**Requirements**:
1. Generate 8-15 relevant specification rows
2. Two columns: "Specification" and "Details"
3. Include all visible/stated specifications from page
4. Add standard specs expected for this product type
5. Use precise units with UK/metric system
6. Include model/part numbers if available
7. Group related specs logically
8. Include compliance/certification information
9. Format as structured data for easy parsing

**Output Format Structure**:
Specification | Details
[Spec Name] | [Value with Units]

**Output Contract**:
Return ONLY the table data in the specified format. Two columns separated by " | ". One specification per line. No headers except first row. No additional formatting or explanations.`
  },

  useCases: {
    system: "You are a construction industry expert and applications specialist for Gerald McDonald Ltd, with deep knowledge of UK building practices and project requirements. You understand how professional contractors, builders, and tradespeople apply products in real-world scenarios. Your sole task is to generate practical use cases that help buyers visualize product applications for their specific projects. Generate only the final use cases with no additional text or explanations.",
    user: `**Task**: Generate compelling use cases and applications for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK construction materials supplier)
- Audience: Professional contractors (primary), builders, specialist trades
- Project Types: Commercial construction, residential builds, renovations, infrastructure
- Market: UK and Ireland construction sector
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Specifications: {SPECIFICATIONS_TABLE}

**Requirements**:
1. Generate exactly 6-8 distinct use cases
2. Each use case: 20-35 words
3. Start with action verb or project type
4. Include specific scenario or project context
5. Mix of: commercial (2-3), residential (2-3), specialist (1-2)
6. Reference realistic UK construction scenarios
7. Include scale/scope indicators (small repairs to large projects)
8. Mention specific trades or professionals who'd use it
9. Format with bullet points (• character)

**Use Case Structure Template**:
• [Project type/Action] - [Specific application] with [context/benefit for that scenario]

**Output Contract**:
Return ONLY the bullet points. Use • character. No headers, no numbering, no additional formatting. Plain text bullets only.`
  },

  seoKeywords: {
    system: "You are an expert SEO strategist specializing in e-commerce optimization for UK construction and building materials. You analyze search intent, competition, and semantic relationships to develop comprehensive keyword strategies for Gerald McDonald Ltd product pages. Your sole task is to generate structured keyword sets that maximize visibility across traditional search engines and AI-powered search systems. Generate only the final keyword strategy with no explanations or additional text.",
    user: `**Task**: Generate a comprehensive SEO keyword strategy for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK construction materials specialist)
- Market: UK and Ireland construction industry
- Competition: B&Q, Travis Perkins, Selco, Screwfix, Wickes
- Search Platforms: Google UK, Bing, AI search (Perplexity, ChatGPT)
- Intent Types: Commercial, transactional, informational, navigational
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}
- Existing Content: {INTRO_PARAGRAPH}

**Requirements**:
1. Generate 5 keyword categories with 3-5 keywords each
2. Total of 20-25 unique keywords/phrases
3. Include search volume indicators (High/Medium/Low)
4. Mix of head terms (1-2 words) and long-tail (3-5 words)
5. Include buyer-intent modifiers
6. Cover different search intents
7. Include UK-specific terms and spellings
8. Consider voice search queries
9. Include semantic/LSI variations

**Output Structure**:
PRIMARY KEYWORDS (High Competition/Volume)
[keyword] | [search volume indicator]

COMMERCIAL INTENT KEYWORDS
[keyword phrase] | [search volume indicator]

LONG-TAIL KEYWORDS (Low Competition)
[specific phrase] | [search volume indicator]

SEMANTIC/LSI KEYWORDS
[related term] | [search volume indicator]

LOCAL/UK-SPECIFIC KEYWORDS
[uk term] | [search volume indicator]

**Output Contract**:
Return ONLY the keyword categories and terms in specified format. Use pipe separator (|) between keyword and volume indicator. No additional text, explanations, or HTML.`
  },

  structuredData: {
    system: "You are a technical SEO specialist expert in schema.org markup and Google's structured data requirements for e-commerce. You create precise JSON-LD structured data for Gerald McDonald Ltd product pages that maximize rich snippet eligibility and enhance SERP visibility. Your sole task is to generate valid, comprehensive structured data that passes Google's Rich Results Test. Generate only the final JSON-LD code with no additional text or explanations.",
    user: `**Task**: Generate complete JSON-LD structured data for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd
- Business Type: Construction materials supplier (LocalBusiness + Store)
- Schema Types: Product, Offer, AggregateRating, Organization
- Rich Results Target: Product snippets, price, availability, reviews
- Compliance: Google Merchant Center, Schema.org v15.0
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Meta Description: {META_DESCRIPTION}
- Specifications: {SPECIFICATIONS_TABLE}

**Requirements**:
1. Use JSON-LD format with @context schema.org
2. Include Product schema with all required properties
3. Embed Offer schema with UK pricing (GBP)
4. Include Organization data for Gerald McDonald
5. Add BreadcrumbList for site navigation
6. Include AggregateRating if reviews exist
7. Add relevant product identifiers (MPN, GTIN if available)
8. Include image URLs (use placeholder structure)
9. Validate against Google's required/recommended properties

**Output Contract**:
Return ONLY the JSON-LD code. No script tags, no HTML wrapper, no explanations. Pure JSON starting with { and ending with }. Use placeholder URLs where actual URLs unknown.`
  },

  faqs: {
    system: "You are a customer service expert and technical advisor for Gerald McDonald Ltd with comprehensive knowledge of UK construction practices, building regulations, and common contractor concerns. You anticipate and answer critical questions that influence purchasing decisions and reduce support inquiries. Your sole task is to generate FAQ sections that provide valuable information while capturing featured snippets and \"People Also Ask\" opportunities. Generate only the final Q&A pairs with no additional text or explanations.",
    user: `**Task**: Generate comprehensive FAQs and additional information for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (UK construction materials expert)
- Audience: Professional contractors, builders, quantity surveyors
- Support Goals: Reduce pre-sales questions, build trust, improve SEO
- Search Features: Featured snippets, People Also Ask boxes
- Common Concerns: Compliance, compatibility, installation, maintenance
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Specifications: {SPECIFICATIONS_TABLE}
- Use Cases: {USE_CASES}

**Requirements**:
1. Generate exactly 6-8 Q&A pairs
2. Question length: 8-15 words (natural search queries)
3. Answer length: 40-60 words (featured snippet optimal)
4. Mix of question types: technical (2-3), practical (2-3), commercial (1-2)
5. Start answers with direct response, then elaborate
6. Include UK-specific regulations/standards where relevant
7. Address common objections or concerns
8. Use natural question phrasing (how, what, can, does, is)
9. Format: Q: [question] / A: [answer]

**Answer Structure Template**:
[Direct answer in first sentence]. [Supporting detail or context]. [Additional value/tip if relevant].

**Output Contract**:
Return ONLY the Q&A pairs. Format as "Q: [question]" on one line, "A: [answer]" on next line, blank line between pairs. No numbering, bullets, or additional formatting.`
  },

  callToActions: {
    system: "You are a conversion optimization specialist and B2B sales expert for Gerald McDonald Ltd, understanding the decision-making process of UK construction professionals. You craft compelling calls to action that drive immediate response while maintaining professional credibility. Your sole task is to generate action-oriented CTAs that convert browsers into buyers or enquirers. Generate only the final CTA text with no additional elements or explanations.",
    user: `**Task**: Generate a high-converting call to action for a Gerald McDonald product page.

**Context**:
- Company: Gerald McDonald Ltd (Trusted UK construction supplier)
- Audience: Professional buyers, contractors, project managers
- Decision Factors: Availability, delivery speed, technical support, bulk pricing
- Conversion Goals: Quote requests, direct orders, callback bookings
- Customer Journey Stage: Product page (high intent)
- URL to analyze: {URL}
- Product Title: {PRODUCT_TITLE}
- Product Category: {PRODUCT_CATEGORY}
- Key Benefits: {FEATURES_BENEFITS}

**Requirements**:
1. Generate 2-3 sentence CTA block (40-60 words total)
2. Primary action statement (8-12 words)
3. Supporting value proposition (15-20 words)
4. Urgency or incentive element (10-15 words)
5. Include specific action verb (Order, Request, Call, Get, Reserve)
6. Reference delivery or availability
7. Mention professional support or expertise
8. Create appropriate urgency without false scarcity
9. Include contact method or next step

**CTA Structure Template**:
[Primary action with product reference]. [Value proposition with benefit]. [Urgency/incentive with contact method].

**Output Contract**:
Return ONLY the CTA text. No buttons, no HTML, no formatting codes. Plain text sentences only.`
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '4mb',
    // Increase timeout for Vercel functions (max 10 seconds for hobby, 60 for pro)
    maxDuration: 60,
  },
}

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

    // Generate content using Gerald McDonald's specialized prompts
    const content = {};

    // Helper function to generate content with specific prompt
    async function generateWithPrompt(promptKey, additionalContext = {}) {
      const prompt = PROMPTS[promptKey];
      let userPrompt = prompt.user
        .replace('{URL}', url)
        .replace('{PRODUCT_TITLE}', content.productTitle || scrapedData.title || 'Product')
        .replace('{META_DESCRIPTION}', content.metaDescription || '')
        .replace('{INTRO_PARAGRAPH}', content.introduction || '')
        .replace('{SPECIFICATIONS_TABLE}', content.technicalSpecs || '')
        .replace('{USE_CASES}', content.useCases || '')
        .replace('{FEATURES_BENEFITS}', content.featuresAndBenefits || '')
        .replace('{PRODUCT_CATEGORY}', additionalContext.productCategory || 'Construction Equipment');

      // Add product information context
      userPrompt += `\n\n**Product Information**:\n${productInfo}`;

      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307', // Using faster model to avoid timeouts
          max_tokens: 1500,
          temperature: 0.7,
          system: prompt.system,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        });

        return response.content[0].text.trim();
      } catch (error) {
        console.error(`Error generating ${promptKey}:`, error);
        return null;
      }
    }

    // Generate critical content first (title, meta, intro)
    content.productTitle = await generateWithPrompt('productTitle');
    content.metaDescription = await generateWithPrompt('metaDescription');
    content.introduction = await generateWithPrompt('introduction');

    // Generate remaining content in parallel to speed up processing
    const parallelGenerations = await Promise.all([
      generateWithPrompt('featuresAndBenefits'),
      generateWithPrompt('technicalSpecs'),
      generateWithPrompt('useCases'),
      generateWithPrompt('seoKeywords'),
      generateWithPrompt('structuredData'),
      generateWithPrompt('faqs'),
      generateWithPrompt('callToActions')
    ]);

    // Assign parallel results
    content.featuresAndBenefits = parallelGenerations[0];
    content.technicalSpecs = parallelGenerations[1];
    content.useCases = parallelGenerations[2];
    content.seoKeywords = parallelGenerations[3];
    content.structuredData = parallelGenerations[4];
    content.faqs = parallelGenerations[5];
    content.callToActions = parallelGenerations[6];

    // Process and format some content types
    if (content.featuresAndBenefits) {
      content.featuresAndBenefits = content.featuresAndBenefits
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().substring(1).trim());
    }

    if (content.seoKeywords) {
      try {
        const keywordSections = content.seoKeywords.split('\n\n');
        const parsedKeywords = {
          primaryKeywords: [],
          commercialIntent: [],
          longTail: [],
          semantic: [],
          localUK: []
        };

        keywordSections.forEach(section => {
          const lines = section.split('\n').filter(line => line.includes('|'));
          if (section.includes('PRIMARY KEYWORDS')) {
            parsedKeywords.primaryKeywords = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('COMMERCIAL INTENT')) {
            parsedKeywords.commercialIntent = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('LONG-TAIL')) {
            parsedKeywords.longTail = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('SEMANTIC')) {
            parsedKeywords.semantic = lines.map(line => line.split('|')[0].trim());
          } else if (section.includes('LOCAL/UK')) {
            parsedKeywords.localUK = lines.map(line => line.split('|')[0].trim());
          }
        });

        content.seoKeywords = parsedKeywords;
      } catch (e) {
        console.error('Error parsing SEO keywords:', e);
      }
    }

    if (content.structuredData) {
      try {
        // Try to parse as JSON to validate
        const jsonData = JSON.parse(content.structuredData);
        content.structuredData = jsonData;
      } catch (e) {
        console.error('Error parsing structured data:', e);
        content.structuredData = generateFallbackStructuredData(scrapedData, url);
      }
    }

    if (content.faqs) {
      try {
        const faqPairs = content.faqs.split('\n\n').filter(pair => pair.includes('Q:') && pair.includes('A:'));
        const parsedFaqs = faqPairs.map(pair => {
          const lines = pair.split('\n');
          const question = lines.find(line => line.startsWith('Q:'))?.substring(2).trim();
          const answer = lines.find(line => line.startsWith('A:'))?.substring(2).trim();
          return { question, answer };
        }).filter(faq => faq.question && faq.answer);

        content.faqs = parsedFaqs;
      } catch (e) {
        console.error('Error parsing FAQs:', e);
      }
    }

    // Fallback for any failed generations
    content.productTitle = content.productTitle || scrapedData.title || 'Premium Product - High Quality & Best Value';
    content.metaDescription = content.metaDescription || `Discover ${scrapedData.title || 'our premium product'}. ${scrapedData.description?.substring(0, 100) || 'Best quality and value'}. Shop now!`;
    content.introduction = content.introduction || scrapedData.description || 'This exceptional product delivers outstanding value and quality, designed to meet your needs and exceed expectations.';
    content.featuresAndBenefits = content.featuresAndBenefits || scrapedData.features || [
      'Premium quality construction',
      'Exceptional value for money',
      'Trusted by thousands of customers',
      'Industry-leading performance',
      'Comprehensive warranty included'
    ];
    content.technicalSpecs = content.technicalSpecs || scrapedData.specifications || {
      'Quality': 'Premium',
      'Warranty': 'Included',
      'Support': '24/7 Available'
    };
    content.callToActions = content.callToActions || 'Order now for fast delivery across the UK. Professional support available. Contact our experts today.';

    return res.status(200).json(content);

  } catch (error) {
    console.error('Content generation error:', error);

    // Return fallback content
    return res.status(200).json(generateFallbackContent(scrapedData));
  }
}

function generateFallbackStructuredData(scrapedData, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": scrapedData.title || 'Product',
    "description": scrapedData.description || '',
    "image": scrapedData.images?.[0] || '',
    "offers": {
      "@type": "Offer",
      "price": scrapedData.price || '',
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock"
    }
  };
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