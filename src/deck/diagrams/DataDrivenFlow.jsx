import React from 'react';
import DeckFlowPanel, { LABEL_STYLE, LABEL_BG } from './DeckFlowPanel.jsx';

// Diagrama 3 — Familias data-driven E1–E8 (§5a, Mermaid).
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
    },
    position: { x: 280, y: 280 },
  },
];

const DASH = { stroke: '#E67E22', strokeWidth: 1.8, strokeDasharray: '6 5' };
const EDGE_LABEL = { fontSize: 9, fontWeight: 600, fill: '#A64F08' };

const edges = [
  { id: 'e8-e3', source: 'e8', target: 'e3', type: 'smoothstep', label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG, style: DASH },
  { id: 'e8-e4', source: 'e8', target: 'e4', type: 'smoothstep', label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG, style: DASH },
  { id: 'e8-e5', source: 'e8', target: 'e5', type: 'smoothstep', label: 'combina', labelStyle: EDGE_LABEL, labelBgStyle: LABEL_BG, style: DASH },
];

export default function DataDrivenFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}

export { LABEL_STYLE, LABEL_BG };
