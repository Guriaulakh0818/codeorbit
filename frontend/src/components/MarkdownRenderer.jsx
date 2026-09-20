import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Copy, Check } from 'lucide-react';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true
});

export const MarkdownRenderer = ({ content }) => {
  const containerRef = useRef(null);

  // Parse & sanitize markdown
  const sanitizedHtml = React.useMemo(() => {
    if (!content) return '';
    try {
      const rawHtml = marked.parse(content);
      return DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
          'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'hr', 'br',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style']
      });
    } catch (e) {
      return '<p class="text-rose-400">Failed to render markdown content.</p>';
    }
  }, [content]);

  // Attach copy buttons to rendered pre/code blocks
  useEffect(() => {
    if (!containerRef.current) return;
    const preBlocks = containerRef.current.querySelectorAll('pre');

    preBlocks.forEach((pre) => {
      // Avoid duplicate wrappers
      if (pre.parentNode.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper relative group my-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950';

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 font-mono select-none';
      header.innerHTML = '<span>Code Example (Copy Only)</span>';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer';
      copyBtn.innerHTML = '<span>Copy</span>';

      copyBtn.onclick = () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = '<span class="text-emerald-400 font-bold">Copied!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>';
          }, 2000);
        });
      };

      header.appendChild(copyBtn);

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      pre.className = 'p-4 overflow-x-auto text-xs font-mono text-sky-200 leading-relaxed bg-transparent';
    });
  }, [sanitizedHtml]);

  return (
    <div
      ref={containerRef}
      className="prose prose-invert max-w-none 
        prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:border-b prose-h1:border-slate-800 prose-h1:pb-3 prose-h1:mb-6
        prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-sky-300
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-slate-100
        prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm prose-p:sm:text-base
        prose-ul:text-slate-300 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-li:text-sm prose-li:sm:text-base
        prose-ol:text-slate-300 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1
        prose-strong:text-white prose-strong:font-bold
        prose-code:text-sky-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:bg-sky-500/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-200 prose-blockquote:not-italic
        prose-table:w-full prose-table:border-collapse prose-table:my-4
        prose-th:border prose-th:border-slate-700 prose-th:bg-slate-900 prose-th:p-2.5 prose-th:text-xs prose-th:text-white
        prose-td:border prose-td:border-slate-800 prose-td:p-2.5 prose-td:text-xs prose-td:text-slate-300"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
