import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

/**
 * Standardized Monospace CodeBlock with Copy button and horizontal mobile scrolling.
 */
export const CodeBlock = ({
  code = '',
  language = 'java',
  title,
  showLineNumbers = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const lines = code.trim().split('\n');

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-md my-4 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-slate-300 uppercase">{title || language}</span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-sans font-medium cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Horizontal Scroll */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200">
        <pre className="min-w-full">
          {showLineNumbers ? (
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="pr-4 text-slate-600 select-none text-right font-mono text-xs w-8">
                      {idx + 1}
                    </td>
                    <td className="font-mono text-slate-100 whitespace-pre">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code.trim()}</code>
          )}
        </pre>
      </div>
    </div>
  );
};
