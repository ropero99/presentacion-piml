import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';

// Diagrama 6 — Árbol de opciones de problema, sin decisión (§7, Mermaid).
const nodes = [
  {
    id: 'q',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: '¿A qué problema apuntar?',
      lines: ['OPCIONES ABIERTAS — sin voto todavía'],
    },
    position: { x: 380, y: 0 },
  },
  {
    id: 'a',
    type: 'deck',
    data: {
      color: '#5B8DBE',
      title: 'A · Escasez de datos',
      lines: ['edificio/campus real', 'Loffa 2025 · Misyris 2020', 'límite: argumento clásico'],
    },
    position: { x: 0, y: 180 },
  },
  {
    id: 'b',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: 'B · Interpretabilidad',
      lines: ['rama física/espectral explícita', 'sin precedentes en demanda', 'con armónicos etiquetados'],
    },
    position: { x: 260, y: 180 },
  },
  {
    id: 'c',
    type: 'deck',
    data: {
      color: '#E67E22',
      title: 'C · Cuantificación de incertidumbre',
      lines: ['solo B-PINN (caro)', 'conformal: barato y riguroso', 'relevancia: despacho / DR'],
    },
    position: { x: 520, y: 180 },
  },
  {
    id: 'd',
    type: 'deck',
    data: {
      color: '#C0392B',
      title: 'D · Robustez / extrapolación',
      lines: ['eventos extremos y OOD', 'abierta por ERCOT 2026', 'protocolos no estandarizados'],
    },
    position: { x: 780, y: 180 },
  },
  {
    id: 'nota',
    type: 'deck',
    data: {
      color: '#F0F4F8',
      title: 'Nota',
      lines: ['no excluyentes — las combinaciones', 'se refuerzan. La decisión formal', 'es posterior a este documento.'],
    },
    position: { x: 370, y: 420 },
  },
];

const DASH = { stroke: '#8394a3', strokeWidth: 1.4, strokeDasharray: '5 4' };

const edges = [
  { id: 'q-a', source: 'q', target: 'a', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'q-b', source: 'q', target: 'b', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'q-c', source: 'q', target: 'c', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'q-d', source: 'q', target: 'd', type: 'smoothstep', style: { stroke: '#5B8DBE', strokeWidth: 2 } },
  { id: 'a-nota', source: 'a', target: 'nota', type: 'smoothstep', style: DASH },
  { id: 'b-nota', source: 'b', target: 'nota', type: 'smoothstep', style: DASH },
  { id: 'c-nota', source: 'c', target: 'nota', type: 'smoothstep', style: DASH },
  { id: 'd-nota', source: 'd', target: 'nota', type: 'smoothstep', style: DASH },
];

export default function OpcionesFlow({ active, title }) {
  return <DeckFlowPanel flow="tb" nodes={nodes} edges={edges} title={title} active={active} />;
}
