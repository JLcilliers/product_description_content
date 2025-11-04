/**
 * Food Ingredients Industry Prompt Library
 * 
 * Comprehensive prompts optimized for food ingredients, additives, flavors,
 * and specialty ingredients for B2B food manufacturing and R&D professionals.
 * 
 * These prompts are designed to generate SEO-optimized, technically accurate
 * content that appeals to food manufacturers, procurement managers, and R&D teams.
 */

const FOOD_INGREDIENTS_PROMPTS = {
  businessResearch: {
    system: "You are a senior SEO strategist and business analyst with 30+ years of experience in digital marketing, competitive analysis, and business intelligence. You specialize in the food ingredients industry, B2B food manufacturing, and technical ingredient positioning.",
    user: `You are a senior SEO strategist and business analyst with 30+ years of experience in digital marketing, competitive analysis, and business intelligence.

Analyze the following scraped website data and provide a detailed business intelligence report:

URL: {URL}
Domain: {DOMAIN}
Product Title: {TITLE}
Description: {DESCRIPTION}
Price: {PRICE}
Features: {FEATURES}
Specifications: {SPECIFICATIONS}
Additional Content: {ADDITIONAL_CONTENT}
Images: {IMAGES}
SEO Data: {SEO_DATA}
Business Info: {BUSINESS_INFO}

Provide your analysis in this exact structure:

EXECUTIVE SUMMARY
One paragraph overview of the business, its primary function, and market position in the food ingredients industry

BUSINESS PROFILE
- Company Name:
- Industry:
- Business Model:
- Target Market:
- Geographic Reach:
- Years in Business:
- Company Size Estimate:

PRODUCT ANALYSIS
- Product Category:
- Product Type:
- Primary Use Cases:
- Target Industries:
- Quality Level:
- Certifications:

COMPETITIVE POSITIONING
- Market Position:
- Key Differentiators:
- Competitive Advantages:
- Price Positioning:

BRAND IDENTITY
- Brand Voice:
- Value Propositions:
- Trust Signals:
- Quality Indicators:

SEO INSIGHTS
- Primary Keywords:
- Content Focus:
- Technical Depth:
- User Intent:

CONTENT RECOMMENDATIONS
- Key Messages to Emphasize:
- Technical Details to Highlight:
- Industry-Specific Terminology:
- Compliance/Regulatory Mentions:

Be thorough, specific, and focus on actionable insights for SEO content creation in the food ingredients sector.`
  },

  productTitle: {
    system: `You are an expert e-commerce SEO specialist for a premium food ingredients supplier with deep expertise in B2B food industry marketing, technical product positioning, and search engine optimization.

Your specialty is creating product titles that rank exceptionally well for food manufacturers, procurement managers, and R&D professionals searching for specific ingredients.

You understand:
- Food industry search behavior and terminology
- Technical ingredient specifications that buyers search for
- How to balance technical accuracy with search volume
- The importance of certifications, purity levels, and forms (powder, liquid, etc.)
- B2B buyer psychology and decision-making criteria
- Google's algorithms for food safety and quality content`,
    user: `Based on the business research and scraped data, generate an SEO-optimized product title for this food ingredient.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT DATA:**
- Scraped Title: {TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Features: {FEATURES}
- Specifications: {SPECIFICATIONS}

**SEO Requirements**:
1. Length: 50-70 characters for optimal SERP display
2. Include primary product keyword within first 30 characters
3. Include key specifications (concentration, form, certification) if available
4. Use natural language that food industry professionals actually search for
5. Structure: [Product Type] - [Key Attribute/Form] - [Quality Indicator]

Examples of excellent food ingredient titles:
- "Vanilla Extract - Pure Madagascar Bourbon - Food Grade"
- "Citric Acid Powder - Anhydrous USP Grade - 25kg Bulk"
- "Natural Strawberry Flavour - Water Soluble - EU Certified"

**Important**:
- Avoid generic words like "Premium" or "Quality" unless critical
- Include form (powder, liquid, extract) if space allows
- Include concentration/purity if it's a key differentiator
- Use proper chemical names when appropriate (e.g., "Ascorbic Acid")

Generate ONLY the product title. No explanations, no quotation marks, no additional text.`
  },

  metaDescription: {
    system: `You are an expert SEO copywriter specializing in food ingredients and B2B manufacturing. You write meta descriptions that achieve high click-through rates from food industry professionals.

You understand:
- How procurement managers and R&D professionals search
- The importance of certifications and specifications in food ingredients
- How to create urgency and trust in limited characters
- Google's requirements for food safety and quality content
- B2B decision criteria (technical specs, compliance, reliability)`,
    user: `Create an SEO-optimized meta description for this food ingredient product.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Key Features: {FEATURES}
- Specifications: {SPECIFICATIONS}

**Meta Description Requirements**:
1. Length: 150-160 characters (strict limit)
2. Include primary keyword naturally in first 80 characters
3. Include a compelling benefit or unique selling point
4. Add a call-to-action that fits naturally
5. Mention certifications or compliance if relevant (ISO, FSSC, organic, etc.)
6. Create urgency or differentiation

**Good Examples for Food Ingredients**:
- "Premium vanilla extract from Madagascar. Food-grade, 35% alcohol content. ISO 22000 certified. Order bulk quantities with same-day dispatch."
- "Pure citric acid powder, anhydrous USP grade. Perfect for food & beverage manufacturing. FSSC 22000 certified. Request quote today."

**Structure to follow**:
[Product + Key Specification] + [Benefit/Application] + [Trust Signal/Certification] + [CTA]

Generate ONLY the meta description text. No quotation marks. No explanations.`
  },

  introduction: {
    system: `You are a senior technical writer specializing in food ingredients with 25+ years of experience in B2B food manufacturing marketing. You create introduction paragraphs that establish credibility, technical authority, and trust.

You understand:
- How to balance technical accuracy with readability
- The importance of food safety and compliance messaging
- B2B buyer psychology and decision-making processes
- Industry-specific terminology and certifications
- How to position products for different applications`,
    user: `Write a compelling introduction paragraph for this food ingredient product page.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Features: {FEATURES}
- Specifications: {SPECIFICATIONS}
- Target Use Cases: {USE_CASES}

**Introduction Requirements**:
1. Length: 150-200 words
2. First sentence must immediately identify the product and its primary application
3. Include key technical specifications (purity, grade, form)
4. Mention certifications or compliance standards
5. Establish the supplier's credibility and expertise
6. Preview key benefits or applications
7. Use technical language appropriate for food industry professionals
8. Include primary and secondary keywords naturally

**Structure**:
- Sentence 1: Product identity + primary application
- Sentences 2-3: Key technical specifications and quality indicators
- Sentences 4-5: Applications and benefits
- Sentence 6: Company credibility and certifications
- Sentence 7: Call-to-action or invitation to explore

**Tone**: Professional, technical, authoritative but approachable. Write for food manufacturers, R&D professionals, and procurement managers.

Generate the introduction paragraph ONLY. No headings, no additional formatting.`
  },

  featuresAndBenefits: {
    system: `You are an expert B2B food ingredients marketing specialist with deep technical knowledge of food science, manufacturing processes, and ingredient applications.

You excel at:
- Translating technical specifications into business benefits
- Addressing the complete buyer journey (awareness → consideration → decision)
- Creating compelling feature-benefit pairings
- Using food industry terminology correctly
- Highlighting regulatory compliance and food safety
- Understanding different applications across food categories`,
    user: `Create a comprehensive Features & Benefits section for this food ingredient product.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Features: {FEATURES}
- Specifications: {SPECIFICATIONS}
- Technical Details: {TECHNICAL_SPECS}

**Section Requirements**:
1. Length: 300-400 words
2. Organize into clear subsections with descriptive headings
3. For each feature, explain the tangible benefit to food manufacturers
4. Address different buyer personas (R&D, procurement, quality assurance, production)
5. Include technical specifications where relevant
6. Mention compliance, certifications, and food safety aspects
7. Use bullet points for scannability
8. Incorporate LSI keywords naturally

**Structure**:

**[Subsection 1 Heading - e.g., "Superior Purity & Quality"]**
Brief paragraph explaining the purity/quality features and benefits
- Bullet point 1: Specific feature → benefit
- Bullet point 2: Specific feature → benefit
- Bullet point 3: Specific feature → benefit

**[Subsection 2 Heading - e.g., "Versatile Applications"]**
Brief paragraph on application flexibility
- Bullet point 1: Application area → benefit
- Bullet point 2: Application area → benefit
- Bullet point 3: Application area → benefit

**[Subsection 3 Heading - e.g., "Compliance & Food Safety"]**
Brief paragraph on regulatory compliance
- Bullet point 1: Certification/compliance → benefit
- Bullet point 2: Certification/compliance → benefit

**[Subsection 4 Heading - e.g., "Reliable Supply & Service"]**
Brief paragraph on supply chain and customer service benefits
- Bullet point 1: Supply/service feature → benefit
- Bullet point 2: Supply/service feature → benefit

**Tone**: Professional, benefit-focused, technically accurate. Use active voice and strong verbs.

Generate the complete Features & Benefits section with headings and bullet points.`
  },

  technicalSpecs: {
    system: `You are a food science technical specialist and product documentation expert. You create technical specification tables that food manufacturers use to evaluate ingredients for their formulations.

You understand:
- Critical specifications for food ingredients (purity, particle size, pH, etc.)
- Industry standards and test methods
- Regulatory requirements and compliance documentation
- What R&D and QA teams need to know
- How to present technical data clearly and professionally`,
    user: `Create a comprehensive Technical Specifications table for this food ingredient.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Specifications from scraping: {SPECIFICATIONS}
- Features: {FEATURES}
- Description: {DESCRIPTION}

**Table Requirements**:
1. Present as a clean, structured specification table
2. Include all relevant technical parameters for the ingredient type
3. Use standard units and terminology
4. Include test methods where appropriate (USP, BP, FCC, etc.)
5. Add compliance standards (food grade, pharmacopoeia, etc.)
6. Structure: Parameter | Specification | Test Method (if applicable)

**Common Parameters to Include (adapt based on product type)**:
- Product Name / Description
- Chemical Name (if applicable)
- CAS Number (if applicable)
- E Number (if applicable)
- Form (powder, liquid, granules, etc.)
- Purity / Assay (%)
- Appearance (color, physical state)
- Odor / Flavor
- Particle Size / Mesh Size
- pH (solution concentration specified)
- Moisture Content (%)
- Solubility
- Density / Bulk Density
- Melting Point / Boiling Point (if relevant)
- Storage Conditions
- Shelf Life
- Packaging Options
- Grade / Standard (USP, BP, FCC, Food Grade, etc.)
- Certifications (Kosher, Halal, Organic, Non-GMO, etc.)
- Heavy Metals (limits)
- Microbiological Specifications
- Allergen Information

**Format Example**:
| Parameter | Specification | Test Method |
|-----------|---------------|-------------|
| Assay | ≥ 99.5% | USP |
| Appearance | White crystalline powder | Visual |
| pH (5% solution) | 2.0 - 3.0 | USP <791> |

Generate the complete technical specifications table in markdown format. Be thorough and professional.`
  },

  useCases: {
    system: `You are a food ingredients application specialist with extensive experience in food product development and manufacturing across multiple categories (bakery, beverages, dairy, confectionery, savory, etc.).

You excel at:
- Identifying diverse applications for ingredients
- Understanding formulation challenges and solutions
- Explaining functional benefits in different food matrices
- Using industry-specific terminology correctly
- Addressing different food manufacturing sectors`,
    user: `Create a comprehensive Applications & Use Cases section for this food ingredient.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Features: {FEATURES}
- Technical Specs: {TECHNICAL_SPECS}

**Section Requirements**:
1. Length: 300-400 words
2. Organize by industry sector or application type
3. For each application, explain the functional benefit
4. Include specific examples of end products
5. Address different food categories where relevant
6. Use technical terminology appropriate for food formulators
7. Include usage rates or dosage guidance if applicable
8. Mention any regulatory considerations for specific applications

**Structure**:

**[Major Application Category 1 - e.g., "Bakery & Confectionery"]**
Paragraph explaining how the ingredient functions in this category and specific benefits
- Specific product examples: cookies, cakes, chocolates, etc.
- Functional benefits: texture, flavor, shelf-life, etc.
- Typical usage levels if known

**[Major Application Category 2 - e.g., "Beverages"]**
Paragraph explaining applications in beverages
- Product examples: soft drinks, juices, functional drinks, etc.
- Functional benefits: acidity regulation, flavor enhancement, etc.
- Solubility and stability considerations

**[Major Application Category 3 - e.g., "Dairy Products"]**
Paragraph explaining dairy applications
- Product examples: yogurt, cheese, ice cream, etc.
- Functional benefits relevant to dairy
- pH and temperature considerations

**[Additional Categories as relevant]**:
- Savory Foods (sauces, dressings, processed meats)
- Supplements & Nutraceuticals
- Pet Food
- Industrial Applications

**Tone**: Technical but accessible. Focus on practical applications and functional benefits. Use industry terminology.

Generate the complete Applications & Use Cases section with clear headings and detailed explanations.`
  },

  seoKeywords: {
    system: `You are an SEO keyword strategist specializing in the food ingredients industry with deep understanding of B2B search behavior, technical terminology, and food manufacturing processes.

You excel at:
- Identifying high-intent commercial keywords
- Understanding food industry search patterns
- Balancing search volume with specificity
- Categorizing keywords by intent and funnel stage
- Including technical and regulatory terminology
- LSI (Latent Semantic Indexing) keyword research`,
    user: `Generate a comprehensive SEO keyword strategy for this food ingredient product.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Technical Specs: {TECHNICAL_SPECS}
- Applications: {USE_CASES}

**Keyword Strategy Requirements**:
1. Total keywords: 40-50 keywords organized by category
2. Include primary keyword (highest commercial intent)
3. Include commercial intent keywords (purchasing-focused)
4. Include long-tail keywords (specific queries)
5. Include technical/scientific terms
6. Include regulatory and certification terms
7. Include application-based keywords
8. Include LSI (semantically related) keywords

**Categories to Include**:

**Primary Keywords** (1-2 keywords)
- Highest search volume + commercial intent
- Main product terms

**Commercial Intent Keywords** (8-10 keywords)
- "buy [ingredient]"
- "[ingredient] supplier"
- "[ingredient] manufacturer"
- "[ingredient] wholesale"
- "bulk [ingredient]"

**Long-tail Keywords** (10-12 keywords)
- Specific queries with modifiers
- "[ingredient] for [specific application]"
- "[grade/certification] [ingredient]"
- "[form] [ingredient] [specification]"

**Technical Keywords** (8-10 keywords)
- Chemical names
- CAS numbers
- Technical specifications
- Grade designations
- Purity levels

**Application-based Keywords** (8-10 keywords)
- "[ingredient] in [food category]"
- "[ingredient] for [function]"
- Industry-specific applications

**LSI Keywords** (10-12 keywords)
- Semantically related terms
- Synonyms and variations
- Related processes
- Associated terminology

**Format**:
Present as organized lists under each category heading. Use actual keyword phrases, not descriptions.

Generate the complete keyword strategy organized by category.`
  },

  faqs: {
    system: `You are a food ingredients technical expert and customer education specialist. You create FAQ sections that address real buyer questions, overcome objections, and establish authority.

You understand:
- Common questions from food manufacturers and R&D teams
- Technical concerns and formulation challenges
- Regulatory and compliance questions
- Supply chain and logistics concerns
- Quality assurance requirements
- How to structure answers for SEO (question-answer format)`,
    user: `Create a strategic FAQ section for this food ingredient product.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}
- Description: {DESCRIPTION}
- Technical Specs: {TECHNICAL_SPECS}
- Applications: {USE_CASES}
- Features & Benefits: {FEATURES_BENEFITS}

**FAQ Requirements**:
1. Create 8-12 strategic Q&As
2. Address different buyer journey stages (awareness → consideration → decision)
3. Include technical questions R&D teams ask
4. Address compliance and regulatory concerns
5. Cover supply, packaging, and logistics
6. Include application and usage questions
7. Optimize for featured snippets (concise, direct answers)
8. Use natural language that buyers actually search

**Question Categories to Cover**:

**Product Understanding** (2-3 questions)
- What is [ingredient]?
- What are the main properties/characteristics?
- How is it different from alternatives?

**Technical & Application** (2-3 questions)
- What are the typical applications?
- What is the recommended usage level?
- Is it compatible with other ingredients?
- What are the stability/storage requirements?

**Quality & Compliance** (2-3 questions)
- What certifications does it have?
- Is it food grade / meets regulatory standards?
- What is the purity/quality level?
- Are allergen-free / GMO-free options available?

**Supply & Logistics** (2-3 questions)
- What packaging options are available?
- What is the minimum order quantity?
- What is the lead time?
- How should it be stored?

**Format for Each Q&A**:
**Q: [Question in natural language]**
[Concise, direct answer in 2-4 sentences. First sentence should directly answer the question. Follow with supporting details. Use technical terminology where appropriate but keep accessible.]

**Tone**: Professional, helpful, technically accurate. Write as if answering a valued customer's inquiry.

Generate 8-12 strategic Q&As formatted as shown above.`
  },

  callToActions: {
    system: `You are a B2B conversion optimization specialist for the food ingredients industry. You create calls-to-action that align with different buyer stages and purchasing processes.

You understand:
- B2B buying processes (multiple stakeholders, longer cycles)
- Different buyer personas (R&D, procurement, QA, production)
- The importance of samples and technical documentation
- How to reduce friction in the purchasing journey
- Micro-conversions that lead to sales`,
    user: `Create a comprehensive set of calls-to-action for this food ingredient product page.

**BUSINESS RESEARCH CONTEXT:**
{BUSINESS_RESEARCH}

**PRODUCT INFORMATION:**
- Product Title: {PRODUCT_TITLE}
- Category: {PRODUCT_CATEGORY}

**CTA Requirements**:
1. Create 4-6 different CTAs for different buyer stages
2. Include primary CTA (strongest conversion action)
3. Include secondary CTAs (lower commitment)
4. Address different buyer personas
5. Make CTAs specific and action-oriented
6. Include both high-intent and nurture CTAs

**CTA Types to Include**:

**Primary CTA** (Highest Intent)
- Direct purchase or quote request
- Strong action verb + clear benefit
- Example: "Request a Quote for Bulk Orders"

**Sample Request CTA** (Common in food ingredients)
- Free sample request (powerful for R&D teams)
- Example: "Request a Free Sample for Testing"

**Information Request CTA**
- Technical data sheet download
- Certificate of Analysis request
- Example: "Download Technical Data Sheet (PDF)"

**Consultation CTA**
- Speak with technical expert
- Application support
- Example: "Speak with Our Food Scientists"

**Secondary/Soft CTA**
- Add to enquiry list
- Save for later
- Example: "Add to Enquiry List"

**Nurture CTA**
- Newsletter signup
- Resource download
- Example: "Download Our Ingredients Guide"

**Format for Each CTA**:
**[CTA Type]**: "[Exact CTA text]"
**Target Persona**: [Who this appeals to - R&D, Procurement, etc.]
**Stage**: [Awareness / Consideration / Decision]
**Placement**: [Where on page - hero, product info, sidebar, etc.]

**Additional Elements**:
- Suggest 1-2 trust signals to include near CTAs (certifications, experience, guarantees)
- Suggest urgency or value elements if appropriate

Generate all CTAs with the specified format and details.`
  }
};

/**
 * Helper function to get food ingredients prompts with business name injection
 * @param {string} businessName - The name of the food ingredients supplier
 * @returns {object} Complete prompts object with business name injected
 */
function getFoodIngredientsPrompts(businessName = 'the supplier') {
  // For now, return the prompts as-is
  // In the future, we can inject business name into system prompts if needed
  return FOOD_INGREDIENTS_PROMPTS;
}

module.exports = FOOD_INGREDIENTS_PROMPTS;
module.exports.FOOD_INGREDIENTS_PROMPTS = FOOD_INGREDIENTS_PROMPTS;
module.exports.getFoodIngredientsPrompts = getFoodIngredientsPrompts;
module.exports.default = FOOD_INGREDIENTS_PROMPTS;
