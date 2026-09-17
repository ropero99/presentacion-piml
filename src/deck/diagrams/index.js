import React from 'react';
import PuertasFisicaFlow from './PuertasFisicaFlow.jsx';
import FamiliasPimlFlow from './FamiliasPimlFlow.jsx';
import DataDrivenFlow from './DataDrivenFlow.jsx';
import InterseccionFlow from './InterseccionFlow.jsx';
import ProblemasFlow from './ProblemasFlow.jsx';
import OpcionesFlow from './OpcionesFlow.jsx';

// id de diagrama (deckContent) -> componente ReactFlow del deck.
export const DIAGRAM_COMPONENTS = {
  d1: PuertasFisicaFlow,
  d2: FamiliasPimlFlow,
  d3: DataDrivenFlow,
  d4: InterseccionFlow,
  d5: ProblemasFlow,
  d6: OpcionesFlow,
};
