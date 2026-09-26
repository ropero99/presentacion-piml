# Design: v4-puertas-round3 — visual refinement of the v4 doors deck

**Slide copy rule**: all slide text stays Spanish academic register; artifact prose English.

## Technical Approach

Pure deck-content + minimal component/CSS evolution over the round-2 baseline (`src/data/deckContent.js`, `src/deck/*`, `src/deck/diagrams/*`). Three diagram-only slides reuse the verified factory `buildMrDiagram({ entry })` (real signature: `{ entry: 'ad' | 'modelo' | 'datos' }`, `mrPipeline.js`) — the full-slide effect comes from the canvas, not from new geometry.

## Architecture Decisions

### AD-1 — Mechanics for the 3 diagram-only slides (REF-4)

| Option | Tradeoff | Decision |
|---|---|---|
| New `kind: 'diagram'` slide branch | +1 branch in `SlideBody.jsx`, +1 CSS grid rule | **CHOSEN** |
| Reuse `kind: 'split'/'door'` with empty content | `SlideBody.jsx:66` `hasFigure` only honors split/door; the empty `slide-content` panel wastes half the column space and draws an empty card | rejected |
| `buildMrDiagram` layout param + new flow components | More code; unnecessary (see AD-2) | rejected |

- `SlideBody.jsx`: extend `hasFigure` to `['split', 'door', 'diagram'].includes(slide.kind) && slide.diagram && DIAGRAM_COMPONENTS[slide.diagram]` and add a `kind === 'diagram'` branch rendering **only** kicker (`'3 · Puerta ① · forma débil · diagrama'`), optional `title` (omit → the in-canvas `.rf-title` chip carries the caption), full-area `.slide-figure` + legend `figcaption`.
- New slide objects in `deckContent.js`: `id: 'd1-puerta1-diagram'`, `'d1-puerta2-diagram'`, `'d1-puerta3-diagram'` — `kind: 'diagram'`, `module: 'd1'`, `diagram: 'mr1'|'mr2'|'mr3'`(**existing** ids/components — no `DIAGRAM_COMPONENTS` additions), legend copied from the door slide, `tone` matching.
- Insertion (SLIDES array, verified order): after each door slide; `d1-puerta4` stays last of module d1 (grid below). Deck goes 29 → 32 slides; ids stable, capture re-indexes automatically.
- Door text slides (`d1-puerta1/2/3`) drop `diagram`/`diagramTitle`/`legend` keys only → `hasFigure` false; `SlideBody` adds `door-columns` modifier class (`.door-columns.is-solo-math { grid-template-columns: minmax(0,1fr) }`) so the math stack takes the full width.

**Slide-grid + d1 module ordering:**

```
deckContent SLIDES (module d1 only)
[3] d1-figura          split   bullets(reframed) + d1 diagram
[4] d1-mr              wide    3 eq-boxes + envelope bullet        (REF-3)
[5] d1-puerta1         door    lema + equations, NO figure
[6] d1-puerta1-diagram diagram mr1 solo (fitView zoom ≈1.26)      (REF-4)
[7] d1-puerta2         door    lema + derivation strip + 4 eq-boxes (REF-5)
[8] d1-puerta2-diagram diagram mr2 solo
[9] d1-puerta3         door    lema + equations, no figure
[10] d1-puerta3-diagram diagram mr3 solo
[11] d1-puerta4        wide    bullets + 2 eq-boxes                (REF-2b)
SlideBody types: cover | split | door | diagram(NEW) | wide
```

### AD-2 — Full-slide variant without touching `buildMrDiagram`

**Choice**: no factory change. `DeckFlowPanel.jsx` fits-to-view (`fitView` effect, padding 0.12, minZoom 0.35, maxZoom 1.6). Geometry: content bbox ≈ 1280×530 px → solo canvas (≈1830×940) yields zoom ≈ 1.26 vs door-panel ≈ 0.63 — automatic 2× up-scaling, below `maxZoom`. Door slides must stay pixel-identical. **Alternatives**: `{ layout:'solo' }` factory option with node-scaling (rejected: needs geometry branching and risks door-regression; reserved as contingency if capture review shows cut labels/overlaps — tuning allowed inside `mrPipeline.js`, no new node types/topologies, per proposal §5).

### AD-3 — `d1-mr` companion text (REF-3)

- Governing CSS: global `.eq-box .eq-conn` (`deck.css:687`, 0.88rem; door override `.slide.is-door .eq-box .eq-conn` 0.84rem untouched).
- `SlideBody` articles gain `data-id={slide.id}` (all 3 branch returns) to scope by stable id (not index).
- Scoped rule: `.slide[data-id="d1-mr"] .eq-conn { font-size: 0.98rem }` (+ `.eq-heading` 1rem so heading stays ≥ conn). One bounded step, 1920×1080 overflow-safe: 3 eq-boxes already fit with slack; verified in pass 1.
- Optional fill per proposal: **one bullet** on the damping-envelope meaning (prose with inline math, NOT a 4th display equation unless literal from the document).
- New artifact, explicit: no global option — scope-only; a global `.eq-conn` bump would reflow the dense d2/d3/d4 math slides (rejected).

### AD-4 — `d1-figura` rewrite (REF-2)

Bullets: keep opening line; **remove** `'**④ Híbrido:** …'`; add 1 problem-general line: model ML $\hat y = f_\theta(\mathbf{x})$ plus physical law $\mathcal{N}[u]=0$ → four entry channels ranked by guarantee strength (weak penalty → structural → data → hybrid). Diagram `d1`, legend, refs untouched; no grammar seam re-check deferral.

### AD-5 — `d1-puerta2` restructure (REF-5)

- No figure. `door-columns` full-width math (AD-1 class). Equation plan (≤4, canonical state first):
  1. Estado canónico + Hamiltoniano: $q=\mathbf{x}$, $p=m\dot{x}$, $H(q,p) = \frac{p^2}{2m} + \frac{kq^2}{2}$ (c=0) — reused verbatim from `d1-mr` eq 2 (grounds "where the Hamilton equations come from").
  2. Existing `J∇H_θ` symplectic model box (current eq 1, conn untouched).
  3. Existing `L_MSE` box. 4. Existing argmin box. **HJ path / MR meaning** = conn prose (no extra display equation — density cap).
- Physics-imposition prominence: derivation strip — chips reusing `.legend-chip` + `.legend-dot` (#7D3C98) in a one-line flex `estado canónico → H_θ → J∇H_θ → L_MSE(solo datos) → θ*` under the lema (new ~10-line CSS class `.derivation-strip`); entry-point stress lives on the solo slide (badge + purple structure box already in `mrPipeline`), no new React-Flow mini-graph (rejected: new mount, duplication of topology, capture wait surface).

### AD-6 — `d1-puerta4` complement (REF-2b)

`kind: 'wide'`, 2 bullets (why hybrids exist: simulator subsidy / interpretability of the base prediction; when chosen over pure PINN: a reliable simulator exists, grey-box tradition) + keep existing eq-box + optionally a 2nd eq-box for the hybrid loss with $\hat y = f_{fisica}+g_\theta$ substituted, only if literal from the document; else 3 bullets. Refs keep Bacher & Madsen (2011).

### AD-7 — `notacion` restructure (REF-1)

`kind:'wide'` → switch render from bullets to `.reading-table` (`slide.table`, 6 rows × 3 cols: Grupo | Símbolos | Uso). Rows: the **five existing groups** (semantics preserved verbatim) + **exogenous covariates promoted out of the RC group** to its own row; final row = local-symbol semantics legend. Table cells pass through `RichText` (+ `<strong>` first col) and MathJax typesets `$…$` inline (proven: `lectura` table). If the table overflows at 1080p in capture pass 1, fallback = two-column CSS grid bullets.

### AD-8 — Verification integration

- Capture pipeline unchanged (`capture-slides.mjs`): waits `document.fonts.ready` → `#viewport .is-active mjx-container` (7 s catch — diagram slides have no math, absorbs ≤3×7 s) → 700 ms settle; PNGs auto-indexed `slide-NN.png`.
- **PDF name passed explicitly**: `export-pdf.mjs` defaults to `presentacion_piml_v2_2026-09.pdf` (verified) — orchestrator MUST invoke `node src/scripts/export-pdf.mjs presentacion_piml_v4_puertas_2026-09.pdf` for in-place regeneration; no filename change, no new infra.
- Review captures by **slide id** (id→index map after insert), budget **2 vision passes/slide** on the **10** touched slides (`notacion`, `d1-figura`, `d1-mr`, `d1-puerta4`, `d1-puerta1/2/3`, `d1-puerta{1,2,3}-diagram`), then `npm run lint` + build, local commit, **NO push**.

**Verification loop (sequence):**

```
edit deckContent/CSS/SlideBody
  ↓ npm run build → dist/
  ↓ node src/scripts/capture-slides.mjs → slide-01..32.png (1920×1080@2x, MathJax+700ms waits)
   ↓ VISION review — 10 slides ← map ids→indexes (notación, figura, mr, puerta4, 3 doors + 3 solos)
  └─ pass? ─→ node export-pdf.mjs presentacion_piml_v4_puertas_2026-09.pdf (in-place)
        ↑          └→ npm run lint → git add <listed files> && commit (NO push) → user uploads
        └─ fail δ (spacing/legibility/overflow): tuning fix — pass ≤ 2 per slide, else escalate to user
```

## Data Flow

```
deckContent.js SLIDES ──→ SlideBody(kind branch) ──→ EquationBox ← MathJax typeset (per slide)
        │                        │
        │           slide.diagram ──→ DIAGRAM_COMPONENTS mr1/mr2/mr3 (module-scope
        │                              buildMrDiagram({entry}) — SAME nodes/edges reused by
        │                              door (panel size) and diagram (solo, fitView up-zoom))
MODULES (deckModules.js) unchanged; rail follows SLIDES order (3 new ids under d1)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/data/deckContent.js` | Modify | 3 new diagram slides inserted; `d1-figura`, `d1-mr`, `d1-puerta1/2/3`, `d1-puerta4`, `notacion` edits |
| `src/deck/SlideBody.jsx` | Modify | `data-id` attrs; `kind:'diagram'` branch + hasFigure; `door-columns` modifier |
| `src/deck/deck.css` | Modify | `.is-diagram` grid; `.door-columns.is-solo-math`; `[data-id="d1-mr"]` type bump; `.derivation-strip` scope |
| `openspec/changes/v4-puertas-round3/` | Create/Update | `design.md` (this), tasks.md via sdd-tasks |

No file deletions. No changes to `mrPipeline.js`, `DeckFlowPanel.jsx`, `capture-slides.mjs` (contingency: `mrPipeline.js` geometry tuning only).

## Interfaces / Contracts

- `buildMrDiagram({ entry: 'ad'|'modelo'|'datos' }) → { nodes, edges }` — INVARIANT (verified; returns throw on unknown entry). No new signature this round.
- New slide contract: `{ id, module:'d1', kind:'diagram', tone, kicker, diagram:'mr1'|'mr2'|'mr3', diagramTitle, legend:[{color,label}] }`; optional `title` omitted.
- Door slides ①②③ lose `diagram/diagramTitle/legend` keys only.

## Testing Strategy

| Layer | What | How |
|---|---|---|
| Static | Valid JSX/data, unique ids, ≤4 display eq per slide | `npm run lint`, code review |
| Build | Vite production build clean | `npm run build` |
| Visual | 10 slides vs REF-1..6 (vision-reviewed captures, 2-pass budget) | `node src/scripts/capture-slides.mjs` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. Capture/PDF scripts are invoked manually with existing args; no workflow file changes.

## Migration / Rollout

No data migration. Single commit, no push; rollback = revert commit (PDF regenerated in place; captures disposable).

## No-Go List (preserved from proposal §4)

No changes to modules d2–d6/lectura/cierre; no new capture/PDF infrastructure or wait-time changes; no version bump or new PDF filename; no GitHub upload step; artifacts only under `openspec/changes/v4-puertas-round3/`.

## Open Questions

- [ ] REF-6 feedback phrase "table row `1 f(h)^2 affinity (useEffect panel)`" matches nothing in the deck (`deckContent.js` has no such table); interpreted as keep door-1/3 diagram topology as-is — confirm with user only if it resurfaces.
- [ ] `d1-puerta4`/`d1-mr` new display equations only if literal from source document; otherwise prose bullets (rule: equations literal from the document, `deckContent.js` header).
