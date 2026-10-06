# Guion de presentación — Revisión PIML (versión matemática)

## Uso del guion

- **Duración objetivo: ~40 minutos** (26 diapositivas; tiempos sugeridos por slide, ajustables). Total sugerido: 40.5 min con los tiempos marcados; margen de ±5 min según ritmo y preguntas intermedias.
- **Público técnico.** Se asume familiaridad con ML y series de tiempo (LSTM/GRU, kernels, sobreajuste, ventanas e horizontes de pronóstico). NO se asume dominio de PIML: las cuatro puertas, la formulación PINN y la notación del proyecto se explican desde cero. No se asume que el público haya leído el documento.
- **Navegación del deck:** flechas izquierda/derecha para avanzar y retroceder; el rail lateral permite saltar a cualquier slide; la tecla `f` activa el modo enfoque (oculta el resto de la interfaz). Este guion va slide por slide, en el mismo orden del deck.
- **Convención de ecuaciones:** cada fórmula se verbaliza en el guion ("lambda físico por la pérdida física") y aparece además en LaTeX renderizado `$...$`, copiado verbatim de las ecuaciones del deck — se ve bien en GitHub, Obsidian y editores con MathJax/KaTeX. Los subíndices y símbolos siguen la Tabla de notación de la slide 2; los símbolos locales (s, d, D, c de SARIMA; A, B, C del SSM) se aclaran al vuelo y no se reutilizan.

## Mapa de la charla

| Bloque | Slides | Contenido | Minutos (cronometraje) |
|---|---|---|---|
| Apertura | 1 | Portada y encuadre de la tesis | 0:00 – 0:01.5 |
| Notación | 2 | Cinco grupos de símbolos fijos | 0:01.5 – 0:03 |
| D1 · Cuatro puertas | 3 – 5 | Cómo entra la física en un modelo ML | 0:03 – 0:08 |
| D2 · Familias PIML para TS | 6 – 9 | F1–F6 y sus ecuaciones | 0:08 – 0:14.5 |
| D3 · Base data-driven | 10 – 14 | E1–E8 sin física (contraste) | 0:14.5 – 0:22.5 |
| D4 · La intersección | 15 – 18 | Patrones A–E en energía | 0:22.5 – 0:29 |
| D5 · Problemas resueltos | 19 – 21 | Qué resuelve cada puerta y qué queda abierto | 0:29 – 0:34 |
| D6 · Opciones de problema | 22 – 24 | Árbol A–D, sin votar | 0:34 – 0:38 |
| Lectura conjunta | 25 | Tabla de los seis diagramas | 0:38 – 0:39.5 |
| Cierre | 26 | Recapitulación e invitación a preguntas | 0:39.5 – 0:40.5 |

Regla de ritmo: los diagramas (slides de figura) son los mapas y merecen el doble de tiempo que sus slides matemáticas; si el tiempo apura, comprimir D3 (la base se conoce) y nunca D4 ni D6 (ahí está la tesis).

---

## Apertura (slide 1)

**Pantalla:** portada con el título completo, el subtítulo "Versión matemática — esquema general, diagramas de decisión y modelos matemáticos por familia, previos a la formulación del modelo" y la línea de Maestría en Ingeniería, Universidad Nacional de Colombia, 2026.

**Guion:**

"Buenas tardes. Esta charla presenta la revisión de Modelos Informados por Física —PIML— para series de tiempo y sistemas energéticos, en su versión matemática. El insumo es el documento revision_piml_series_tiempo_energia_matematica, y la entrega son seis diagramas de decisión, cada uno acompañado de su matemática por familia. El objetivo es preciso: explicar la matemática que gobierna esos diagramas antes de la etapa de formulación del modelo. No vamos a discutir resultados ni benchmarks; vamos a fijar el lenguaje: símbolos, puertas, familias y patrones. Al final, esperamos que la mesa pueda discutir la formulación con esta misma notación."

---

## Recorrido (slides 2 – 25)

### Slide 2 — 2 · Notación · Tabla de notación: cinco grupos, símbolos fijos

- ⏱ ~1.5 min
- **Pantalla:** la tabla de notación completa en cinco bloques (marco general, RFF multibanda, TSB y recurrencia, física RC, símbolos locales). Señalar el grupo de pérdidas y el de RFF; mencionar la nota al pie de decisiones de unificación.
- **Guion:**
  "Antes de los diagramas, la notación, en cinco grupos fijos. Primero la convención del tiempo, que vale para toda la charla: toda magnitud dependiente del tiempo lleva argumento explícito, con paréntesis en tiempo continuo y corchetes con índice entero en tiempo discreto; y los argumentos que no son tiempo, como los parámetros o las features, se escriben entre paréntesis como siempre. El primero es el marco general: la serie observada $y[t]$, el pronóstico multi-paso directo $\hat{\mathbf{y}} \in \mathbb{R}^h$, la ventana $\mathbf{X} \in \mathbb{R}^{\tau \times d}$, y las pérdidas —$\mathcal{L}_{MSE}$, $\mathcal{L}_{phys}$ y $\mathcal{L}_{total}$— con su peso $\lambda_{phys}$, el residuo $\mathcal{R}_{phys}$ y la ley $\mathcal{N}[u] = 0$ en el dominio $\Omega_T$. El segundo grupo es el codificador RFF multibanda del artículo guía: $K$ bandas con ancho $\mathrm{softplus}(\rho_k)$, $N_f$ features por banda y el mapeo $\boldsymbol{\phi}_k$ (Ecuación 24); el embedding $\mathbf{z}[t] \in \mathbb{R}^F$ con $F = K\, N_f$, y el pre-set de bandas $B = (6, 24, 72)$ horas. El tercero cubre el bloque espectro-temporal y la recurrencia: dilatación $\breve{d}$, kernel $\breve{k}$, GELU $\breve{\sigma}$, LayerNorm y el módulo $f_{RNN}$; noten que la compuerta de actualización de la GRU es $\mathbf{u}[t]$, no $\mathbf{z}[t]$, para no colisionar con el embedding espectral. El cuarto grupo es la física térmica RC: temperaturas $T_{in}$, $T_{out}$ y $T_m$; capacidades $C_{in}$ y $C_m$; resistencias $R_{ea}$, $R_{in}$ y $R_{out}$; y las exógenas $I_{sol}$, $A_w$, $\dot{Q}_{int}$ y $P_{HVAC}$. El quinto avisa que los símbolos locales viven solo dentro de su ecuación y no se reutilizan."
- **Puente:** "Con la notación fijada, entramos al Diagrama 1: las cuatro puertas."

### Slide 3 — 3 · Diagrama 1 · Las cuatro puertas por las que entra la física

- ⏱ ~2 min
- **Pantalla:** el mapa del Diagrama 1: a la izquierda el núcleo azul oscuro (conocimiento físico, $\mathcal{N}[u] = 0$) y a la derecha el modelo ML/DL; cuatro rutas coloreadas ① pérdida, ② arquitectura, ③ datos/features, ④ híbrido. Señalar que la leyenda etiqueta ① como "débil" y ② como "fuerte".
- **Guion:**
  "Este mapa tiene un solo punto de partida: el predictor paramétrico del modelo ML, $\hat{y} = f_\theta(\mathbf{x})$, y una ley física conocida, $\mathcal{N}[u] = 0$. La pregunta del diagrama es: ¿por dónde entra esa ley en el modelo? La puerta 1 es la pérdida: física débil, aplicada como penalización durante el entrenamiento. La puerta 2 es la arquitectura: física fuerte, cableada en la propia estructura de $f_\theta$. La puerta 3 actúa sobre los datos: features derivadas de leyes físicas y datos de múltiples fidelidades. Y la puerta 4 es el híbrido: simulador más red residual, $f_{fis}(\mathbf{x}) + g_\theta(\mathbf{x})$. Toda la taxonomía PIML que veremos hoy se reduce a estas cuatro rutas de inyección."
- **Puente:** "Veamos la puerta 1 en su forma matemática."

### Slide 4 — 3 · Matemática del Diagrama 1 · Puerta ① — Función de pérdida (forma débil)

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: el modelo general ($\hat{y} = f_\theta(\mathbf{x}),\ \theta \in \Theta$) y la pérdida compuesta del PINN clásico con $N_d$ datos y $\lambda_{phys}$ por la norma del residuo $r_\theta$ sobre $N_c$ puntos de colocación.
- **Guion:**
  "La forma débil vive en la función de pérdida. Todo parte del predictor $\hat{y} = f_\theta(\mathbf{x})$, con $\theta \in \Theta$. La pérdida compuesta del PINN clásico, de Raissi 2019, es $\mathcal{L}_{total}$ igual a $\mathcal{L}_{MSE}$ más lambda físico por $\mathcal{L}_{phys}$: $ \mathcal{L}_{total}(\theta) = \frac{1}{N_d}\sum_{i=1}^{N_d} \left| f_\theta(t_i) - x(t_i) \right|^2 + \lambda_{phys}\, \frac{1}{N_c}\sum_{j=1}^{N_c} \left\| r_\theta(t_j) \right\|^2 $ — el primer término es el error cuadrático medio sobre los $N_d$ datos, y el segundo es la norma del residuo $r_\theta$ evaluado en los $N_c$ puntos de colocación. El residuo es exactamente la ley física aplicada a la red: $r_\theta = \mathcal{N}[f_\theta]$. Se llama 'débil' porque la física no se impone exactamente: se penaliza, y cuánto pesa lo decide $\lambda_{phys}$. En la formulación PINN-RC del proyecto, ese residuo es la EDO térmica del edificio evaluada en la predicción."
- **Puente:** "Las otras tres puertas no dependen de lambda físico; veamos por qué."

### Slide 5 — 3 · Matemática del Diagrama 1 · Puertas ② ③ ④ — Arquitectura, datos y híbrido

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones apiladas: la forma hamiltoniana con la matriz simpléctica $\mathbb{J}$; las features físicas $\tilde{\mathbf{x}} = [\mathbf{x}, \psi_{fis}(\mathbf{x})]$ y la multi-fidelity $y_{HF} = \alpha_{mf}\, f_{LF} + \delta_{mf}$; y el híbrido en sus dos variantes (suma residual y apilamiento de features).
- **Guion:**
  "La puerta 2 pone la física en la estructura: en la forma hamiltoniana, $\frac{d}{dt}[q;\ p] = \mathbb{J}\, \nabla H_\theta(q, p)$, con $\mathbb{J}$ la matriz simpléctica de ceros y unos menos identidad. Esa conservación se cumple para todo $\theta$, sin $\lambda_{phys}$: la garantía es estructural. La puerta 3 actúa en los datos: las features se aumentan con $\psi_{fis}$, $\tilde{\mathbf{x}} = [\mathbf{x}, \psi_{fis}(\mathbf{x})]$, y la multi-fidelity escribe el dato de alta fidelidad como $\alpha_{mf}\, f_{LF}(\mathbf{x}) + \delta_{mf}(\mathbf{x})$, con el cuello de botella en el latente. La puerta 4 es el híbrido en dos variantes: suma residual, $f_{fis}(\mathbf{x}) + g_\theta(\mathbf{x})$, o apilamiento, $g_\theta(\mathbf{x}, f_{fis}(\mathbf{x}))$. Comparen las garantías: la puerta 1 penaliza, la puerta 2 garantiza, y las puertas 3 y 4 combinan conocimiento y aprendizaje."
- **Puente:** "La pregunta siguiente es qué familias concretas existen para series de tiempo: eso es el Diagrama 2."

### Slide 6 — 4 · Diagrama 2 · Familias PIML para series de tiempo (todas las aplicaciones)

- ⏱ ~2 min
- **Pantalla:** el mapa de las seis familias F1–F6 colgando de la cabeza "serie de tiempo"; la leyenda codifica madurez por color: F1 madura, F3 y F4 de madurez media, F2 y F5 de nicho, F6 emergente.
- **Guion:**
  "El Diagrama 2 ordena seis familias PIML para series de tiempo, en todas las aplicaciones. El punto de partida común: la serie $y(t)$ observa un sistema dinámico gobernado por una ley $\mathcal{N}[u] = 0$, total o parcialmente conocida. F1 es la familia PINN sobre EDO y EDP, la más madura. F2 son las redes recurrentes physics-guided. F3 son las Neural ODE y SDE informadas, y F4 es la física en el espacio latente, con PhyDNet como referencia; ambas de madurez media. F5 son los métodos kernel y GPR, de nicho, y F6 es la física embebida en la arquitectura, la familia emergente, donde vive el RFF multibanda del artículo guía. El color del diagrama codifica exactamente esa madurez, y en los bloques matemáticos veremos las seis de dos en dos."
- **Puente:** "Empezamos por F1 y F2."

### Slide 7 — 4 · Matemática del Diagrama 2 · F1 — PINN sobre EDO/EDP · F2 — Physics-guided RNN

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: la EDO con su residuo $r_\theta(t, \mathbf{x}) = \partial_t u_\theta + \mathcal{N}[u_\theta]$; la pérdida de F1 con $N_d$ datos y $N_c$ puntos de colocación; la recurrencia estándar de F2; y la pérdida $\mathcal{L} = \mathcal{L}_{MSE} + \lambda_{phys}\, \mathcal{L}_{EC}$ con el residuo de consistencia temporal.
- **Guion:**
  "F1 es la PINN clásica: la red aprende la solución del sistema dinámico, $u_\theta(t, \mathbf{x})$, que debe satisfacer $\partial_t u + \mathcal{N}[u] = 0$ en $\Omega_T$. El residuo es justamente esa suma, $r_\theta(t, \mathbf{x}) = \partial_t u_\theta + \mathcal{N}[u_\theta]$, evaluado en los $N_c$ puntos de colocación $(t_j, \mathbf{x}_j)$, y la pérdida suma el error sobre los $N_d$ datos más lambda físico por la norma del residuo: $\mathcal{L}(\theta) = \frac{1}{N_d}\sum_{i=1}^{N_d} | u_\theta(t_i, \mathbf{x}_i) - u(t_i, \mathbf{x}_i) |^2 + \lambda_{phys}\, \frac{1}{N_c}\sum_{j=1}^{N_c} \| r_\theta(t_j, \mathbf{x}_j) \|^2$. F2 cambia el objeto: la recurrencia es estándar, $\mathbf{h}[t] = f_{RNN}(\mathbf{x}[t], \mathbf{h}[t-1]; \Theta_r)$, y la predicción sale de $g(\mathbf{h}[t])$; la física entra como consistencia temporal. La pérdida es $\mathcal{L} = \mathcal{L}_{MSE} + \lambda_{phys}\, \mathcal{L}_{EC}$, donde $\mathcal{L}_{EC} = \sum_t \| r_{EC}(\hat{y}[t], \hat{y}[t-1], \mathbf{x}[t]) \|^2$ suma la norma del residuo entre predicciones consecutivas. La diferencia clave: F1 aproxima la solución de la ley; F2 solo penaliza que las predicciones la respeten en el tiempo."
- **Puente:** "F3 y F4 llevan la física a la dinámica continua y al espacio latente."

### Slide 8 — 4 · Matemática del Diagrama 2 · F3 — Neural ODE/SDE informados · F4 — Física en el espacio latente

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la dinámica continua de F3 con su integral de $t_0$ a $t_1$; la ecuación de Euler–Lagrange de la Lagrangian NN; y la descomposición latente de PhyDNet ($\mathbf{z}[t] = \mathbf{z}[t]^{phys} + \mathbf{z}[t]^{res}$).
- **Guion:**
  "En F3 la dinámica es continua: $\frac{d\mathbf{h}(t)}{dt} = f_\theta(\mathbf{h}(t), t)$, y entre $t_0$ y $t_1$ el estado se obtiene integrando $f_\theta$ con un solver diferenciable: $\mathbf{h}(t_1) = \mathbf{h}(t_0) + \int_{t_0}^{t_1} f_\theta(\mathbf{h}(t), t)\, dt$. La estructura física parcial puede ser la forma hamiltoniana de la puerta 2 del Diagrama 1, o la euler-lagrangeana: $\frac{d}{dt}\frac{\partial L_\theta}{\partial \dot{q}} - \frac{\partial L_\theta}{\partial q} = 0$. Existe la variante estocástica con el diferencial $d\mathbf{W}_t$. En F4, PhyDNet separa el latente en dos: $\mathbf{z}[t] = \mathbf{z}[t]^{phys} + \mathbf{z}[t]^{res}$; la componente física evoluciona con el PhyCell, $\mathbf{z}[t]^{phys} = \mathrm{PhyCell}(\mathbf{z}[t-1]^{phys})$, y el decoder produce la predicción, $\hat{y}[t] = \mathrm{Dec}(\mathbf{z}[t])$. Es la puerta 2 traducida a un espacio latente: encoder, física, decoder."
- **Puente:** "F5 y F6 son las dos familias más cercanas al forecasting operativo."

### Slide 9 — 4 · Matemática del Diagrama 2 · F5 — Forecasting restringido · F6 — TS con física embebida

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: el kernel ridge de F5 con su solución cerrada $\mathbf{a} = (\mathbf{K}_{GP} + \lambda_{rk} \mathbf{I})^{-1} \mathbf{y}$; el predictor de F6 con el prior físico $\mathcal{P}_{fis}$ dentro de $g_\theta$; y el mapeo RFF multibanda de la Ecuación 24 con $\mathrm{softplus}(\rho_k)$.
- **Guion:**
  "F5 es kernel ridge con restricciones de forma: la predicción es $\hat{f}(x) = \sum_{i=1}^{N} a_i\, \kappa(x, x_i)$, y los coeficientes salen del sistema cerrado: $\mathbf{a} = (\mathbf{K}_{GP} + \lambda_{rk}\, \mathbf{I})^{-1} \mathbf{y}$. Las restricciones del diagrama —cotas, rampas, parabolicidad, estacionalidad— se imponen sobre esa función; en su variante GPR con prior físico es la línea de Doumèche 2025. F6 es la familia de la física embebida: el predictor es $g_\theta(\mathbf{X}; \mathcal{P}_{fis})$ con un prior físico dentro de la arquitectura, sin EDP explícita. La instancia que nos interesa es el RFF multibanda de la Ecuación 24: $\boldsymbol{\phi}_k(\mathbf{x}[t]) = \sqrt{\frac{2}{N_f}}\, \cos\!\left(\mathrm{softplus}(\rho_k)\, \mathbf{W}_k^\top \mathbf{x}[t] + \mathbf{b}_k\right)$. Cada banda $k$ lleva su propio ancho de banda aprendible, $\mathrm{softplus}(\rho_k)$, siempre positivo; el prior aquí es espectral."
- **Puente:** "Con las familias PIML en la mesa, hace falta el contraste: qué se usa hoy en energía sin física."

### Slide 10 — 5a · Diagrama 3 · Familias data-driven en sistemas energéticos (SIN física)

- ⏱ ~2 min
- **Pantalla:** el mapa de las ocho familias E1–E8; la leyenda agrupa en cuatro bloques: clásicos y tradicionales (E1–E2), DL secuencial (E3–E4), LTSF moderno (E5–E7) y el patrón dominante en carga (E8, en naranja).
- **Guion:**
  "Este diagrama es el contraste necesario: la base contra la que se mide todo PIML energético. Son las ocho familias de la matriz SOTA 2022 a 2026: treinta y dos papers revisados, veinticinco de ellos en la hoja de energía. E1 son los estadísticos clásicos, E2 el ML clásico, E3 los recurrentes, E4 las TCN, E5 los Transformers para LTSF, E6 los SSM y Mamba, E7 los modelos fundacionales, y E8 la descomposición más híbridos. La leyenda los agrupa en cuatro bloques de tradición a frontera, y el naranja marca el patrón dominante en carga, que es E8. Esta base define el nivel de comparación: sin ella no se puede juzgar si la física agrega valor."
- **Puente:** "Veamos la matemática de la base, familia por familia."

### Slide 11 — 5a · Matemática del Diagrama 3 · E1 — Estadísticos clásicos · E2 — ML clásico

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la SARIMA de Box–Jenkins con el operador de rezago $\mathcal{B}$ y el ruido blanco gaussiano; y el SVR con pérdida épsilon-insensible, su minimización y la banda $\left| y_i - f(\mathbf{x}_i) \right| \le \varepsilon + \xi_i^{(*)}$.
- **Guion:**
  "E1 es SARIMA en su forma Box-Jenkins: $\phi_p(\mathcal{B})\, \Phi_P(\mathcal{B}^s)\, (1-\mathcal{B})^d\, (1-\mathcal{B}^s)^D\, y[t] = c + \theta_q(\mathcal{B})\, \Theta_Q(\mathcal{B}^s)\, \varepsilon[t]$, con $\varepsilon[t] \sim \mathcal{N}(0, \sigma_\varepsilon^2)$. Aquí $\mathcal{B}$ es el operador de rezago y $s$ el período estacional, típicamente 24 o 168 horas; $s$, $d$, $D$ y $c$ son símbolos locales de esta ecuación. E2 es ML clásico sobre features tabulares duras: rezagos, calendario, meteorología. El caso formal es la SVR: $f(\mathbf{x}) = \langle \mathbf{w}, \varphi(\mathbf{x}) \rangle + b$, minimizando $\frac{1}{2}\lVert \mathbf{w} \rVert^2 + C_{svr} \sum_i (\xi_i + \xi_i^*)$ sujeto a la banda épsilon-insensible $\left| y_i - f(\mathbf{x}_i) \right| \le \varepsilon + \xi_i^{(*)}$. XGBoost, random forest y ANFIS entran en esta familia como ensambles aditivos."
- **Puente:** "El bloque E3 introduce las compuertas que dominan la práctica."

### Slide 12 — 5a · Matemática del Diagrama 3 · E3 — Recurrentes: compuertas de la LSTM y la GRU

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: compuertas de entrada $\mathbf{i}[t]$ y olvido $\mathbf{f}[t]$ de la LSTM; compuerta de salida $\mathbf{o}[t]$ y candidato $\tilde{\mathbf{c}}[t]$; compuertas de actualización $\mathbf{u}[t]$ y reinicio $\mathbf{r}[t]$ de la GRU; y el candidato $\tilde{\mathbf{h}}[t]$ con el estado $\mathbf{h}[t]$ interpolado.
- **Guion:**
  "La LSTM gobierna su estado con tres compuertas sigmoideas: entrada $\mathbf{i}[t]$, olvido $\mathbf{f}[t]$ y salida $\mathbf{o}[t]$. El estado de celda se actualiza como $\mathbf{c}[t] = \mathbf{f}[t] \odot \mathbf{c}[t-1] + \mathbf{i}[t] \odot \tilde{\mathbf{c}}[t]$, y la salida es $\mathbf{o}[t] \odot \tanh(\mathbf{c}[t])$. La GRU compacta eso en dos compuertas: actualización $\mathbf{u}[t]$ y reinicio $\mathbf{r}[t]$. El candidato es $\tilde{\mathbf{h}}[t] = \tanh\!\bigl(\mathbf{W}_h \mathbf{x}[t] + \mathbf{U}_h (\mathbf{r}[t] \odot \mathbf{h}[t-1]) + \mathbf{b}_h\bigr)$; y el estado nuevo interpola: $\mathbf{h}[t] = (1 - \mathbf{u}[t]) \odot \mathbf{h}[t-1] + \mathbf{u}[t] \odot \tilde{\mathbf{h}}[t]$. Noten la decisión de notación de la sección 1: la compuerta de actualización es $\mathbf{u}[t]$, no $\mathbf{z}[t]$, para no colisionar con el embedding espectral. El backbone del artículo guía, $\breve{\mathbf{h}}[t] = f_{RNN}(\tilde{\mathbf{z}}[t], \breve{\mathbf{h}}[t-1])$, es exactamente una de estas celdas."
- **Puente:** "E4 y E5 son las dos arquitecturas no recurrentes dominantes."

### Slide 13 — 5a · Matemática del Diagrama 3 · E4 — Convolucionales/TCN · E5 — Transformers LTSF

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la convolución causal dilatada $(\mathbf{s} *_{\breve{d}} \mathbf{f})[t]$ y la atención escalada $\mathrm{softmax}(\mathbf{Q}\mathbf{K}^\top/\sqrt{d_k})\mathbf{V}$ junto a la multi-cabeza con concatenación de heads.
- **Guion:**
  "E4 es la convolución causal dilatada: $(\mathbf{s} *_{\breve{d}} \mathbf{f})[t] = \sum_{i=0}^{\breve{k}-1} f[i]\, s[t-\breve{d}\,i]$. Es causal, solo mira el pasado, y el campo receptivo crece exponencialmente con la dilatación $\breve{d}$. El TSB del artículo guía es un bloque TCN: convolución dilatada compuesta con residual, GELU y LayerNorm; los híbridos CNN-LSTM combinan esto con la recurrencia de E3. E5 es la atención escalada: $\mathrm{Att}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \mathrm{softmax}\!\left(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{d_k}}\right)\mathbf{V}$; la versión multi-cabeza concatena las $n_{cab}$ cabezas y proyecta con $\mathbf{W}^O$: $\mathrm{MHA}(\mathbf{X}) = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_{n_{cab}})\, \mathbf{W}^O$. Las familias TFT, Informer, PatchTST, iTransformer y TimeXer son variantes de esta atención que cambian la tokenización; PatchTST trocea cada canal en parches, con independencia de canales."
- **Puente:** "Las tres últimas familias modernizan el bloque secuencial."

### Slide 14 — 5a · Matemática del Diagrama 3 · E6 — SSM/Mamba · E7 — Fundacionales · E8 — Descomposición

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: el espacio de estados continuo de E6; la distribución predictiva de E7 con $\theta$ congelado; la descomposición $y(t) = \sum_{j=1}^{J} c_j(t) + r(t)$ de E8; y el problema variacional de la VMD.
- **Guion:**
  "E6 formula el sistema en espacio de estados continuo: $\mathbf{h}'(t) = \mathbf{A}\, \mathbf{h}(t) + \mathbf{B}\, x(t)$, con salida $y(t) = \mathbf{C}\, \mathbf{h}(t)$. Al discretizar queda la recurrencia lineal: $\mathbf{h}[t] = \mathbf{\bar{A}}\, \mathbf{h}[t-1] + \mathbf{\bar{B}}\, x[t]$. Mamba, con selective scan, vuelve los parámetros dependientes de la entrada y baja el costo a orden de $\tau$, frente al orden de $\tau^2$ de la atención. E7 son los modelos fundacionales: entregan la distribución predictiva $p_\theta(y[\tau+1], \dots, y[\tau+h] \mid \mathbf{X})$ con $\theta$ fijado en pre-entrenamiento masivo externo; eso es el zero y few-shot: Chronos tokeniza los valores, TimesFM usa parches y Moirai es any-variate. Y E8 descompone la serie: $y(t) = \sum_{j=1}^{J} c_j(t) + r(t)$; la expresión sigue en tiempo continuo, pero se implementa sobre la serie muestreada $y[t]$, y la VMD lo hace resolviendo el problema variacional de modos con frecuencias centrales $\omega_j$. El patrón dominante en carga es E8: descomponer, modelar cada componente con su propia red $g_{\theta_j}$, y reconstruir sumando."
- **Puente:** "Con la base fijada, entra la física: el Diagrama 4, la intersección."

### Slide 15 — 5b · Diagrama 4 · La intersección: TS + física en sistemas energéticos

- ⏱ ~2 min
- **Pantalla:** el mapa de la intersección TS ∩ física ∩ energía con los cinco patrones A–E; el marcador rojo del cuadrante vacío. Señalar la frase clave del bullet: el cuadrante "dinámica de edificio + multi-horizonte + rigor + UQ conformal" está VACÍO.
- **Guion:**
  "El Diagrama 4 cruza las familias E1 a E8 con las puertas 1 a 4 y entrega cinco patrones. A es dinámica de potencia, con la ecuación de oscilación del generador; B es flujo de red, con las ecuaciones nodales; C es demanda, donde la física es de forma; D es edificios, física de sustancia con circuitos RC; y E es renovables, con rama física más residual. Los patrones A y B son los únicos con rigor matemático maduro; C es física de forma, D es física de sustancia y E es el híbrido moderno. Y está el hallazgo del mapa: el cuadrante dinámica de edificio, más multi-horizonte, más rigor, más UQ conformal, está vacío. Ese vacío es la decisión informativa que alimenta la tesis: nadie combina esas cuatro condiciones a la vez."
- **Puente:** "Veamos la matemática de cada patrón."

### Slide 16 — 5b · Matemática del Diagrama 4 · Patrón A — Dinámica de potencia · Patrón B — Flujo de red

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la ecuación de oscilación del generador síncrono (dos líneas, ángulo y velocidad: $\dot{\delta}(t) = \omega(t) - \omega_s$); el residuo físico $r_\theta(t)$ sobre la trayectoria estimada; y las ecuaciones nodales de flujo de potencia $P_i$ y $Q_i$.
- **Guion:**
  "El patrón A parte de la ecuación de oscilación del generador síncrono: $\dot{\delta}(t) = \omega(t) - \omega_s$, y $M\, \dot{\omega}(t) = P_m - P_e(\delta) - D\, (\omega(t) - \omega_s)$. La PINN de Misyris 2020, puerta 1, penaliza el residuo sobre la trayectoria estimada: $r_\theta(t) = M\, \frac{d\hat{\omega}}{dt} - \left[ P_m - P_e(\hat{\delta}) - D\, (\hat{\omega} - \omega_s) \right]$. En modo inverso, la misma red estima $M$ y $D$; la variante DAE-PINN añade las restricciones algebraicas: $0 = g(\mathbf{x}_d, \mathbf{x}_a)$. El patrón B usa las ecuaciones nodales de flujo: $P_i$ y $Q_i$ suman sobre los $N_{bus}$ buses los productos de módulos de voltaje por las admitancias $G_{ij}$ y $B_{ij}$, con $\cos\theta_{ij}$ y $\sin\theta_{ij}$: $P_i = \sum_{j=1}^{N_{bus}} \lvert V_i \rvert \lvert V_j \rvert \left( G_{ij}\cos\theta_{ij} + B_{ij}\sin\theta_{ij} \right)$. Las PINN-GNN imponen ese residuo sobre el grafo de admitancias —puertas 2 más 1— y los biases generalizan a redes no vistas."
- **Puente:** "El patrón C cambia el papel de la física: de ley dinámica a restricción de forma."

### Slide 17 — 5b · Matemática del Diagrama 4 · Patrón C — Demanda: física como restricción de forma

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: las penalizaciones de rampas $\mathcal{L}_{rampa}$ y parabolicidad $\mathcal{L}_{par}$ (ERCOT 2026); y la pérdida total del patrón C que las suma con $\lambda_{phys}$ sobre $\mathcal{L}_{MSE}$.
- **Guion:**
  "En demanda no hay EDO del activo: la física entra como regularizadores cualitativos sobre el vector de pronóstico $\hat{\mathbf{y}} \in \mathbb{R}^h$, por la puerta 1, o por la 2 si se cablea. Primero, rampas: $\mathcal{L}_{rampa} = \sum_{j=1}^{h-1} \max\!\bigl(0, | \hat{y}[j+1] - \hat{y}[j] | - r_{max}\bigr)$. Segundo, parabolicidad: $\mathcal{L}_{par} = \sum_{j=2}^{h-1} \left( \hat{y}[j-1] - 2\hat{y}[j] + \hat{y}[j+1] \right)^2$. Tercero, monotonía para chillers: la derivada parcial del pronóstico respecto de la variable meteorológica no puede ser negativa, penalizada con $\mathcal{L}_{mono}$, en la línea de Tang 2026. La pérdida total del patrón C es $\mathcal{L}_{MSE}$ más lambda físico por la suma de rampa, parabolicidad y monotonía: $\mathcal{L}_{total} = \mathcal{L}_{MSE} + \lambda_{phys}\, (\mathcal{L}_{rampa} + \mathcal{L}_{par} + \mathcal{L}_{mono})$. Ninguna de las tres contiene una EDO del activo: es el regularizador de forma del diagrama, aplicado al forecast de demanda."
- **Puente:** "El patrón D sí vuelve a la física de sustancia: un circuito térmico."

### Slide 18 — 5b · Matemática del Diagrama 4 · Patrón D — Física de sustancia (circuito RC) · Patrón E — rama física + residual

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la ecuación del nodo interior del circuito 2R2C; el residuo físico $\mathcal{R}_{phys}(t)$ y su pérdida $\mathcal{L}_{phys}$ promediada sobre $\tilde{N}$ muestras y $h$ pasos; y la suma de ramas del PhysEmbedFormer.
- **Guion:**
  "El patrón D es la formulación PINN-RC del proyecto: un circuito térmico equivalente 2R2C. La ecuación del nodo interior dice: $C_{in} \frac{d T_{in}(t)}{dt} = \frac{T_{out}(t) - T_{in}(t)}{R_{ea}} + \frac{T_{m}(t) - T_{in}(t)}{R_{in}} + A_w I_{sol}(t) + \dot{Q}_{int}(t) + P_{HVAC}(t)$. El segundo nodo es la masa de la envolvente, con $C_m$, $R_{in}$ y $R_{out}$. El residuo físico reescribe esa ecuación con la temperatura estimada: $\mathcal{R}_{phys}(t) = C_{in} \frac{d \hat{T}_{in}(t)}{dt} - \left[ \frac{T_{out}(t) - \hat{T}_{in}(t)}{R_{ea}} + A_w I_{sol}(t) + \dot{Q}_{int}(t) + P_{HVAC}(t) \right]$, y la pérdida física es la norma del residuo promediada sobre los $\tilde{N}$ escenarios y los $j$ pasos del horizonte: $\mathcal{L}_{phys} = \frac{1}{\tilde{N}\, h} \sum_{n,j} \| \mathcal{R}_{phys}(t_{n,j}; \Theta) \|^2$; la conexión con el Diagrama 1 es directa: puerta 1, pérdida compuesta estándar. El dato crítico del documento: en la literatura no hay evaluación multi-horizonte de este residuo; los horizontes son cortos. El patrón E, en renovables, es la puerta 4 con sabor de la 2: $\hat{y} = \underbrace{f_{fis}(\mathbf{x}_{met})}_{\text{rama física}} + \underbrace{g_\theta(\mathbf{x}, \mathbf{c}_{met})}_{\text{rama residual + contexto}}$; es PhysEmbedFormer, con variante fotovoltaica que penaliza el residuo de $P_{pv}$ por la puerta 1."
- **Puente:** "Con familias y patrones sobre la mesa, la pregunta cambia: ¿qué problema resuelve cada enfoque?"

### Slide 19 — 6 · Diagrama 5 · ¿Qué problema resuelve cada enfoque PIML en energía?

- ⏱ ~2 min
- **Pantalla:** la matriz del Diagrama 5: filas con las cuatro puertas ①–④, columnas con los problemas (escasez, interpretabilidad, OOD, plausibilidad) y estrellas marcando fortalezas; fila inferior con los problemas laterales sin dueño.
- **Guion:**
  "El Diagrama 5 es la lectura informática del documento: cada puerta ataca preferentemente un problema distinto. Los problemas del eje son escasez de datos, interpretabilidad, extrapolación fuera de dominio y plausibilidad física; las fortalezas están marcadas con estrella en la matriz. El documento ancla la evidencia: escasez con Loffa 2025 y Misyris 2020, extrapolación con Tang 2026, transferencia con el arXiv dos cinco cero nueve punto dos cinco uno cinco ocho, y UQ con la posterior B-PINN de Yang, Meng y Karniadakis, dos mil veintiuno. Y subrayo el mensaje del diagrama: hay problemas laterales que ninguna puerta resuelve —incertidumbre, eventos extremos, cómputo y escalabilidad—. Esa fila abierta es la que abre el Diagrama 6."
- **Puente:** "Veamos esa lectura en lenguaje matemático."

### Slide 20 — 6 · Matemática del Diagrama 5 · Lectura matemática de las filas ①–④

- ⏱ ~1.5 min
- **Pantalla:** la posterior del GP con prior físico $\bar{f}(x) = \mathbf{k}(x)^\top (\mathbf{K}_{GP} + \sigma_n^2 \mathbf{I})^{-1} \mathbf{y}$ como ecuación central; los bullets con la lectura de ① frente a la escasez y de ②④ en el híbrido.
- **Guion:**
  "Primero, la puerta 1 contra la escasez: el término $\lambda_{phys}\, \mathcal{L}_{phys}$ restringe las funciones admisibles a las que casi satisfacen la ley $\mathcal{N}[u] = 0$; en la práctica aumenta la muestra efectiva, y la ganancia aparece exactamente con pocos datos, según Loffa 2025. Segundo, las puertas 2 y 4: en el híbrido $\hat{y} = f_{fis}(\mathbf{x}_{met}) + g_\theta(\mathbf{x}, \mathbf{c}_{met})$, cada término es inspeccionable; y fuera del dominio, $g_\theta$ puede fallar pero $f_{fis}$ sigue correcta: el error queda acotado por el componente físico. Tercero, la puerta 3 contra estados no observables: el posterior del GP es $\bar{f}(x) = \mathbf{k}(x)^\top (\mathbf{K}_{GP} + \sigma_n^2 \mathbf{I})^{-1} \mathbf{y}$. Con el prior físico $\mathcal{GP}(m_{fis}, \kappa_{fis})$ —el PhI-GPR—, la posterior reconstruye estados no medidos, siempre que el modelo dinámico esté bien especificado."
- **Puente:** "Quedan los problemas laterales: incertidumbre, eventos extremos y escala."

### Slide 21 — 6 · Matemática del Diagrama 5 · Problemas laterales: UQ, eventos extremos y escalabilidad

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la posterior bayesiana de B-PINN con su predictiva marginal integrada sobre $\Theta$; y el cuantil conformal $\hat{q}$ con el intervalo $C(\hat{y}) = [\hat{y} - \hat{q},\ \hat{y} + \hat{q}]$. Bullets de eventos extremos (partición del test en $\mathcal{E}$) y de cómputo (crecimiento con $N_c$).
- **Guion:**
  "Para UQ bayesiana, B-PINN computa el posterior $p(\Theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \Theta)\, p(\Theta)}{p(\mathcal{D})}$ por Bayes y la predictiva marginal $p(y^* \mid \mathbf{x}^*, \mathcal{D}) = \int p(y^* \mid \mathbf{x}^*, \Theta)\, p(\Theta \mid \mathcal{D})\, d\Theta$ integrando sobre $\Theta$; se muestrea con HMC o métodos variacionales, y ese costo es prohibitivo para forecasting operativo. La alternativa barata son los cuantiles conformales: con puntajes $s_i = \lvert \text{error}_i \rvert$ en una muestra de calibración de tamaño $n$, el cuantil se toma en $\hat{q} = \mathrm{Quantile}\!\left(\{s_i\}; \frac{\lceil (n+1)(1-\alpha) \rceil}{n}\right)$, y el intervalo es $C(\hat{y}) = [\hat{y} - \hat{q},\, \hat{y} + \hat{q}]$. La cobertura es $\mathbb{P}\{y \in C(\hat{y})\} \ge 1 - \alpha$, sin supuestos distribucionales y sobre cualquier predictor: ese es, de hecho, el hueco más claro del mapa energético. Para eventos extremos, el protocolo es particionar el test en el conjunto $\mathcal{E}$ y su complemento, y reportar el $\mathcal{L}_{MSE}\vert_{\mathcal{E}}$ por separado; el caso ERCOT 2026 muestra que las pérdidas de forma mejoran la forma durante el evento, no la magnitud del pico. Y en cómputo: evaluar la pérdida física crece con $N_c$ y con el orden de $N$, y no hay PINNs energéticas sobre datasets de $10^6$ o $10^7$ muestras."
- **Puente:** "Último diagrama: ¿a qué problema apuntar?"

### Slide 22 — 7 · Diagrama 6 · Árbol de opciones de problema (NO vinculado a ningún modelo)

- ⏱ ~2 min
- **Pantalla:** el árbol con la pregunta cabeza y cuatro opciones: A escasez de datos (estándar), B interpretabilidad etiquetada y C UQ conformal (huecos claros), D extremos/OOD (más reciente); nota de combinación al pie.
- **Guion:**
  "El Diagrama 6 es un árbol de opciones de problema, y subrayo el rótulo del título: no está vinculado a ningún modelo. Las opciones son cuatro: A, escasez de datos, la opción estándar; B, interpretabilidad etiquetada, un hueco claro; C, UQ por conformal, el otro hueco claro; y D, extremos y fuera de distribución, la más reciente y abierta. La nota al pie dice algo importante: las opciones no son excluyentes; las combinaciones se refuerzan. Este diagrama no vota: la decisión es posterior a este documento, y esa es precisamente la etapa que sigue en la tesis."
- **Puente:** "Cada opción tiene un anclaje matemático; los de A y B son esta slide."

### Slide 23 — 7 · Matemática del Diagrama 6 · Anclajes A y B — régimen de escasez y bandas etiquetadas

- ⏱ ~1 min
- **Pantalla:** el bullet del anclaje A (dominio de $\lambda_{phys}\, \mathcal{L}_{phys}$ con $\tilde{N}$ pequeño, umbral del residuo RC) y la ecuación de B: el embedding $\mathbf{z}[t]$ como concatenación de bandas $\boldsymbol{\phi}_1 \dots \boldsymbol{\phi}_K$ con $F = K\, N_f$.
- **Guion:**
  "Anclaje A, el régimen de escasez: cuando el número de muestras $\tilde{N}$ es pequeño, domina el término $\lambda_{phys}\, \mathcal{L}_{phys}$, y existe un umbral donde el residuo del circuito RC de la §5b-D supera al MSE solo; ese es el régimen documentado por Loffa 2025. Anclaje B, interpretabilidad etiquetada: el embedding es $\mathbf{z}[t] = [\boldsymbol{\phi}_1(\mathbf{x}[t]), \dots, \boldsymbol{\phi}_K(\mathbf{x}[t])] \in \mathbb{R}^F$, con dimensión $F = K\, N_f$. Cada banda $\boldsymbol{\phi}_k$ queda etiquetada con su escala temporal: el pre-set $B = (6, 24, 72)$ h, o el alternativo $(4, 24, 168)$ h. Es el análogo aprendible de la descomposición de E8, $y(t) = \sum_j c_j(t) + r(t)$, pero dentro del modelo, no como preprocesamiento externo."
- **Puente:** "Los anclajes C y D cierran el árbol."

### Slide 24 — 7 · Matemática del Diagrama 6 · Anclajes C y D — conformal y evaluación por régimen

- ⏱ ~1 min
- **Pantalla:** dos bullets con las expresiones de los anclajes: el intervalo conformal $C(\hat{y}) = [\hat{y} - \hat{q},\ \hat{y} + \hat{q}]$ con cobertura $\ge 1 - \alpha$; y la evaluación por régimen con $\mathcal{L}_{MSE}\vert_{\mathcal{E}}$ más las pérdidas de forma de §5b-C ($\mathcal{L}_{rampa}$, $\mathcal{L}_{par}$).
- **Guion:**
  "Anclaje C, UQ: la opción conformal da el intervalo $C(\hat{y}) = [\hat{y} - \hat{q},\ \hat{y} + \hat{q}]$, con cobertura $\mathbb{P}\{y \in C(\hat{y})\} \ge 1 - \alpha$, sobre cualquier predictor y sin supuestos distribucionales; B-PINN queda descartado por costo en forecasting operativo. Anclaje D, robustez y extremos: la evaluación por régimen reporta $\mathcal{L}_{MSE}\vert_{\mathcal{E}}$ —el MSE restringido al conjunto de eventos $\mathcal{E}$— por separado, y durante el evento añade las pérdidas $\mathcal{L}_{rampa}$ y $\mathcal{L}_{par}$ del patrón C. Con esto, cada opción del árbol tiene un anclaje matemático concreto. Y la decisión de cuál tomar no está en este documento."
- **Puente:** "Antes de cerrar, la lectura conjunta de los seis diagramas."

### Slide 25 — 8 · Lectura conjunta · Los seis diagramas en una tabla

- ⏱ ~1.5 min
- **Pantalla:** la tabla de seis filas: número de diagrama, pregunta que responde y matemática asociada, con las referencias de sección (§3 a §7) en la tercera columna.
- **Guion:**
  "Esta tabla compacta los seis diagramas en pregunta y matemática. El Diagrama 1 responde cómo entra la física: $\mathcal{L}_{total}$, la forma hamiltoniana, $\psi_{fis}$ y el híbrido $f_{fis} + g_\theta$. El 2, qué familias PIML existen para series de tiempo: de F1, la PINN, a F6, la física embebida con RFF. El 3, cuál es la base data-driven en energía: E1 a E8, de SARIMA a la VMD. El 4, dónde se cruzan las tres cosas: los patrones A a E, del swing al circuito RC con su residuo $\mathcal{R}_{phys}$. El 5, qué problema resuelve cada enfoque: regularizador físico, posterior B-PINN y cuantiles conformales. Y el 6, qué opciones de problema quedan abiertas, sin conectar todavía a un modelo. Si deben llevarse una sola imagen de esta charla, que sea esta tabla."
- **Puente:** "Cierro con la recapitulación y abro las preguntas."

---

## Cierre (slide 26)

**Pantalla:** slide de cierre "Gracias", con el subtítulo "Preguntas y discusión — el siguiente paso del documento es la formulación del modelo".

**Guion:**

"Recapitulo en una línea por diagrama. La física entra por cuatro puertas: pérdida, arquitectura, datos e híbrido. Esas puertas organizan seis familias PIML para series de tiempo, de la PINN al RFF multibanda. La base energética sin física son las ocho familias E1 a E8. La intersección muestra cinco patrones y un cuadrante vacío: edificio, multi-horizonte, rigor y UQ conformal. Cada puerta resuelve un problema preferente, y tres problemas quedan abiertos para cualquier puerta. Y las opciones de problema están planteadas, con anclajes matemáticos, pero sin votar. El siguiente paso del documento es la formulación del modelo, con esta notación y este mapa como lenguaje común. Muchas gracias; quedo atento a sus preguntas y a la discusión."

---

## Q&A anticipado

**1. ¿Cuál es la diferencia exacta entre una PINN (F1) y una physics-guided RNN (F2)?**
La F1 aproxima la solución del sistema dinámico: la red es $u_\theta$ y el residuo $r_\theta = \partial_t u_\theta + \mathcal{N}[u_\theta]$ se penaliza en los $N_c$ puntos de colocación. La F2 mantiene la recurrencia estándar $\mathbf{h}[t] = f_{RNN}(\mathbf{x}[t], \mathbf{h}[t-1]; \Theta_r)$ y solo añade la consistencia temporal: $\mathcal{L} = \mathcal{L}_{MSE} + \lambda_{phys}\, \mathcal{L}_{EC}$, con $\mathcal{L}_{EC} = \sum_t \lVert r_{EC}(\hat{y}[t], \hat{y}[t-1], \mathbf{x}[t]) \rVert^2$. En F1 la red es la solución de la ley; en F2 la ley solo penaliza las predicciones.

**2. ¿Por qué el ancho de banda del RFF multibanda es softplus(ρ_k) y no ρ_k directamente?**
Porque el ancho de una banda espectral debe ser positivo y aprendible. $\mathrm{softplus}$ garantiza positividad para cualquier $\rho_k$ real y es diferenciable, de modo que $\rho_k$ se entrena por retropropagación. Cada banda $k$ del mapeo $\boldsymbol{\phi}_k$ (Ecuación 24) lleva su propio ancho, y el embedding final es $\mathbf{z}[t] \in \mathbb{R}^F$ con $F = K \cdot N_f$.

**3. ¿Qué es exactamente el cuadrante vacío del Diagrama 4?**
La combinación de las cuatro condiciones: dinámica de edificio (física de sustancia, circuito RC), evaluación multi-horizonte, rigor matemático y UQ por conformal. En la intersección revisada, los patrones maduros (A, B) no son edificios ni multi-horizonte, y el patrón D —el más cercano— no reporta evaluación multi-horizonte del residuo $\mathcal{R}_{phys}$ ("horizontes cortos").

**4. ¿Por qué conformal y no B-PINN para la UQ?**
B-PINN computa el posterior $p(\Theta \mid \mathcal{D})$ y la predictiva marginal integrando sobre $\Theta$, con HMC o métodos variacionales; el costo es prohibitivo para forecasting operativo. Los cuantiles conformales dan $C(\hat{y}) = [\hat{y} - \hat{q},\ \hat{y} + \hat{q}]$ con cobertura $\mathbb{P}\{y \in C(\hat{y})\} \ge 1 - \alpha$, sin supuestos distribucionales y sobre cualquier predictor: por eso el documento lo marca como "el hueco más claro del mapa energético".

**5. ¿Cuál de las seis familias F1–F6 está más madura y por qué importa?**
F1 (PINN) es la familia madura (Raissi 2019); F3 (Neural ODE/SDE) y F4 (PhyDNet) son de madurez media; F2 (PG-RNN) y F5 (kernel/GPR) son de nicho; F6 (física embebida, PINT/RFF) es emergente. La madurez importa porque define el riesgo de adoptar cada familia y con quién hay que comparar: la frontera del nicho energético está en F1 y en los patrones A–B del Diagrama 4.

**6. ¿Las puertas ① y ② son intercambiables? ¿Cuándo elegir cada una?**
No. La puerta ① penaliza: la física se satisface solo aproximadamente y la garantía depende de $\lambda_{phys}$. La puerta ② garantiza: la ley vive en la estructura de $f_\theta$ (por ejemplo la forma hamiltoniana $\frac{d}{dt}\begin{bmatrix} q \\ p \end{bmatrix} = \mathbb{J}\, \nabla H_\theta$) y se cumple para todo $\theta$, sin $\lambda_{phys}$. La elección depende de qué tan confiable es la ley y de cuánta garantía estructural se exige.

**7. ¿Qué decisión queda pendiente después de esta revisión?**
Elegir el problema objetivo entre las opciones A–D del Diagrama 6 —escasez, interpretabilidad etiquetada, UQ conformal, extremos/OOD—, que no son excluyentes, y recién entonces formular el modelo. El Diagrama 6 no está vinculado a ningún modelo y el documento no vota: la resolución es posterior a la revisión.

**8. ¿Por qué el patrón E8 (descomposición) es el dominante en carga y qué relación tiene con las bandas etiquetadas?**
Porque descomponer la serie ($y(t) = \sum_j c_j(t) + r(t)$ con EMD/VMD, fórmula en tiempo continuo que se implementa sobre la serie muestreada $y[t]$), modelar cada componente con su propia red ($\hat{c}_j = g_{\theta_j}$) y reconstruir sumando es el patrón predominante en la literatura de carga. Las bandas etiquetadas del anclaje B ($\mathbf{z}[t] = [\boldsymbol{\phi}_1, \dots, \boldsymbol{\phi}_K]$, $F = K \cdot N_f$, con escalas de $6/24/72$ h o $4/24/168$ h) son el análogo aprendible de esa descomposición, pero integrado dentro del modelo en lugar de ejecutarse como preprocesamiento externo.
