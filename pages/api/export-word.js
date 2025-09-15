import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, PageBreak } from 'docx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { results } = req.body;

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ error: 'Results array is required' });
  }

  try {
    const sections = [];

    // Create sections for each product
    results.forEach((result, index) => {
      const productSections = [];

      // Title
      productSections.push(
        new Paragraph({
          text: result.productTitle || `Product ${index + 1}`,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        })
      );

      // URL
      productSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Product URL: ',
              bold: true
            }),
            new TextRun({
              text: result.url,
              color: '0000FF',
              underline: {}
            })
          ],
          spacing: { after: 200 }
        })
      );

      if (result.success) {
        // Meta Description
        productSections.push(
          new Paragraph({
            text: 'Meta Description',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: result.metaDescription || '',
            spacing: { after: 400 }
          })
        );

        // Introduction
        productSections.push(
          new Paragraph({
            text: 'Introduction',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: result.introduction || '',
            spacing: { after: 400 }
          })
        );

        // Features and Benefits
        if (result.featuresAndBenefits && Array.isArray(result.featuresAndBenefits)) {
          productSections.push(
            new Paragraph({
              text: 'Features & Benefits',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            })
          );

          result.featuresAndBenefits.forEach(feature => {
            productSections.push(
              new Paragraph({
                text: `• ${feature}`,
                spacing: { after: 100 },
                indent: { left: 360 }
              })
            );
          });
        }

        // Technical Specifications
        if (result.technicalSpecs && Object.keys(result.technicalSpecs).length > 0) {
          productSections.push(
            new Paragraph({
              text: 'Technical Specifications',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            })
          );

          const tableRows = Object.entries(result.technicalSpecs).map(([key, value]) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: key, bold: true })],
                  width: { size: 30, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph({ text: String(value) })],
                  width: { size: 70, type: WidthType.PERCENTAGE }
                })
              ]
            })
          );

          productSections.push(
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          );
        }

        // Use Cases
        if (result.useCases && Array.isArray(result.useCases)) {
          productSections.push(
            new Paragraph({
              text: 'Use Cases',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            })
          );

          result.useCases.forEach(useCase => {
            productSections.push(
              new Paragraph({
                text: `• ${useCase}`,
                spacing: { after: 100 },
                indent: { left: 360 }
              })
            );
          });
        }

        // SEO Keywords
        if (result.seoKeywords) {
          productSections.push(
            new Paragraph({
              text: 'SEO Keywords',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            })
          );

          if (result.seoKeywords.primaryKeywords) {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Primary Keywords: ', bold: true }),
                  new TextRun({ text: result.seoKeywords.primaryKeywords.join(', ') })
                ],
                spacing: { after: 100 }
              })
            );
          }

          if (result.seoKeywords.commercialIntent) {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Commercial Intent Keywords: ', bold: true }),
                  new TextRun({ text: result.seoKeywords.commercialIntent.join(', ') })
                ],
                spacing: { after: 100 }
              })
            );
          }

          if (result.seoKeywords.longTail) {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Long-tail Keywords: ', bold: true }),
                  new TextRun({ text: result.seoKeywords.longTail.join(', ') })
                ],
                spacing: { after: 100 }
              })
            );
          }

          if (result.seoKeywords.semantic) {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Semantic Keywords: ', bold: true }),
                  new TextRun({ text: result.seoKeywords.semantic.join(', ') })
                ],
                spacing: { after: 100 }
              })
            );
          }

          if (result.seoKeywords.localUK) {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Local/UK Keywords: ', bold: true }),
                  new TextRun({ text: result.seoKeywords.localUK.join(', ') })
                ],
                spacing: { after: 400 }
              })
            );
          }
        }

        // FAQs
        if (result.faqs && Array.isArray(result.faqs)) {
          productSections.push(
            new Paragraph({
              text: 'Frequently Asked Questions',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            })
          );

          result.faqs.forEach(faq => {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `Q: ${faq.question}`, bold: true })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: `A: ${faq.answer}`,
                spacing: { after: 200 },
                indent: { left: 360 }
              })
            );
          });
        }

        // Call to Actions
        if (result.callToActions) {
          productSections.push(
            new Paragraph({
              text: 'Call to Action',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: result.callToActions,
              spacing: { after: 400 }
            })
          );
        }

        // Structured Data (Schema.org)
        if (result.structuredData) {
          productSections.push(
            new Paragraph({
              text: 'Structured Data (Schema.org JSON-LD)',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: JSON.stringify(result.structuredData, null, 2),
              spacing: { after: 400 },
              style: 'Code'
            })
          );
        }

      } else {
        // Error message for failed products
        productSections.push(
          new Paragraph({
            text: `Error: ${result.error || 'Failed to generate content'}`,
            color: 'FF0000',
            spacing: { after: 400 }
          })
        );
      }

      // Add all sections for this product
      sections.push(...productSections);

      // Add page break between products (except for the last one)
      if (index < results.length - 1) {
        sections.push(new Paragraph({ children: [new PageBreak()] }));
      }
    });

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    // Generate the document buffer
    const buffer = await Packer.toBuffer(doc);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=product-descriptions-${Date.now()}.docx`);

    return res.send(buffer);

  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({ error: 'Failed to generate Word document' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}