import React from 'react';
import DeckFlowPanel, { LABEL_STYLE, LABEL_BG, makeEdge } from './DeckFlowPanel.jsx';

// Diagrama 5 — Enfoques ①–④ → problemas resueltos (§6, Mermaid + tabla ASCII).
const doors = [
  { id: 'p1', color: '#2E86AB', title: '① Loss física', lines: ['PINN soft'] },
  { id: 'p2', color: '#7D3C98', title: '② Arquitectura física (hard)', lines: [] },
  { id: 'p3', color: '#16A085', title: '③ Datos guiados por física', lines: [] },
  { id: 'p4', color: '#E67E22', title: '④ Híbrido físico + residual', lines: [] },
];

const problems = [
  { id: 'esc', title: 'Escasez de datos', lines: ['evidencia: Loffa 2025 · Misyris 2020'] },
  { id: 'int', title: 'Interpretabilidad', lines: ['evidencia: PhysEmbedFormer · PISR'] },
  { id: 'tra', title: 'Transferencia / OOD', lines: ['evidencia: arXiv:2509.25158 · PhI-GPR'] },
  { id: 'pla', title: 'Plausibilidad física / extrapolación', lines: ['evidencia: Tang 2026 · PhyDNet'] },
];

// Un anclaje de salida por arista de cada puerta, repartido en el canto
// derecho (nodo ~90px: 15% ≈ 13px, 85% ≈ 76px, siempre dentro del nodo).
const doorSources = {
  p1: [15, 38, 62, 85],
  p2: [25, 50, 75],
  p3: [35, 65],
  p4: [25, 50, 75],
};

// Un anclaje de llegada por arista entrante, ordenado por la posición
// vertical de la puerta que lo origina (mapeo monótono → sin cruces).
const problemTargets = {
  esc: [35, 65],
  int: [25, 50, 75],
  tra: [15, 38, 62, 85],
  pla: [25, 50, 75],
};

const nodes = [
  ...doors.map((d, i) => ({
    id: d.id,
    type: 'deck',
    data: {
      color: d.color,
      title: d.title,
      lines: d.lines,
      sourceHandles: doorSources[d.id].map((yPct, j) => ({ id: `s${j}`, yPct })),
    },
    position: { x: 0, y: i * 115 },
  })),
  ...problems.map((p, i) => ({
    id: p.id,
    type: 'deck',
    data: {
      color: '#F0F4F8',
      title: p.title,
      lines: p.lines,
      targetHandles: problemTargets[p.id].map((yPct, j) => ({ id: `t${j}`, yPct })),
    },
    position: { x: 560, y: i * 115 },
  })),
];

const doorColor = Object.fromEntries(doors.map((d) => [d.id, d.color]));

// [id, puerta, problema, anclaje salida, anclaje llegada, fuerza] —
// emparejado por cercanía vertical para minimizar cruces.
const EDGE_TABLE = [
  ['p1-esc', 'p1', 'esc', 0, 0, '★★★'],
  ['p1-int', 'p1', 'int', 1, 0, '★★'],
  ['p1-tra', 'p1', 'tra', 2, 0, '★★'],
  ['p1-pla', 'p1', 'pla', 3, 0, '★★'],
  ['p2-int', 'p2', 'int', 0, 1, '★★★'],
  ['p2-tra', 'p2', 'tra', 1, 1, '★★★'],
  ['p2-pla', 'p2', 'pla', 2, 2, '★★★'],
  ['p3-tra', 'p3', 'tra', 0, 2, '★★★'],
  ['p3-pla', 'p3', 'pla', 1, 2, '★★'],
  ['p4-esc', 'p4', 'esc', 0, 1, '★★★'],
  ['p4-int', 'p4', 'int', 1, 2, '★★'],
  ['p4-tra', 'p4', 'tra', 2, 3, '★★'],
];

const edges = EDGE_TABLE.map(([id, src, tgt, sIdx, tIdx, label], i) =>
  makeEdge(src, tgt, {
    id,
    color: doorColor[src],
    sourceHandle: `s${sIdx}`,
    targetHandle: `t${tIdx}`,
    label,
    labelStyle: LABEL_STYLE,
    labelBgStyle: LABEL_BG,
    offset: (i % 3) * 12,
    opacity: label === '★★' ? 0.85 : 1,
  })
);

export default function ProblemasFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}

export { LABEL_STYLE, LABEL_BG };
