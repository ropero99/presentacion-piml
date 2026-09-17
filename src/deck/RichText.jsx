import React from 'react';

const makeTokenizer = () => /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

/**
 * Renderiza texto en línea con **negrita** y *cursiva*. La matemática
 * ($...$ / $$...$$) se deja como texto crudo: el wrapper MathJax del slide
 * la compone (typeset en modo post, una pasada por slide).
 */
export default function RichText({ text, as: Tag = 'span' }) {
  if (typeof text !== 'string') return <Tag>{text}</Tag>;

  const parts = [];
  let lastIndex = 0;
  let key = 0;
  const tokenRe = makeTokenizer();

  let match;
  while ((match = tokenRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={key++}>{match[2]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <Tag>{parts}</Tag>;
}
