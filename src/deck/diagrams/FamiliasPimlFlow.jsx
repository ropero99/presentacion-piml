import React from 'react';
import DeckFlowPanel, { makeEdge } from './DeckFlowPanel.jsx';

// Diagrama 2 — Familias PIML para series de tiempo F1–F6 (§4, Mermaid).
const TS_SOURCES = [8, 22, 36, 62, 76, 90]; // 6 salidas repartidas en el canto inferior

const nodes = [
  {
    id: 'ts',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: 'Serie de tiempo y(t)',
      lines: ['observar un sistema dinámico'],
      sourceHandles: TS_SOURCES.map((yPct, j) => ({ id: `s${j}`, yPct })),
    },
    position: { x: 420, y: 0 },
  },
  {
    id: 'f1',
    type: 'deck',
    data: {
      color: '#2E86AB',
      title: 'F1 · PINN sobre EDO/EDP',
      lines: ['loss = residuo de la ecuación', 'en puntos de colocación'],
    },
    position: { x: 0, y: 170 },
  },
  {
    id: 'f2',
    type: 'deck',
    data: {
      color: '#16A085',
      title: 'F2 · Physics-guided RNN (PGML)',
      lines: ['recurrencia + loss física', 'nicho: lagos, hidrología'],
    },
    position: { x: 300, y: 170 },
  },
  {
    id: 'f3',
    type: 'deck',
    data: {
      color: '#5B8DBE',
      title: 'F3 · Neural ODE / SDE',
      lines: ['Hamiltonian / Lagrangian NN', 'dinámica continua estructurada'],
    },
    position: { x: 600, y: 170 },
  },
  {
    id: 'f4',
    type: 'deck',
    data: {
      color: '#5B8DBE',
      title: 'F4 · Física en el espacio latente',
      lines: ['encoder + física + decoder', 'PhyDNet (CVPR 2020)'],
    },
    position: { x: 0, y: 340 },
  },
  {
    id: 'f5',
    type: 'deck',
    data: {
      color: '#16A085',
      title: 'F5 · Forecasting restringido',
      lines: ['kernel/GPR con forma', 'bounds · rampas · parabolicidad'],
    },
    position: { x: 300, y: 340 },
  },
  {
    id: 'f6',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: 'F6 · TS extremo-a-extremo',
      lines: ['prior físico embebido, sin EDP', 'PINT (2025) — emergente'],
    },
    position: { x: 600, y: 340 },
  },
];

// Color = color del nodo origen (ts); offsets 0/12/24 separan las rutas
// paralelas hacia cada familia (de izquierda a derecha, por columna).
const edges = [
  makeEdge('ts', 'f1', { color: '#1E3A5F', sourceHandle: 's0', offset: 0 }),
  makeEdge('ts', 'f2', { color: '#1E3A5F', sourceHandle: 's1', offset: 12 }),
  makeEdge('ts', 'f3', { color: '#1E3A5F', sourceHandle: 's2', offset: 24 }),
  makeEdge('ts', 'f4', { color: '#1E3A5F', sourceHandle: 's3', offset: 0 }),
  makeEdge('ts', 'f5', { color: '#1E3A5F', sourceHandle: 's4', offset: 12 }),
  makeEdge('ts', 'f6', { color: '#1E3A5F', sourceHandle: 's5', offset: 24 }),
];

export default function FamiliasPimlFlow({ active, title }) {
  return <DeckFlowPanel flow="tb" nodes={nodes} edges={edges} title={title} active={active} />;
}
