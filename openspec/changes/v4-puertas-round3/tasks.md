# Tasks: v4-puertas-round3 — deck doors round-3 refinement

Slide copy: Spanish academic register; artifact prose English. In-place refinement, same PDF, NO push. d2..d6/lectura/cierre untouched.

## Review Workload Forecast

Recent estimate: ~250 changed lines (deckContent.js moderate; SlideBody.jsx ~30; deck.css ~40; DeckFlowPanel/mrPipeline untouched). 400-line budget risk Low → single slice.

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Work Units

| Unit | Goal | Test command | Rollback |
|---|---|---|---|
| 1 | Phase 1 text edits (1.1–1.5) | `npm run lint` | deckContent.js revert |
| 2 | Diagram slides + component/CSS (1.6, 2.1–2.2) | `npm run lint` + captures | remove inserts + revert component/CSS |

Runtime harness (build required first): `npm run build && node src/scripts/capture-slides.mjs`. If final diff > 400 lines: slice 1 = tasks 1.1–1.5; slice 2 = 1.6 + 2.1–2.2. Below 400 → single commit.

## Phase 1: Content edits — `src/data/deckContent.js`

- [x] 1.1 (AD-7, REF-1/R1) `notacion` → `.reading-table` slide.table 6×3 (Grupo|Símbolos|Uso); RichText cells, MathJax inline; 5 groups verbatim, exogenous covariates own row, local-symbol legend final row.
- [x] 1.2 (AD-4, REF-2/R2) `d1-figura`: remove door-4 bullet; add problem-general line (model + physical law → four entry channels); keep diagram/legend/refs.
- [x] 1.3 (AD-3, REF-3/R3) `d1-mr`: add damping-envelope meaning bullet (prose + inline math, no 4th eq); eq-boxes untouched.
- [x] 1.4 (AD-5, REF-5/R5) `d1-puerta2`: drop diagram keys; eq 1 = canonical state (verbatim from `d1-mr` eq 2), existing boxes → eq 2–4; derivation-strip chips under lema; HJ path/MR meaning as conn prose; ≤4 eqs.
- [x] 1.5 (AD-6, REF-2b/R2b) `d1-puerta4`: 2 bullets (why hybrids; when over pure PINN — Bacher & Madsen); 2nd eq-box only if literal from source doc, else prose.
- [ ] 1.6 (AD-1, REF-4/R4) Insert `d1-puerta{1,2,3}-diagram` after each door slide: kind:'diagram', module:'d1', diagram mr1/mr2/mr3, door-template kicker, legend copied, tone matched, title omitted; doors ①②③ drop diagram/diagramTitle/legend keys; `d1-puerta4` stays last of d1 (29 → 32 slides).

## Phase 2: Component + CSS — `src/deck/`

- [ ] 2.1 (AD-1, REF-4/R4) `src/deck/SlideBody.jsx`: `data-id={slide.id}` on all 3 branch returns; hasFigure includes 'diagram'; diagram branch = kicker + optional title + full-area .slide-figure + legend figcaption, no bullets/eqs.
- [ ] 2.2 (AD-1/3/5) `src/deck/deck.css`: .is-diagram grid; .door-columns.is-solo-math full-width; scoped `.slide[data-id="d1-mr"] .eq-conn` 0.98rem + .eq-heading 1rem (no global bump); .derivation-strip ~10 lines reusing legend-chip/legend-dot.

## Phase 3: Verification — design AD-8

- [ ] 3.1 (RV) `npm run build && node src/scripts/capture-slides.mjs` (read-only): expect 32 PNGs slide-01..32; vision-review 10 touched slides by id→index (notacion, d1-figura, d1-mr, d1-puerta4, d1-puerta1/2/3, d1-puerta{1,2,3}-diagram) vs REF-1..6 + REF-2b; ≤2 tuning passes/slide else escalate; git status shows ONLY the 4 design-listed entries.
- [ ] 3.2 (RV) `node src/scripts/export-pdf.mjs presentacion_piml_v4_puertas_2026-09.pdf` (read-only invocation); verify PDF = 32 pages.
- [ ] 3.3 `npm run lint` clean; conventional local commit, NO push; apply chain-split only if diff > 400 lines.
