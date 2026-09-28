# Tasks: v4-diagram-space — diagram space + scoped LaTeX

Spanish slide copy; two revertible commits (P1, P2); NO push; PDF name unchanged. Order: spread → padding → font bumps.

## Review Workload Forecast

~150–250 changed lines, ~10 files; 33 captures @2x/phase.

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Focused test | Runtime harness | Rollback |
|---|---|---|---|---|
| 1 | P1 sizing (1.1–1.6) | `npm run lint` | build+captures+review | revert mrPipeline/props/CSS |
| 2 | P2 LaTeX (2.1–2.7) | `npm run lint` | build+captures+review+PDF | revert P2 commit |

## Phase 1: R14 sizing (03/06/11 + 09 micro)

- [x] 1.1 (R14/D2) `src/deck/diagrams/mrPipeline.js`: local per-variant geometry — ad gap 40; datos gap 34 + 52px neurons, pitch 86; modelo 132/46/22 untouched; thetaY 332→386 (old baseline 332, not 330).
- [x] 1.2 (R14) `src/deck/diagrams/PuertasFisicaFlow.jsx`: p1–p4 rows y 0/140/280/420 (step 110→140); ml →(700,230); fis y 140→200; column x 320 unchanged.
- [x] 1.3 (R14/D3) ψ_fis 52px exact in datos data AND `.flow-mr3 .deck-neuron` CSS — DOM 52 = layout 52, else mesh anchors stale.
- [x] 1.4 (R14) `src/deck/deck.css`: append `.flow-d1`/`.flow-mr1`/`.flow-mr3` blocks after line 964; `.flow-hnn` untouched.
- [x] 1.5 (R14/D1) Props: `PuertasFisicaFlow.jsx` flow-d1+0.05; `MRPuerta1Flow.jsx` flow-mr1+0.04; `MRPuerta3Flow.jsx` flow-mr3+0.04; `MRPuerta2Flow.jsx` 0.03→0.02 ONLY; others keep 0.12.
- [x] 1.6 (RV) `npm run build && npm run lint && node src/scripts/capture-slides.mjs`; review 03/06/09/11 vs REF-1..6: vertical fill, no overlaps/cut labels, ψ_fis inside, 09 = 7b + micro, other captures unchanged; ≤2 tuning passes/slide; commit, NO push. (0 tuning passes used — first capture run passed review.)

## Phase 2: R15 scoped LaTeX (after P1 verified)

- [ ] 2.1 (R15/D4) Create `src/deck/diagrams/NodeEquation.jsx` (~15 LOC): `<MathJax inline dynamic onTypeset className="deck-eqline">`; `$…$` passed through as-is, NOT stripped (config `inlineMath [['$','$']]` consumes them); `dynamic` mandatory in prod.
- [ ] 2.2 (R15/D5) `src/deck/diagrams/DeckFlowPanel.jsx`: FlowCanvas provides RefitContext — rAF-debounced `fitView({padding: fitViewPadding, duration: 0})` — reaching DeckNode and `mrNodeTypes.jsx` types (loss/theta bypass `buildNodeType`); NOT bare `useReactFlow().fitView()` (no-arg padding defaults 0.1).
- [ ] 2.3 (R15) `src/deck/diagrams/mrNodeTypes.jsx`: LossLineNode + theta LabelNode route `$…$` strings via NodeEquation; detector: starts AND ends `$` (no `includes`); audit `rg '\$' src/deck/diagrams/*.jsx`: 0 dollars in DataDriven/FamiliasPiml/Interseccion/Problemas/Opciones.
- [ ] 2.4 (R15) Mark R15 lines only, per design table: slide-03 p1/p4/ml; AD loss; theta label (shared node → slide 11/mr3 typesets it too); 3 hnn-estructura lines; 2 autodiff lines; hnn-p4. Datos loss, neurons/badges/chips stay unicode.
- [ ] 2.5 (R15) `src/deck/deck.css`: `.deck-eqline` — font-size inherit, no width constraints.
- [ ] 2.6 (R15/D6) `src/scripts/capture-slides.mjs:86`: settle 700→1000 ms; mjx-stable wait only if still stale.
- [ ] 2.7 (RV) `npm run build && npm run lint && node src/scripts/capture-slides.mjs`; review 03/06/09/11: eq nodes show `mjx-container`, refit clears clipped nodes/stale bands, non-eq nodes stay unicode; commit, NO push.

## Phase 3: RV verification

- [ ] 3.1 (RV) `node src/scripts/export-pdf.mjs presentacion_piml_v4_puertas_2026-09.pdf` (argv explicit — engram #34) → 33 pages, same path; ids unique.
- [ ] 3.2 (RV) Regression: non-target captures pixel-identical to 7b baseline; PDF 03/06/09/11 pages match PNGs.
- [ ] 3.3 (RV) Final `npm run lint` + `npm run build`; conventional commits, NO push; files == design File Changes table.
