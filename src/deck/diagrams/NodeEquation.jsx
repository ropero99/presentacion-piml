import React from 'react';
import { MathJax } from 'better-react-mathjax';

/**
 * Línea de nodo con math tipografado: envuelve un string marcado con
 * `$…$` (los delimitadores pasan tal cual — la config de MathProvider
 * los consume con inlineMath [['$','$']]). Único componente del panel
 * que importa better-react-mathjax fuera de SlideBody.
 *
 * `dynamic` es obligatorio en builds de producción:
 * better-react-mathjax 3.0.2 hace typeset con `dynamic` o en dev; sin
 * esa prop el prod nunca renderiza `mjx-container`.
 */
export default function NodeEquation({ code, onTypeset }) {
  return (
    <MathJax inline dynamic onTypeset={onTypeset} className="deck-eqline">
      {code}
    </MathJax>
  );
}
