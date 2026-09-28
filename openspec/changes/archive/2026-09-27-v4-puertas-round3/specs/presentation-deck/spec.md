# Delta for presentation-deck — v4-puertas-round3

Scope: in-place refinement of the Spanish academic slide deck (Vite + React, data-driven), regenerating the same PDF artifact. Slide copy stays Spanish; artifact prose English. Six accepted refinements (REF-1..REF-6) plus three diagram-only door slides.

## ADDED Requirements

### Requirement: R1 — Notation slide expansion (REF-1)

Slide `notacion` SHALL keep the semantics of its five current groups and SHOULD gain entries needed by later slides (e.g. exogenous covariates, decision-map symbols that appear later, a semantic note about local symbols). Added copy MUST respect deck density and Spanish academic register.

#### Scenario: Notation page no longer sparse

- GIVEN `notacion` renders with its five groups
- WHEN the viewer reaches the slide at 1920x1080
- THEN each group retains its current symbols and at least the exogenous-covariate entry plus symbols appearing later are present
- AND the slide fits its panel without visually detected overflow

### Requirement: R2 — Door-figure slide rewrite (REF-2)

Slide `d1-figura` text content MUST NOT mention door 4 (id `d1-figura` bullets/text only; the diagram legend MAY keep the door-4 color entry, and `d1-puerta4` still exists). Text SHALL gain a small problem-general framing (model plus physical law; what "physics entering" means), delivered as semantics-preserving rich-text partials with no grammar seam after removal.

#### Scenario: Door-4 text line removed

- GIVEN the text content of slide `d1-figura`
- WHEN the slide is rendered or its data inspected
- THEN no bullet/text references door 4
- AND the legend color entry and slide `d1-puerta4` remain present

#### Scenario: Problem-general framing added

- GIVEN slide `d1-figura`
- WHEN its remaining bullets are read
- THEN a concise framing of model + physical law and "physics entering" is present with no broken narrative flow

### Requirement: R2b — Door-4 slide complement (REF-2b)

Slide `d1-puerta4` SHALL be complemented (why hybrids exist, when they are chosen over pure PINN, grey-box grounding via Bacher & Madsen) within deck density conventions.

#### Scenario: Door-4 slide no longer almost empty

- GIVEN slide `d1-puerta4` at 1920x1080
- WHEN rendered
- THEN it presents hybrid motivation and the Bacher & Madsen grounding within standard density without overflow

### Requirement: R3 — MR slide typography and density (REF-3)

Slide `d1-mr` bold companion text beside equations SHALL become slightly larger within the same component family, with no overflow at 1920x1080. The panel SHOULD gain one concept block (e.g. meaning of the damping envelope). The increase MUST stay bounded: no existing content is dropped or wrapped away.

#### Scenario: Bounded typography increase

- GIVEN slide `d1-mr` at 1920x1080
- WHEN rendered
- THEN the companion text is slightly larger in the same family, all prior content remains, and no overflow is visually detected

### Requirement: R4 — Door diagram-only slides (REF-4)

Three new slides with ids `d1-puerta1-diagram`, `d1-puerta2-diagram`, `d1-puerta3-diagram` MUST be inserted immediately after each of `d1-puerta1/2/3`; `d1-puerta4` MUST remain the last slide of module d1. Each new slide MUST render the single shared MR topology built by `buildMrDiagram({entry})` via a full-slide layout variant, diagram alone and large. No new topologies SHALL be created; the factory MUST be reused from deck data.

#### Scenario: Full-slide diagram legibility

- GIVEN any new `-diagram` slide at 1920x1080
- WHEN rendered
- THEN the single shared MR topology fills the slide with no overlapping elements and all node labels legible
- AND the slide shows no door narrative text beyond the diagram

#### Scenario: Shared topology reuse

- GIVEN the three new diagram slides
- WHEN their content data is inspected
- THEN all three use `buildMrDiagram({entry})` with the full-slide variant and no new topology code exists

### Requirement: R5 — Door-2 Hamiltonian restructure (REF-5)

Slide `d1-puerta2` SHALL restructure its text once the diagram moves to its own slide: the derivation path (canonical state → Hamilton-Jacobi path → loss), its meaning in MR terms, and a MORE visible physics-imposition point in the architecture (color/arrow/source-zone emphasis; a small flow diagram MAY be used). Density MUST fit 1920x1080 without overflow.

#### Scenario: Hamiltonian slide restructured

- GIVEN slide `d1-puerta2`
- WHEN rendered
- THEN the derivation chain and MR meaning are explicit and the physics-imposition emphasis is visually identifiable through color/arrow/source-zone cues within one 1920x1080 viewport

### Requirement: R6 — Door-1/3 diagram refinement (REF-6)

Door-1 and door-3 diagram instances SHALL be fine-tuned once isolated: spacing, overlaps, dimmed nodes, and cut labels fixed. The table row "1 f(h)^2 affinity (useEffect panel)" MUST remain unchanged.

#### Scenario: Legibility defects fixed

- GIVEN the door-1 and door-3 diagram slides
- WHEN visually reviewed against the prior captures
- THEN spacing/overlap/dim-node/label problems are resolved
- AND the f(h)^2 affinity table row is intact

### Requirement: RV — Verification pipeline unchanged

Verification MUST run the existing pipeline in place: `npm run build`, capture via `src/scripts/capture-slides.mjs` (Playwright, 1920x1080@2x), PDF via `src/scripts/export-pdf.mjs` to the SAME output file path/filename. The capture script MUST wait for MathJax and ReactFlow before screenshotting every slide, including the three new `-diagram` slides. Slide ids MUST be unique deck-wide. Each touched/created slide MUST receive visual review per capture (mapped to REF-1..REF-6), plus `npm run lint` and successful build.

#### Scenario: Capture waits for new slides

- GIVEN the three new diagram slides and the capture pipeline
- WHEN `capture-slides.mjs` runs
- THEN each slide, new and existing, is screenshotted only after MathJax and ReactFlow have settled

#### Scenario: Unique ids and same PDF filename

- GIVEN the deck now contains three new ids
- WHEN the deck builds and exports
- THEN all slide ids are unique and `presentacion_piml_v4_puertas_2026-09.pdf` is regenerated at the same output file path

## Out of scope

Modules d2..d6, lectura, and cierre are untouched. No new PDF infrastructure (existing `capture-slides.mjs` / `export-pdf.mjs`; only wait-time tweaks if needed). No version bump or filename change. No GitHub upload. No GUI changes beyond the deck content and components listed above.

## ADDED Requirements (round 4 — post-verify user feedback)

### Requirement: R7 — Stacked door-figure page

Slide `d1-figura` SHALL render its text (intro bullets + references) ABOVE the diagram, with the diagram occupying the full slide width below (kind `diagram` with `lead`), instead of the previous side-by-side split.

#### Scenario: Full-width diagram on the doors overview

- GIVEN slide `d1-figura` at 1920x1080
- WHEN rendered
- THEN the two intro lines and references appear above the figure
- AND the Diagrama 1 canvas spans the full content width with all node labels legible

### Requirement: R8 — Door-2 mathematical derivation page

A new slide `d1-puerta2-deriv` (kind `door`, module `d1`) MUST be inserted immediately after `d1-puerta2` and before `d1-puerta2-diagram`, with a 4-step breakdown: Hamilton equations derived from H, recomposition into the MR ODE, conservation argument (dH/dt = ∇Hᵀ J ∇H = 0), and the Euler–Lagrange variant (literal from the source document §F3). Display equations ≤ 4; Spanish academic register.

#### Scenario: Derivation page between door 2 and its diagram

- GIVEN the SLIDES array
- WHEN inspected
- THEN `d1-puerta2-deriv` sits between `d1-puerta2` and `d1-puerta2-diagram`
- AND the deck grows to 33 slides with unique ids

### Requirement: R9 — Hamiltonian entry visible in the door-2 diagram

The door-2 solo diagram MUST show where the Hamiltonian enters: the dashed structure box carries the equation chip `d/dt [q, p] = J ∇H_θ` inside the box, its title is enlarged (0.74rem), and the Física N[u]=0 box keeps its arrow into the structure.

#### Scenario: Physics entry unmistakable

- GIVEN the `d1-puerta2-diagram` slide at 1920x1080
- WHEN visually reviewed
- THEN the structure box displays the symplectic-flow equation inside the dashed box with the entry badge below it

### Requirement: R10 — Door-3 diagram tidy geometry

In the door-3 solo diagram, the Features box and the Física box form a clean bottom row (Física → Features horizontal edge; Datos drops into the Features top anchor) using declared target handles, with the Features→ψ_fis feedback edge routed through empty canvas (no box overlaps, no θ-label collision).

#### Scenario: No messy crossings

- GIVEN the `d1-puerta3-diagram` slide at 1920x1080
- WHEN visually reviewed
- THEN no edge overlaps a box, the θ label is collision-free, and the feedback edge reads as a clean bow through empty space

## ADDED Requirements (rounds 6–7b — HNN door-② final state)

### Requirement: R11 — Door-② HNN architecture trio (round 6)

The door-② strong form SHALL be presented as an HNN trio: slide `d1-puerta2` restructured as a 5-block architecture page (canonical state + physical H, f_θ ↦ H_θ as scalar learner, ★ physics entry with Autodiff + Hamilton equations + J, L_HNN(θ) + argmin θ*), a new derivation slide `d1-puerta2-deriv` from H to the MR ODE, and the door-② solo diagram rebuilt as a 10-stage HNN flow with a prediction branch (`buildHnnDiagram()`, colors: navy physical, teal data, purple HNN/autodiff/structure, orange L_HNN, red optimization). The damped system MUST NOT be mixed into door-② content.

#### Scenario: HNN architecture slide restructured

- GIVEN slide `d1-puerta2` at 1920x1080
- WHEN rendered
- THEN the four equation blocks and the message-key note present the HNN architecture (loss L_HNN(θ), argmin θ*) within the viewport with references visible

#### Scenario: Derivation page inserted

- GIVEN the SLIDES array
- WHEN inspected
- THEN `d1-puerta2-deriv` sits between `d1-puerta2` and `d1-puerta2-diagram` with the H → Hamilton-equation → MR-ODE → conservation chain

#### Scenario: Solo 10-stage flow with prediction branch

- GIVEN the `d1-puerta2-diagram` slide
- WHEN rendered
- THEN the flow shows the 10 training stages and a prediction branch chain ending in x(t), built by `buildHnnDiagram()`

### Requirement: R12 — HNN final adjustments (round 7)

The HNN slides and diagram SHALL carry the user's final adjustments: data targets named (q̇_n = ẋ_n, ṗ_n = m·ẍ_n, ṗ_n by finite differences when no acceleration is measured), H_θ explicitly NOT necessarily compared with energy labels (learned because its gradient must reproduce observed dynamics), energy conservation scoped to the conservative case c = 0 without external force, loss naming L_HNN(θ) everywhere, the physics-entry block (Autodiff + grad(H_θ) + Hamilton equations) highlighted with a purple panel and ★ badge, training and prediction visually separated (navy/teal chips + dashed divider), the integrator labeled "integrador numérico (preferiblemente simpléctico)", consistent notation (q, p, H_θ, θ, θ*, J, L_HNN), and larger diagram boxes/text scoped to this diagram.

#### Scenario: Data-derived targets named

- GIVEN the cost block of slide `d1-puerta2`
- WHEN read or rendered
- THEN the target derivation q̇_n = ẋ_n, ṗ_n = m·ẍ_n and the finite-difference fallback are stated

#### Scenario: Loss naming and conservation scoping

- GIVEN the HNN slides 7–9 and legend
- WHEN inspected
- THEN L_HNN(θ) is the only loss name, and the conservation statement scopes it to c = 0 without external force (in the HNN, for all θ)

#### Scenario: Physics entry panel and train/pred separation

- GIVEN the `d1-puerta2-diagram` slide at 1920x1080
- WHEN visually reviewed
- THEN the purple panel wraps Autodiff + Estructura Hamiltoniana + ★ badge, navy ENTRENAMIENTO and teal PREDICCIÓN chips with a dashed divider separate the rows, and the integrator reads "preferiblemente simpléctico"

#### Scenario: Notation audit and scoped sizing

- GIVEN the HNN trio and its diagram
- WHEN inspected
- THEN notation (q, p, H_θ, θ, θ*, J, L_HNN(θ)) is consistent, and the sizing bumps apply only under the `flow-hnn` CSS scope

### Requirement: R13 — HNN diagram vertical fill (round 7b)

The door-② solo diagram SHALL use the vertical canvas: mesh neuron gap enlarged (24→64), rows spread (bounding height 410→552), and the panel gains a `fitViewPadding` prop (default 0.12 preserved for other diagrams; `flow-hnn` passes 0.03) for a larger fitView zoom — structure unchanged.

#### Scenario: Taller mesh and spread rows

- GIVEN the `d1-puerta2-diagram` slide at 1920x1080
- WHEN visually reviewed
- THEN the mesh fills its block vertically, the rows use the freed blank bands, and no element overlaps

#### Scenario: Scoped fitView padding

- GIVEN the DeckFlowPanel component
- WHEN inspected
- THEN `fitViewPadding` defaults to 0.12 and only the HNN flow passes 0.03, leaving rounds 4–5 diagram tuning untouched
