import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const filename = req.query.filename as string;
  const contentType = (req.query.contentType as string) || 'application/octet-stream';

  if (!filename) {
    return res.status(400).json({ error: 'filename query parameter is required' });
  }

  try {
    // Get the raw body — Vercel parses unknown content-types as Buffer
    let body: Buffer;
    if (Buffer.isBuffer(req.body)) {
      body = req.body;
    } else if (typeof req.body === 'string') {
      body = Buffer.from(req.body, 'binary');
    } else {
      // Fallback: read the stream manually
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      body = Buffer.concat(chunks);
    }

    if (!body || body.length === 0) {
      return res.status(400).json({ error: 'Empty file body' });
    }

    const blob = await put(filename, body, {
      access: 'public',
      contentType: contentType.split(';')[0].trim(),
      addRandomSuffix: true,
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
