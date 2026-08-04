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

  // Construct height calculation script to inject
  const scriptToInject = `
    <script>
      (function() {
        const sendHeight = () => {
          let h = 0;
          
          if (document.body) {
            h = Math.max(h, document.body.scrollHeight, document.body.offsetHeight);
            const bodyRect = document.body.getBoundingClientRect();
            if (bodyRect.height > h) h = Math.ceil(bodyRect.height);
          }
          if (document.documentElement) {
            h = Math.max(h, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
          }
          
          const wrapper = document.getElementById('iframe-content-wrapper');
          if (wrapper) {
            h = Math.max(h, wrapper.scrollHeight, Math.ceil(wrapper.getBoundingClientRect().height));
          }

          // Check children position for dynamic absolute/flex/collapsed elements
          const children = (document.body && document.body.children) ? document.body.children : [];
          for (let i = 0; i < children.length; i++) {
            if (children[i].tagName === 'SCRIPT' || children[i].tagName === 'STYLE') continue;
            const childRect = children[i].getBoundingClientRect();
            const childBottom = childRect.bottom + window.scrollY;
            if (childBottom > h) {
              h = Math.ceil(childBottom);
            }
          }

          if (h > 0) {
            window.parent.postMessage({
              type: 'resize-iframe',
              id: '${idRef.current}',
              height: h + 20
            }, '*');
          }
        };

        window.addEventListener('load', sendHeight);
        document.addEventListener('DOMContentLoaded', sendHeight);
        
        // Immediate and delayed trigger on clicks (e.g. accordion toggles, row expansion)
        document.addEventListener('click', function() {
          sendHeight();
          setTimeout(sendHeight, 50);
          setTimeout(sendHeight, 200);
          setTimeout(sendHeight, 400);
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

        // Periodic check fallback for animations/delayed renders
        setInterval(sendHeight, 500);
      })();
    </script>
  `;

  let docContent = '';
  const isFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(trimmed);

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
            html, body {
              margin: 0;
              padding: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: transparent;
              overflow-x: hidden;
              overflow-y: visible;
              font-size: 14px;
              color: #334155;
              line-height: 1.6;
            }
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
