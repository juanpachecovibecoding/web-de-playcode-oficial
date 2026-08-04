import React, { useState, useEffect, useRef } from 'react';

interface SafeHTMLViewerProps {
  htmlContent: string;
  className?: string;
  minHeight?: number;
}

export const SafeHTMLViewer: React.FC<SafeHTMLViewerProps> = ({
  htmlContent,
  className = '',
  minHeight = 400,
}) => {
  const [height, setHeight] = useState(minHeight);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const idRef = useRef(`iframe-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'resize-iframe' && e.data.id === idRef.current) {
        if (typeof e.data.height === 'number' && e.data.height > 0) {
          setHeight(Math.max(e.data.height, minHeight));
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [minHeight]);

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

  // Override CSS to prevent inner min-height: 100vh from locking the iframe height measurement
  const styleOverride = `
    <style id="playcode-view-overrides">
      html, body {
        min-height: auto !important;
        height: auto !important;
        overflow-x: hidden !important;
        overflow-y: visible !important;
      }
    </style>
  `;

  // Height calculation script to inject inside iframe
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

          // Measure all major elements to get true bottom bound
          try {
            const elems = document.querySelectorAll('.main, #mh-form, .cat-section, .out-section, body > *');
            for (let i = 0; i < elems.length; i++) {
              const el = elems[i];
              if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') continue;
              const rect = el.getBoundingClientRect();
              const bottom = rect.bottom + (window.pageYOffset || document.documentElement.scrollTop || 0);
              if (bottom > h) {
                h = Math.ceil(bottom);
              }
            }
          } catch(e) {}

          if (h > 0) {
            window.parent.postMessage({
              type: 'resize-iframe',
              id: '${idRef.current}',
              height: h + 50
            }, '*');
          }
        };

        window.addEventListener('load', sendHeight);
        document.addEventListener('DOMContentLoaded', sendHeight);
        
        // Triggers on click / interactions (accordion toggles, tabs, etc)
        document.addEventListener('click', function() {
          sendHeight();
          setTimeout(sendHeight, 50);
          setTimeout(sendHeight, 150);
          setTimeout(sendHeight, 300);
          setTimeout(sendHeight, 500);
        });

        window.addEventListener('resize', sendHeight);

        // Observe DOM mutations & size changes
        if (window.MutationObserver) {
          try {
            const observer = new MutationObserver(sendHeight);
            observer.observe(document.documentElement || document.body, {
              childList: true,
              subtree: true,
              attributes: true,
              characterData: true
            });
          } catch(e) {}
        }

        if (window.ResizeObserver && document.body) {
          try {
            new ResizeObserver(sendHeight).observe(document.body);
          } catch(e) {}
        }

        setInterval(sendHeight, 500);
      })();
    </script>
  `;

  let docContent = '';
  const isFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(trimmed);

  if (isFullDoc) {
    let prepared = trimmed;
    // Inject style override into <head>
    if (prepared.includes('</head>')) {
      prepared = prepared.replace('</head>', `${styleOverride}\n</head>`);
    } else {
      prepared = styleOverride + prepared;
    }

    // Inject height script before </body> or </html>
    if (prepared.includes('</body>')) {
      docContent = prepared.replace('</body>', `${scriptToInject}\n</body>`);
    } else if (prepared.includes('</html>')) {
      docContent = prepared.replace('</html>', `${scriptToInject}\n</html>`);
    } else {
      docContent = prepared + scriptToInject;
    }
  } else {
    docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${styleOverride}
          <style>
            #iframe-content-wrapper {
              padding: 1px 0;
              width: 100%;
              box-sizing: border-box;
            }
            img, video, iframe {
              max-width: 100%;
              height: auto;
            }
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
    />
  );
};
