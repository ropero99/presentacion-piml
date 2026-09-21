import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from '@xyflow/react';

/**
 * Panel compartido de las figuras ReactFlow del deck. Cada diagrama declara
 * sus nodos/aristas fieles al bloque Mermaid del documento; el estilo visual
 * es el del deck de referencia (blanco, líneas frías, acentos por clase).
 */
export default function DeckFlowPanel({ flow = 'lr', nodes, edges, title, active }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas flow={flow} nodes={nodes} edges={edges} title={title} active={active} />
    </ReactFlowProvider>
  );
}

// Anclajes declarados por el nodo (data.sourceHandles / data.targetHandles)
// se reparten a lo largo del canto: en 'lr' en vertical (top %), en 'tb' en
// horizontal (left %). Sin declaración se conserva el anclaje único de siempre.
function anchorStyle(yPct, vertical) {
  return vertical ? { left: `${yPct}%` } : { top: `${yPct}%` };
}

function buildNodeType(flow) {
  return function DeckNode({ data }) {
    const vertical = flow === 'tb';
    return (
      <div className={`deck-node${data.heavy ? ' is-heavy' : ''}`}>
        <div
          className="node-bar"
          style={{ background: data.color || '#2E86AB' }}
          aria-hidden="true"
        />
        {(data.targetHandles || []).map((h) => (
          <Handle
            key={`tgt-${h.id}`}
            type="target"
            id={h.id}
            position={vertical ? Position.Top : Position.Left}
            style={anchorStyle(h.yPct, vertical)}
            isConnectable={false}
          />
        ))}
        {!data.targetHandles ? (
          <Handle type="target" position={vertical ? Position.Top : Position.Left} isConnectable={false} />
        ) : null}
        {data.title ? <div className="node-title">{data.title}</div> : null}
        {(data.lines || []).map((line, i) => (
          <div className="node-line" key={i}>
            {line}
          </div>
        ))}
        {(data.sourceHandles || []).map((h) => (
          <Handle
            key={`src-${h.id}`}
            type="source"
            id={h.id}
            position={vertical ? Position.Bottom : Position.Right}
            style={anchorStyle(h.yPct, vertical)}
            isConnectable={false}
          />
        ))}
        {!data.sourceHandles ? (
          <Handle type="source" position={vertical ? Position.Bottom : Position.Right} isConnectable={false} />
        ) : null}
      </div>
    );
  };
}

/**
 * Arista personalizada del deck: geometría smoothstep idéntica a la nativa
 * (offset/borderRadius vía pathOptions) pero con la etiqueta anclada al tramo
 * final, junto al destino, donde cada arista llega a un anclaje propio y
 * distinto. Así las estrellas ya no colisionan en el corredor central (el
 * punto medio del smoothstep no se desplaza con el offset).
 */
function DeckEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  pathOptions,
}) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    offset: pathOptions?.offset ?? data?.offset ?? 0,
    borderRadius: pathOptions?.borderRadius ?? 10,
  });

  const horizontal =
    targetPosition === Position.Left || targetPosition === Position.Right;
  // 'lr': etiqueta a la izquierda del handle destino. 'tb': sobre el destino.
  const labelX = horizontal ? targetX - 34 : targetX;
  const labelY = horizontal ? targetY : targetY - 20;

  const bg = data?.labelBgStyle || LABEL_BG;
  const labelStyleDef = data?.labelStyle || LABEL_STYLE;

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      {data?.label ? (
        <EdgeLabelRenderer>
          <div
            className="deck-edge-label"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              fontSize: labelStyleDef.fontSize,
              fontWeight: labelStyleDef.fontWeight,
              color: labelStyleDef.fill,
              fontFamily: labelStyleDef.fontFamily,
              background: bg.fill,
              border: `${bg.strokeWidth}px solid ${bg.stroke}`,
              borderRadius: bg.borderRadius,
              padding: '1px 5px',
              pointerEvents: 'none',
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}

/**
 * Fábrica de aristas trazables: color heredado del nodo origen, anclajes
 * explícitos (sourceHandle/targetHandle) y offset para separar rutas
 * paralelas que sin esto se superpondrían.
 */
// eslint-disable-next-line react/only-export-components -- helper compartido por diseño
export function makeEdge(source, target, opts = {}) {
  const {
    color,
    sourceHandle,
    targetHandle,
    label,
    labelStyle,
    labelBgStyle,
    offset = 0,
    dashed = false,
    opacity = 1,
    strokeWidth = 2,
    id,
  } = opts;
  const style = { stroke: color, strokeWidth };
  if (dashed) style.strokeDasharray = '6 5';
  if (opacity < 1) style.opacity = opacity;
  return {
    id: id || `${source}-${target}`,
    source,
    target,
    type: 'deck',
    ...(sourceHandle ? { sourceHandle } : null),
    ...(targetHandle ? { targetHandle } : null),
    ...(label ? { data: { label, labelStyle, labelBgStyle } } : null),
    pathOptions: { offset, borderRadius: 10 },
    style,
  };
}

const LABEL_STYLE = {
  fontSize: 10,
  fontWeight: 600,
  fill: '#1b2029',
  fontFamily: '"Space Grotesk", sans-serif',
};

const LABEL_BG = {
  fill: '#ffffff',
  strokeWidth: 1,
  stroke: '#dde2ec',
  borderRadius: 6,
};

function FlowCanvas({ flow, nodes, edges, title, active }) {
  const nodeType = useMemo(() => buildNodeType(flow), [flow]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.12, duration: 240 });
    });
    return () => cancelAnimationFrame(id);
  }, [active, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={{ deck: nodeType }}
      edgeTypes={{ deck: DeckEdge }}
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.35}
      maxZoom={1.6}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      zoomOnDoubleClick={false}
    >
      {title ? <div className="rf-title">{title}</div> : null}
      <Background color="#8394a3" gap={22} size={1.4} />
      <Controls position="bottom-right" showInteractive={false} />
    </ReactFlow>
  );
}

export { LABEL_STYLE, LABEL_BG };
