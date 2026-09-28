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
- [x] 1.6 (AD-1, REF-4/R4) Insert `d1-puerta{1,2,3}-diagram` after each door slide: kind:'diagram', module:'d1', diagram mr1/mr2/mr3, door-template kicker, legend copied, tone matched, title omitted; doors ①②③ drop diagram/diagramTitle/legend keys; `d1-puerta4` stays last of d1 (29 → 32 slides).

## Phase 2: Component + CSS — `src/deck/`

- [x] 2.1 (AD-1, REF-4/R4) `src/deck/SlideBody.jsx`: `data-id={slide.id}` on all 3 branch returns; hasFigure includes 'diagram'; diagram branch = kicker + optional title + full-area .slide-figure + legend figcaption, no bullets/eqs.
- [x] 2.2 (AD-1/3/5) `src/deck/deck.css`: .is-diagram grid; .door-columns.is-solo-math full-width; scoped `.slide[data-id="d1-mr"] .eq-conn` 0.98rem + .eq-heading 1rem (no global bump); .derivation-strip ~10 lines reusing legend-chip/legend-dot.

## Phase 3: Verification — design AD-8

- [x] 3.1 (RV) `npm run build && node src/scripts/capture-slides.mjs` (read-only): expect 32 PNGs slide-01..32; vision-review 10 touched slides by id→index (notacion, d1-figura, d1-mr, d1-puerta4, d1-puerta1/2/3, d1-puerta{1,2,3}-diagram) vs REF-1..6 + REF-2b; ≤2 tuning passes/slide else escalate; git status shows ONLY the 4 design-listed entries.
- [x] 3.2 (RV) `node src/scripts/export-pdf.mjs presentacion_piml_v4_puertas_2026-09.pdf` (read-only invocation); verify PDF = 32 pages.
- [x] 3.3 `npm run lint` clean; conventional local commit, NO push; apply chain-split only if diff > 400 lines.

## Phase 4: Round-4 refinements (post-verify user feedback)

- [x] 4.1 (R7) `d1-figura` → kind 'diagram' with `lead` (text above, full-width diagram); SlideBody diagram branch renders optional lead/refs inside MathJax; CSS lead classes.
- [x] 4.2 (R8) New slide `d1-puerta2-deriv` (door, 4 eq: Hamilton eqs from H → MR ODE → dH/dt=0 conservation → Euler–Lagrange §F3 literal), inserted after `d1-puerta2` (deck 32→33).
- [x] 4.3 (R9) mrPipeline modelo: structure box carries eq chip `d/dt [q, p] = J ∇H_θ`; StructureNode renders `data.eq`; title 0.74rem; box bg 0.08.
- [x] 4.4 (R10) mrPipeline datos: feat (430,470) with targetHandles t-datos 25%/t-fis 75%; fis (40,470) straight edge; feedback bezier through empty canvas.
- [x] 4.5 (RV) build + 33 captures + vision review of slides 03/08/09/11 (all PASS) + PDF in place (33 pages) + commit 80b49b9.

## Phase 5: Round-5 diagram tweaks (post-round-4 feedback)

- [x] 5.1 (R7 scope) `.rf-title` chip 0.78→0.98rem — diagram caption readable deck-wide.
- [x] 5.2 (new R11) Door-1 diagram: Diff. automática box BESIDE Comparar con datos (row cmp→ad→opt at y=92/172; cmp→ad edge explicit; fis→ad bezier under the row; loss line under ad row). Commit 346798e.
- [x] 5.3 (new R12) Door-3 diagram: Features box UNDER Datos/entrenamiento (185,430); fis horizontal edge (t-fis anchor); feat→ψ_fis near-vertical bezier; redundant datos→feat edge removed (datos keeps its direct short hook to ψ_fis). Commit 346798e.
- [x] 5.4 (RV) build + 33 captures + vision review slides 03/06/11 PASS + PDF in place (33 pages).

## Phase 6: Round-6 HNN door-② rewrite (user spec)

- [x] 6.1 `d1-puerta2` → lema "por construcción"; derivation strip 5 chips; 4 eq blocks: canonical state + H, f_θ ↦ H_θ, autodiff + Hamilton eqs (★ physics entry), L_HNN(θ) + argmin θ*; notes = mensaje clave.
- [x] 6.2 `d1-puerta2-deriv` → "Del Hamiltoniano a la dinámica del masa-resorte": T+V → Hamilton eqs → recovery m·ẍ + k·x = 0 → dH/dt = 0; LNN as note.
- [x] 6.3 `buildHnnDiagram()` (mrPipeline, appended): 10-stage flow + prediction branch chain; colors navy/teal/purple/orange/red; `MRPuerta2Flow` consumes it.
- [x] 6.4 SlideBody door branch renders `slide.notes`; scoped `[data-id='d1-puerta2']` compaction (eq clamp 0.95–1.12rem, strip/notes margins).

## Phase 7: Round-7 final adjustments (slides 7–9, structure preserved)

- [x] 7.1 (R13) Data targets clarified in `d1-puerta2` cost block: q̇_n = ẋ_n, ṗ_n = m·ẍ_n; ṗ_n estimated by finite differences when no acceleration is measured.
- [x] 7.2 (R14) H_θ(q,p) not necessarily compared with energy labels — learned because its gradient must reproduce the observed dynamics (block 2 conn).
- [x] 7.3 (R15) Energy conservation explicitly scoped: conservative case c = 0 and no external force; in the HNN it holds for all θ (deriv slide).
- [x] 7.4 (R16) L_HNN(θ) as the loss name everywhere (slides 7/9 + legend).
- [x] 7.5 (R17) Physics-entry block highlighted in `buildHnnDiagram`: purple translucent panel behind Autodiff + Estructura Hamiltoniana + ★ badge.
- [x] 7.6 (R18) Training vs prediction visually separated: navy ENTRENAMIENTO chip, dashed divider, teal PREDICCIÓN chip (LabelNode variants chip/panel/divider + data.style).
- [x] 7.7 (R19) "integrador numérico (preferiblemente simpléctico)" in the prediction chain.
- [x] 7.8 (R20) Notation audit q, p, H_θ, θ, θ*, J, L_HNN(θ) — consistent across slides 7–9 and diagram.
- [x] 7.9 (R21) Bigger diagram boxes/text scoped to the HNN flow via `className="flow-hnn"` (DeckFlowPanel className prop; CSS bumps: node 0.72→0.78rem, title 0.84rem, neuron 52px, min-width 165) + compressed x layout (1830→1729 bounding width → fitView zoom ≈ +15%).
- [x] 7.10 (RV) build clean, lint clean, 33 captures, vision review slides 07/08/09 PASS (refs unclipped, no overflow), PDF regenerated in place (33 pages, pdfinfo), commit a85a5e0. NO push.
