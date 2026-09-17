import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
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
        <Handle type="target" position={vertical ? Position.Top : Position.Left} isConnectable={false} />
        {data.title ? <div className="node-title">{data.title}</div> : null}
        {(data.lines || []).map((line, i) => (
          <div className="node-line" key={i}>
            {line}
          </div>
        ))}
        <Handle type="source" position={vertical ? Position.Bottom : Position.Right} isConnectable={false} />
      </div>
    );
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
