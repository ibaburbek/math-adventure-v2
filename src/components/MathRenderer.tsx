import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  formula?: string;
  text?: string;
  inline?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  formula,
  text,
  inline = false,
  className = '',
}) => {
  // If a dedicated formula string is provided
  const renderedFormula = useMemo(() => {
    if (!formula) return null;
    try {
      return katex.renderToString(formula, {
        displayMode: !inline,
        throwOnError: false,
      });
    } catch {
      return formula;
    }
  }, [formula, inline]);

  // If text contains $...$ or $$...$$ formulas, parse them
  const renderedText = useMemo(() => {
    if (!text) return null;
    // Fast check if there are math delimiters
    if (!text.includes('$')) return text;

    try {
      const parts: Array<{ type: 'text' | 'math'; content: string; display: boolean }> = [];
      const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
            display: false,
          });
        }
        const isBlock = match[0].startsWith('$$');
        const rawFormula = isBlock ? match[0].slice(2, -2) : match[0].slice(1, -1);
        parts.push({
          type: 'math',
          content: rawFormula,
          display: isBlock,
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex),
          display: false,
        });
      }

      return parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        try {
          const html = katex.renderToString(part.content, {
            displayMode: part.display,
            throwOnError: false,
          });
          return (
            <span
              key={i}
              className="inline-block px-1 align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={i}>{part.content}</span>;
        }
      });
    } catch {
      return text;
    }
  }, [text]);

  if (formula && renderedFormula) {
    return (
      <div
        className={`math-render overflow-x-auto py-1 ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedFormula }}
      />
    );
  }

  return <span className={className}>{renderedText}</span>;
};
