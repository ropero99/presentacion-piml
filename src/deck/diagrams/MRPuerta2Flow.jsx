import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { buildHnnDiagram } from './mrPipeline.js';
import { NeuronNode, LabelNode, StructureNode, LossLineNode } from './mrNodeTypes.jsx';

/**
 * Puerta ② — Arquitectura (forma fuerte, Hamiltonian NN). Flujo completo de
 * 10 etapas sobre el MR conservativo (ronda 6), con rama de predicción.
 */
const { nodes, edges } = buildHnnDiagram();

export default function MRPuerta2Flow({ active, title }) {
  return <DeckFlowPanel
      flow="lr"
      nodes={nodes}
      edges={edges}
      title={title}
      active={active}
      className="flow-hnn"
      extraNodeTypes={{ neuron: NeuronNode, label: LabelNode, structure: StructureNode, lossline: LossLineNode }}
    />;
}
