import React, { useEffect, useMemo, useRef } from 'react';
import { MODULES } from '../data/deckModules.js';

/**
 * Rail horizontal superior del deck (estilo IA-Agentes-Software):
 * módulos como píldoras con botón de título + pips por slide.
 */
export default function Rail({ slides, currentIndex, onJump }) {
  const groups = useMemo(() => {
    const byModule = new Map();
    slides.forEach((slide, idx) => {
      if (!byModule.has(slide.module)) byModule.set(slide.module, []);
      byModule.get(slide.module).push(idx);
    });
    return MODULES.map((mod) => ({
      ...mod,
      indices: byModule.get(mod.id) || [],
    })).filter((mod) => mod.indices.length > 0);
  }, [slides]);

  const activeModule = slides[currentIndex]?.module;
  const railRef = useRef(null);

  useEffect(() => {
    const active = railRef.current?.querySelector('.rail-module.is-active-module');
    if (active) {
      active.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
      });
    }
  }, [activeModule]);

  return (
    <nav className="rail" ref={railRef} aria-label="Módulos">
      {groups.map((mod) => (
        <div
          key={mod.id}
          className={`rail-module${activeModule === mod.id ? ' is-active-module' : ''}`}
          data-module={mod.id}
        >
          <button
            type="button"
            className="rail-title"
            data-first={mod.indices[0]}
            onClick={() => onJump(mod.indices[0])}
            aria-label={`Ir a ${mod.label}`}
          >
            {mod.label}
          </button>
          <div className="rail-dots" id={`dots-${mod.id}`}>
            {mod.indices.map((slideIdx) => (
              <button
                key={slideIdx}
                type="button"
                className={`rail-pip${slideIdx === currentIndex ? ' is-active' : ''}`}
                data-slide={slideIdx}
                onClick={() => onJump(slideIdx)}
                aria-label={`Slide ${slideIdx + 1} de ${mod.label}`}
                title={`Slide ${slideIdx + 1}`}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
