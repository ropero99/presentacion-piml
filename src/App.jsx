import React from 'react';
import MathProvider from './deck/MathProvider.jsx';
import DeckShell from './deck/DeckShell.jsx';

export default function App() {
  return (
    <MathProvider>
      <DeckShell />
    </MathProvider>
  );
}
