import { storage } from './firebase';
import { config } from '../config';
import * as XLSX from 'xlsx';

export async function exportTestCases(
  testCases: any[],
  format: 'json' | 'csv' | 'xlsx' | 'pdf'
): Promise<string> {
  let content: Buffer | string;
  let contentType: string;
  let fileExtension: string;

  switch (format) {
    case 'json':
      content = JSON.stringify(testCases, null, 2);
      contentType = 'application/json';
      fileExtension = 'json';
      break;

    case 'csv':
      content = convertToCSV(testCases);
      contentType = 'text/csv';
      fileExtension = 'csv';
      break;

    case 'xlsx':
      content = convertToXLSX(testCases);
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileExtension = 'xlsx';
      break;

    case 'pdf':
      content = await convertToPDF(testCases);
      contentType = 'application/pdf';
      fileExtension = 'pdf';
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  // Upload to Cloud Storage
  const fileName = `test-cases-export-${Date.now()}.${fileExtension}`;
  const bucket = storage.bucket(config.storage.bucketName);
  const file = bucket.file(`exports/${fileName}`);

  await file.save(content, {
    contentType,
    metadata: {
      cacheControl: 'public, max-age=3600',
    },
  });

  // Generate signed URL
  const [url] = await file.getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });

  return url;
}

function convertToCSV(data: any[]): string {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Priority',
    'Type',
    'Status',
    'Compliance',
    'Steps',
    'Expected Results',
  ];

  const rows = data.map((tc) => [
    tc.id,
    tc.title,
    tc.description,
    tc.priority,
    tc.type,
    tc.status,
    (tc.compliance || []).join('; '),
    (tc.steps || []).join(' | '),
    tc.expectedResults,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

function convertToXLSX(data: any[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((tc) => ({
      ID: tc.id,
      Title: tc.title,
      Description: tc.description,
      Priority: tc.priority,
      Type: tc.type,
      Status: tc.status,
      Compliance: (tc.compliance || []).join('; '),
      Steps: (tc.steps || []).join(' | '),
      'Expected Results': tc.expectedResults,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

async function convertToPDF(data: any[]): Promise<Buffer> {
  // Basic HTML representation (in production, use a proper PDF library)
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <h1>Test Cases Export</h1>
      ${data.map((tc) => `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2>${tc.title}</h2>
          <p><strong>ID:</strong> ${tc.id}</p>
          <p><strong>Priority:</strong> ${tc.priority}</p>
          <p><strong>Type:</strong> ${tc.type}</p>
          <p><strong>Description:</strong> ${tc.description}</p>
          <p><strong>Steps:</strong></p>
          <ol>${(tc.steps || []).map((step: string) => `<li>${step}</li>`).join('')}</ol>
          <p><strong>Expected Results:</strong> ${tc.expectedResults}</p>
        </div>
      `).join('')}
    </body>
    </html>
  `;

  return Buffer.from(html);
}
