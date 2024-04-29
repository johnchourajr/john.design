import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

const createSafeHtml = (html: string) => {
  DOMPurify.addHook('afterSanitizeElements', function (node: Element) {
    if (node.nodeName === 'P') {
      let allImagesOrBr = Array.from(node.childNodes).every(
        (child) => child.nodeName === 'IMG' || child.nodeName === 'BR',
      );

      if (allImagesOrBr) {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeName === 'IMG') {
            node.parentNode?.insertBefore(child.cloneNode(true), node);
          }
        });
        node.parentNode?.removeChild(node);
      }
    }
  });

  const cleanHtml = DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'src'],
  });

  DOMPurify.removeHook('afterSanitizeElements');

  return cleanHtml;
};

export const useDomPurify = (content: string) => {
  const [safeHtml, setSafeHtml] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sanitizedHtml = createSafeHtml(content);
      setSafeHtml(sanitizedHtml);
    }
  }, [content]);

  return safeHtml;
};
