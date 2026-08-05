import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

async function getParsedBody(req: VercelRequest): Promise<any> {
  // If Vercel already parsed it as an object
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  // If Vercel parsed it as a string
  if (typeof req.body === 'string') {
    return JSON.parse(req.body);
  }

  // If it's a buffer or a stream, read it
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(new Error('Failed to parse request body as JSON: ' + (err as Error).message));
      }
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(500).json({ 
      error: "BLOB_READ_WRITE_TOKEN is missing in the Vercel server environment. Please ensure you have added it to your Environment Variables in the Vercel dashboard and triggered a new deployment." 
    });
  }

  let body: HandleUploadBody;
  try {
    body = await getParsedBody(request);
  } catch (err) {
    return response.status(400).json({ error: (err as Error).message });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        pathname,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        clientPayload
      ) => {
        // Authorize uploads. In a production app, we would authenticate the admin here.
        // For simplicity and matching current open client architecture, we allow it.
        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
            'text/html',
            'text/css',
            'text/javascript',
            'text/plain',
            'application/json',
            'application/zip',
            'application/x-zip-compressed'
          ],
          tokenPayload: JSON.stringify({
            // optional payload data
          }),
        };
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: (error as Error).message });
  }
}
