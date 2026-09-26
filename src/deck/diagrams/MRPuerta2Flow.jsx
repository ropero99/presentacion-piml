import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { buildMrDiagram } from './mrPipeline.js';
import { NeuronNode, LabelNode, StructureNode, LossLineNode } from './mrNodeTypes.jsx';

/**
 * Puerta ② — Arquitectura (forma fuerte, Hamiltonian NN). Pipeline MR
 * compartido con la física viviendo dentro de la estructura de f_θ.
 */
const { nodes, edges } = buildMrDiagram({ entry: 'modelo' });

export default function MRPuerta2Flow({ active, title }) {
  return <DeckFlowPanel
      flow="lr"
      nodes={nodes}
      edges={edges}
      title={title}
      active={active}
      extraNodeTypes={{ neuron: NeuronNode, label: LabelNode, structure: StructureNode, lossline: LossLineNode }}
    />;
}
