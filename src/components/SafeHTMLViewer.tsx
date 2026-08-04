import React, { useState, useEffect, useRef } from 'react';

interface SafeHTMLViewerProps {
  htmlContent: string;
  className?: string;
  minHeight?: number;
  /** When true, iframe fills its container height and scrolls internally */
  fillContainer?: boolean;
}

export const SafeHTMLViewer: React.FC<SafeHTMLViewerProps> = ({
  htmlContent,
  className = '',
  minHeight = 400,
  fillContainer = false,
}) => {
  const [height, setHeight] = useState(minHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const idRef = useRef(`iframe-${Math.random().toString(36).substring(2, 11)}`);

  // Only do dynamic height measurement when NOT in fillContainer mode
  useEffect(() => {
    if (fillContainer) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'resize-iframe' && e.data.id === idRef.current) {
        if (typeof e.data.height === 'number' && e.data.height > 0) {
          setHeight(Math.max(e.data.height, minHeight));
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [minHeight, fillContainer]);

  if (!htmlContent) return null;

  const trimmed = htmlContent.trim();
  const isIframe = trimmed.startsWith('<iframe') && (trimmed.endsWith('</iframe>') || trimmed.endsWith('/>'));

  if (isIframe) {
    return (
      <div
        className={`w-full flex justify-center items-center [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:min-h-[500px] [&_iframe]:aspect-video ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // ── FILL CONTAINER MODE ───────────────────────────────────────────────────
  // The iframe occupies 100% of its parent and the document inside scrolls naturally.
  if (fillContainer) {
    const isFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(trimmed);
    let docContent = '';

    if (isFullDoc) {
      // Use the document as-is — it already has its own scroll behaviour
      docContent = trimmed;
    } else {
      docContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              *, *::before, *::after { box-sizing: border-box; }
              html, body {
                margin: 0; padding: 0;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 14px;
                color: #334155;
                line-height: 1.6;
              }
              img, video, iframe { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;
    }

    return (
      <iframe
        ref={iframeRef}
        srcDoc={docContent}
        className={`w-full border-0 ${className}`}
        style={{ display: 'block', flex: 1, minHeight: 0 }}
        sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-downloads"
        scrolling="yes"
        title="lesson-content"
      />
    );
  }

  // ── DYNAMIC HEIGHT MODE (for embedded lessons inside a scrollable page) ───
  const scriptToInject = `
    <script>
      (function() {
        const sendHeight = () => {
          let h = 0;
          if (document.body) {
            h = Math.max(h, document.body.scrollHeight, document.body.offsetHeight);
          }
          if (document.documentElement) {
            h = Math.max(h, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
          }
          const wrapper = document.getElementById('iframe-content-wrapper');
          if (wrapper) {
            h = Math.max(h, wrapper.scrollHeight, Math.ceil(wrapper.getBoundingClientRect().height));
          }
          if (h > 0) {
            window.parent.postMessage({ type: 'resize-iframe', id: '${idRef.current}', height: h + 32 }, '*');
          }
        };
        window.addEventListener('load', sendHeight);
        document.addEventListener('DOMContentLoaded', sendHeight);
        document.addEventListener('click', () => { setTimeout(sendHeight, 50); setTimeout(sendHeight, 300); });
        if (window.ResizeObserver && document.body) {
          try { new ResizeObserver(sendHeight).observe(document.body); } catch(e) {}
        }
        if (window.MutationObserver) {
          try {
            new MutationObserver(sendHeight).observe(document.documentElement || document.body, {
              childList: true, subtree: true, attributes: true
            });
          } catch(e) {}
        }
        setInterval(sendHeight, 1000);
      })();
    </script>
  `;

  const isFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(trimmed);
  let docContent = '';

  if (isFullDoc) {
    if (trimmed.includes('</body>')) {
      docContent = trimmed.replace('</body>', `${scriptToInject}\n</body>`);
    } else if (trimmed.includes('</html>')) {
      docContent = trimmed.replace('</html>', `${scriptToInject}\n</html>`);
    } else {
      docContent = trimmed + scriptToInject;
    }
  } else {
    docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            html, body { margin: 0; padding: 0; font-family: system-ui, sans-serif; font-size: 14px; color: #334155; line-height: 1.6; overflow-x: hidden; overflow-y: visible; }
            #iframe-content-wrapper { padding: 1px 0; width: 100%; box-sizing: border-box; }
            img, video, iframe { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <div id="iframe-content-wrapper">
            ${htmlContent}
          </div>
          ${scriptToInject}
        </body>
      </html>
    `;
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={docContent}
      className={`w-full border-0 ${className}`}
      style={{ height: `${height}px`, display: 'block', overflow: 'hidden' }}
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-downloads"
      scrolling="no"
      title="lesson-content"
    />
  );
};
