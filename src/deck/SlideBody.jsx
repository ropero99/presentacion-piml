import React from 'react';
import { MathJax } from 'better-react-mathjax';
import RichText from './RichText.jsx';
import EquationBox from './EquationBox.jsx';
import { DIAGRAM_COMPONENTS } from './diagrams/index.js';

function pad(value) {
  return String(value).padStart(2, '0');
}

/**
 * Cuerpo de un slide según su kind: cover (portada/cierre), split
 * (contenido + figura de diagrama) o wide (columna única: bullets/tabla/
 * pila de ecuaciones).
 */
export default function SlideBody({ slide, index, total, phaseClass }) {
  const cls = ['slide'];

  if (slide.kind === 'cover') {
    cls.push('is-cover');
  } else if (slide.kind === 'wide') {
    cls.push('is-wide');
  }
  if (phaseClass) cls.push(...phaseClass);

  if (slide.kind === 'cover') {
    return (
      <article
        className={cls.join(' ')}
        data-index={index}
        data-module={slide.module}
        data-tone={slide.tone}
      >
        <div className="cover-content">
          <p className="cover-kicker slide-kicker">{slide.kicker}</p>
          <h1 className="cover-project">{slide.title}</h1>
          {slide.subtitle ? <p className="cover-subtitle">{slide.subtitle}</p> : null}
          <div className="cover-logos">
            <img
              src={`${import.meta.env.BASE_URL}escudo_unal.png`}
              alt="Universidad Nacional de Colombia"
              className="cover-logo-unal"
            />
            <img
              src={`${import.meta.env.BASE_URL}logo_labIA.png`}
              alt="Laboratorio de Inteligencia Artificial UNAL"
              className="cover-logo-labia"
            />
          </div>
          <p className="cover-meta">
            {(slide.metaLines || []).map((line, i) => (
              <span key={i} className={i === 0 ? 'cover-author' : undefined}>
                {line}
              </span>
            ))}
            <span className="cover-year">{slide.year}</span>
          </p>
        </div>
      </article>
    );
  }

  const hasFigure = slide.kind === 'split' && slide.diagram && DIAGRAM_COMPONENTS[slide.diagram];
  const Diagram = hasFigure ? DIAGRAM_COMPONENTS[slide.diagram] : null;

  return (
    <article
      className={cls.join(' ')}
      data-index={index}
      data-module={slide.module}
      data-tone={slide.tone}
      aria-label={`${pad(index + 1)} de ${pad(total)}`}
    >
      <div className="slide-content">
        <MathJax>
          <p className="slide-kicker">{slide.kicker}</p>
          <h2>{slide.title}</h2>

          {slide.table ? (
            <table className="reading-table">
              <tbody>
                {slide.table.map((row, r) =>
                  r === 0 ? (
                    <tr key="head">
                      {row.map((cell, i) => (
                        <th key={i}>
                          <RichText text={cell} />
                        </th>
                      ))}
                    </tr>
                  ) : (
                    <tr key={row[0]}>
                      {row.map((cell, c) => (
                        <td key={c}>
                          {c === 0 ? <strong>{cell}</strong> : <RichText text={cell} />}
                        </td>
                      ))}
                    </tr>
                  ),
                )}
            </tbody>
            </table>
          ) : null}

          {slide.bullets ? (
            <ul className="slide-list">
              {slide.bullets.map((b, i) => (
                <li key={i}>
                  <RichText text={b} />
                </li>
              ))}
            </ul>
          ) : null}

          {slide.equations ? (
            <div className="math-stack">
              {slide.equations.map((eq, i) => (
                <EquationBox key={i} heading={eq.heading} tex={eq.tex} conn={eq.conn} />
              ))}
            </div>
          ) : null}

          {slide.notes ? (
            <p className="slide-notes">
              <RichText text={slide.notes} />
            </p>
          ) : null}

          {slide.refs ? (
            <ul className="slide-references">
              {slide.refs.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          ) : null}
        </MathJax>
      </div>

      {hasFigure ? (
        <figure className="slide-figure">
          <div className="rf-host">
            <Diagram active title={slide.diagramTitle} legend={slide.legend} />
          </div>
          <figcaption className="figure-legend">
            {(slide.legend || []).map((chip, i) => (
              <span className="legend-chip" key={i}>
                <span className="legend-dot" style={{ background: chip.color }} />
                {chip.label}
              </span>
            ))}
          </figcaption>
        </figure>
      ) : null}
    </article>
  );
}
