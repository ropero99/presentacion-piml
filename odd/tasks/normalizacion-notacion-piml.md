# Feature: Normalización notacional — tiempo continuo/discreto y homogeneidad (PIML deck)

**Estado:** cerrado y verificado (rama `feat/presentacion-notacion-regresores`)
**Razón:** revisor de la tesis exige (a) que toda magnitud dependiente del tiempo lo muestre de forma
explícita en todo el documento, (b) `()` para tiempo continuo y `[]` para tiempo discreto, de forma
consistente, sin que las funciones de costo queden ambiguas, y (c) simbología homogénea.

**Alcance:** `src/data/deckContent.js` (36 slides), `src/deck/diagrams/*`, `GUION.md`.
**Fuera de alcance:** re-sincronizar la estructura de `GUION.md` con las 36 slides actuales (el guion
describe una versión de 24 slides) — se reporta como pendiente aparte; aquí sólo se normaliza la notación.

---

## 1. Canonical notation policy (normativa vinculante para este cambio)

**N1 — Continuous time uses parentheses `( )`.**
`x(t)`, `\dot{x}(t)`, `\ddot{x}(t)`, `q(t)`, `p(t)`, `T_{in}(t)`, `\delta(t)`, `\omega(t)`,
`\mathbf{h}(t)`, `u(t,\mathbf{x})`, `E(t)`, `r_\theta(t)`, `\hat{x}_\theta(t)`, `\hat{T}_{in}(t)`,
`I_{sol}(t)`, `\dot{Q}_{int}(t)`, `P_{HVAC}(t)`, `P_{pv}(t)`, `u_j(t)`, `c_j(t)`, `y(t)`.

**N2 — Discrete time uses square brackets `[ ]` with an integer index.**
Sequence index `t`, `t-1`: `y[t]`, `\hat{y}[t]`, `\hat{y}[t-1]`, `\mathbf{x}[t]`, `\mathbf{h}[t]`,
`\mathbf{h}[t-1]`, `\mathbf{z}[t]`, `\mathbf{z}[t-1]`, `\mathbf{u}[t]`, `\mathbf{r}[t]`, `\mathbf{o}[t]`,
`\mathbf{i}[t]`, `\mathbf{f}[t]`, `\mathbf{c}[t]`, `\mathbf{c}[t-1]`, `\tilde{\mathbf{c}}[t]`,
`\tilde{\mathbf{h}}[t]`, `\breve{\mathbf{h}}[t]`, `\breve{\mathbf{h}}[t-1]`, `\tilde{\mathbf{z}}[t]`,
`\varepsilon[t]`, `x[t]`.
Forecast horizon index `j` and offsets: `\hat{y}[j]`, `\hat{y}[j+1]`, `\hat{y}[j-1]`, `y[\tau+1]`, `y[\tau+h]`.
Sequence elements in E4 convolution: `f[i]`, `s[t-\breve{d}i]`, and `(s *_{\breve{d}} f)[t]`.
SARIMA: `y[t]`, `\varepsilon[t]`.
Nested superscripts keep their slot after the bracket: `\mathbf{z}[t]^{phys}`, `\mathbf{z}[t-1]^{phys}`.

**N3 — Sampling instants of continuous signals keep the subscript `t_i`, `t_j`, `t_n`, `t_{n,j}`
and the continuous function is evaluated there with parentheses: `x(t_i)`, `\dot{x}(t_n)`, `u(t_i,\mathbf{x}_i)`.**
A sampling instant is a *value of the continuous variable* `t`, not a discrete sequence argument.

**N4 — Non-time indices keep the subscript.**
Coefficients, slack variables, component/feature/band indices, bus indices, and generic supervised
samples in formulations where time is not an argument: `a_i`, `\xi_i`, `s_i`, `c_j`, `r(t)` (EMD residue),
`\boldsymbol{\phi}_k`, `\rho_k`, `K`, `N_f`, `x_i`/`y_i` inside SVR, kernel ridge and conformal formulas,
`V_i`, `V_j`, `G_{ij}`, `B_{ij}`, `\theta_{ij}`, `x_m`, `t_i`, `t_j`, `t_n`, `t_{n,j}`.

**N5 — Non-time arguments use parentheses.**
`\mathcal{L}_{total}(\theta)`, `\mathcal{L}_{HNN}(\theta)`, `\mathcal{L}_{MSE}(\theta)`,
`f_\theta(\mathbf{x})`, `H(q(t),p(t))`, `\kappa(x,x_i)`, `\mathrm{Att}(\mathbf{Q},\mathbf{K},\mathbf{V})`.
`**;** separates data from parameter sets` and is declared: `f_{RNN}(\mathbf{x}[t],\mathbf{h}[t-1];\Theta_r)`,
`\mathcal{R}_{phys}(t_{n,j};\Theta)`, `g_\theta(\mathbf{X};\mathcal{P}_{fis})`.
Parameter *vector* is `\theta`, parameter *set* is `\Theta`; a loss function is always applied to `\theta`
(`\mathcal{L}_{total}(\theta)`, never `\mathcal{L}_{total}(\Theta)`).

**N6 — Square brackets that are NOT discrete time stay exactly as they are and are declared:**
`\mathcal{N}[u]` (differential operator), vector/concatenation `[\,x,\ \psi_{fis}\,]`,
interval `[\hat{y}-\hat{q},\ \hat{y}+\hat{q}]`, matrix `bmatrix`, grouping `\left[\dots\right]`.

**N7 — Same object, same form, everywhere.**
The MR trajectory is `x(t)`; it is never written `x_i`, `x_n`. Evaluations are `x(t_i)`, `\dot{x}(t_n)`.

**N8 — Terminology and suffixes are uniform.**
- Losses are called **"función de pérdida"** (headings, lemas, bullets). Do not use "función de costo"
  as a heading/term anymore; where the text must acknowledge the synonym, write "función de pérdida
  (costo)" once.
- Physics weight/residual/loss share the `phys` suffix: `\lambda_{phys}`, `\mathcal{R}_{phys}`,
  `\mathcal{L}_{phys}` (replaces `\mathcal{L}_{physics}` everywhere: deck, diagrams, GUION).
- The physics branch/model is `f_{fis}` everywhere (replaces `f_{fisica}`), consistent with
  `\psi_{fis}`, `\mathcal{P}_{fis}`, `m_{fis}`, `\kappa_{fis}`.
- `\hat{y}` is the scalar forecast, `\hat{\mathbf{y}} \in \mathbb{R}^h` the multi-step vector;
  its components are `\hat{y}[j]`.

**N9 — Canonical coordinates `q`, `p` are plain italic (the MR has 1 DoF).**
Replace every `\mathbf{q}` → `q`, `\mathbf{p}` → `p` (deck, GUION, diagrams). Bold stays reserved for
data/state tensors: `\mathbf{x}`, `\mathbf{X}`, `\mathbf{h}`, `\mathbf{z}`, `\mathbf{W}`, `\mathbf{U}`,
`\hat{\mathbf{y}}`, `\mathbf{K}_{GP}`, `\mathbf{k}(x)`. Attention uses `\mathbf{Q},\mathbf{K},\mathbf{V}`
(uppercase) — do not touch them.
In the scalar Legendre product drop the transpose: `\mathbf{p}(t)^{\top}\dot{\mathbf{q}}(t)` →
`p(t)\,\dot{q}(t)` (correct for 1 DoF; the surrounding `conn` already states the MR is 1 DoF).

**N10 — Only *signals* lose their `_t` subscript.**
`\mathcal{L}_{total}`, `\Omega_T`, `\mathcal{L}_{EC}`, `t_i`, `z_{bot}`, `dW_t` (SDE increment) and any
label subscript are untouched. `\sum_t` becomes `\sum_t` with discrete `[t]` objects inside.

---

## 2. Work items

- [x] **T1 — Slide 2 "Notación": declare the temporal convention.**
  Add a first data row (before "Series y marco general") with the `()`/`[]` rule (N1–N6) in Spanish.
  Update the existing rows: `$y_t$` → `$y[t]$`, `$\mathbf{z}_t$` → `$\mathbf{z}[t]$`,
  `$\breve{\mathbf{h}}_t$` → `$\breve{\mathbf{h}}[t]$`, `$\mathbf{u}_t$`/`$z_t$` → `$\mathbf{u}[t]$`/`$\mathbf{z}[t]$`,
  `$\mathcal{L}_{physics}$` → `$\mathcal{L}_{phys}$`, `$f_{fisica} \equiv f_{fis}$` → `$f_{fis}$`.
  Extend the "Símbolos locales" row with: instantes `t_i` y muestras `i` (N3/N4), secuencias de la
  convolución E4 `f[i]`, `s[t]`, y la nota de que `\mathcal{N}[u]` y los corchetes de vector/intervalo
  no son tiempo discreto.

- [x] **T2 — Normalize `src/data/deckContent.js`.**
  1. `d1-mr` (línea ~121): `\mathbf{x}_i = (t_i, x_i, \dot{x}_i)` → `(t_i, x(t_i), \dot{x}(t_i))`.
  2. `d1-puerta1` (línea ~149): `\mathcal{L}_{total}(\Theta)` → `(\theta)`; `f_\theta(t_i) - x_i` →
     `f_\theta(t_i) - x(t_i)`; heading/lema "Función de costo" → "Función de pérdida".
  3. `d1-puarta2*`: N9 plain `q`, `p` everywhere (equations, `derivation` chains, `bridge` chains,
     `conn`, `notes`, table cells, legends); conn `\dot{x}_n`, `\ddot{x}_n` → `\dot{x}(t_n)`, `\ddot{x}(t_n)`;
     step-3 chains read `m\ddot{q}(t)+k\,q(t)=0 \Rightarrow m\ddot{x}(t)+k\,x(t)=0` (the `conn` explains
     `q(t)\equiv x(t)`); Legendre products without `^\top`.
  4. `d1-puerta3`: `\psi_{fis} = [x, \dot{x}, E]` → `[x(t), \dot{x}(t), E(t)]` and
     `E = \tfrac12 m\dot{x}^2 + \tfrac12 kx^2` → `E(t) = \tfrac{1}{2}m\dot{x}(t)^2 + \tfrac{1}{2}k\,x(t)^2`;
     loss target `y_i` → `y(t_i)`; `\mathbf{z}_{bot} = E(\mathbf{x})` → `E(t)`;
     heading "Función de costo" → "Función de pérdida".
  5. `d1-puerta4`, `lectura`, diagrams legends: `f_{fisica}` → `f_{fis}`; legends `θ*` (unicode) → `$\theta^{*}$`.
  6. `d2-figura`: "la serie $y(t)$" → "$y[t]$".
  7. `d2-mat-1`: F1 `u_i` → `u(t_i, \mathbf{x}_i)`; F2 recurrency and `\mathcal{L}_{EC}` → `[t]`.
  8. `d2-mat-2`: F3 Euler–Lagrange and F4 PhyDNet → plain `q` and `[t]` (`\mathbf{z}[t]`, `\mathbf{z}[t-1]`).
  9. `d2-mat-3`: RFF `\mathbf{x}_t` → `\mathbf{x}[t]` (2×).
  10. `d3-mat-1`: SARIMA `y_t`, `\varepsilon_t` → `y[t]`, `\varepsilon[t]`. SVR keeps N4 subscripts.
  11. `d3-mat-2`: all LSTM/GRU gates and states → `[t]`, `[t-1]`; conn `\breve{\mathbf{h}}_t = f_{RNN}(\tilde{\mathbf{z}}_t,\breve{\mathbf{h}}_{t-1};\Theta_r)` → `[t]`.
  12. `d3-mat-3`: E4 → `(\mathbf{s} *_{\breve{d}} \mathbf{f})[t] = \sum_{i=0}^{\breve{k}-1} f[i]\, s[t-\breve{d}\,i]`.
  13. `d3-mat-4`: E6 discretization conn → `\mathbf{h}[t] = \bar{\mathbf{A}}\,\mathbf{h}[t-1] + \bar{\mathbf{B}}\,x[t]`;
      E7 → `y[\tau+1], \dots, y[\tau+h]`; E8 keeps the continuous EMD/VMD formulation and its `conn`
      gains the clause "se implementa sobre la serie muestreada $y[t]$".
  14. `d4-mat-1`: `M\,\frac{d\hat{\omega}}{dt}` → `M\,\frac{d\hat{\omega}(t)}{dt}`.
  15. `d4-mat-2`: `\hat{y}_{j\pm1}`, `\hat{y}_j` → `\hat{y}[j\pm1]`, `\hat{y}[j]` (both losses).
  16. `d4-mat-3`: `\mathcal{L}_{physics}` → `\mathcal{L}_{phys}` in the `conn`.
  17. `d5-mat-1`, `d5-mat-2`, `d6-mat-*`: `\mathcal{L}_{physics}` → `\mathcal{L}_{phys}`;
      `d6-mat-1` `\mathbf{z}_t = [\boldsymbol{\phi}_1(\mathbf{x}_t),\dots]` → `[t]`.
  18. Every heading/lema/bullet that says "función de costo" → "función de pérdida".
  19. All remaining `\mathcal{L}_{physics}` (8×), `f_{fisica}` (6×), `\mathbf{q}` (123×),
      `\mathbf{p}` (54×) in this file.

- [x] **T3 — Normalize the diagrams.**
  `mrPipeline.js`: `125` and `316` `m\ddot{x} + c\dot{x} + k\,x = 0` → `m\,\ddot{x}(t) + c\,\dot{x}(t) + k\,x(t) = 0`;
  `135`/`265` `(t, x, \dot{x})` → `(t, x(t), \dot{x}(t))` (in `cmpData`, wrap the whole line in `$…$`
  so it typesets: `$(t, x(t), \dot{x}(t))\ \to\ \mathcal{L}_{MSE}$`);
  `188` `\hat{x}_\theta(t)` already fine, `(\hat{q},\hat{p})` fine once `q`,`p` are plain;
  `234` `\frac{d}{dt}\,[\mathbf{q},\mathbf{p}]` → `[q,\ p]`; `291` add `(t)`: `$\dot{\hat{x}}_\theta(t),\,\ddot{\hat{x}}_\theta(t) \to r_\theta(t)$`;
  `334`/`337` `\mathcal{L}_{physics}` → `\mathcal{L}_{phys}`; `493` already has `(t)` — keep as reference form.
  `PuertasFisicaFlow.jsx`: `29` `\mathcal{L}_{physics}` → `\mathcal{L}_{phys}`;
  `62` `$f_{fisica}(x) + g_\theta(x)$` → `$f_{fis}(\mathbf{x}) + g_\theta(\mathbf{x})$`;
  `73` `$\hat{y} = f_\theta(x)$` → `$\hat{y} = f_\theta(\mathbf{x})$`.
  Sweep every other diagram file for `$…$` math and apply N1–N10.

- [x] **T4 — Normalize `GUION.md` with exactly the same rules.**
  Rewrite the notation paragraph (línea ~46) so it *states* the `()`/`[]` convention aloud and uses
  `y[t]`, `\mathbf{z}[t]`, `\mathbf{u}[t]`, `\mathcal{L}_{phys}`, `f_{fis}`.
  Line ~62 (puerta 1): `$L_{total}$`, `$L_{MSE}$` → `$\mathcal{L}_{total}$`, `$\mathcal{L}_{MSE}$`;
  `$L_{física}$` → `$\mathcal{L}_{phys}$`; `\mathcal{L}_{total}(\Theta)` → `(\theta)`;
  `f_\theta(\mathbf{x}_i) - y_i` → `f_\theta(t_i) - x(t_i)` (the model is `\hat{x}(t)=f_\theta(t)`,
  see `d1-puerta1`); `r_\theta(\mathbf{x}_j)` → `r_\theta(t_j)`.
  Line ~166 `$L_{MSE}$` → `$\mathcal{L}_{MSE}$`.
  Apply N2 to every discrete subscript (`\mathbf{z}_t` 15×, `\mathbf{x}_t` 9×, `\mathbf{u}_t` 6×,
  `\mathbf{h}_t` 6×, `\mathbf{h}_{t-1}` 5×, `\hat{y}_t`, `y_t`, `\varepsilon_t`, `\tilde{\mathbf{h}}_t`,
  `\tilde{\mathbf{c}}_t`, `\mathbf{c}_t`, `\mathbf{c}_{t-1}`, `\mathbf{r}_t`, `\mathbf{o}_t`, `\mathbf{i}_t`,
  `\mathbf{f}_t`, `\sum_t`, `\hat{y}_{t-1}`, `\mathbf{\breve{h}}_t` → `\breve{\mathbf{h}}[t]`),
  N3 for `x(t_i)`/`u(t_i,\mathbf{x}_i)`, N9 plain `q`/`p` (5×/3×), and every
  `\mathcal{L}_{physics}` (6×) / `f_{fisica}` (3×).

- [x] **T5 — Verification (evidence required).**
  `npm run lint`, `npm run build` must pass; residual greps in §3 must return 0; then
  `node src/scripts/capture-slides.mjs` and visually check slides 2, 4, 7, 9, 10, 24 (new numbering:
  2=Notación, 4=Datos disponibles, 7=Puerta ②, 24=E6/E7/E8) for rendering regressions.

  **Evidence (2026-10-06, rama `feat/presentacion-notacion-regresores`):**
  - `npm run lint` → PASS (oxlint, sin errores).
  - `npm run build` → PASS (vite 376 ms).
  - Greps residuales §3 → 0 en todos, salvo la excepción documentada más abajo.
  - `node src/scripts/capture-slides.mjs` → 36/36 PNG frescos, sin error.
  - Inspección visual `slide-02.png`: la fila nueva "Convención temporal" entra completa, la tabla no
    desborda el marco. `slide-07.png`: `q(t)`, `p(t)` planos, `H(q(t),p(t))`, `\mathcal{L}_{HNN}(\theta)`
    y `\theta^{*}` renderizan correctamente.

---

## 3. Definition of done — residual greps (all must return 0)

```bash
grep -rn "mathcal{L}_{physics}" src GUION.md
grep -rn "f_{fisica}"           src GUION.md
grep -rnE '\\mathbf\{(q|p)\}'   src GUION.md
grep -rnE '(hat\{y\}|varepsilon|mathbf\{(h|x|z|u|r|o|i|f|c)\}|breve\{\\mathbf\{h\}\}|y)_\{?t(-1)?\}?\}' src GUION.md
grep -rn "L}_{total}(\\\\Theta)" src GUION.md
grep -rn 'función de costo'     src GUION.md
grep -rnE '\$x_i\$|[^\\mathbf]x_i' src/data/deckContent.js   # scalar x_i must be gone; \mathbf{x}_i is allowed
```
Allowed exceptions (documented in N2/N4): `dW_t`, `\Omega_T`, `\mathcal{L}_{total}`,
`\mathcal{L}_{EC}`, `t_i`/`t_j`/`t_n`, `z_{bot}`, `\sum_t`, label subscripts.

**Known false positive of the last grep (verified, not a residual).** The pattern
`[^\\mathbf]x_i` is deliberately over-inclusive and matches exactly one site:
`src/data/deckContent.js:614`, inside the F5 kernel-ridge formula
`\hat{f}(x) = \sum_{i=1}^{N} a_i\, \kappa(x, x_i)`. N4 explicitly keeps `x_i`/`y_i` inside SVR,
kernel-ridge and conformal formulas, so this line is policy-compliant and must not be changed.
An N4-compliant run therefore expects exactly **1** match on that grep and 0 on all the others.

## 4. Pending (out of scope, reported to the user)
- `GUION.md` still describes a 24-slide structure while the deck has 36: slide numbering and titles in
  the script do not match the current deck. Requires a separate re-authoring pass.
