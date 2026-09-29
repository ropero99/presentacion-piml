import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { buildMrDiagram } from './mrPipeline.js';
import { NeuronNode, LabelNode, StructureNode, LossLineNode } from './mrNodeTypes.jsx';

/**
 * Puerta ① — Función de pérdida (forma débil, PINN). Pipeline MR compartido
 * con la física entrando en la autodiff: el residuo r_θ alimenta la pérdida.
 */
const { nodes, edges } = buildMrDiagram({ entry: 'ad' });

export default function MRPuerta1Flow({ active, title }) {
  return <DeckFlowPanel
      flow="lr"
      nodes={nodes}
      edges={edges}
      title={title}
      active={active}
      className="flow-mr1"
      fitViewPadding={0.02}
      extraNodeTypes={{ neuron: NeuronNode, label: LabelNode, structure: StructureNode, lossline: LossLineNode }}
    />;
}
