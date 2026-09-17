import React from 'react';
import { MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)'],
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]'],
    ],
    processEscapes: true,
  },
  options: {
    enableMenu: false,
    renderActions: {
      addMenu: [],
    },
  },
};

export default function MathProvider({ children }) {
  return (
    <MathJaxContext config={mathJaxConfig} version={3}>
      {children}
    </MathJaxContext>
  );
}
