import React from 'react';
import DeckFlowPanel, { LABEL_STYLE, LABEL_BG, makeEdge } from './DeckFlowPanel.jsx';

// Diagrama 3 — Familias data-driven E1–E8 (§5a, Mermaid).
const E8_SOURCES = [25, 50, 75]; // 3 salidas repartidas en el canto derecho

const nodes = [
  {
    id: 'e1',
    type: 'deck',
    data: { color: '#95A5A6', title: 'E1 · Estadísticos', lines: ['ARIMA / SARIMA / ETS'] },
    position: { x: 0, y: 0 },
  },
  {
    id: 'e2',
    type: 'deck',
    data: { color: '#95A5A6', title: 'E2 · ML clásico', lines: ['SVR · RF · XGBoost · ANFIS'] },
    position: { x: 0, y: 120 },
  },
  {
    id: 'e3',
    type: 'deck',
    data: { color: '#2E86AB', title: 'E3 · Recurrentes', lines: ['LSTM · GRU · BiLSTM+att'] },
    position: { x: 340, y: 0 },
  },
  {
    id: 'e4',
    type: 'deck',
    data: { color: '#2E86AB', title: 'E4 · Convolucionales', lines: ['CNN · TCN · CNN-LSTM'] },
    position: { x: 330, y: 120 },
  },
  {
    id: 'e5',
    type: 'deck',
    data: { color: '#7D3C98', title: 'E5 · Transformers', lines: ['TFT · PatchTST · iTransformer'] },
    position: { x: 660, y: 0 },
  },
  {
    id: 'e6',
    type: 'deck',
    data: { color: '#7D3C98', title: 'E6 · SSM / Mamba', lines: ['S-Mamba · Time-SSM'] },
    position: { x: 660, y: 120 },
  },
  {
    id: 'e7',
    type: 'deck',
    data: { color: '#7D3C98', title: 'E7 · Fundacionales', lines: ['Chronos · TimesFM · Moirai'] },
    position: { x: 660, y: 240 },
  },
  {
    id: 'e8',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: 'E8 · Descomposición + híbridos',
      lines: ['VMD/EMD/CEEMDAN + red profunda', 'combina E3–E5 · patrón dominante en carga'],
      sourceHandles: E8_SOURCES.map((yPct, j) => ({ id: `s${j}`, yPct })),
    },
    position: { x: 280, y: 280 },
  },
];

const EDGE_LABEL = { fontSize: 9, fontWeight: 600, fill: '#A64F08' };

// Color = color del nodo origen (e8); anclajes + offsets 0/12/24 separan
// las tres aristas "combina" que antes salían del mismo píxel.
const edges = [
  makeEdge('e8', 'e3', { id: 'e8-e3', color: '#E67E22', sourceHandle: 's0', offset: 0, dashed: true, strokeWidth: 1.8, label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG }),
  makeEdge('e8', 'e5', { id: 'e8-e5', color: '#E67E22', sourceHandle: 's1', offset: 12, dashed: true, strokeWidth: 1.8, label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG }),
  makeEdge('e8', 'e4', { id: 'e8-e4', color: '#E67E22', sourceHandle: 's2', offset: 24, dashed: true, strokeWidth: 1.8, label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG }),
];

export default function DataDrivenFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}

export { LABEL_STYLE, LABEL_BG };
