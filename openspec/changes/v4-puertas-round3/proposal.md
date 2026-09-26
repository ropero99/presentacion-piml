# Proposal — v4-puertas-round3: visual refinement of the v4 doors deck

**Change:** `v4-puertas-round3` · **Repo:** `presentacion_piml` (Vite + React slide deck) · **Date:** 2026-09-26
**Status:** proposal · **Expected outcome:** the SAME document `presentacion_piml_v4_puertas_2026-09.pdf` regenerated in-place, with 6 refinements plus 3 new diagram-only slides for doors (1)(2)(3).

All artifact prose in this `openspec/` tree is English (SDD artifact default). Slide copy inside the deck stays Spanish academic register (existing deck convention, explicit user request from round 2).

---

## 1. Why

The user reviewed the rendered `presentacion_piml_v4_puertas_2026-09.pdf` (v4, 29 slides; three door slides share one MR-pipeline topology via `buildMrDiagram({entry})`) and requested 6 refinements. The deck is edited in place: same repo, same revision history, same PDF filename regenerated in place. The user reviews the regenerated PDF locally BEFORE uploading to GitHub. Visual self-review of rendered captures with vision is a MANDATORY verification step.

## 2. Page-to-id mapping (verified against `src/data/deckContent.js`, 29 slides)

| User page | Slide id | Title / description |
|---|---|---|
| 2 | `notacion` | Notation table: five groups, fixed symbols (5 bullets, sparse) |
| 3 | `d1-figura` | The four doors (remove door-4 text line; add a bit of problem-general context) |
| 4 | `d1-mr` | The exemplary system: mass-spring-damper (bold companion text small) |
| 5 | `d1-puerta1` | Door 1 — PINN (loss function) |
| 6 | `d1-puerta2` | Door 2 — HNN (Hamiltonian architecture) |
| 7 | `d1-puerta3` | Door 3 — Physics in data / features |
| 8 | `d1-puerta4` | Door 4 — Hybrid grey-box (almost empty; complement it) |

New diagram-only slides are inserted AFTER each of `d1-puerta1/2/3` with ids `d1-puerta{1,2,3}-diagram`; `d1-puerta4` remains the last slide of module d1.

## 3. Accepted scope (6 changes)

1. **REF-1 (page 2, `notacion`)** — too sparse for a full page: restructure and/or add needed entries (e.g. exogenous covariates, decision-map symbols if they appear later, semantic note about local symbols). Keep current semantics of the five groups.
2. **REF-2 (page 3, `d1-figura`)** — remove the door-4 sentence from the slide text (door 4 already appears in the diagram legend and has its own slide 8); add a little more problem-general framing (model plus physical law, what "physics entering" means). Deliver with semantics-preserving rich-text partials.
3. **REF-2b (page 8, `d1-puerta4`)** — the door-4 slide is almost empty: complement it (why hybrids exist, when chosen over pure PINN, grey-box grounding Bacher & Madsen) while staying within deck density conventions.
4. **REF-3 (page 4, `d1-mr`)** — slightly increase the font size of the bold companion text next to equations; optionally add one more concept block to fill the panel (e.g. meaning of the damping envelope).
5. **REF-4 (doors 1/2/3)** — add one diagram-only slide per door: diagram alone, large, perfectly legible, so the existing door text slides reorganize text and can show more of where equations come from. Reuse `buildMrDiagram({entry})` shared topology (variant flag / full-slide layout); no new topologies.
6. **REF-5 (page 6, `d1-puerta2`)** — expand the Hamiltonian concept: where the Hamilton equations are derived from (canonical state to Hamilton-Jacobi path to loss), what they mean in MR terms; with the diagram moving to its own slide, restructure text density; make the physics-imposition point in the architecture MORE visible (colors/arrows/source-zone emphasis; the public must understand the diagram; small flow diagram if useful).
7. **REF-6 (doors 1/3 diagrams)** — once the door-1 and door-3 diagrams sit alone on a page, fine-tune composition/legibility: fix anything visually off (spacing, overlaps, dimmed nodes, cut labels), keep the current table row "1 f(h)^2 affinity (useEffect panel)".

## 4. Out of scope

- Modules d2..d6, lectura, cierre: untouched. Maintain GUI deck module list as-is.
- Any new PDF infrastructure: none (keep `capture-slides.mjs` / `export-pdf.mjs`; only wait-time tweaks if new content needs them).
- Version bump or new PDF filename: NO (same document, in-place regeneration).
- GitHub upload itself (user does it after local review) and workflow files.
- Artifacts live only under `openspec/changes/v4-puertas-round3/` (proposal, spec, design, tasks); nothing else changes outside the deck content/components listed above.

## 5. Structural decisions (carry into design)

- Same-document edit; PDF regenerated in-place with the same filename; slide ids stay unique and stable for the capture pipeline (new ids carry the `-diagram` suffix).
- Mandatory reuse of `buildMrDiagram({entry})` for the 3 new diagram-only slides (single shared topology; layout variant at full-slide scale; NO new topologies) — prevents duplication and keeps door slides visually consistent.
- Verification is two-level: (1) `npm run build` + `node src/scripts/capture-slides.mjs` (Playwright, 1920x1080@2x, waits MathJax/ReactFlow) + visual review with vision of ALL 9 touched/created slides mapped to REF-1..REF-6; (2) lint (`npm run lint`, oxlint) + successful build. Deliverable: regenerated PDF reviewed visually; local commit, NO push.
- Chain delivery: small change (est. < 400 changed lines) → single slice (auto-chain). If the estimate crosses ~400 lines changed, chain: slice 1 = REF-1/2/2b/3 text and density fixes; slice 2 = REF-4/5/6 door-diagram slides; feature-branch-chain; documented before implementation.

## 6. Risks

- Visual overflow on `notacion`, `d1-mr`, `d1-puerta2` when adding content. Mitigation: iterative capture-review loop with a bounded budget (2 tuning passes per slide; escalate to the user only after 2).
- ReactFlow diagrams at full-slide scale (1920x1080): if `buildMrDiagram` needs tuning for the solo layout, adjust with flow notes/markers inside the variant; no new topologies.
- Capture waits: new equations may need re-verification of the MathJax/ReactFlow wait settings in `capture-slides.mjs`.
- Narrative seam in `d1-figura` after deleting the door-4 line: re-read surrounding bullets to avoid a grammar seam.
- Captures are re-indexed automatically (slide-*.png by index): review captures per slide id, not by stale numbering.
- Round-3 inherits round-2 state (door slides, MR pipeline builder) as the baseline.

## 7. Estimation origin

- Direct user feedback on the rendered PDF (6 items) relayed verbatim in section 3 (REF-1..REF-6).
- Est. size: under 400 changed lines (content/config-level changes plus 3 slide inserts reusing the diagram factory).

## 8. Next

- `spec` (formalize requirements R1..R6 + R-diagram-slides with Given/When/Then) then `design` then `tasks` then `apply`, then visual verification (build + capture + vision) and archive at close.
