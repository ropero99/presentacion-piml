# Proposal: Enlarge Diagram Space (03/06/09/11) + LaTeX Node Formulas

## Intent

Diagrams waste canvas space (slide 06 fills ~45% vertically; slide 11 has a ~250px dead band and `ψ_fis(x)` overflows its 46px neuron); equation nodes show unicode, not typeset math. Goal: full slide-space use, bigger text, LaTeX formulas in nodes.

## Scope

### In Scope

- **P1 sizing (03/06/11)**: round-7b recipe generalized — per-flow scoped CSS via `className` (`.flow-d1`, `.flow-mr1`, `.flow-mr3`), vertical spread, reduced `fitViewPadding`; neuron fix `ψ_fis(x)` 46→52px.
- **P1 slide 09 (HNN)**: micro only — padding cut, round-7b look preserved.
- **P2 LaTeX (after P1)**: scoped MathJax, equation nodes only — door-1 loss + θ label, HNN estructura/autodiff + `J∇H_θ*`, slide-03 p1/p4/ml. Neurons/badges stay unicode; fitView refit after typeset; capture-wait verified.
- **Verification**: build + lint + 33 captures + vision review of 4 slides + PDF in place; ≤2 tuning passes.

### Out of Scope

- No topology rewrites (`buildMrDiagram`, `buildHnnDiagram` unchanged).
- KaTeX rejected; MathJax only, no global rescan.
- No edge re-layout beyond spread; no other slides; `entry:'modelo'` untouched.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `presentation-deck`: sizing for 03/06/09/11 (per-flow scopes, padding cuts, neuron fix); scoped-LaTeX for equation nodes with refit and capture-wait guarantee.

## Approach

1. **P1**: `DeckFlowPanel` already takes `className`/`fitViewPadding` (default 0.12); pass per-flow classes mirroring `.flow-hnn`. Order: spread → padding cut → font bumps last (font growth widens bbox → drops fitView scale).
2. **P2**: wrap equation lines in `MathJax` inside the existing `MathJaxContext`; fitView-refit hook after typeset (post-mount growth stales one-shot fitView); confirm capture waits.

## Affected Areas

| Area | Impact |
|---|---|
| `DeckFlowPanel.jsx` | refit hook (P2) |
| `mrPipeline.js` | spread (P1); HNN lines (P2) |
| `PuertasFisicaFlow.jsx` | class, spread, typeset |
| `MRPuerta1Flow.jsx` | class (P1); loss/θ (P2) |
| `MRPuerta3Flow.jsx` | class, spread (P1) |
| `deck.css` | new flow scopes (P1) |
| `capture-slides.mjs` | settle wait if stale (P2) |

## Risks

| Risk | L | Mitigation |
|---|---|---|
| bbox growth vs fitView | Med | spread first, fonts last |
| post-mount heights | Med | refit hook |
| 700ms settle tight | Low | raise if stale |
| HNN 7b regression | Low | micro only |
| maxZoom 1.6 clipping | Low | padding ≥0.02 |

## Rollback Plan

Two commits (P1, P2), independently revertable; scoped CSS additive. Captures/PDF regenerate from `dist`.

## Dependencies

None — MathJax context loads via `MathProvider`.

## Success Criteria

- [ ] 03/06/11 fill freed vertical space, no overlaps
- [ ] Slide 09 matches round-7b baseline beyond micro padding
- [ ] `ψ_fis(x)` inside its neuron (slide 11)
- [ ] Equation nodes typeset (no unicode) on 03/06/09/11
- [ ] Build + lint pass; PDF regenerated in place
- [ ] Forecast: ~150–250 lines across ~7 files — under the 400 budget
