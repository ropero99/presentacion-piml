import React from 'react';
import DeckFlowPanel, { makeEdge } from './DeckFlowPanel.jsx';

// Diagrama 1 — Las cuatro puertas por las que entra la física (§3, Mermaid).
const FIS_SOURCES = [15, 38, 62, 85]; // 4 salidas repartidas en el canto derecho
const ML_TARGETS = [15, 38, 62, 85]; // 4 llegadas repartidas en el canto izquierdo

const nodes = [
  {
    id: 'fis',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: 'Conocimiento físico',
      lines: ['EDO/EDP · leyes · restricciones de forma'],
      sourceHandles: FIS_SOURCES.map((yPct, j) => ({ id: `s${j}`, yPct })),
    },
    position: { x: 0, y: 140 },
  },
  {
    id: 'p1',
    type: 'deck',
    data: {
      color: '#2E86AB',
      title: '① Función de pérdida (débil)',
      lines: ['L = L_MSE + λ_phys·L_physics', 'se penaliza, no se garantiza'],
    },
    position: { x: 320, y: 0 },
  },
  {
    id: 'p2',
    type: 'deck',
    data: {
      color: '#7D3C98',
      title: '② Arquitectura (fuerte)',
      lines: ['invariancias · monotonías', 'se cumple SIEMPRE'],
    },
    position: { x: 320, y: 110 },
  },
  {
    id: 'p3',
    type: 'deck',
    data: {
      color: '#16A085',
      title: '③ Datos / features',
      lines: ['features de leyes físicas', 'multi-fidelity · bottleneck'],
    },
    position: { x: 320, y: 220 },
  },
  {
    id: 'p4',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: '④ Híbrido',
      lines: ['f_fisica(x) + g_θ(x)', 'residual learning'],
    },
    position: { x: 320, y: 330 },
  },
  {
    id: 'ml',
    type: 'deck',
    data: {
      color: '#34495E',
      title: 'Modelo ML/DL',
      lines: ['ŷ = f_θ(x)'],
      targetHandles: ML_TARGETS.map((yPct, j) => ({ id: `t${j}`, yPct })),
    },
    position: { x: 660, y: 150 },
  },
];

// Color = color del nodo origen; offsets 0/12/24 separan las rutas paralelas.
const edges = [
  makeEdge('fis', 'p1', { color: '#1E3A5F', sourceHandle: 's0', offset: 0 }),
  makeEdge('fis', 'p2', { color: '#1E3A5F', sourceHandle: 's1', offset: 12 }),
  makeEdge('fis', 'p3', { color: '#1E3A5F', sourceHandle: 's2', offset: 24 }),
  makeEdge('fis', 'p4', { color: '#1E3A5F', sourceHandle: 's3', offset: 12 }),
  makeEdge('p1', 'ml', { color: '#2E86AB', targetHandle: 't0', offset: 0 }),
  makeEdge('p2', 'ml', { color: '#7D3C98', targetHandle: 't1', offset: 12 }),
  makeEdge('p3', 'ml', { color: '#16A085', targetHandle: 't2', offset: 24 }),
  makeEdge('p4', 'ml', { color: '#E67E22', targetHandle: 't3', offset: 12 }),
];

export default function PuertasFisicaFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}
