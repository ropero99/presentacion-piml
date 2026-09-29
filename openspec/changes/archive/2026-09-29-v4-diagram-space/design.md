# Design: Enlarge Diagram Space (03/06/09/11) + Scoped LaTeX Node Formulas

Spec: `specs/presentation-deck/spec.md` (R14 sizing scopes, R15 scoped LaTeX + refit, RV pipeline). Explore artifact: engram `sdd/v4-diagram-space/explore` (#46). Round-7b precedent (#39): these diagrams are width-bound in fitView, so raising bbox height + cutting per-flow `fitViewPadding` compounds into real vertical fill.

## Technical Approach

Two independently verified commits. **P1 (R14)**: add per-flow additive CSS scopes (`.flow-d1`, `.flow-mr1`, `.flow-mr3`) mirroring the existing `.flow-hnn` block (`deck.css:926-964`), spread geometry with per-variant local constants (the proven `buildHnnDiagram` HN/HG pattern, `mrPipeline.js:427-433` — shared constants untouched), cut `fitViewPadding` per flow (default 0.12 preserved for non-target flows), and fix the `ψ_fis(x)` 46px overflow with matched data geometry + scope CSS. Ordering per spec: spread → padding → font bumps. **P2 (R15, after P1 captures verified)**: typeset only R15-listed equation strings via a small `MathJax inline dynamic` wrapper inside the panel subtree — node subtrees sit OUTSIDE `SlideBody`'s `<MathJax>` (`SlideBody.jsx:106-118`: the `<figure>` is a sibling of the MathJax block, the root cause of unicode diagrams) — with a refit hook driven by the wrapper's `onTypeset` callback. Capture settle window 700→1000 ms.

## Architecture Decisions

| # | Decision | Options (tradeoff) | Choice & rationale |
|---|----------|--------------------|--------------------|
| D1 | Per-flow scope mechanism | (a) pass `className`+`fitViewPadding` at each flow component; (b) new panel API/engine heuristics | (a). Exactly how `MRPuerta2Flow.jsx:19-20` already does it for `.flow-hnn`; zero panel API delta; additive CSS; trivial rollback |
| D2 | Geometry spread | (a) edit shared `NEURON_GAP`/`NET_Y0` (regression surface: both `buildMrDiagram` variants + shared formulas incl. the dead `entry:'modelo'` branch); (b) per-variant local geometry object | (b). Follows the accepted HNN local-shadow precedent (HN 52/HG 64/NET_Y0 132 local, `mrPipeline.js:431-433`); `entry:'ad'` and `entry:'datos'` spread independently; `entry:'modelo'` branch stays numerically identical |
| D3 | ψ_fis 46→52px fix | (a) CSS-only 52px in `.flow-mr3` — **rejected**: React Flow measures the DOM node, so CSS 52px on all m3 neurons contradicts layout math computed with `NEURON_SIZE=46` → stale mesh edge anchors; (b) data change only; (c) data geometry + matching scope CSS | (c). Door-3 layout computes rows with local 52/34 exactly as HNN does with HN 52; `.flow-mr3 .deck-neuron{width/height:52px}` makes DOM and plan agree — measured size 52 = layout constant 52, mesh anchors stay honest. Single source of truth preserved |
| D4 | LaTeX mechanism | (a) per-line `<MathJax inline dynamic>` wrapper (component-level eq nodes); (b) wrap whole flow host in one `<MathJax>` | (a). Opt-in per marked line; no MathJax rescan/mutation over the full canvas subtree (bars, unicode, edges stay untouched); mirrors existing `SlideBody`/`MathJax` usage; (b) would typeset-scan all node text and couples MathJax DOM with React Flow measurement |
| D5 | Refit hook | (a) `useMathJax()` hook — **does not exist** in better-react-mathjax v3; (b) rAF polling of node heights; (c) `MathJax` `onTypeset` callback → debounced `fitView` | (c). Verified v3 API: `MathJax` supports `onTypeset`/`onInitTypeset` callbacks fired after each completed typeset pass (mutex-guarded, so no double-typeset on re-activation); fallback if callbacks misbehave: `MathJaxBaseContext.promise.then(mj => mj.typesetPromise([hostEl]))` then rAF×2 → refit. Node hint: this deck is client-only (no SSR), and slides stay mounted (`DeckShell.jsx:161-169`) — activation re-runs the existing one-shot fitView on already-grown nodes |
| D6 | Capture settle | (a) keep 700 ms; (b) diagram-specific mjx-count-stable wait; (c) raise settle | (c). `waitForMathSettled` already waits for `#viewport .is-active mjx-container` (active-scoped ✓) — raise `waitForTimeout(700→1000)` at `capture-slides.mjs:86` to cover typeset→onTypeset refit→fitView(240ms)→overlay transition. (b) only if 1000 ms still proves stale |

### Slide 09 micro-guard (R14 — hard constraint)

Only `fitViewPadding 0.03→0.02` on `MRPuerta2Flow.jsx`. NO `.flow-hnn` CSS edits, NO `HN/HG/NET_Y0` change. Guard: padding ≥0.02 keeps fitView zoom under `maxZoom: 1.6` (`DeckFlowPanel.jsx:262`), so the 7b look cannot be clipped; verified by capture diff against the 7b baseline.

### Data flow (P2 typeset → refit)

```
App ─ MathJaxContext ──> SlideBody text branches (kicker/title/lead)   [existing scope]
                 │
                 └──> slide-figure ──> DeckFlowPanel (react-flow)
                                        │   P1: unicode lines; fitView one-shot on [active]
                                        ▼   P2:
              DeckNode / LabelNode / LossLineNode
              line flagged "$...$"  ──> <NodeEquation>  (MathJax inline dynamic)
                                        │ mj.typesetPromise(subtree) → mjx-container
                                        ▼
              onTypeset ──> rAF-debounce ──> fitView({ padding, duration: 0 })   [refit]
capture: waitForMathSettled (active mjx-container) + 1000 ms settle
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/deck/diagrams/mrPipeline.js` | Modify | P1: per-variant geometry (D2/D3 blocks below). P2: `$...$` markers in R15 equation strings |
| `src/deck/diagrams/PuertasFisicaFlow.jsx:86` | Modify | `className="flow-d1"` + `fitViewPadding={0.05}` (P1); line markers (P2) |
| `src/deck/diagrams/MRPuerta1Flow.jsx` | Modify | `className="flow-mr1"` + `fitViewPadding={0.04}` (P1); loss/θ markers (P2) |
| `src/deck/diagrams/MRPuerta3Flow.jsx` | Modify | `className="flow-mr3"` + `fitViewPadding={0.04}` (P1 only — no R15 node on mr3) |
| `src/deck/diagrams/MRPuerta2Flow.jsx` | Modify | `fitViewPadding 0.03→0.02` only (P1); estructura/autodiff/prediction markers (P2) |
| `src/deck/diagrams/DeckFlowPanel.jsx` | Modify | P2: `$`-marker branch in `DeckNode` line rendering + `onTypeset` refit plumbing in `FlowCanvas` (rAF-debounced). No signature change |
| `src/deck/diagrams/mrNodeTypes.jsx` | Modify | P2: same marker branch in `LossLineNode` lines; `LabelNode` theta variant. Neurons/badges/chips untouched |
| `src/deck/diagrams/NodeEquation.jsx` | Create | ~15 LOC: `MathJax inline dynamic onTypeset` wrapper (sole typeset component; decks' only new import from better-react-mathjax) |
| `src/deck/deck.css` | Modify | Append `.flow-d1`, `.flow-mr1`, `.flow-mr3` blocks after line 964 (additive, mirrors `.flow-hnn`); `.deck-eqline` step; `.flow-mr3 .deck-neuron` 52px |
| `src/scripts/capture-slides.mjs:86` | Modify | settle 700→1000 ms (P2 commit) |
| `src/data/deckContent.js` | None | Slide 03's p1/p4/ml equation lines live in `PuertasFisicaFlow.jsx` node data, not deckContent — no content-file change |

## Interfaces / Contracts

```jsx
// NodeEquation.jsx (new) — the only new component
import { MathJax } from 'better-react-mathjax';
export default function NodeEquation({ code, onTypeset }) {
  return (
    <MathJax inline dynamic onTypeset={onTypeset} className="deck-eqline">
      {code}  {/* single line string incl. its $...$ delimiters */}
    </MathJax>
  );
}
```

- **Marker convention**: a `data.lines` entry / `data.label` / `data.eq` string is typeset iff it BOTH starts and ends with `$`. Containment (`includes`) is rejected — stray dollars elsewhere in node text must never trigger a rescan. Detection happens at render (no data migration, no new node fields):
  - `DeckNode` line loop (`DeckFlowPanel.jsx:80-84`) and `LossLineNode`/θ `LabelNode` (`mrNodeTypes.jsx`) route matching strings through `NodeEquation`; everything else renders as today.
- **Unicode guarantee (R15)**: neurons, badges, chips keep plain text — their strings carry no `$` markers (verified per-node in ADDITIONS).
- **Refit contract**: `FlowCanvas` creates `refit = rAF-debounced(() => fitView({ padding: fitViewPadding, duration: 0 }))` and passes it down `buildNodeType(flow, refit)`; `NodeEquation` calls it via `onTypeset`. Idempotent: MathJax mutex prevents double-typeset; refit re-running is harmless (monotone, no state).

## Testing Strategy

Strict TDD disabled (`openspec/config.yaml`); pipeline = build + captures + vision review.

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual E2E per slide | 03/06/11 vertical fill, no overlaps/cut labels; 09 equals 7b baseline beyond padding micro; ψ_fis inside its circle; typeset `mjx-container` present in eq nodes | `npm run build && node src/scripts/capture-slides.mjs` at 1920×1080@2x; slide-by-slide captures vs REF-1..6 |
| Regression | Non-target slides (incl. rounds 4–7b states) pixel-identical; PDF same path/filename; ≤2 tuning passes per touched slide | 33 captures regenerated; watch `export-pdf.mjs` argv (v4 filename explicit — see engram #34 gotcha) |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Layout math only influences React Flow's own internal DOM measurement.

## Migration / Rollout / Sequencing

No data migration. Commit 1 = P1 (scopes + spread + padding + node fonts + ψ_fis fix). Commit 2 = P2 (LaTeX + refit + capture settle). Gate: P1 captures vision-verified BEFORE P2 starts; each phase runs `npm run build` + `npm run lint` + full capture review. Rollback: independent `git revert` of either commit; CSS is append-only and scoped (`fitViewPadding` default 0.12 untouched for non-target flows). PDF regenerated in place at `presentacion_piml_v4_puertas_2026-09.pdf`; local commits, NO push.

## Open Questions

- Exact fis/loss row depths and `AG`/`DG` gaps within the values below (±20 px tolerance, ≤2 tuning passes during P1 verification).
- P2: confirm `onTypeset` refit ordering against the capture settle window; fallback path (D5 fallback) if stale.

---

## ADDITIONS — mechanical contract per file

### mrPipeline.js — per-variant geometry (P1)

Replace shared-constant use inside `buildMrDiagram` with a local geometry object; `entry:'modelo'` gets the legacy numbers so its branch (incl. estructura-box formulas, `mrPipeline.js:206-235`) is numerically unchanged:

| Variant | y0 | neuron size | gap (row pitch) |
|---|----|-----------|-----------------|
| `modelo` (legacy, no caller) | 132 | 46 | 22 (unchanged) |
| `ad` (slide 06) | 132 | 46 | **40** (pitch 86) |
| `datos` (slide 11) | 132 | **52** | **34** (pitch 86) |

Downstream deltas (`old → new`), rows = `y0 + row*(size+gap)`:

| Node (variant) | Old → New |
|---|---|
| hidden rows / inputs / out (ad, datos) | pitch 68 → 86 (ad rows 132/218/304; datos rows 132/218/304; in-psi row2 → y 304; out → y 218) |
| layer labels (ad, datos) | y = y0−34 = 98 (formula unchanged) |
| `thetaY` (ad, datos) | 330 → 386 (`y0 + 3*pitch − 4`) |
| `cmp` (ad) | y 92 → 132 |
| `ad` (ad) | y 92 → 132 |
| `opt` (ad) | y 172 → 232 |
| `fis` (ad) | y 360 → 460 |
| `loss` (ad) | y 360 → 500 |
| `cmp` (datos) | y 172 (unchanged) |
| `opt` (datos) | y 176 (unchanged) |
| `fis` (datos) | y 441 → 500 |
| `feat` (datos) | y 430 → 512 |
| `loss` (datos) | y 310 → 650 |
| `mr`/`datos` boxes | y 170/178 (unchanged) |

PuertasFisicaFlow (slide 03): p1..p4 row step 110 → 140 (y = 0/140/280/420); `ml` (660,150) → (700, 230); `fis` y 140 → 200. Column x 320 unchanged.

Target bboxes (rough, pre-P2; verify in captures): 03 ≈ 900×520; 06 ≈ 1560×470 (fill 45%→~60%); 09 unchanged ≈ 1560×560; 11 ≈ 1060×620 (dead band ~250px → ~60px; ψ_fis fits).

### deck.css — append after line 964 (all additive)

| Selector | Properties |
|---|---|
| `.flow-d1 .deck-node` | padding 8px 11px; min-width 205px; font-size .76rem |
| `.flow-d1 .deck-node .node-title` | font-size .82rem |
| `.flow-d1 .deck-node .node-bar` | height 5px; margin −8px −11px 7px |
| `.flow-mr1 .deck-node` | padding 9px 12px; min-width 165px; font-size .78rem; border-radius 11px |
| `.flow-mr1 .deck-node .node-title` | font-size .84rem; margin-bottom 3px |
| `.flow-mr1 .deck-node .node-bar` | height 5px; margin −9px −12px 7px; border-radius 10px 10px 0 0 |
| `.flow-mr1 .deck-label` / `.is-theta` / `.is-badge` | .64rem / .8rem / .62rem + padding 3px 9px |
| `.flow-mr3` | same block values as `.flow-mr1` |
| `.flow-mr3 .deck-neuron` | width 52px; height 52px; font-size .66rem (matches datos geometry — D3) |
| `.deck-eqline` | typeset line wrapper: font-size inherit; no width constraints (MathJax container must measure naturally) |
| `.flow-hnn` | UNTOUCHED (09 micro-guard) |

Non-target flows (rounds 4–7b): inherit base rules — pixel-equivalent guarantee.

### Props per flow component (P1)

| File | Change |
|---|---|
| PuertasFisicaFlow.jsx:86 | `className="flow-d1" fitViewPadding={0.05}` |
| MRPuerta1Flow.jsx | `className="flow-mr1" fitViewPadding={0.04}` |
| MRPuerta3Flow.jsx | `className="flow-mr3" fitViewPadding={0.04}` |
| MRPuerta2Flow.jsx | `fitViewPadding={0.03}` → `{0.02}` (only) |
| all others | unchanged (default 0.12 preserved) |

### Equation strings — exact marker list (P2, R15 scope only)

| File/node | line becomes |
|---|---|
| PuertasFisicaFlow `p1` | `'$L = L_{MSE} + \\lambda_{phys} L_{physics}$'` |
| PuertasFisicaFlow `p4` | `'$f_{fisica}(x) + g_\\theta(x)$'` |
| PuertasFisicaFlow `ml` | `'\\hat{y} = f_\\theta(x)'` wrapped `$…$` |
| mrPipeline `loss` (ad) | `'$L_{MSE}(\\theta) + \\lambda_{phys} L_{physics}(\\theta) = L_{total}(\\theta)$'` (ad variant only; datos variant line stays prose/unicode) |
| mrPipeline `theta` label | `'\\theta = \\{W_\\ell, b_\\ell\\}_{\\ell=1}^{L}'` wrapped `$…$` |
| mrPipeline `hnn-estructura` | the three lines `q̇_θ = ∂H_θ/∂p` etc. → `$…$` (task writes exact TeX) |
| mrPipeline `hnn-autodiff` | `∂H_θ/∂q`, `∂H_θ/∂p` → `$…$` |
| mrPipeline `hnn-p4` | `'J ∇H_θ*'` → `'$\\mathbf{J}\\,\\nabla H_{\\theta^*}$'` |

NOT marked (unicode stays, per R15): all neuron labels, badges, chips, mr3 loss line (prose), cmp/fis/feat/ad/opt boxes, ml legacy nodes. Marker audit for other flows (`$` in DataDrivenFlow/FamiliasPimlFlow/InterseccionFlow/ProblemasFlow/OpcionesFlow node lines): expected none — apply-phase must grep first; if any stray dollar appears, tighten detector to exact `^\$.*\$$` per string (already the rule).
