# Delta for presentation-deck — v4-diagram-space

Scope: enlarges diagram space on the four diagram-bearing slides (03 `d1-figura`, 06 `d1-puerta1-diagram`, 09 `d1-puerta2-diagram`, 11 `d1-puerta3-diagram`) and introduces scoped typeset math inside equation-bearing diagram nodes. Sizing reuses the round-7b recipe generalized to per-flow scopes; topology, edge routing, and non-target slides remain untouched.

## ADDED Requirements

### Requirement: R14 — Diagram-space utilization via per-flow scopes (slides 03/06/11)

Slides 03, 06, and 11 SHALL apply the round-7b sizing recipe generalized through per-flow `className` scopes (`.flow-d1`, `.flow-mr1`, `.flow-mr3`) mirroring the existing `.flow-hnn` scope: vertical spread of diagram geometry (door-1: enlarged neuron gap plus lower θ/loss/fis rows; slide-03: wider column steps; door-3: spread between the network cluster and the feat/fis block), reduced `fitViewPadding` (~0.04–0.06 for 06/11, ~0.05 for 03), font/box bumps in every new scope, and the `ψ_fis(x)` neuron grown 46→52px in the door-3 scope only. Ordering SHALL be spread → padding → font bumps. Slide 09 (HNN) MAY receive micro changes only: a `fitViewPadding` cut ≤0.02, preserving the round-7b layout. No topology (`buildMrDiagram`, `buildHnnDiagram`) or edge-routing changes are permitted.

#### Scenario: Full-width vertical use, no overlaps or cut labels

- GIVEN slides 03/06/11 at 1920x1080
- WHEN the diagrams are rendered and visually reviewed
- THEN each uses the freed vertical space (no ~45% fill on 06, no ~250px dead band on 11)
- AND no element overlaps and no label is cut by its node boundary

#### Scenario: Scoped CSS only, other diagrams unchanged

- GIVEN the new flow scopes in `deck.css`
- WHEN non-target diagrams (rounds 4–7b states) are rendered
- THEN their rendering is pixel-equivalent to the accepted baseline (scopes are additive)
- AND `.flow-hnn` rules for slide 09 are not altered beyond the optional ≤0.02 padding cut

#### Scenario: psi_fis label inside its neuron (slide 11)

- GIVEN the door-3 diagram with the 52px `ψ_fis(x)` neuron
- WHEN visually reviewed at 1920x1080
- THEN the label is fully inside its neuron circle with no overflow

### Requirement: R15 — Scoped LaTeX in equation-bearing nodes (applied after R14)

Equation-bearing node texts SHALL be typeset with MathJax inside the existing `MathJaxContext` (door-1 loss line + θ label; HNN estructura, autodiff ∂H_θ/∂q + ∂H_θ/∂p, and prediction line `J∇H_θ*`; slide-03 p1/p4/ml lines where equations appear). Neurons, badges, and short chips MUST remain unicode (no typeset math in ~46–52px elements). After typesetting, the flow SHALL re-fit via a fitView refit hook so nodes post-mount height growth does not leave a stale fitView scale. The capture pipeline MUST still wait for math settle before screenshotting diagram slides.

#### Scenario: Equation nodes render typeset math

- GIVEN slides 03/06/09/11 rendered after P1
- WHEN the equation-bearing nodes are inspected
- THEN each contains an `mjx-container` (typeset), not unicode placeholders, while neurons/badges/short chips remain unicode without overflow

#### Scenario: fitView re-runs after typeset

- GIVEN MathJax grows node heights after mount
- WHEN typesetting completes on a flow
- THEN fitView refits once math is settled, and captures show no clipped nodes and no stale-scale blank bands on 03/06/09/11

## MODIFIED Requirements

### Requirement: RV — Verification pipeline unchanged

Verification MUST run the existing pipeline in place: `npm run build`, capture via `src/scripts/capture-slides.mjs` (Playwright, 1920x1080@2x), PDF via `src/scripts/export-pdf.mjs` to the SAME output file path/filename. The capture script MUST wait for MathJax and ReactFlow before screenshotting every slide, including the three new `-diagram` slides. Slide ids MUST be unique deck-wide. Each touched/created slide MUST receive visual review per capture (mapped to REF-1..REF-6), plus `npm run lint` and successful build.
(Previously: RV was part of the round3 change; unchanged pipeline now verified against the sizing (R14) and LaTeX (R15) slides, with scoped-additive CSS guaranteeing non-target captures are unchanged.)

#### Scenario: Capture waits for new slides

- GIVEN the three new diagram slides and the capture pipeline
- WHEN `capture-slides.mjs` runs
- THEN each slide, new and existing, is screenshotted only after MathJax and ReactFlow have settled

#### Scenario: Unique ids and same PDF filename

- GIVEN the deck now contains three new ids
- WHEN the deck builds and exports
- THEN all slide ids are unique and `presentacion_piml_v4_puertas_2026-09.pdf` is regenerated at the same output file path

#### Scenario: Non-target captures unchanged by scoped CSS

- GIVEN additive per-flow CSS scopes for slides 03/06/11 and the R15 typeset scope
- WHEN the 33 captures are regenerated
- THEN slides other than 03/06/09/11 are visually identical to the previous captures (≤2 tuning passes per touched slide; build + lint pass; PDF regenerated in place)
