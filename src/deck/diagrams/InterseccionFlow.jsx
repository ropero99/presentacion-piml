import React from 'react';
import DeckFlowPanel, { LABEL_STYLE, LABEL_BG } from './DeckFlowPanel.jsx';

// Diagrama 4 — La intersección TS+física en sistemas energéticos (§5b, Mermaid).
const nodes = [
  {
    id: 'a',
    type: 'deck',
    data: {
      color: '#2E86AB',
      title: 'A · Dinámica de potencia',
      lines: ['ecuación swing, DAE', 'puertas ①/③ — Misyris 2020, DAE-PINN'],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'b',
    type: 'deck',
    data: {
      color: '#2E86AB',
      title: 'B · Estado y flujo de red',
      lines: ['PINN-GNN, inductive biases', 'puertas ②/③ — redes no vistas'],
    },
    position: { x: 340, y: 0 },
  },
  {
    id: 'c',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: 'C · Forecasting de demanda/carga',
      lines: ['física como restricción de FORMA', 'puerta ① soft — ERCOT 2026 · chillers OOD'],
    },
    position: { x: 0, y: 190 },
  },
  {
    id: 'd',
    type: 'deck',
    data: {
      color: '#16A085',
      title: 'D · Edificios / HVAC',
      lines: ['física de SUSTANCIA (ODE térmica, RC)', 'pero: horizontes cortos · sin UQ'],
    },
    position: { x: 340, y: 190 },
  },
  {
    id: 'e',
    type: 'deck',
    data: {
      color: '#7D3C98',
      title: 'E · Renovables / EV',
      lines: ['rama física + rama residual', 'PhysEmbedFormer 2026'],
    },
    position: { x: 680, y: 190 },
  },
  {
    id: 'vac',
    type: 'deck',
    heavy: true,
    data: {
      color: '#C0392B',
      title: '▲ CUADRANTE VACÍO',
      lines: ['dinámica de edificio + multi-horizonte', '+ rigor + UQ conformal'],
    },
    position: { x: 160, y: 400 },
  },
];

const edges = [
  { id: 'c-vac', source: 'c', target: 'vac', type: 'smoothstep', style: { stroke: '#C0392B', strokeWidth: 2.4 } },
  { id: 'd-vac', source: 'd', target: 'vac', type: 'smoothstep', style: { stroke: '#C0392B', strokeWidth: 2.4 } },
];

export default function InterseccionFlow({ active, title }) {
  return <DeckFlowPanel flow="tb" nodes={nodes} edges={edges} title={title} active={active} />;
}

export { LABEL_STYLE, LABEL_BG };
