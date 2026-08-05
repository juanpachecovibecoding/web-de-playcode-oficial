import type { VercelRequest, VercelResponse } from '@vercel/node';

const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'playcode-39ce5';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  nullValue?: null;
}

interface FirestoreDoc {
  name: string;
  fields: Record<string, FirestoreValue>;
}

interface FirestoreQueryResult {
  document?: FirestoreDoc;
}

function getStringField(doc: FirestoreDoc, field: string): string | undefined {
  return doc.fields[field]?.stringValue;
}

/** Run a Firestore structured query to find a file/folder by name and parentId */
async function findByNameAndParent(name: string, parentId: string): Promise<FirestoreDoc | null> {
  const url = `${FIRESTORE_BASE}:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId: 'files' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: 'name' },
                op: 'EQUAL',
                value: { stringValue: name },
              },
            },
            {
              fieldFilter: {
                field: { fieldPath: 'parentId' },
                op: 'EQUAL',
                value: { stringValue: parentId },
              },
            },
          ],
        },
      },
      limit: 1,
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Firestore query failed: ${response.status} ${response.statusText}`);
  }

  const results: FirestoreQueryResult[] = await response.json();

  if (!results || results.length === 0 || !results[0].document) {
    return null;
  }

  return results[0].document;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract path segments — Vercel passes [...path] as an array or joined string
  const rawPath = req.query.path;
  const segments: string[] = Array.isArray(rawPath)
    ? rawPath.flatMap(p => p.split('/').filter(Boolean))
    : typeof rawPath === 'string'
    ? rawPath.split('/').filter(Boolean)
    : [];

  if (segments.length === 0) {
    return res.status(400).json({ error: 'Se requiere un path de archivo' });
  }

  try {
    let currentParentId = 'root';

    for (let i = 0; i < segments.length; i++) {
      const segment = decodeURIComponent(segments[i]);
      const isLast = i === segments.length - 1;

      const doc = await findByNameAndParent(segment, currentParentId);

      if (!doc) {
        return res.status(404).send(
          `<html><body style="font-family:sans-serif;padding:2rem">` +
          `<h2>404 — Archivo no encontrado</h2>` +
          `<p>No existe <code>${segments.slice(0, i + 1).join('/')}</code> en el gestor de archivos.</p>` +
          `</body></html>`
        );
      }

      const type = getStringField(doc, 'type');
      const content = getStringField(doc, 'content');

      if (isLast) {
        if (type !== 'file' || !content) {
          return res.status(404).send(
            `<html><body style="font-family:sans-serif;padding:2rem">` +
            `<h2>404 — Sin contenido</h2>` +
            `<p>Este elemento no tiene archivo adjunto.</p>` +
            `</body></html>`
          );
        }

        // Redirect to Vercel Blob CDN URL
        res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return res.redirect(302, content);
      } else {
        if (type !== 'directory') {
          return res.status(404).send(
            `<html><body style="font-family:sans-serif;padding:2rem">` +
            `<h2>404 — Ruta inválida</h2>` +
            `<p><code>${segment}</code> es un archivo, no una carpeta.</p>` +
            `</body></html>`
          );
        }
        // Get the document ID from the resource name
        const docId = doc.name.split('/').pop()!;
        currentParentId = docId;
      }
    }

    return res.status(404).json({ error: 'Path no resuelto' });
  } catch (err) {
    console.error('[archivos] Error:', err);
    return res.status(500).send(
      `<html><body style="font-family:sans-serif;padding:2rem">` +
      `<h2>500 — Error interno</h2>` +
      `<p>No se pudo resolver la ruta. Intente nuevamente.</p>` +
      `</body></html>`
    );
  }
}
