import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';

// Diagrama 1 — Las cuatro puertas por las que entra la física (§3, Mermaid).
const nodes = [
  {
    id: 'fis',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: 'Conocimiento físico',
      lines: ['EDO/EDP · leyes · restricciones de forma'],
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
    },
    position: { x: 660, y: 150 },
  },
];

const edges = [
  { id: 'fis-p1', source: 'fis', target: 'p1', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2.2 } },
  { id: 'fis-p2', source: 'fis', target: 'p2', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2.2 } },
  { id: 'fis-p3', source: 'fis', target: 'p3', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2.2 } },
  { id: 'fis-p4', source: 'fis', target: 'p4', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2.2 } },
  { id: 'p1-ml', source: 'p1', target: 'ml', type: 'smoothstep', style: { stroke: '#2E86AB', strokeWidth: 2.2 } },
  { id: 'p2-ml', source: 'p2', target: 'ml', type: 'smoothstep', style: { stroke: '#7D3C98', strokeWidth: 2.2 } },
  { id: 'p3-ml', source: 'p3', target: 'ml', type: 'smoothstep', style: { stroke: '#16A085', strokeWidth: 2.2 } },
  { id: 'p4-ml', source: 'p4', target: 'ml', type: 'smoothstep', style: { stroke: '#E67E22', strokeWidth: 2.2 } },
];

export default function PuertasFisicaFlow({ active, title }) {
  return <DeckFlowPanel flow="lr" nodes={nodes} edges={edges} title={title} active={active} />;
}
