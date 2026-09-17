import React from 'react';
import RichText from './RichText.jsx';

/**
 * Caja de ecuación estilo deck: encabezado, ecuación display (delimitadores
 * $$...$$ compuestos por el MathJax del slide) y línea de conexión con el
 * diagrama. La ecuación DEBE ser literal del documento.
 */
export default function EquationBox({ heading, tex, conn }) {
  return (
    <div className="eq-box">
      {heading ? (
        <p className="eq-heading">
          <RichText text={heading} />
        </p>
      ) : null}
      <div className="eq-display">{`$$${tex}$$`}</div>
      {conn ? (
        <p className="eq-conn">
          <RichText text={conn} />
        </p>
      ) : null}
    </div>
  );
}
