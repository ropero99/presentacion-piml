import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import NodeEquation from './NodeEquation.jsx';
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
  BezierEdge,
} from '@xyflow/react';

/**
 * Panel compartido de las figuras ReactFlow del deck. Cada diagrama declara
 * sus nodos/aristas fieles al bloque Mermaid del documento; el estilo visual
 * es el del deck de referencia (blanco, líneas frías, acentos por clase).
 */
export default function DeckFlowPanel({
  flow = 'lr',
  nodes,
  edges,
  title,
  active,
  extraNodeTypes,
  extraEdgeTypes,
  className,
  fitViewPadding = 0.12,
}) {
  return (
    <ReactFlowProvider>
      <FlowCanvas
        flow={flow}
        nodes={nodes}
        edges={edges}
        title={title}
        active={active}
        extraNodeTypes={extraNodeTypes}
        extraEdgeTypes={extraEdgeTypes}
        className={className}
        fitViewPadding={fitViewPadding}
      />
    </ReactFlowProvider>
  );
}

// Cambio v4 (R15/D5): fitView de refit compartido. FlowCanvas crea un
// fitView con rAF-debounce usando el fitViewPadding del propio flujo y lo
// publica por contexto; DeckNode y los tipos extra (loss/theta, que no
// pasan por buildNodeType) lo consumen. El one-shot del useEffect ya
// existente dispara con la altura pre-typeset; el refit re-cuadra tras el
// crecimiento de MathJax. Idempotente: el mutex de MathJax evita dobles
// typeset y repetir fitView es monótono (sin estado).
// eslint-disable-next-line react/only-export-components -- contexto compartido por diseño (patrón makeEdge)
export const RefitContext = createContext(null);

/** Línea de nodo marcada para typeset: empieza Y termina en `$` (nunca
 * `includes` — un `$` suelto en texto de nodo no debe tipografiar nada). */
// eslint-disable-next-line react/only-export-components -- helper compartido por diseño (patrón makeEdge)
export function isEquationLine(line) {
  return typeof line === 'string' && line.startsWith('$') && line.endsWith('$');
}

/** Línea CON math tipografiable: contiene al menos un par `$…$` completo, ya
 * sea toda la línea (ecuación pura) o mezclado con prosa (rótulos tipo
 * "ajuste de $\theta$ con $\mathcal{L}_{HNN}(\theta)$"). MathJax con
 * inlineMath [['$','$']] compone los segmentos math y deja el resto intacto;
 * un `$` suelto o desparejado no dispara typeset. */
// eslint-disable-next-line react/only-export-components -- helper compartido por diseño (patrón makeEdge)
export function hasMathLine(line) {
  return typeof line === 'string' && /\$[^$\n]+\$/.test(line);
}

// Anclajes declarados por el nodo (data.sourceHandles / data.targetHandles)
// se reparten a lo largo del canto: en 'lr' en vertical (top %), en 'tb' en
// horizontal (left %). Sin declaración se conserva el anclaje único de siempre.
function anchorStyle(yPct, vertical) {
  return vertical ? { left: `${yPct}%` } : { top: `${yPct}%` };
}

// Fábrica del nodo 'deck': el closure mantiene flow ('lr'/'tb') para los
// anclajes (nodeTypes se recrea por useMemo cuando cambia flow) y las
// líneas marcadas `$…$` se tipografían vía NodeEquation (R15).
function buildNodeType(flow) {
  return function DeckNode({ data }) {
    const vertical = flow === 'tb';
    const refit = useContext(RefitContext);
    return (
      <div className={`deck-node${data.heavy ? ' is-heavy' : ''}${data.dashed ? ' is-dashed' : ''}`}>
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
        {data.title ? (
          <div className="node-title">
            {hasMathLine(data.title) ? (
              <NodeEquation code={data.title} onTypeset={refit} />
            ) : (
              data.title
            )}
          </div>
        ) : null}
        {(data.lines || []).map((line, i) => (
          <div className="node-line" key={i}>
            {hasMathLine(line) ? <NodeEquation code={line} onTypeset={refit} /> : line}
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

function FlowCanvas({
  flow,
  nodes,
  edges,
  title,
  active,
  extraNodeTypes,
  extraEdgeTypes,
  className,
  fitViewPadding,
}) {
  const nodeType = useMemo(() => buildNodeType(flow), [flow]);
  const nodeTypes = useMemo(
    () => ({ deck: nodeType, ...(extraNodeTypes || {}) }),
    [nodeType, extraNodeTypes],
  );
  const edgeTypes = useMemo(
    // Registrar 'default' explícitamente: al pasar edgeTypes propios,
    // ReactFlow v12 desactiva los tipos builtin y la malla de neuronas
    // (bezier por defecto) dejaría de renderizarse.
    () => ({ default: BezierEdge, deck: DeckEdge, ...(extraEdgeTypes || {}) }),
    [extraEdgeTypes],
  );
  const { fitView } = useReactFlow();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      fitView({ padding: fitViewPadding, duration: 240 });
    });
    // Consolidación (r5): el fitView inicial puede ejecutarse con medidas
    // previas a fuentes/MathJax y dejar el viewport descentrado o con zoom
    // por debajo del óptimo. Estos refits tardíos (sin duración) re-encajan
    // con los bounds ya asentados: centrado y zoom máximos del layout final.
    const refitNow = () => fitView({ padding: fitViewPadding, duration: 0 });
    // Serie de refits: el typeset de MathJax + la re-medida de ReactFlow
    // (ResizeObserver) puede ocurrir DESPUÉS de un refit puntual y dejar el
    // viewport pegado arriba con zoom bajo. Una serie cubre cualquier orden;
    // fitView(duration 0) es idempotente cuando ya no hay cambios.
    const late = [600, 1400, 2200, 3000, 3800, 4600].map((ms) => setTimeout(refitNow, ms));
    const fonts = document.fonts?.ready?.then(refitNow) || null;
    return () => {
      cancelAnimationFrame(id);
      late.forEach(clearTimeout);
      if (fonts && typeof fonts.catch === 'function') fonts.catch(() => {});
    };
  }, [active, fitView, fitViewPadding]);

  // Refit (R15/D5): los callbacks onTypeset llegan agregados en un solo
  // fitView por frame, con el padding propio del flujo. Sin debounce, cada
  // línea de ecuación dispararía su propio fitView y la malla vibraría.
  // El frame pendente vive en un ref (patrón compilable); rAF siempre
  // existe donde corre React Flow (deck client-only, sin SSR).
  const refitFrame = useRef(null);
  const refit = useMemo(
    () => () => {
      if (refitFrame.current !== null) return;
      refitFrame.current = requestAnimationFrame(() => {
        refitFrame.current = null;
        fitView({ padding: fitViewPadding, duration: 0 });
      });
    },
    [fitView, fitViewPadding],
  );

  return (
    <RefitContext.Provider value={refit}>
      <div className="rf-frame">
        {title ? <div className="rf-title">{title}</div> : null}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          className={className}
          fitView
          fitViewOptions={{ padding: fitViewPadding }}
          minZoom={0.35}
          maxZoom={1.9}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
        >
          <Background color="#8394a3" gap={22} size={1.4} />
          <Controls position="bottom-right" showInteractive={false} />
        </ReactFlow>
      </div>
    </RefitContext.Provider>
  );
}

export { LABEL_STYLE, LABEL_BG };
