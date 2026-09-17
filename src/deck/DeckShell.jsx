import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SLIDES } from '../data/deckContent.js';
import { MODULES } from '../data/deckModules.js';
import Rail from './Rail.jsx';
import SlideBody from './SlideBody.jsx';

const STORAGE_KEY = 'deck-slide-piml';
const TRANSITION_MS = 440;

function pad(value) {
  return String(value).padStart(2, '0');
}

const toneByModule = new Map(MODULES.map((m) => [m.id, m.tone]));

function loadSavedIndex(total) {
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(saved) && saved >= 0 && saved < total) return saved;
  } catch {
    /* almacenamiento no disponible */
  }
  return 0;
}

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Shell del deck: exactamente un slide activo, transiciones direccionales de
 * 440 ms, navegación por teclado/botones/swipe, reanudación y tono por módulo.
 */
export default function DeckShell() {
  const total = SLIDES.length;
  const [current, setCurrent] = useState(() => loadSavedIndex(total));
  const [leaving, setLeaving] = useState(null); // índice del slide saliente
  const [direction, setDirection] = useState('next');
  const [animate, setAnimate] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
  const cleanupTimer = useRef(null);

  const render = useCallback(
    (index, options = {}) => {
      const next = Math.max(0, Math.min(index, total - 1));
      if (next === current) return;
      const { animate: withAnimation = true } = options;
      setDirection(next > current ? 'next' : 'prev');
      setLeaving(current);
      setCurrent(next);
      const shouldAnimate = Boolean(withAnimation) && !reduceMotion;
      setAnimate(shouldAnimate);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* almacenamiento no disponible */
      }
    },
    [current, reduceMotion, total],
  );

  // Limpieza de las clases transitorias (~440 ms), igual que el deck fuente.
  useEffect(() => {
    if (!animate) return undefined;
    cleanupTimer.current = window.setTimeout(() => {
      setAnimate(false);
      setLeaving(null);
      cleanupTimer.current = null;
    }, TRANSITION_MS);
    return () => {
      if (cleanupTimer.current) window.clearTimeout(cleanupTimer.current);
    };
  }, [animate]);

  // Navegación por teclado.
  useEffect(() => {
    const onKeyDown = (event) => {
      const opts = { animate: !event.repeat };
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        render(current + 1, opts);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        render(current - 1, opts);
      } else if (event.key === 'Home') {
        event.preventDefault();
        render(0, { animate: false });
      } else if (event.key === 'End') {
        event.preventDefault();
        render(total - 1, { animate: false });
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setFocusMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current, render, total]);

  // Swipe táctil horizontal (umbral 40 px), como el deck fuente.
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (event) => {
      startX = event.changedTouches[0].screenX;
    };
    const onTouchEnd = (event) => {
      const delta = event.changedTouches[0].screenX - startX;
      if (Math.abs(delta) < 40) return;
      if (delta < 0) render(current + 1);
      else render(current - 1);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [current, render]);

  // Modo enfoque: oculta rail y controles decorativos.
  useEffect(() => {
    document.body.classList.toggle('focus-mode', focusMode);
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode]);

  const tone = toneByModule.get(SLIDES[current].module) || 'blue';
  const deckClass = `deck-app tone-${tone}`;

  // Clases de fase por slide (solo los dos slides en transición se animan).
  const phaseByIndex = useMemo(() => {
    const map = new Map();
    if (animate && !reduceMotion) {
      map.set(current, ['is-active', 'is-entering', direction === 'next' ? 'from-next' : 'from-prev']);
      if (leaving !== null && leaving !== current) {
        map.set(leaving, ['is-leaving', direction === 'next' ? 'to-next' : 'to-prev']);
      }
    } else {
      map.set(current, ['is-active']);
    }
    return map;
  }, [animate, current, leaving, direction, reduceMotion]);

  const handleJump = useCallback(
    (index) => {
      render(index, { animate: true });
    },
    [render],
  );

  return (
    <div className={deckClass} data-tone={tone}>
      <div className="ambient" aria-hidden="true" />
      <Rail slides={SLIDES} currentIndex={current} onJump={handleJump} />
      <div className="stage-layout">
        <main className="viewport" id="viewport">
          {SLIDES.map((slide, index) => (
            <SlideBody
              key={slide.id}
              slide={slide}
              index={index}
              total={total}
              phaseClass={phaseByIndex.get(index) || []}
            />
          ))}
        </main>
      </div>
      <footer className="deck-controls">
        <p className="running-title">
          Revisión de modelos informados por física (PIML) para series de tiempo y sistemas
          energéticos — versión matemática. Universidad Nacional de Colombia.
        </p>
        <img
          className="controls-logo controls-logo-unal"
          src={`${import.meta.env.BASE_URL}escudo_unal.png`}
          alt="Universidad Nacional de Colombia"
        />
        <img
          className="controls-logo"
          src={`${import.meta.env.BASE_URL}logo_labIA.png`}
          alt="Laboratorio de Inteligencia Artificial UNAL"
        />
        <button
          type="button"
          className="ghost"
          aria-label="Slide anterior"
          title="Anterior"
          disabled={current === 0}
          onClick={() => render(current - 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 5 L8 12 L15 19" />
          </svg>
        </button>
        <span id="counter">
          {pad(current + 1)} / {pad(total)}
        </span>
        <button
          type="button"
          className="solid"
          aria-label="Slide siguiente"
          title="Siguiente"
          disabled={current === total - 1}
          onClick={() => render(current + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 5 L16 12 L9 19" />
          </svg>
        </button>
      </footer>
    </div>
  );
}
