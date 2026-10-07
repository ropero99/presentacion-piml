# Feature: Regresores base en D3/E2 — mínimos cuadrados, máxima verosimilitud, ridge y lasso

**Estado:** cerrado y verificado
**Rama:** `feat/presentacion-notacion-regresores`
**Iteración 2:** el usuario pidió **extender cada modelo a su propia slide densa**. Las dos slides
resumen originales (`d3-reg-1` formulaciones y `d3-reg-2` soluciones) fueron **reemplazadas** por cuatro
slides, una por modelo, con regresión lineal y mínimos cuadrados **fusionadas** en una sola.
Deck: 38 → **40 slides**. `GUION.md` queda diferido por decisión explícita del usuario.
**Razón:** el revisor de la tesis pide incorporar la matemática de los modelos regresores base en la
presentación. Se arranca por los cuatro cimientos que sostienen la familia E2 (ML clásico) del
Diagrama 3: mínimos cuadrados ordinarios (OLS), máxima verosimilitud (MLE), ridge ($\ell_2$) y
lasso ($\ell_1$). La idea es fijar primero el nivel base y, en iteraciones posteriores, extender a
otros regresores.

**Alcance:** `src/data/deckContent.js` (2 slides nuevas + fila de notación).
**Fuera de alcance:** `GUION.md` (el usuario pidió dejarlo para después); otros regresores distintos
de los cuatro base; re-sincronizar la estructura del guion con las 36 slides.

**Decisión de ubicación (delegada por el usuario):** dos slides nuevas inmediatamente después de
`d3-mat-1`, con el mismo `kicker` (`5a · Matemática del Diagrama 3`) y `tone: orange` de la sección
D3. Justificación: los cuatro modelos son la base estadística de E2 (ML clásico sobre features
tabulares duras) y `d3-mat-1` ya cierra E1 (SARIMA) y abre E2 (SVR/ensambles) sin espacio para
cuatro formulaciones más.

---

## 1. Política notacional vinculante para este cambio

Se hereda íntegra la política del feature `normalizacion-notacion-piml.md` (N1–N10). Reglas nuevas:

**R1 — El índice de muestra no es tiempo.** En las cuatro formulaciones, `i` numera muestras y
`j = 1..d` numera variables. `y_i`, `x_{ij}`, `\beta_j`, `\varepsilon_i` van con **subíndice**
(N4), nunca con corchetes: los corchetes están reservados para tiempo discreto (N2). Esto es
coherente con la SVR de `d3-mat-1`, que ya usa `y_i`/`\mathbf{x}_i`.

**R2 — Colisión de `\mathbf{X}` resuelta.** El deck ya reserva `\mathbf{X} \in \mathbb{R}^{\tau \times d}`
para la ventana de entrada. La matriz de diseño de la regresión se escribe **`\mathbf{D} \in \mathbb{R}^{N \times d}`**
(símbolo local nuevo, declarado en la tabla de notación), nunca `\mathbf{X}`.

**R3 — Colisión de `\lambda` resuelta.** `\lambda_{phys}` (peso físico) y `\lambda_{rk}` (kernel ridge)
ya existen. El parámetro de regularización de ridge y lasso se escribe **`\lambda_{reg}`**, único para
los dos, y la norma ($\ell_1$ vs $\ell_2$) es lo que los distingue.

**R4 — Colisión de `\varepsilon` resuelta por índice.** La innovación SARIMA es `\varepsilon[t]`
(corchete, tiempo discreto); el ruido por muestra del modelo de regresión es `\varepsilon_i`
(subíndice, R1). Misma letra, contexto y convención distintos, declarados ambos.

**R5 — El sesgo se absorbe.** `\beta_0` se absorbe aumentando `\mathbf{x}_i` con un 1, de modo que el
modelo es `f_{\boldsymbol{\beta}}(\mathbf{x}) = \mathbf{x}^{\top}\boldsymbol{\beta}` con
`\boldsymbol{\beta} \in \mathbb{R}^{d}`. Se declara en el `conn` para que `d` no quede ambiguo.

**R6 — Toda notación nueva se declara.** Filas nuevas en la tabla de la slide 2 para
`\boldsymbol{\beta}`, `\mathbf{D}`, `\lambda_{reg}`, `\varepsilon_i` y el caso ortonormal `(\cdot)_+`.

---

## 2. Contenido matemático acordado

### Slide B1 — `d3-reg-1` · "E2 — Regresores base (I): formulaciones"

| # | heading | núcleo de la fórmula |
| --- | --- | --- |
| 1 | E2 · Mínimos cuadrados ordinarios (OLS) | `\hat\beta_{OLS} = \arg\min_\beta \sum_i (y_i - \mathbf{x}_i^\top\beta)^2 = \arg\min_\beta \lVert\mathbf{y}-\mathbf{D}\beta\rVert_2^2` |
| 2 | E2 · Máxima verosimilitud (MLE) con ruido gaussiano | `y_i = \mathbf{x}_i^\top\beta + \varepsilon_i`, `\varepsilon_i \sim \mathcal{N}(0,\sigma^2)`; `-\log p = \frac{N}{2}\log(2\pi\sigma^2) + \frac{1}{2\sigma^2}\lVert\mathbf{y}-\mathbf{D}\beta\rVert_2^2` |
| 3 | E2 · Ridge ($\ell_2$) | `\lVert\mathbf{y}-\mathbf{D}\beta\rVert_2^2 + \lambda_{reg}\lVert\beta\rVert_2^2` |
| 4 | E2 · Lasso ($\ell_1$) | `\lVert\mathbf{y}-\mathbf{D}\beta\rVert_2^2 + \lambda_{reg}\lVert\beta\rVert_1` |

### Slide B2 — `d3-reg-2` · "E2 — Regresores base (II): solución cerrada y geometría"

| # | heading | núcleo de la fórmula |
| --- | --- | --- |
| 1 | OLS — ecuación normal y condición de rango | `\hat\beta = (\mathbf{D}^\top\mathbf{D})^{-1}\mathbf{D}^\top\mathbf{y}`, única sii `\mathrm{rango}(\mathbf{D}) = d` |
| 2 | MLE — equivalencia con OLS y varianza | `\hat\beta_{MLE} = \hat\beta_{OLS}`, `\hat\sigma^2_{MLE} = \frac{1}{N}\lVert\mathbf{y}-\mathbf{D}\hat\beta\rVert_2^2` |
| 3 | Ridge — forma cerrada y contracción | `(\mathbf{D}^\top\mathbf{D} + \lambda_{reg}\mathbf{I})^{-1}\mathbf{D}^\top\mathbf{y}`; factor `s_k^2/(s_k^2+\lambda_{reg})` |
| 4 | Lasso — KKT, esparsidad y geometría | `\hat\beta_j = \mathrm{sign}(\hat\beta^{OLS}_j)(\|\hat\beta^{OLS}_j\|-\lambda_{reg})_+` (diseño ortonormal); politopo `\lVert\beta\rVert_1 \le c` |

**Puntos pedagógicos obligatorios en los `conn`:**
1. MLE **no cambia** el estimador de `\beta` bajo ruido gaussiano: justifica el error cuadrático y
   añade varianza e inferencia. Si el ruido no es gaussiano la equivalencia se rompe.
2. Ridge nunca anula coeficientes (contracción suave, reparte peso entre variables correlacionadas);
   lasso sí los anula (vértices del politopo $\ell_1$), de ahí la selección de variables.
3. La patología que ambos corrigen (`\mathbf{D}^\top\mathbf{D}` singular por colinealidad o `d > N`)
   se declara explícitamente en la slide B2.
4. Puente con PIML: la penalización de ridge/lasso es el análogo lineal del término penalizado de la
   puerta ① (`\lambda_{phys}\,\mathcal{L}_{phys}`): restringe funciones admisibles sin imponerlas.

**Referencias a declarar en `refs`** (a verificar contra la bibliografía de la tesis):
Hoerl & Kennard, *Technometrics* 12(1), 1970 · Tibshirani, *JRSS-B* 58(1), 1996 ·
Hastie, Tibshirani & Friedman, *ESL* 2.ª ed., 2009, cap. 3 · Zou & Hastie, *JRSS-B* 67(2), 2005.

---

## 3. Work items

- [x] **B1 — Crear las 2 slides en `src/data/deckContent.js`**, insertadas tras `d3-mat-1`
  (ids `d3-reg-1` y `d3-reg-2`), con `module: 'd3'`, `tone: 'orange'`, `kind: 'wide'`,
  `kicker: '5a · Matemática del Diagrama 3'`, 4 bloques `{heading, tex, conn}` cada una, más `refs`.
  **Evidencia:** 38 slides en total (`d3-reg-1` = slide 22, `d3-reg-2` = slide 23). Todas las `tex`
  dentro del límite de renderizado del deck (máximo previo 329 caracteres; las nuevas: 259, 298, 303,
  308, 190, 199, 264, 257). Las `refs` quedaron sólo en `d3-reg-2`: en `d3-reg-1` no caben (ver
  hallazgo H1).
- [x] **B2 — Tabla de notación de la slide 2.** Los símbolos de regresión se fusionaron en la fila
  existente **«Símbolos locales»** en vez de crear una fila dedicada: una fila nueva expulsaba
  «Decisiones de unificación» fuera del área visible (ver hallazgo H2). `\lambda_{reg}` sí se agregó a
  la fila «Decisiones de unificación».
- [x] **B3 — Verificación.** `npm run lint` exit 0; `npm run build` exit 0; PDF y 38 PNG generados;
  chequeo determinista con Playwright de las 38 slides: **0 errores de MathJax** (`mjx-merror`) y
  0 TeX inválido; y medición de recorte real por slide (ver §4).
- [x] **B4 — `presentacion_piml_v4_puertas_2026-09.pdf` regenerado** (38 páginas). Respaldo del PDF
  anterior en `/tmp/v4-puertas-backup.pdf`. El PDF no se versiona (`presentacion_piml_v*.pdf` está en
  `.gitignore`).
- [x] **B5 — Commit de la unidad de trabajo.**

## 3bis. Hallazgos de maquetación (medidos, no estimados)

**H1 — `refs` en una slide de 4 bloques no cabe.** La slide `d3-reg-1` usa 1.269 caracteres de `conn`
(4 bloques) y el borde inferior de su contenido ya toca el marco: la lista de referencias quedaba en
`.slide-content`, que tiene `overflow-y: auto`, es decir **fuera del área visible sin indicio visual**.
Se movieron las referencias a `d3-reg-2`. Regla para futuras slides: con 4 bloques y este tamaño de
`conn`, no agregar `refs`.

**H2 — La tabla de notación tiene ancho automático y el recorte no es lineal.** Acortar una etiqueta de
la columna «Grupo» **ensancha** las columnas 2–3 y puede hacer crecer otra fila (+25 px medidos en
«Exógenas y drivers»). La altura de una fila la fija su celda más alta, no la suma de contenidos.
Medir con `scrollHeight` antes de dar por buena cualquier poda.

**H3 — La métrica `scrollHeight − clientHeight` sobreestima el recorte.** En la slide 2 marca 13 px de
exceso, pero el borde inferior de la última fila queda **12,6 px por encima** del borde del contenido:
es el margen inferior de `.reading-table`, no contenido recortado. Métrica correcta:
`lastRow.getBoundingClientRect().bottom − content.getBoundingClientRect().bottom` (negativo = sobra
espacio).

**H4 — Desborde preexistente en cinco slides `door` (heredado de `main`, no de este cambio).**
Medido en `main` (`e2ea076`), en la unidad A (`ecef378`) y en el estado actual, con valores idénticos:
`d1-puerta1` +10 px, `d1-puerta2` +32 px, `d1-puerta2-deriv` +32 px, `d1-puerta2-lagrange` +11 px,
`d1-puerta2-lagrange-deriv` +40 px. Pendiente de investigar por separado (y de aplicar H3 para saber
si hay recorte visible real o sólo margen).

**H5 — La slide 2 sí la empeoró la unidad A.** En `main` no desbordaba; la fila «Convención temporal»
introducida por la unidad A la llevó a +41 px y la fusión de símbolos de regresión a +68 px. Tras
recortar cuatro celdas queda en +13 px de margen (H3), con las 9 filas completas y visibles.

## 4. Definition of done — greps de control

```bash
grep -c "d3-reg-1" src/data/deckContent.js      # 1
grep -c "d3-reg-2" src/data/deckContent.js      # 1
grep -cE '\\\\mathbf\{X\}' src/data/deckContent.js   # sin cambio neto: la matriz de diseño es \mathbf{D}
grep -rn 'lambda_{reg}' src/data/deckContent.js # ≥ 6 (4 formulaciones + ≥2 en conn/tabla)
grep -rn 'boldsymbol{\\\\beta}' src/data/deckContent.js | wc -l  # > 0
```

## 5. Iteración 2 — una slide densa por modelo

**Estructura acordada:** 4 slides reemplazan a las 2 resumen. `d3-reg-ols` (=slide 22),
`d3-reg-mle` (23), `d3-reg-ridge` (24), `d3-reg-lasso` (25). Forma: **3 bloques de ecuaciones +
viñetas + notas**, con `kicker: '5a · Matemática del Diagrama 3'`, `tone: orange`, `module: d3`.

| Slide | Bloques |
| --- | --- |
| `d3-reg-ols` | modelo lineal y supuestos · criterio de mínimos cuadrados · ecuación normal y proyección ($\mathbf{H}$) |
| `d3-reg-mle` | verosimilitud · log-verosimilitud negativa (puente con OLS) · estimadores y dispersión |
| `d3-reg-ridge` | objetivo penalizado · solución cerrada e invertibilidad · contracción espectral (SVD) |
| `d3-reg-lasso` | objetivo y forma restringida · condiciones KKT · umbral suave y politopo |

**Restricciones de maquetación descubiertas y medidas** (valen para cualquier slide nueva de este deck):

1. **El orden de render en las slides `wide` es viñetas → ecuaciones → notas.** Las viñetas se leen
   como entrada del tema y las notas como cierre; no se puede invertir desde los datos.
2. **La altura de un display NO mide envoltura, mide construcciones altas.** `\arg\min_{\beta}`,
   `\sum_{k=1}^{d}` y `\left(\dots\right)^{2}` suben el bloque de 24 px a 41–62 px. `scrollWidth`
   no detecta envoltura: un display que envuelve crece en alto, no en ancho.
3. **Las `notes` tienen un piso de ~51 px (3 líneas):** recortar su texto no libera altura. Los
   recortes útiles son el número de viñetas (~31 px cada una) y la altura de los displays.
4. **Presupuesto medido por slide** (contenido disponible 891 px): kicker 24 + h2 41 + viñetas +
   3 bloques + notas 51 + refs 18 + ~87 px de márgenes entre bloques.
5. **`refs` cuesta 18 px** y sólo cabe en una slide con holgura.

**Verificación (determinista, Playwright, 40 slides):** `npm run lint` y `npm run build` en verde;
**0 errores de MathJax** (`mjx-merror`) en las cuatro slides nuevas; **0 recorte real** en las cuatro
(holguras: −18 / −52 / −4 / −2 px). En el deck completo quedan **sólo los 3 recortes heredados de
`main`** (`d1-puerta2` +1,7 px, `d1-puerta2-deriv` +1,8 px, `d1-puerta2-lagrange-deriv` +9,3 px), con
valores idénticos a antes. Solapamiento de nodos ReactFlow: 0 en las slides del diagrama MR.

## 6. Incidente de escape de barras invertidas (corregido y prevenido)

**Qué pasó.** Al escribir el bloque nuevo con el archivo de contenido generado a mano, el LaTeX de los
campos `conn`, `bullets` y `notes` quedó con **una sola barra invertida** dentro de comillas simples de
JavaScript. En JS, `'\l'` es `'l'` y `'\b'` es un retroceso (0x08), así que el LaTeX se destruía al
interpretarse: MathJax reportaba 4–6 `Math input error` por slide. Los campos `tex` sí llevaban doble
barra y se renderizaban bien.

**Prevención.** Las 4 slides se generan con `String.raw` (LaTeX en su forma natural) más un serializador
que escapa `\` y `'` de forma garantizada, con un control automático que cuenta barras invertidas
sueltas en **todo** el archivo: el criterio de aceptación es **0**. Ese control debe volver a ejecutarse
cada vez que se edite `src/data/deckContent.js` a mano.

## 7. Pendientes (fuera de alcance, reportados al usuario)
- `GUION.md` no recibe estas dos slides nuevas (decisión explícita del usuario).
- El desfase estructural de `GUION.md` (24 slides descritas vs. 38 tras este cambio) sigue abierto.
- Otros regresores (elastic net, regularización robusta, GLM) quedan para una iteración siguiente.
- **H4**: desborde preexistente en `d1-puerta1`, `d1-puerta2`, `d1-puerta2-deriv`,
  `d1-puerta2-lagrange` y `d1-puerta2-lagrange-deriv` (heredado de `main`).
