import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';

// Diagrama 2 — Familias PIML para series de tiempo F1–F6 (§4, Mermaid).
const nodes = [
  {
    id: 'ts',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: 'Serie de tiempo y(t)',
      lines: ['observar un sistema dinámico'],
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

const edges = [
  { id: 'ts-f1', source: 'ts', target: 'f1', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'ts-f2', source: 'ts', target: 'f2', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'ts-f3', source: 'ts', target: 'f3', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'ts-f4', source: 'ts', target: 'f4', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'ts-f5', source: 'ts', target: 'f5', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'ts-f6', source: 'ts', target: 'f6', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
];

export default function FamiliasPimlFlow({ active, title }) {
  return <DeckFlowPanel flow="tb" nodes={nodes} edges={edges} title={title} active={active} />;
}
