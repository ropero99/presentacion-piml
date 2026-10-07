# Feature: Unificación de símbolos — un solo nombre por concepto (deck PIML)

**Estado:** cerrado y verificado
**Rama:** `feat/presentacion-notacion-regresores`
**Razón:** el revisor pide que la notación sea consistente para poder seguir el hilo conductor: un
símbolo por concepto en todo el documento. El caso concreto señalado: al cambiar de modelo, los pesos
cambiaban de nombre (`\mathbf{W}`, `\boldsymbol{\beta}`, `\mathbf{w}`…), lo que obliga al lector a
reaprender la notación en cada familia.

**Relación con `normalizacion-notacion-piml.md`:** ese documento fija la política **temporal**
(N1–N11: `()` continuo / `[]` discreto, argumento temporal explícito). Este fija la política de
**símbolos** (S1–S9). Juntos son la política notacional completa del deck.

---

## 1. Política de símbolos (S1–S9)

**S1 — `\theta` es el único símbolo de los parámetros del modelo.**
`\theta` es el vector de parámetros, sea el modelo lineal o no lineal; `\Theta` es el conjunto donde
vive (`\theta \in \Theta`). Los coeficientes de una regresión, los pesos de una red, los coeficientes
duales de un modelo kernel y las matrices de compuerta son todos `\theta` o **bloques con nombre de
`\theta`**.
→ `\boldsymbol{\beta}` desaparece (52 sitios), `\mathbf{w}` (SVR) y `\mathbf{a}` (kernel ridge) pasan
a `\theta`.

**S2 — Las matrices y sesgos internos de una arquitectura llevan nombre propio en negrita y se
declaran bloques de `\theta`.** `\mathbf{W}_i`, `\mathbf{U}_i`, `\mathbf{b}_i` (compuertas), con
`\theta = \{\mathbf{W}_\ell, \mathbf{b}_\ell\}_{\ell=1}^{L}` como declaración explícita.

**S3 — El modelo es `f_\theta`.** `f_\theta(\mathbf{x})` es siempre la red o el modelo paramétrico.
La rama física es `f_{fis}` y la rama residual del híbrido es `g_\theta`; ambos se declaran. No queda
ningún `f` sin subíndice.

**S4 — Toda pérdida se escribe `\mathcal{L}_{\cdot}(\theta)`.** `\mathcal{L}_{MSE}`,
`\mathcal{L}_{phys}`, `\mathcal{L}_{total}`, `\mathcal{L}_{ridge}`, `\mathcal{L}_{lasso}`.
→ `\mathcal{J}` (introducido por error en las slides de regresores) desaparece.

**S5 — Toda fuerza de penalización se escribe `\lambda_{\cdot}`.** `\lambda_{phys}`, `\lambda_{reg}`,
`\lambda_{svr}`, `\lambda_{rk}`.
→ `C_{svr}` desaparece.

**S6 — `\varepsilon` es siempre ruido o innovación, nunca una tolerancia.**
`\varepsilon_i` (ruido por muestra), `\boldsymbol{\varepsilon}` (vector de ruido), `\varepsilon[t]`
(innovación SARIMA). El tubo de la SVR es **`\varepsilon_{svr}`**.

**S7 — `\mathcal{N}` es sólo la distribución normal.** La ley física es **`\mathcal{F}[u] = 0`**.
→ 13 sitios de `\mathcal{N}[u]` pasan a `\mathcal{F}[u]`.

**S8 — `\mathbf{w}` queda reservado a las frecuencias espectrales del RFF** (`p(\mathbf{w})`), único
uso tras retirarlo de la SVR.

**S9 — El vector de entrada es `\mathbf{x}` también en los kernels y el GP.**
`\kappa(\mathbf{x}, \mathbf{x}_i)`, `\bar{f}(\mathbf{x})`, `\mathbf{k}(\mathbf{x})`; no queda ningún
`x` escalar como argumento de un modelo o kernel.

**Colisiones tipográficas declaradas (no renombradas, por costo/beneficio):**
- `\mathbf{D}` (matriz de diseño, E2) vs `\mathcal{D}` (datos, fórmula de Bayes): distinta fuente,
  declarado.
- `\mathcal{B}` (operador de rezago, E1) vs `\mathbf{B}` (matriz del SSM, E6): declarado como
  símbolo local.
- `\mathbf{U}` sin subíndice (factor del SVD, ridge) vs `\mathbf{U}_i` (matriz de compuerta): el
  subíndice distingue; declarado en la tabla.

---

## 2. Alcance ejecutado

| Archivo | Cambios | Sitios |
| --- | --- | --- |
| `src/data/deckContent.js` | β→θ, `\mathcal{J}`→`\mathcal{L}`, `\mathcal{N}[`→`\mathcal{F}[`, SVR (`\mathbf{w}`→`\theta`, sin `b`, `C_{svr}`→`\lambda_{svr}`, tubo→`\varepsilon_{svr}`), kernel ridge (`a_i`, `\mathbf{a}`→`\theta`), `x`→`\mathbf{x}` en kernel/GP, `f`→`f_\theta`, fila de notación reescrita | 138 |
| `src/deck/diagrams/mrPipeline.js` | `\mathcal{N}[`→`\mathcal{F}[`; `\{W_\ell, b_\ell\}`→`\{\mathbf{W}_\ell, \mathbf{b}_\ell\}` | 3 |
| `GUION.md` | mismos renames (LaTeX con una sola barra, es markdown) | 19 |

**Reemplazos deterministas** con exigencia de que cada patrón exista (un patrón ausente se reporta, no
se ignora a ciegas), más un control de aceptación al final. El guion se incluyó porque dejar su
notación desalineada reintroduce exactamente la inconsistencia que este cambio elimina; su
re-sincronización **estructural** (24 slides descritas frente a 40 reales) sigue pendiente y es otra
tarea.

## 3. Definición de cumplido — control de aceptación

```bash
grep -c '\\beta'          src/data/deckContent.js   # 0
grep -c '\\mathcal{J}'    src/data/deckContent.js   # 0
grep -c 'C_{svr}'         src/data/deckContent.js   # 0
grep -c '\\mathcal{N}\['  src/data/deckContent.js   # 0
grep -c '\\mathbf{a}'     src/data/deckContent.js   # 0
grep -c '\\mathbf{w}'     src/data/deckContent.js   # 1 (sólo p(w) del RFF)
grep -c '\\mathcal{F}\['  src/data/deckContent.js   # 13
```

Más: **0 barras invertidas sueltas** en el archivo (control del incidente de escape, ver
`regresores-base-d3.md` §6).

## 4. Evidencia de verificación

- `npm run lint` y `npm run build` en verde.
- Auditoría Playwright de las **40 slides**: **0 errores de MathJax** y 0 recorte real en todo lo
  tocado. Persisten **sólo los 3 recortes heredados de `main`** (`d1-puerta2` +1,7 px,
  `d1-puerta2-deriv` +1,8 px, `d1-puerta2-lagrange-deriv` +9,3 px).
- Solapamiento de nodos ReactFlow: sólo el panel de fondo intencional `hnn-panel-fisica` de la
  slide 12.
- Inspección visual `slide-21.png` (SVR): `f_\theta`, `\lVert \theta \rVert_2^2`, `\lambda_{svr}`,
  `\varepsilon_{svr}` renderizan correctamente.

**Incidente de maquetación resuelto:** la fila de notación creció 3 líneas (+81 px) al añadir las
declaraciones y desplazó la última fila fuera del área. Se recortaron cuatro celdas y la slide 2
volvió a su estado correcto: última fila **12,6 px por encima** del borde, sin recorte.

## 5. Pendientes reportados
- La política **no** se ha aplicado a un anexo o documento externo a este repositorio; si el capítulo
  de la tesis usa `\beta` o `C_{svr}`, la correspondencia está en la tabla de notación de la slide 2.
- `GUION.md` sigue desalineado en estructura (24 slides descritas vs 40 reales).
