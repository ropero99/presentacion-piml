import React, { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { RefitContext, hasMathLine } from './DeckFlowPanel.jsx';
import NodeEquation from './NodeEquation.jsx';

/**
 * Tipos de nodo extra del esquema MR (lenguaje del esquema TikZ de
 * referencia, Slides_PINNs/esquemaPINNs.tex): neuronas circulares con
 * conexiones lado a lado, etiquetas de capa, caja punteada de estructura
 * física (puerta ②) y línea de pérdida (composición L = ...).
 * Se registran vía la prop extraNodeTypes de DeckFlowPanel (evolución
 * compartida del panel, sin forks por diagrama).
 *
 * IMPORTANTE: todo nodo custom con aristas debe renderizar al menos un
 * Handle (aunque sea isConnectable={false}) — sin él ReactFlow no calcula
 * handleBounds y la arista no se dibuja.
 */

/** Neurona circular: borde del color de capa, relleno claro, texto centrado.
 * El rótulo puede llevar math `$…$` (p. ej. `$H_\theta$`, `$\hat{x}_\theta(t)$`)
 * y se tipografía vía NodeEquation. */
export function NeuronNode({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div
      className={`deck-neuron${data.heavy ? ' is-heavy' : ''}`}
      style={{
        borderColor: data.color,
        background: data.fill || '#fff',
        color: data.textColor || 'var(--fg)',
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      {hasMathLine(data.label) ? (
        <NodeEquation code={data.label} onTypeset={refit} />
      ) : (
        data.label
      )}
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
}

/** Etiqueta de capa, chip, panel de zona o divisor (texto plano o caja).
 * La llave theta (variant 'theta') puede llevar `$…$` y se tipografía
 * vía NodeEquation (R15: nodo compartido por las puertas ① y ③). */
export function LabelNode({ data }) {
  const refit = useContext(RefitContext);
  const style =
    data.variant === 'badge' || data.variant === 'chip'
      ? { background: data.color, color: '#fff' }
      : { color: data.color };
  return (
    <div
      className={`deck-label${data.variant ? ` is-${data.variant}` : ''}`}
      style={{ ...style, ...(data.style || {}) }}
    >
      {hasMathLine(data.label) ? (
        <NodeEquation code={data.label} onTypeset={refit} />
      ) : (
        data.label
      )}
    </div>
  );
}

/** Caja punteada de estructura física (puerta ②): envuelve las ocultas. */
export function StructureNode({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div className="deck-structurebox" style={{ borderColor: data.color, ...(data.style || {}) }}>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <span className="deck-structure-title" style={{ color: data.color }}>
        {hasMathLine(data.label) ? <NodeEquation code={data.label} onTypeset={refit} /> : data.label}
      </span>
      {data.eq ? (
        <span className="deck-structure-eq">
          {hasMathLine(data.eq) ? <NodeEquation code={data.eq} onTypeset={refit} /> : data.eq}
        </span>
      ) : null}
      {data.badge ? <span className="deck-structure-badge">★ PUNTO DE ENTRADA DE LA FÍSICA</span> : null}
    </div>
  );
}

/** Línea de composición de la pérdida (texto plano, sin caja). Las
 * líneas marcadas `$…$` se tipografían vía NodeEquation (R15, puerta ①). */
export function LossLineNode({ data }) {
  const refit = useContext(RefitContext);
  return (
    <div className="deck-lossline" style={{ color: data.color }}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      {data.lines.map((line, i) =>
        hasMathLine(line) ? (
          <NodeEquation key={i} code={line} onTypeset={refit} />
        ) : (
          <span key={i} className="deck-lossline-part">
            {line}
          </span>
        ),
      )}
    </div>
  );
}
