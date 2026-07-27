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
        setHeight(Math.max(e.data.height, minHeight));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [minHeight]);

  if (!htmlContent) return null;

  const trimmed = htmlContent.trim();
  const isIframe = trimmed.startsWith('<iframe') && (trimmed.endsWith('</iframe>') || trimmed.endsWith('/>'));

  if (isIframe) {
    // If it's already an iframe (like YouTube embed, Scratch, etc.), render it directly
    return (
      <div
        className={`w-full flex justify-center items-center [&_iframe]:w-full [&_iframe]:border-0 [&_iframe]:min-h-[500px] [&_iframe]:aspect-video ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // Inject a resize script and basic style resetting
  const docContent = `
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
            overflow: hidden;
            font-size: 14px;
            color: #334155;
            line-height: 1.6;
          }
          #iframe-content-wrapper {
            padding: 1px 0; /* Prevents margin collapsing issues */
            width: 100%;
            box-sizing: border-box;
          }
          /* Responsive media items */
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
        <script>
          const sendHeight = () => {
            const wrapper = document.getElementById('iframe-content-wrapper');
            if (!wrapper) return;
            // Get height including margins and paddings
            const rect = wrapper.getBoundingClientRect();
            const height = Math.ceil(rect.height);
            window.parent.postMessage({
              type: 'resize-iframe',
              id: '${idRef.current}',
              height: height
            }, '*');
          };
          window.addEventListener('load', sendHeight);
          // Wait for images to load to get correct height
          document.querySelectorAll('img').forEach(img => {
            if (img.complete) return;
            img.addEventListener('load', sendHeight);
            img.addEventListener('error', sendHeight);
          });
          if (window.ResizeObserver) {
            new ResizeObserver(sendHeight).observe(document.body);
          }
          // Periodic fallback check (e.g. for dynamic JS modifications or late fonts loading)
          setInterval(sendHeight, 1000);
        </script>
      </body>
    </html>
  `;

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
