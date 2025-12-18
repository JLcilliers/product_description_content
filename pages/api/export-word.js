import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, PageBreak } from 'docx';

// Default font settings - Poppins size 12
const DEFAULT_FONT = 'Poppins';
const DEFAULT_FONT_SIZE = 24; // Size in half-points (12pt = 24 half-points)
const HEADING_FONT_SIZE = 28; // 14pt for headings

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

      // 1. Page Name (Title)
      productSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Page Name',
              font: DEFAULT_FONT,
              size: HEADING_FONT_SIZE,
              bold: true
            })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: result.productTitle || `Product ${index + 1}`,
              font: DEFAULT_FONT,
              size: DEFAULT_FONT_SIZE
            })
          ],
          spacing: { after: 400 }
        })
      );

      // 2. Product URL
      productSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Product URL',
              font: DEFAULT_FONT,
              size: HEADING_FONT_SIZE,
              bold: true
            })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: result.url || '',
              font: DEFAULT_FONT,
              size: DEFAULT_FONT_SIZE,
              color: '0000FF',
              underline: {}
            })
          ],
          spacing: { after: 400 }
        })
      );

      if (result.success) {
        // 3. Meta Description
        productSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Meta Description',
                font: DEFAULT_FONT,
                size: HEADING_FONT_SIZE,
                bold: true
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: result.metaDescription || '',
                font: DEFAULT_FONT,
                size: DEFAULT_FONT_SIZE
              })
            ],
            spacing: { after: 400 }
          })
        );

        // 4. Meta Title
        productSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Meta Title',
                font: DEFAULT_FONT,
                size: HEADING_FONT_SIZE,
                bold: true
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: result.metaTitle || result.productTitle || '',
                font: DEFAULT_FONT,
                size: DEFAULT_FONT_SIZE
              })
            ],
            spacing: { after: 400 }
          })
        );

        // 5. Introduction
        productSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Introduction',
                font: DEFAULT_FONT,
                size: HEADING_FONT_SIZE,
                bold: true
              })
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: result.introduction || '',
                font: DEFAULT_FONT,
                size: DEFAULT_FONT_SIZE
              })
            ],
            spacing: { after: 400 }
          })
        );

        // 6. Features and Benefits
        if (result.featuresAndBenefits && Array.isArray(result.featuresAndBenefits)) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Features & Benefits',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { after: 200 }
            })
          );

          result.featuresAndBenefits.forEach(feature => {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${feature}`,
                    font: DEFAULT_FONT,
                    size: DEFAULT_FONT_SIZE
                  })
                ],
                spacing: { after: 100 },
                indent: { left: 360 }
              })
            );
          });
        }

        // 7. Technical Specifications
        if (result.technicalSpecs && Object.keys(result.technicalSpecs).length > 0) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Technical Specifications',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { before: 400, after: 200 }
            })
          );

          const tableRows = Object.entries(result.technicalSpecs).map(([key, value]) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: key, font: DEFAULT_FONT, size: DEFAULT_FONT_SIZE, bold: true })
                    ]
                  })],
                  width: { size: 30, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [
                      new TextRun({ text: String(value), font: DEFAULT_FONT, size: DEFAULT_FONT_SIZE })
                    ]
                  })],
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

        // 8. Use Cases
        if (result.useCases && Array.isArray(result.useCases)) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Use Cases',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { before: 400, after: 200 }
            })
          );

          result.useCases.forEach(useCase => {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${useCase}`,
                    font: DEFAULT_FONT,
                    size: DEFAULT_FONT_SIZE
                  })
                ],
                spacing: { after: 100 },
                indent: { left: 360 }
              })
            );
          });
        }

        // 9. FAQs
        if (result.faqs && Array.isArray(result.faqs)) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Frequently Asked Questions',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { before: 400, after: 200 }
            })
          );

          result.faqs.forEach(faq => {
            productSections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Q: ${faq.question}`,
                    font: DEFAULT_FONT,
                    size: DEFAULT_FONT_SIZE,
                    bold: true
                  })
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `A: ${faq.answer}`,
                    font: DEFAULT_FONT,
                    size: DEFAULT_FONT_SIZE
                  })
                ],
                spacing: { after: 200 },
                indent: { left: 360 }
              })
            );
          });
        }

        // 10. Call to Action
        if (result.callToActions) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Call to Action',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: result.callToActions,
                  font: DEFAULT_FONT,
                  size: DEFAULT_FONT_SIZE
                })
              ],
              spacing: { after: 400 }
            })
          );
        }

        // 11. Structured Data (Schema.org)
        if (result.structuredData) {
          productSections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Structured Data (Schema.org JSON-LD)',
                  font: DEFAULT_FONT,
                  size: HEADING_FONT_SIZE,
                  bold: true
                })
              ],
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: JSON.stringify(result.structuredData, null, 2),
                  font: 'Consolas',
                  size: 20 // 10pt for code
                })
              ],
              spacing: { after: 400 }
            })
          );
        }

      } else {
        // Error message for failed products
        productSections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Error: ${result.error || 'Failed to generate content'}`,
                font: DEFAULT_FONT,
                size: DEFAULT_FONT_SIZE,
                color: 'FF0000'
              })
            ],
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
