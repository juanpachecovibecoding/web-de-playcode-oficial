import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const body = request.body as HandleUploadBody;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(500).json({ 
      error: "BLOB_READ_WRITE_TOKEN is missing in the Vercel server environment. Please ensure you have added it to your Environment Variables in the Vercel dashboard and triggered a new deployment." 
    });
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
