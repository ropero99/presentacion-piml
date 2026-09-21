import React from 'react';
import DeckFlowPanel, { makeEdge } from './DeckFlowPanel.jsx';

// Diagrama 6 — Árbol de opciones de problema, sin decisión (§7, Mermaid).
const Q_SOURCES = [15, 38, 62, 85]; // 4 salidas repartidas en el canto inferior
const NOTA_TARGETS = [15, 38, 62, 85]; // 4 llegadas repartidas en el canto superior

const nodes = [
  {
    id: 'q',
    type: 'deck',
    data: {
      color: '#1E3A5F',
      title: '¿A qué problema apuntar?',
      lines: ['OPCIONES ABIERTAS — sin voto todavía'],
      sourceHandles: Q_SOURCES.map((yPct, j) => ({ id: `s${j}`, yPct })),
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
      targetHandles: NOTA_TARGETS.map((yPct, j) => ({ id: `t${j}`, yPct })),
    },
    position: { x: 370, y: 420 },
  },
];

// Color = color del nodo origen; offsets 0/12/24 separan las rutas paralelas.
// Las flechas punteadas hacia la Nota heredan el color del origen (antes gris).
const edges = [
  makeEdge('q', 'a', { id: 'q-a', color: '#1E3A5F', sourceHandle: 's0', offset: 0 }),
  makeEdge('q', 'b', { id: 'q-b', color: '#1E3A5F', sourceHandle: 's1', offset: 12 }),
  makeEdge('q', 'c', { id: 'q-c', color: '#1E3A5F', sourceHandle: 's2', offset: 24 }),
  makeEdge('q', 'd', { id: 'q-d', color: '#1E3A5F', sourceHandle: 's3', offset: 12 }),
  makeEdge('a', 'nota', { id: 'a-nota', color: '#5B8DBE', targetHandle: 't0', offset: 0, dashed: true, strokeWidth: 1.4 }),
  makeEdge('b', 'nota', { id: 'b-nota', color: '#E67E22', targetHandle: 't1', offset: 12, dashed: true, strokeWidth: 1.4 }),
  makeEdge('c', 'nota', { id: 'c-nota', color: '#E67E22', targetHandle: 't2', offset: 24, dashed: true, strokeWidth: 1.4 }),
  makeEdge('d', 'nota', { id: 'd-nota', color: '#C0392B', targetHandle: 't3', offset: 0, dashed: true, strokeWidth: 1.4 }),
];

export default function OpcionesFlow({ active, title }) {
  return <DeckFlowPanel flow="tb" nodes={nodes} edges={edges} title={title} active={active} />;
}
