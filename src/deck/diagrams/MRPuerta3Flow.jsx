import React from 'react';
import DeckFlowPanel from './DeckFlowPanel.jsx';
import { buildMrDiagram } from './mrPipeline.js';
import { NeuronNode, LabelNode, StructureNode, LossLineNode } from './mrNodeTypes.jsx';

/**
 * Puerta ③ — Física en los datos / features. Pipeline MR compartido con la
 * física entrando en los datos: features ψ_fis / simulador f_LF antes del modelo.
 */
const { nodes, edges } = buildMrDiagram({ entry: 'datos' });

export default function MRPuerta3Flow({ active, title }) {
  return <DeckFlowPanel
      flow="lr"
      nodes={nodes}
      edges={edges}
      title={title}
      active={active}
      className="flow-mr3"
      fitViewPadding={0.04}
      extraNodeTypes={{ neuron: NeuronNode, label: LabelNode, structure: StructureNode, lossline: LossLineNode }}
    />;
}
