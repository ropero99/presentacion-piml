import React from 'react';
import DeckFlowPanel, { LABEL_STYLE, LABEL_BG } from './DeckFlowPanel.jsx';

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

const nodes = [
  ...doors.map((d, i) => ({
    id: d.id,
    type: 'deck',
    data: { color: d.color, title: d.title, lines: d.lines },
    position: { x: 0, y: i * 115 },
  })),
  ...problems.map((p, i) => ({
    id: p.id,
    type: 'deck',
    data: { color: '#F0F4F8', title: p.title, lines: p.lines },
    position: { x: 560, y: i * 115 },
  })),
];

const edges = [
  { id: 'p1-esc', source: 'p1', target: 'esc', label: '★★★' },
  { id: 'p1-int', source: 'p1', target: 'int', label: '★★' },
  { id: 'p1-tra', source: 'p1', target: 'tra', label: '★★' },
  { id: 'p1-pla', source: 'p1', target: 'pla', label: '★★' },
  { id: 'p2-int', source: 'p2', target: 'int', label: '★★★' },
  { id: 'p2-tra', source: 'p2', target: 'tra', label: '★★★' },
  { id: 'p2-pla', source: 'p2', target: 'pla', label: '★★★' },
  { id: 'p3-tra', source: 'p3', target: 'tra', label: '★★★' },
  { id: 'p3-pla', source: 'p3', target: 'pla', label: '★★' },
  { id: 'p4-esc', source: 'p4', target: 'esc', label: '★★★' },
  { id: 'p4-int', source: 'p4', target: 'int', label: '★★' },
  { id: 'p4-tra', source: 'p4', target: 'tra', label: '★★' },
].map((e) => ({
  ...e,
  type: 'smoothstep',
  labelStyle: LABEL_STYLE,
  labelBgStyle: LABEL_BG,
  style: { stroke: '#5B8DBE', strokeWidth: 1.6 },
}));

export default function ProblemasFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}

export { LABEL_STYLE, LABEL_BG };
