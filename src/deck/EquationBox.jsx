import React from 'react';
import RichText from './RichText.jsx';

/**
 * Caja de ecuación estilo deck: encabezado, ecuación display (delimitadores
 * $$...$$ compuestos por el MathJax del slide), puente visual opcional
 * (cadena de pasos con flechas rotuladas) y línea de conexión con el
 * diagrama. La ecuación DEBE ser literal del documento.
 */
function BridgeChain({ bridge }) {
  return (
    <div className="eq-bridge">
      <div className="eq-bridge-chain">
        {bridge.chain.map((node, i) =>
          node.step ? (
            <span className="eq-bridge-step" key={i}>
              <span className="eq-bridge-step-label">{node.step}</span>
              <span className="eq-bridge-step-arrow" aria-hidden="true" />
            </span>
          ) : (
            <span className="eq-bridge-node" key={i}>
              {`$${node.tex}$`}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export default function EquationBox({ heading, tex, conn, bridge }) {
  return (
    <div className="eq-box">
      {heading ? (
        <p className="eq-heading">
          <RichText text={heading} />
        </p>
      ) : null}
      <div className="eq-display">{`$$${tex}$$`}</div>
      {bridge ? <BridgeChain bridge={bridge} /> : null}
      {conn ? (
        <p className="eq-conn">
          <RichText text={conn} />
        </p>
      ) : null}
    </div>
  );
}
