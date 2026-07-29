import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const body = request.body as HandleUploadBody;

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
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Log when a file has successfully uploaded to Vercel Blob CDN.
        console.log('Blob upload completed successfully:', blob, tokenPayload);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: (error as Error).message });
  }
}
