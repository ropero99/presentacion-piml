// Slides del deck — derivados del documento
// EstadoDelArte/revision_piml_series_tiempo_energia_matematica.md.
// Reglas: ecuaciones literales del documento (notación de la Tabla §1),
// máximo 2–4 ecuaciones display por slide, español académico.

export const SLIDES = [
  // ── Portada ──────────────────────────────────────────────────────────────
  {
    id: 'cover',
    module: 'portada',
    tone: 'cyan',
    kind: 'cover',
    kicker: '1 · Portada',
    title: 'Revisión de Modelos Informados por Física (PIML) para Series de Tiempo y Sistemas Energéticos',
    subtitle: 'Versión matemática — esquema general, diagramas de decisión y modelos matemáticos por familia, previos a la formulación del modelo',
    metaLines: [
      'Maestría en Ingeniería · Universidad Nacional de Colombia',
      'Basado en: revision_piml_series_tiempo_energia_matematica.md',
    ],
    year: '2026',
  },

  // ── Mapa del documento ──────────────────────────────────────────────────
  {
    id: 'mapa',
    module: 'mapa',
    tone: 'blue',
    kind: 'wide',
    kicker: '2 · Mapa del documento',
    title: 'Un mapa del terreno antes de decidir la formulación',
    bullets: [
      '**Notación (§1)** — la garantía de consistencia: ningún símbolo cambia de significado entre secciones.',
      '**D1 · Cuatro puertas (§3)** — ¿cómo entra la física en un modelo $\\hat{y} = f_\\theta(\\mathbf{x})$? Pérdida, arquitectura, datos/features, híbrido.',
      '**D2 · Familias PIML para TS (§4)** — seis familias con su modelo matemático representativo (F1–F6).',
      '**D3 · Base data-driven (§5a)** — las familias E1–E8 que ya mapeó la matriz SOTA 2022–2026, sin física.',
      '**D4 · La intersección (§5b)** — dónde se cruzan TS ∩ física ∩ energía (patrones A–E); el cuadrante "edificio + multi-horizonte + rigor + UQ" queda **vacío**.',
      '**D5 · Problemas resueltos (§6)** — escasez de datos, interpretabilidad, transferencia/OOD, plausibilidad física-extrapolación.',
      '**D6 · Opciones de problema (§7)** — opciones abiertas **sin** vincularlas a ningún modelo: la decisión es posterior.',
    ],
    notes:
      'Advertencia de rigor: las cifras citadas provienen del abstract o cuerpo de los papers referenciados; los DOIs deben re-verificarse al editar la bibliografía final.',
  },

  // ── §1 Notación ─────────────────────────────────────────────────────────
  {
    id: 'notacion',
    module: 'notacion',
    tone: 'purple',
    kind: 'wide',
    kicker: '2 · Notación',
    title: 'Tabla de notación: cinco grupos, símbolos fijos',
    bullets: [
      '**Series y marco general:** $y_t$ observada, $\\hat{\\mathbf{y}} \\in \\mathbb{R}^h$ multi-paso directa, ventana $\\mathbf{X} \\in \\mathbb{R}^{\\tau \\times d}$, pérdidas $\\mathcal{L}_{MSE}$, $\\mathcal{L}_{physics}$, $\\mathcal{L}_{total}$, peso $\\lambda_{phys}$, residuo $\\mathcal{R}_{phys}$, ley $\\mathcal{N}[u] = 0$ en dominio $\\Omega_T$.',
      '**Codificador RFF multibanda (artículo guía):** kernel $\\kappa$, bandas $K$ con ancho $\\mathrm{softplus}(\\rho_k)$, $N_f$ features por banda, mapeo $\\boldsymbol{\\phi}_k$ (Ecuación 24), embedding $\\mathbf{z}_t \\in \\mathbb{R}^{F}$ con $F = K N_f$, secuencia $\\mathbf{Z} = \\Phi_{MB}(\\mathbf{X})$; pre-set $B = (6, 24, 72)$ h.',
      '**TSB y recurrencia:** convolución con dilatación $\\breve{d}$ y kernel $\\breve{k}$, GELU $\\breve{\\sigma}$, LayerNorm $\\mathrm{LN}$, estado $\\breve{\\mathbf{h}}_t$, módulo $f_{RNN}$; en GRU la compuerta de actualización es $\\mathbf{u}_t$ (**no** $z_t$, para no colisionar con el embedding espectral).',
      '**Física térmica RC (PINN-RC):** temperaturas $T_{in}, T_{out}, T_m$; capacidades $C_{in}, C_m$; resistencias $R_{ea}, R_{in}, R_{out}$; exógenas $I_{sol}, A_w, \\dot{Q}_{int}, P_{HVAC}$.',
      '**Símbolos locales:** existen solo dentro de su ecuación (p. ej. $\\mathcal{B}$ del rezago en E1, $\\mathbf{A},\\mathbf{B},\\mathbf{C}$ del SSM en E6) y no se reutilizan fuera de contexto.',
    ],
    notes:
      'Decisiones de unificación adoptadas: el peso físico siempre $\\lambda_{phys}$; densidad espectral $p(\\mathbf{w}) = \\mathcal{N}(\\mathbf{0}, \\rho^{-2}\\mathbf{I})$; el mapeo RFF canónico es la Ecuación (24); $f_{fisica} \\equiv f_{fis}$ son sinónimos.',
  },

  // ── §2 Resumen ejecutivo ────────────────────────────────────────────────
  {
    id: 'resumen',
    module: 'resumen',
    tone: 'green',
    kind: 'wide',
    kicker: '2 · Resumen ejecutivo',
    title: 'Seis conclusiones que estructuran el mapa',
    bullets: [
      '**PIML** (referencia marco: Karniadakis et al., *Nature Reviews Physics* 2021, ~12.000 citas): todo modelo parte de $\\hat{y} = f_\\theta(\\mathbf{x})$ al que se inyecta una ley $\\mathcal{N}[u] = 0$ por una de cuatro puertas.',
      'La taxonomía operativa pregunta **por dónde entra la física**: pérdida débil $\\mathcal{L}_{total} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,\\mathcal{L}_{physics}$, arquitectura fuerte $\\dot{[\\mathbf{q},\\mathbf{p}]}^\\top = \\mathbb{J}\\nabla H_\\theta$, datos/features, o híbrido $\\hat{y} = f_{fisica}(\\mathbf{x}) + g_\\theta(\\mathbf{x})$.',
      'Para series de tiempo hay **6 familias** (F1–F6) con madurez muy desigual, cada una con su modelo matemático representativo.',
      'La base data-driven energética es la **matriz SOTA ya construida**: Transformers/patch, DLinear, Mamba, fundacionales, híbridos con descomposición (E1–E8).',
      'La intersección se concentra en 3 patrones: física **de forma** en demanda, física **de sustancia** en edificios (ODE térmica RC) y PINN **rigurosa** en dinámica de potencia (swing). **El cuadrante "edificio dinámico + multi-horizonte + rigor + UQ" queda vacío.**',
      'Problemas que PIML resuelve en energía: escasez de datos, interpretabilidad, transferencia/OOD y plausibilidad-extrapolación; laterales abiertos: **UQ** (conformal como candidato barato frente a B-PINN), eventos extremos y escalabilidad.',
    ],
  },

  // ── §3 Diagrama 1 — Cuatro puertas ──────────────────────────────────────
  {
    id: 'd1-figura',
    module: 'd1',
    tone: 'blue',
    kind: 'split',
    kicker: '3 · Diagrama 1',
    title: 'Las cuatro puertas por las que entra la física',
    bullets: [
      'Un solo punto de partida: el modelo ML $\\hat{y} = f_\\theta(\\mathbf{x})$ y el conocimiento físico $\\mathcal{N}[u] = 0$.',
      '**① Pérdida (débil):** se penaliza el residuo; no se garantiza.',
      '**② Arquitectura (fuerte):** la física está codificada en la estructura; se cumple **siempre**.',
      '**③ Datos/features:** conocimiento previo curado (features de leyes, multi-fidelity, bottleneck).',
      '**④ Híbrido:** simulador + red residual: $f_{fisica}(\\mathbf{x}) + g_\\theta(\\mathbf{x})$.',
    ],
    diagram: 'd1',
    diagramTitle: 'Diagrama 1 · ¿Cómo entra la física en un modelo ML/DL?',
    legend: [
      { color: '#1E3A5F', label: 'Conocimiento físico (núcleo)' },
      { color: '#2E86AB', label: '① Pérdida (débil)' },
      { color: '#7D3C98', label: '② Arquitectura (fuerte)' },
      { color: '#16A085', label: '③ Datos / features' },
      { color: '#E67E22', label: '④ Híbrido' },
      { color: '#34495E', label: 'Modelo ML/DL' },
    ],
    refs: [
      'Karniadakis et al., Nature Reviews Physics 3(6), 2021 (DOI: 10.1038/s42254-021-00314-5) · Hao et al., arXiv:2211.08064 · Willard et al., ACM Computing Surveys 2022 · Doumèche, tesis doctoral Sorbonne 2025.',
    ],
  },
  {
    id: 'd1-mat-1',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '3 · Matemática del Diagrama 1',
    title: 'Puerta ① — Función de pérdida (forma débil)',
    equations: [
      {
        heading: 'Modelo general (bloque "Modelo ML: ŷ = f_θ(x)")',
        tex: '\\hat{y} = f_\\theta(\\mathbf{x}), \\qquad \\theta \\in \\Theta',
        conn: 'Todo el diagrama parte de un predictor paramétrico entrenado sobre pares $(\\mathbf{x}, y)$; las cuatro puertas son cuatro maneras de inyectar una ley física conocida en $f_\\theta$.',
      },
      {
        heading: 'Pérdida compuesta (PINN clásico, Raissi 2019)',
        tex: '\\mathcal{L}_{total}(\\Theta) = \\underbrace{\\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| f_\\theta(\\mathbf{x}_i) - y_i \\right|^2}_{\\mathcal{L}_{MSE}} \\;+\\; \\lambda_{phys}\\,\\underbrace{\\frac{1}{N_c}\\sum_{j=1}^{N_c} \\left\\| r_\\theta(\\mathbf{x}_j) \\right\\|^2}_{\\mathcal{L}_{physics}}',
        conn:
          '**Conexión:** el bloque "L = L_MSE + λ_phys·L_physics" es exactamente $\\mathcal{L}_{total}$; "r(ŷ) = residuo de la EDO/EDP" es $r_\\theta = \\mathcal{N}[f_\\theta]$ evaluado por diferenciación automática; los $\\mathbf{x}_j$ del segundo sumando son los *puntos de colocación*. Es la formulación adoptada por el proyecto en PINN-RC.',
      },
    ],
  },
  {
    id: 'd1-mat-2',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '3 · Matemática del Diagrama 1',
    title: 'Puertas ② ③ ④ — Arquitectura, datos y híbrido',
    equations: [
      {
        heading: '② Conservación hamiltoniana (se cumple para todo θ)',
        tex: '\\frac{d}{dt}\\begin{bmatrix} \\mathbf{q} \\\\ \\mathbf{p} \\end{bmatrix} = \\mathbb{J}\\,\\nabla H_\\theta(\\mathbf{q}, \\mathbf{p}), \\qquad \\mathbb{J} = \\begin{bmatrix} \\mathbf{0} & \\mathbf{I} \\\\ -\\mathbf{I} & \\mathbf{0} \\end{bmatrix}',
        conn:
          '**Conexión:** "invariancias, simetrías, monotonías, conservación de energía" son propiedades de $f_\\theta$, no del entrenamiento (no aparece $\\lambda_{phys}$); garantiza conservación de $H_\\theta$ a lo largo de las trayectorias.',
      },
      {
        heading: '③ Datos / features (features de leyes físicas y multi-fidelity)',
        tex: '\\tilde{\\mathbf{x}} = \\left[ \\mathbf{x},\\; \\psi_{fis}(\\mathbf{x}) \\right], \\qquad y_{HF}(\\mathbf{x}) = \\alpha_{mf}\\, f_{LF}(\\mathbf{x}) + \\delta_{mf}(\\mathbf{x})',
        conn:
          '**Conexión:** "features derivadas de leyes físicas" ↔ $\\psi_{fis}(\\mathbf{x})$ (p. ej. sensación térmica, grados-día); "multi-fidelity" ↔ el modelo de Kennedy–O’Hagan ($f_{LF}$ simulador barato, $\\delta_{mf}$ discrepancia a aprender); el *physical bottleneck* fuerza la latente $\\mathbf{z}_{bot} = E(\\mathbf{x})$.',
      },
      {
        heading: '④ Híbrido simulador + red (grey-box)',
        tex: '\\hat{y} = \\underbrace{f_{fisica}(\\mathbf{x})}_{\\text{predicción base física}} + \\underbrace{g_\\theta(\\mathbf{x})}_{\\text{residuo aprendido}} \\quad \\text{o} \\quad \\hat{y} = g_\\theta\\bigl(\\mathbf{x},\\, f_{fisica}(\\mathbf{x})\\bigr)',
        conn:
          '**Conexión:** las dos líneas del bloque ④ (residual learning y feature stacking) son exactamente estas dos ecuaciones; tradición grey-box de identificación de parámetros (Bacher & Madsen 2011).',
      },
    ],
  },

  // ── §4 Diagrama 2 — Familias PIML para TS ───────────────────────────────
  {
    id: 'd2-figura',
    module: 'd2',
    tone: 'purple',
    kind: 'split',
    kicker: '4 · Diagrama 2',
    title: 'Familias PIML para series de tiempo (todas las aplicaciones)',
    bullets: [
      'Punto de partida común: la serie $y(t)$ observa un sistema dinámico gobernado por una ley $\\mathcal{N}[u] = 0$ total o parcialmente conocida.',
      '**F1** PINN sobre EDO/EDP — la red aprende LA SOLUCIÓN; madurez máxima.',
      '**F2** Physics-guided RNN (PGML) — recurrencia + pérdida física; nicho.',
      '**F3** Neural ODE/SDE informados — Hamiltonian/Lagrangian NN; fuerte.',
      '**F4** Física en el espacio latente — PhyDNet; medio.',
      '**F5** Forecasting restringido — kernel/GPR con forma; el más riguroso.',
      '**F6** TS extremo-a-extremo con física embebida — PINT; emergente.',
    ],
    diagram: 'd2',
    diagramTitle: 'Diagrama 2 · Seis familias PIML para series de tiempo',
    legend: [
      { color: '#1E3A5F', label: 'Serie de tiempo (cabeza)' },
      { color: '#2E86AB', label: 'F1 · madura' },
      { color: '#5B8DBE', label: 'F3, F4 · media' },
      { color: '#16A085', label: 'F2, F5 · nicho' },
      { color: '#E67E22', label: 'F6 · emergente' },
    ],
    refs: [
      'Raissi et al., J. Comp. Physics 378, 2019 (F1) · Karpatne et al., arXiv:1710.11431 (F2) · Greydanus NeurIPS 2019 / Chen NeurIPS 2018 (F3) · Le Guen & Thome, CVPR 2020 (F4) · Doumèche 2025 / Tartakovsky IJF 2023 (F5) · PINT, arXiv:2502.04018 (F6).',
    ],
  },
  {
    id: 'd2-mat-1',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '4 · Matemática del Diagrama 2',
    title: 'F1 — PINN sobre EDO/EDP · F2 — Physics-guided RNN',
    equations: [
      {
        heading: 'F1 · La red aproxima la solución del sistema dinámico',
        tex: '\\partial_t u + \\mathcal{N}[u] = 0 \\;\\; \\text{en } \\Omega_T, \\qquad r_\\theta(t, \\mathbf{x}) = \\partial_t u_\\theta + \\mathcal{N}[u_\\theta]',
        conn:
          '**Conexión:** "la red aprende LA SOLUCIÓN" ↔ $u_\\theta(t, \\mathbf{x})$; el residuo se evalúa en los $N_c$ puntos de colocación $(t_j, \\mathbf{x}_j)$.',
      },
      {
        heading: 'F1 · Pérdida con puntos de colocación',
        tex: '\\mathcal{L}(\\theta) = \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| u_\\theta(t_i, \\mathbf{x}_i) - u_i \\right|^2 + \\lambda_{phys}\\,\\frac{1}{N_c}\\sum_{j=1}^{N_c} \\left\\| r_\\theta(t_j, \\mathbf{x}_j) \\right\\|^2',
      },
      {
        heading: 'F2 · Recurrencia estándar + término físico',
        tex: '\\mathbf{h}_t = f_{RNN}(\\mathbf{x}_t, \\mathbf{h}_{t-1}; \\Theta_r), \\qquad \\hat{y}_t = g(\\mathbf{h}_t)',
        conn:
          '**Conexión:** "recurrencia estándar" ↔ $f_{RNN}$; "restricciones de consistencia temporal" ↔ $\\mathcal{L}_{EC}$ (p. ej. balance de energía entre pasos consecutivos; línea PGML de Karpatne en lagos).',
      },
      {
        heading: 'F2 · Pérdida de consistencia temporal',
        tex: '\\mathcal{L} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,\\mathcal{L}_{EC}, \\qquad \\mathcal{L}_{EC} = \\sum_t \\left\\| r_{EC}(\\hat{y}_t, \\hat{y}_{t-1}, \\mathbf{x}_t) \\right\\|^2',
      },
    ],
  },
  {
    id: 'd2-mat-2',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '4 · Matemática del Diagrama 2',
    title: 'F3 — Neural ODE/SDE informados · F4 — Física en el espacio latente',
    equations: [
      {
        heading: 'F3 · Dinámica continua integrada con solver diferenciable',
        tex: '\\frac{d\\mathbf{h}(t)}{dt} = f_\\theta(\\mathbf{h}(t), t), \\qquad \\mathbf{h}(t_1) = \\mathbf{h}(t_0) + \\int_{t_0}^{t_1} f_\\theta(\\mathbf{h}(t), t)\\, dt',
        conn:
          '**Conexión:** "estructura física parcial conocida" ↔ forma hamiltoniana $\\dot{[\\mathbf{q},\\mathbf{p}]}^\\top = \\mathbb{J}\\nabla H_\\theta$ (puerta ② del D1) o lagrangiana vía Euler–Lagrange $\\frac{d}{dt}\\frac{\\partial L_\\theta}{\\partial \\dot{\\mathbf{q}}} - \\frac{\\partial L_\\theta}{\\partial \\mathbf{q}} = 0$. Variante estocástica: $d\\mathbf{X}_t = f_\\theta(\\mathbf{X}_t, t)\\,dt + g_\\theta(\\mathbf{X}_t, t)\\,dW_t$.',
      },
      {
        heading: 'F3 · Lagrangian NN (Euler–Lagrange)',
        tex: '\\frac{d}{dt}\\,\\frac{\\partial L_\\theta}{\\partial \\dot{\\mathbf{q}}} - \\frac{\\partial L_\\theta}{\\partial \\mathbf{q}} = 0',
      },
      {
        heading: 'F4 · PhyDNet: latente descompuesta física + residual',
        tex: '\\mathbf{z}_t = \\mathbf{z}_t^{phys} + \\mathbf{z}_t^{res}, \\qquad \\hat{y}_t = \\mathrm{Dec}(\\mathbf{z}_t), \\qquad \\mathbf{z}_t^{phys} = \\mathrm{PhyCell}(\\mathbf{z}_{t-1}^{phys})',
        conn:
          '**Conexión:** "encoder → latente donde actúa la física → decoder" ↔ $\\mathrm{Enc}$, PhyCell (discretiza la EDP conocida con esquema predicción–corrección), $\\mathrm{Dec}$; "física + residual en representaciones latentes" ↔ la suma anterior.',
      },
    ],
  },
  {
    id: 'd2-mat-3',
    module: 'd2',
    tone: 'purple',
    kind: 'wide',
    kicker: '4 · Matemática del Diagrama 2',
    title: 'F5 — Forecasting restringido · F6 — TS con física embebida',
    equations: [
      {
        heading: 'F5 · Kernel ridge con restricciones de forma',
        tex: '\\hat{f}(x) = \\sum_{i=1}^{N} a_i\\, \\kappa(x, x_i), \\qquad \\mathbf{a} = (\\mathbf{K}_{GP} + \\lambda_{rk} \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** "bounds, rampas, parabolicidad, estacionalidad conocida" ↔ las restricciones sobre $f$ (cotas $a \\le f(x) \\le b$, monotonía $\\partial f/\\partial x_m \\ge 0$); GPR con prior físico: posterior $\\bar{f}(x) = \\mathbf{k}(x)^\\top (\\mathbf{K}_{GP} + \\sigma_n^2 \\mathbf{I})^{-1} \\mathbf{y}$. Formulación rigurosa: Doumèche 2025; PhI-GPR deriva $m$ y $\\kappa$ de las ecuaciones swing (Tartakovsky 2023).',
      },
      {
        heading: 'F6 · Prior físico cableado, sin EDP explícita',
        tex: '\\hat{\\mathbf{y}} = g_\\theta\\bigl(\\mathbf{X};\\, \\mathcal{P}_{fis}\\bigr)',
        conn:
          '**Conexión:** "inductive biases específicas" ↔ $\\mathcal{P}_{fis}$ dentro de $g_\\theta$. El codificador RFF multibanda del artículo guía es una instancia de este patrón con prior espectral (Ecuación 24): inyecta el conocimiento "la señal es una superposición de oscilaciones en $K$ escalas" sin imponer ninguna EDP.',
      },
      {
        heading: 'F6 · RFF multibanda del artículo guía (Ecuación 24)',
        tex: '\\boldsymbol{\\phi}_k(\\mathbf{x}_t) = \\sqrt{\\frac{2}{N_f}}\\,\\cos\\!\\left(\\mathrm{softplus}(\\rho_k)\\,\\mathbf{W}_k^\\top \\mathbf{x}_t + \\mathbf{b}_k\\right)',
      },
    ],
  },

  // ── §5a Diagrama 3 — Familias data-driven E1–E8 ─────────────────────────
  {
    id: 'd3-figura',
    module: 'd3',
    tone: 'orange',
    kind: 'split',
    kicker: '5a · Diagrama 3',
    title: 'Familias data-driven en sistemas energéticos (SIN física)',
    bullets: [
      'El contraste necesario: la base contra la que se mide todo PIML energético — las 8 familias que ya mapeó la matriz SOTA 2022–2026.',
      '**E1** Estadísticos (ARIMA/SARIMA/ETS) · **E2** ML clásico (SVR, RF, XGBoost, ANFIS).',
      '**E3** Recurrentes (LSTM/GRU + atención) · **E4** Convolucionales/TCN.',
      '**E5** Transformers LTSF · **E6** SSM/Mamba · **E7** Fundacionales (Chronos, TimesFM, Moirai).',
      '**E8** Descomposición + híbridos (VMD/EMD/CEEMDAN + red profunda): el **patrón dominante en carga**, combina E3–E5.',
    ],
    diagram: 'd3',
    diagramTitle: 'Diagrama 3 · Familias data-driven (base sin física)',
    legend: [
      { color: '#95A5A6', label: 'Clásicos / tradicionales (E1–E2)' },
      { color: '#2E86AB', label: 'DL secuencial (E3–E4)' },
      { color: '#7D3C98', label: 'Moderno LTSF (E5–E7)' },
      { color: '#E67E22', label: 'Patrón dominante en carga (E8)' },
    ],
    refs: [
      'Matriz interna (32 papers ≥2022; hoja "Matriz Energia" con 25) · Kim et al., arXiv:2411.05793 · Kong et al., IJMLC 16, 2025 · Benchmark KIT-IAI, arXiv:2607.15705, 2026.',
    ],
  },
  {
    id: 'd3-mat-1',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E1 — Estadísticos clásicos · E2 — ML clásico',
    equations: [
      {
        heading: 'E1 · SARIMA (Box–Jenkins; $\\mathcal{B}$ operador de rezago)',
        tex: '\\phi_p(\\mathcal{B})\\,\\Phi_P(\\mathcal{B}^s)\\,(1-\\mathcal{B})^d\\,(1-\\mathcal{B}^s)^D\\, y_t = c + \\theta_q(\\mathcal{B})\\,\\Theta_Q(\\mathcal{B}^s)\\,\\varepsilon_t, \\qquad \\varepsilon_t \\sim \\mathcal{N}(0, \\sigma_\\varepsilon^2)',
        conn:
          '**Conexión:** "ARIMA/SARIMA/ETS" ↔ esta ecuación ($s$ = período estacional 24 h o 168 h; ETS es su equivalente en espacio de estados con suavizado exponencial). Símbolos $s, d, D, c$ son **locales** de esta sección.',
      },
      {
        heading: 'E2 · SVR con pérdida ε-insensible y ensambles aditivos',
        tex: 'f(\\mathbf{x}) = \\langle \\mathbf{w}, \\varphi(\\mathbf{x}) \\rangle + b, \\qquad \\min_{\\mathbf{w}, b, \\boldsymbol{\\xi}, \\boldsymbol{\\xi}^*} \\frac{1}{2}\\lVert \\mathbf{w} \\rVert^2 + C_{svr} \\sum_{i=1}^{N} (\\xi_i + \\xi_i^*) \\;\\; \\text{s.a. } \\left| y_i - f(\\mathbf{x}_i) \\right| \\le \\varepsilon + \\xi_i^{(*)}',
        conn:
          '**Conexión:** "SVR, RF, XGBoost, ANFIS — features duras tabulares" ↔ $f(\\mathbf{x})$ sobre $\\mathbf{x}$ tabular (rezagos, calendario, meteorología). XGBoost/RF: $\\hat{y}_i = \\sum_{m=1}^{M_{arb}} f_m(\\mathbf{x}_i)$ con $\\mathcal{L} = \\sum_i \\ell(y_i, \\hat{y}_i) + \\sum_m \\Omega(f_m)$.',
      },
    ],
  },
  {
    id: 'd3-mat-2',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E3 — Recurrentes: compuertas de la LSTM y la GRU',
    equations: [
      {
        heading: 'LSTM · compuertas de entrada, olvido y salida',
        tex: '\\mathbf{i}_t = \\sigma(\\mathbf{W}_i \\mathbf{x}_t + \\mathbf{U}_i \\mathbf{h}_{t-1} + \\mathbf{b}_i), \\qquad \\mathbf{f}_t = \\sigma(\\mathbf{W}_f \\mathbf{x}_t + \\mathbf{U}_f \\mathbf{h}_{t-1} + \\mathbf{b}_f)',
        conn:
          'Estado de celda y salida: $\\mathbf{c}_t = \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tilde{\\mathbf{c}}_t$ y $\\mathbf{h}_t = \\mathbf{o}_t \\odot \\tanh(\\mathbf{c}_t)$.',
      },
      {
        heading: 'LSTM · estado de celda (compuerta de salida $\\mathbf{o}_t$)',
        tex: '\\mathbf{o}_t = \\sigma(\\mathbf{W}_o \\mathbf{x}_t + \\mathbf{U}_o \\mathbf{h}_{t-1} + \\mathbf{b}_o), \\qquad \\tilde{\\mathbf{c}}_t = \\tanh(\\mathbf{W}_c \\mathbf{x}_t + \\mathbf{U}_c \\mathbf{h}_{t-1} + \\mathbf{b}_c)',
      },
      {
        heading: 'GRU · compuertas de actualización $\\mathbf{u}_t$ y reinicio $\\mathbf{r}_t$ (decisión 5 de §1)',
        tex: '\\mathbf{u}_t = \\sigma(\\mathbf{W}_u \\mathbf{x}_t + \\mathbf{U}_u \\mathbf{h}_{t-1} + \\mathbf{b}_u), \\qquad \\mathbf{r}_t = \\sigma(\\mathbf{W}_r \\mathbf{x}_t + \\mathbf{U}_u \\mathbf{h}_{t-1} + \\mathbf{b}_r)',
        conn:
          '**Conexión:** "LSTM / GRU / BiLSTM + atención" ↔ estos dos sistemas de compuertas; la bidireccional concatena $\\overrightarrow{\\mathbf{h}}_t$ y $\\overleftarrow{\\mathbf{h}}_t$. El backbone del artículo guía ($\\breve{\\mathbf{h}}_t = f_{RNN}(\\tilde{\\mathbf{z}}_t, \\breve{\\mathbf{h}}_{t-1}; \\Theta_r)$) es exactamente una de estas celdas sobre la secuencia espectral $\\tilde{\\mathbf{Z}}$.',
      },
      {
        heading: 'GRU · candidato y estado oculto',
        tex: '\\tilde{\\mathbf{h}}_t = \\tanh\\!\\bigl(\\mathbf{W}_h \\mathbf{x}_t + \\mathbf{U}_h (\\mathbf{r}_t \\odot \\mathbf{h}_{t-1}) + \\mathbf{b}_h\\bigr), \\qquad \\mathbf{h}_t = (1 - \\mathbf{u}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{u}_t \\odot \\tilde{\\mathbf{h}}_t',
      },
    ],
  },
  {
    id: 'd3-mat-3',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E4 — Convolucionales/TCN · E5 — Transformers LTSF',
    equations: [
      {
        heading: 'E4 · Convolución causal dilatada (campo receptivo exponencial en $\\breve{d}$)',
        tex: '(\\mathbf{s} *_{\\breve{d}} \\mathbf{f})(t) = \\sum_{i=0}^{\\breve{k}-1} f_i\\, s_{t - \\breve{d}\\, i}',
        conn:
          '**Conexión:** "CNN, TCN, híbridos CNN-LSTM" ↔ la convolución dilatada (local) compuesta con una recurrencia E3. El TSB del artículo guía es, de hecho, un bloque TCN con residual + GELU + LN (mismas $\\breve{d}, \\breve{k}$ de §1.3).',
      },
      {
        heading: 'E5 · Atención escalada y multi-cabeza',
        tex: '\\mathrm{Att}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\mathrm{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}}\\right)\\mathbf{V}, \\qquad \\mathrm{MHA}(\\mathbf{X}) = \\mathrm{Concat}(\\mathrm{head}_1, \\dots, \\mathrm{head}_{n_{cab}})\\,\\mathbf{W}^O',
        conn:
          '**Conexión:** "TFT, Informer, PatchTST, iTransformer, TimeXer" ↔ variantes de $\\mathrm{Att}$ con distinta tokenización; "channel-independence como leitmotiv" ↔ PatchTST trocea cada canal en parches ($n_p$, paso $s_p$) y aplica el encoder por canal de forma independiente.',
      },
    ],
  },
  {
    id: 'd3-mat-4',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E6 — SSM/Mamba · E7 — Fundacionales · E8 — Descomposición',
    equations: [
      {
        heading: 'E6 · Espacio de estados continuo y discretización (recurrencia lineal)',
        tex: '\\mathbf{h}\'(t) = \\mathbf{A}\\,\\mathbf{h}(t) + \\mathbf{B}\\,x(t), \\qquad y(t) = \\mathbf{C}\\,\\mathbf{h}(t)',
        conn:
          'Discretización: $\\bar{\\mathbf{A}} = \\exp(\\Delta \\mathbf{A})$, $\\bar{\\mathbf{B}} = (\\Delta \\mathbf{A})^{-1}(\\bar{\\mathbf{A}} - \\mathbf{I})\\,\\Delta \\mathbf{B}$, luego $\\mathbf{h}_t = \\bar{\\mathbf{A}}\\,\\mathbf{h}_{t-1} + \\bar{\\mathbf{B}}\\,x_t$. Mamba vuelve los parámetros dependientes de la entrada (*selective scan*: $\\mathbf{B}_t = s_B(x_t)$, $\\mathbf{C}_t = s_C(x_t)$, $\\Delta_t = s_\\Delta(x_t)$): costo $\\mathcal{O}(\\tau)$ frente al $\\mathcal{O}(\\tau^2)$ de la atención.',
      },
      {
        heading: 'E7 · Distribución predictiva pre-entrenada (zero/few-shot)',
        tex: 'p_\\theta\\bigl(y_{\\tau+1}, \\dots, y_{\\tau+h} \\mid \\mathbf{X}\\bigr) \\quad \\text{con } \\theta \\text{ fijado en pre-entrenamiento masivo externo}',
        conn:
          '**Conexión:** "zero/few-shot" ↔ evaluar $p_\\theta$ sin re-entrenar $\\theta$ (Chronos tokeniza valores; TimesFM parches; Moirai any-variate patching).',
      },
      {
        heading: 'E8 · Descomposición (EMD: IMFs + residuo) y VMD variacional',
        tex: 'y(t) = \\sum_{j=1}^{J} c_j(t) + r(t)',
        conn:
          '**Conexión:** "VMD/EMD/CEEMDAN + red profunda — combina familias E3–E5" ↔ $\\hat{c}_j = g_{\\theta_j}(\\mathbf{X}_j)$ por componente y $\\hat{y} = \\sum_j \\hat{c}_j + \\hat{r}$. Análogo al pre-set multibanda $B$ del codificador RFF (§1.2), pero como preprocesamiento externo en lugar de capa aprendible.',
      },
      {
        heading: 'E8 · Problema variacional de la VMD',
        tex: '\\min_{\\{u_j\\}, \\{\\omega_j\\}} \\sum_{j=1}^{J} \\left\\| \\partial_t \\left[ \\left( \\delta(t) + \\frac{i}{\\pi t} \\right) * u_j(t) \\right] e^{-i \\omega_j t} \\right\\|_2^2 \\qquad \\text{s.a. } \\sum_{j=1}^{J} u_j(t) = y(t)',
      },
    ],
  },

  // ── §5b Diagrama 4 — La intersección ────────────────────────────────────
  {
    id: 'd4-figura',
    module: 'd4',
    tone: 'magenta',
    kind: 'split',
    kicker: '5b · Diagrama 4',
    title: 'La intersección: TS + física en sistemas energéticos',
    bullets: [
      'Dónde se cruzan las familias E1–E8 con las puertas ①–④: cinco patrones (A–E) con madurez desigual.',
      '**A** Dinámica de potencia (swing, DAE) — PINN rigurosa, madura. **B** Estado y flujo de red — PINN-GNN, maduro.',
      '**C** Forecasting de demanda — física como **restricción de forma** (emergente).',
      '**D** Edificios/HVAC — física **de sustancia** (ODE térmica, RC), pero horizontes cortos y sin UQ.',
      '**E** Renovables/EV — rama física + rama residual (PhysEmbedFormer).',
      '**El cuadrante "dinámica de edificio + multi-horizonte + rigor + UQ conformal" está VACÍO en este mapa.**',
    ],
    diagram: 'd4',
    diagramTitle: 'Diagrama 4 · Dónde TS ∩ física ∩ energía se cruzan',
    legend: [
      { color: '#2E86AB', label: 'Maduro · rigor matemático (A, B)' },
      { color: '#E67E22', label: 'C · física de forma' },
      { color: '#16A085', label: 'D · física de sustancia' },
      { color: '#7D3C98', label: 'E · híbrido moderno' },
      { color: '#C0392B', label: '▲ Cuadrante vacío' },
    ],
    refs: [
      'Misyris et al., IEEE PES GM 2020 (A) · Huang & Wang, IEEE TPS 38(1), 2023 (review A) · Tang et al., E&B 2026, DOI: 10.1016/j.enbuild.2026.117299 (C) · Loffa et al., ACM e-Energy 2025 (D) · PhysEmbedFormer, Sci. Reports 2026 (E).',
    ],
  },
  {
    id: 'd4-mat-1',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '5b · Matemática del Diagrama 4',
    title: 'Patrón A — Dinámica de potencia · Patrón B — Flujo de red',
    equations: [
      {
        heading: 'A · Ecuación de oscilación del generador síncrono',
        tex: '\\dot{\\delta}(t) = \\omega(t) - \\omega_s, \\qquad M\\,\\dot{\\omega}(t) = P_m - P_e(\\delta) - D\\,\\bigl(\\omega(t) - \\omega_s\\bigr)',
        conn:
          '**Conexión:** "entrada (t,θ) → salida δ(t), ω(t)" ↔ $u_\\theta: (t, \\theta_{sis}) \\mapsto (\\hat{\\delta}, \\hat{\\omega})$; la PINN (Misyris 2020) penaliza el residuo $r_\\theta(t) = M\\,\\frac{d\\hat{\\omega}}{dt} - \\left[ P_m - P_e(\\hat{\\delta}) - D(\\hat{\\omega} - \\omega_s) \\right]$ con $\\mathcal{L} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\lVert r_\\theta \\rVert^2$ (puerta ①); en modo inverso $M$ y $D$ se aprenden ("estima inercia y amortiguación"). DAE-PINN añade $0 = g(\\mathbf{x}_{dif}, \\mathbf{y}_{alg})$.',
      },
      {
        heading: 'A · Residuo físico sobre la trayectoria estimada',
        tex: 'r_\\theta(t) = M\\,\\frac{d\\hat{\\omega}}{dt} - \\left[ P_m - P_e(\\hat{\\delta}) - D\\,(\\hat{\\omega} - \\omega_s) \\right]',
      },
      {
        heading: 'B · Ecuaciones nodales de flujo de potencia',
        tex: 'P_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\cos\\theta_{ij} + B_{ij}\\sin\\theta_{ij} \\right), \\qquad Q_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\sin\\theta_{ij} - B_{ij}\\cos\\theta_{ij} \\right)',
        conn:
          '**Conexión:** "voltajes, ángulos" ↔ $(\\lvert V_i \\rvert, \\theta_i)$; las PINN-GNN usan paso de mensajes sobre el grafo de admitancias $(G_{ij}, B_{ij})$ con residuo de estas ecuaciones (puertas ②+①); las *inductive biases* de arXiv:2509.25158 cablean esta estructura y generalizan a redes NO vistas (leave-one-out).',
      },
    ],
  },
  {
    id: 'd4-mat-2',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '5b · Matemática del Diagrama 4',
    title: 'Patrón C — Demanda: física como restricción de forma',
    bullets: [
      'No hay EDO del activo: la física entra como **regularizadores cualitativos** sobre la curva $\\hat{\\mathbf{y}} \\in \\mathbb{R}^h$ (puerta ①, o ② si la monotonía se cablea por arquitectura).',
    ],
    equations: [
      {
        heading: 'Penalización de rampas y de parabolicidad (ERCOT 2026)',
        tex: '\\mathcal{L}_{rampa} = \\sum_{j=1}^{h-1} \\max\\!\\bigl(0,\\; \\left| \\hat{y}_{j+1} - \\hat{y}_j \\right| - r_{max}\\bigr), \\qquad \\mathcal{L}_{par} = \\sum_{j=2}^{h-1} \\left( \\hat{y}_{j-1} - 2\\hat{y}_j + \\hat{y}_{j+1} \\right)^2',
        conn:
          '**Conexión:** "loss parabólica/ramp" ↔ $\\mathcal{L}_{par}$, $\\mathcal{L}_{rampa}$ (curvas plausibles tipo parábola durante *cold snaps*). Monotonía para chillers (Tang 2026): $\\frac{\\partial \\hat{y}}{\\partial x_m} \\ge 0$ garantizada por pesos positivos o penalizada con $\\mathcal{L}_{mono} = \\sum \\max(0, -\\partial \\hat{y}/\\partial x_m)^2$.',
      },
      {
        heading: 'Pérdida total del patrón C',
        tex: '\\mathcal{L}_{total} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,(\\mathcal{L}_{rampa} + \\mathcal{L}_{par} + \\mathcal{L}_{mono})',
        conn:
          'Ninguna de estas pérdidas contiene una EDO del activo térmico: es el "REGULARIZADOR DE FORMA" del diagrama — la frontera aplicada al forecast de demanda.',
      },
    ],
  },
  {
    id: 'd4-mat-3',
    module: 'd4',
    tone: 'magenta',
    kind: 'wide',
    kicker: '5b · Matemática del Diagrama 4',
    title: 'Patrón D — Física de sustancia (circuito RC) · Patrón E — rama física + residual',
    equations: [
      {
        heading: 'D · Circuito térmico equivalente 2R2C (formulación PINN-RC del proyecto)',
        tex: 'C_{in} \\frac{d T_{in}(t)}{dt} = \\frac{T_{out}(t) - T_{in}(t)}{R_{ea}} + \\frac{T_{m}(t) - T_{in}(t)}{R_{in}} + A_w I_{sol}(t) + \\dot{Q}_{int}(t) + P_{HVAC}(t)',
        conn:
          'Segundo nodo (masa de la envolvente): $C_{m} \\frac{d T_{m}(t)}{dt} = \\frac{T_{in}(t) - T_{m}(t)}{R_{in}} + \\frac{T_{out}(t) - T_{m}(t)}{R_{out}}$. "Modelos RC" ↔ los parámetros $(R_{ea}, R_{in}, R_{out}, C_{in}, C_m)$.',
      },
      {
        heading: 'D · Residuo físico y pérdida compuesta',
        tex: '\\mathcal{R}_{phys}(t) = C_{in} \\frac{d \\hat{T}_{in}(t)}{dt} - \\left[ \\frac{T_{out}(t) - \\hat{T}_{in}(t)}{R_{ea}} + A_w I_{sol}(t) + \\dot{Q}_{int}(t) + P_{HVAC}(t) \\right]',
        conn:
          'Y la pérdida $\\mathcal{L}_{physics} = \\frac{1}{\\tilde{N} \\cdot h} \\sum_{n,j} \\lVert \\mathcal{R}_{phys}(t_{n,j}; \\Theta) \\rVert^2$ con $\\mathcal{L}_{total} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,\\mathcal{L}_{physics}$ (puerta ①). "Horizontes cortos": en la literatura $\\mathcal{L}_{physics}$ no se evalúa en protocolo multi-horizonte LTSF (ver decisión pendiente §7.6 de PINN-RC).',
      },
      {
        heading: 'E · Rama física + rama residual + contexto (PhysEmbedFormer)',
        tex: '\\hat{y} = \\underbrace{f_{fis}(\\mathbf{x}_{met})}_{\\text{rama física}} + \\underbrace{g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})}_{\\text{rama residual + contexto}}',
        conn:
          '**Conexión:** puerta ④ con sabor de ② (la rama física es explícita e interpretable). Rama física PV: $P_{pv}(t) = \\eta_{pv}\\, A_{pv}\\, I_{sol}(t)\\,[1 - \\gamma_{pv}(T_c(t) - 25\\,^\\circ\\mathrm{C})]$; la variante "PV con corrección de temperatura PINN" penaliza el residuo de esta ecuación (puerta ①).',
      },
    ],
  },

  // ── §6 Diagrama 5 — Problemas que resuelve ──────────────────────────────
  {
    id: 'd5-figura',
    module: 'd5',
    tone: 'cyan',
    kind: 'split',
    kicker: '6 · Diagrama 5',
    title: '¿Qué problema resuelve cada enfoque PIML en energía?',
    bullets: [
      'Tabla estratégica: cada puerta ataca preferentemente un problema distinto — la decisión informativa del documento.',
      '**① Pérdida** → escasez de datos (★★★): Loffa 2025, Misyris 2020.',
      '**② Arquitectura** → interpretabilidad y transferencia/OOD (★★★).',
      '**③ Datos guiados** → transferencia y estados no observables (★★★).',
      '**④ Híbrido** → escasez y plausibilidad/extrapolación (★★★).',
      'Laterales abiertos (ninguna puerta los resuelve): **UQ**, eventos extremos, cómputo/escalabilidad.',
    ],
    diagram: 'd5',
    diagramTitle: 'Diagrama 5 · Enfoques ①–④ → problemas resueltos (★ = fortaleza)',
    legend: [
      { color: '#2E86AB', label: '① Loss física' },
      { color: '#7D3C98', label: '② Arquitectura' },
      { color: '#16A085', label: '③ Datos guiados' },
      { color: '#E67E22', label: '④ Híbrido' },
      { color: '#F0F4F8', label: 'Problemas (escasez · interpretabilidad · OOD · plausibilidad)' },
    ],
    refs: [
      'Escasez ↔ Loffa et al. 2025 (DOI: 10.1145/3679240.3734642) y Misyris et al. 2020 · Extrapolación ↔ Tang et al. 2026 · Transferencia ↔ arXiv:2509.25158 · UQ ↔ Yang, Meng & Karniadakis, B-PINN, J. Comp. Physics 425, 2021.',
    ],
  },
  {
    id: 'd5-mat-1',
    module: 'd5',
    tone: 'cyan',
    kind: 'wide',
    kicker: '6 · Matemática del Diagrama 5',
    title: 'Lectura matemática de las filas ①–④',
    bullets: [
      '**① vs escasez:** $\\lambda_{phys}\\,\\mathcal{L}_{physics}$ restringe la clase de funciones admisibles a las que casi satisfacen $\\mathcal{N}[u] = 0$ → aumenta el tamaño efectivo de la muestra; la ganancia aparece "EXACTAMENTE con pocos datos" (Loffa 2025) y se desvanece con abundancia.',
      '**② vs interpretabilidad/transferencia:** si $f_\\theta$ se factoriza con significado físico (p. ej. $\\hat{y} = f_{fis}(\\mathbf{x}_{met}) + g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})$), cada término es inspeccionable y la parte física es válida fuera del dominio de entrenamiento.',
      '**④ vs plausibilidad/extrapolación:** fuera del rango de entrenamiento $g_\\theta$ puede fallar, pero $f_{fisica}$ sigue siendo evaluable y correcta; el error total queda acotado por el del componente físico (grey-box: Bacher & Madsen 2011).',
    ],
    equations: [
      {
        heading: '③ vs estados no observables: posterior del GP con prior físico',
        tex: '\\bar{f}(x) = \\mathbf{k}(x)^\\top (\\mathbf{K}_{GP} + \\sigma_n^2 \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** con $f \\sim \\mathcal{GP}(m_{fis}, \\kappa_{fis})$ (PhI-GPR, IJF 2023), la posterior puede reconstruir estados que ningún dato mide directamente, siempre que el modelo dinámico esté bien especificado (donde ARIMA/GPR puro fracasan).',
      },
    ],
  },
  {
    id: 'd5-mat-2',
    module: 'd5',
    tone: 'cyan',
    kind: 'wide',
    kicker: '6 · Matemática del Diagrama 5',
    title: 'Problemas laterales: UQ, eventos extremos y escalabilidad',
    equations: [
      {
        heading: 'UQ bayesiana (B-PINN): posterior sobre parámetros y predictiva marginal',
        tex: 'p(\\Theta \\mid \\mathcal{D}) = \\frac{p(\\mathcal{D} \\mid \\Theta)\\,p(\\Theta)}{p(\\mathcal{D})}, \\qquad p(y^* \\mid \\mathbf{x}^*, \\mathcal{D}) = \\int p(y^* \\mid \\mathbf{x}^*, \\Theta)\\, p(\\Theta \\mid \\mathcal{D})\\, d\\Theta',
        conn:
          'Muestreada con HMC o variacional: costo prohibitivo para forecasting operativo (Yang et al. 2021). La alternativa barata y rigurosa: **cuantiles conformales**.',
      },
      {
        heading: 'Cuantiles conformales: cobertura $\\ge 1-\\alpha$ sin supuestos distribucionales',
        tex: '\\hat{q} = \\mathrm{Quantile}\\!\\left(\\{s_i\\}_{i=1}^{n};\\; \\frac{\\lceil (n+1)(1-\\alpha) \\rceil}{n}\\right), \\qquad C(\\hat{y}) = \\left[ \\hat{y} - \\hat{q},\\; \\hat{y} + \\hat{q} \\right]',
        conn:
          'con puntajes de no conformidad $s_i = |y_i - \\hat{y}_i|$ sobre un conjunto de calibración de tamaño $n$; $\\mathbb{P}\\{y \\in C(\\hat{y})\\} \\ge 1 - \\alpha$. El **hueco** más claro del mapa energético.',
      },
    ],
    bullets: [
      '**Eventos extremos:** particionar el test en el evento $\\mathcal{E}$ (cold snap) y su complemento, reportando $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ por separado — ERCOT 2026 muestra que $\\mathcal{L}_{par} + \\mathcal{L}_{rampa}$ mejora la *forma* durante $\\mathcal{E}$ sin resolver la magnitud del pico.',
      '**Cómputo:** evaluar $\\mathcal{L}_{physics}$ crece con los puntos de colocación $N_c$ y el orden de las derivadas de $\\mathcal{N}$; no existen PINNs energéticas entrenadas sobre datasets del tamaño de ECL/IHEPC ($\\sim 10^6$–$10^7$ muestras).',
    ],
  },

  // ── §7 Diagrama 6 — Opciones de problema ────────────────────────────────
  {
    id: 'd6-figura',
    module: 'd6',
    tone: 'red',
    kind: 'split',
    kicker: '7 · Diagrama 6',
    title: 'Árbol de opciones de problema (NO vinculado a ningún modelo)',
    bullets: [
      'Opciones de problema que la tesis podría abarcar — **sin votar todavía**; la decisión formal corresponde a la formulación del modelo.',
      '**A** Escasez de datos en medición real de edificio/campus (evidencia: Loffa 2025, Misyris 2020).',
      '**B** Interpretabilidad por rama física/espectral **etiquetada** — sin precedentes en demanda eléctrica con armónicos etiquetados.',
      '**C** Cuantificación de incertidumbre — el hueco más claro; conformal = candidato barato y riguroso.',
      '**D** Robustez / extrapolación a eventos extremos y OOD — abierta por ERCOT 2026.',
      'Las opciones **no son excluyentes**: las combinaciones se refuerzan (A potenciado por B, C potenciado por A…).',
    ],
    diagram: 'd6',
    diagramTitle: 'Diagrama 6 · ¿A qué problema apuntar? — opciones abiertas',
    legend: [
      { color: '#1E3A5F', label: 'Pregunta (cabeza)' },
      { color: '#5B8DBE', label: 'Opción estándar (A)' },
      { color: '#E67E22', label: 'Hueco claro (B, C)' },
      { color: '#C0392B', label: 'Más reciente / abierta (D)' },
      { color: '#F0F4F8', label: 'Nota de combinación' },
    ],
    refs: [
      'Anclajes de evidencia por opción en §7 ("Matemática del Diagrama 6"); decisión informativa: Tabla 5 (§6) y opciones (§7); resolución posterior a este documento.',
    ],
  },
  {
    id: 'd6-mat-1',
    module: 'd6',
    tone: 'red',
    kind: 'wide',
    kicker: '7 · Matemática del Diagrama 6',
    title: 'Anclajes A y B — régimen de escasez y bandas etiquetadas',
    bullets: [
      '**Opción A (escasez de datos):** régimen $\\tilde{N}$ pequeño → el término $\\lambda_{phys}\\,\\mathcal{L}_{physics}$ domina la geometría de la pérdida; existe un umbral de disponibilidad de datos por debajo del cual $\\mathcal{L}_{MSE} + \\lambda_{phys}\\,\\mathcal{L}_{physics}$ con el residuo RC de la §5b-D supera a $\\mathcal{L}_{MSE}$ sola (Loffa 2025). Es el argumento del regularizador de la fila ① (§6).',
    ],
    equations: [
      {
        heading: 'B · Descomposición por bandas espectralmente etiquetadas',
        tex: '\\mathbf{z}_t = [\\boldsymbol{\\phi}_1(\\mathbf{x}_t), \\dots, \\boldsymbol{\\phi}_K(\\mathbf{x}_t)] \\in \\mathbb{R}^{F}, \\qquad F = K\\,N_f',
        conn:
          '**Conexión:** cada banda $\\boldsymbol{\\phi}_k$ con su ancho $\\mathrm{softplus}(\\rho_k)$ queda *etiquetada* con una escala temporal física ($B = (6, 24, 72)$ h o $(4, 24, 168)$ h): separa explícitamente armónicos diarios/semanales del contenido residual rápido — el análogo **aprendible** de la descomposición E8 ($y(t) = \\sum_j c_j(t) + r(t)$), pero dentro del modelo y con significado físico asignable. Sin precedente en demanda eléctrica.',
      },
    ],
  },
  {
    id: 'd6-mat-2',
    module: 'd6',
    tone: 'red',
    kind: 'wide',
    kicker: '7 · Matemática del Diagrama 6',
    title: 'Anclajes C y D — conformal y evaluación por régimen',
    bullets: [
      '**Opción C (UQ):** candidato conformal (§6): intervalos $C(\\hat{y}) = [\\hat{y} - \\hat{q},\\, \\hat{y} + \\hat{q}]$ con cobertura $\\mathbb{P}\\{y \\in C(\\hat{y})\\} \\ge 1 - \\alpha$, aplicables sobre cualquier predictor (incluido un PIML) sin modificar su entrenamiento; frente a B-PINN, cuya posterior $p(\\Theta \\mid \\mathcal{D})$ es prohibitiva en forecasting.',
      '**Opción D (robustez/extremos):** protocolo de evaluación por régimen — partición del test en el evento $\\mathcal{E}$ y su complemento, con $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ reportada por separado — más regularizadores de forma $\\mathcal{L}_{rampa}$, $\\mathcal{L}_{par}$ (§5b-C) para sostener la plausibilidad de la curva durante el evento.',
    ],
  },

  // ── §8 Lectura conjunta ─────────────────────────────────────────────────
  {
    id: 'lectura',
    module: 'lectura',
    tone: 'green',
    kind: 'wide',
    kicker: '8 · Lectura conjunta',
    title: 'Los seis diagramas en una tabla',
    table: [
      ['Diagrama', 'Pregunta que responde', 'Matemática asociada'],
      ['1', 'Cómo entra la física (4 puertas)', '$\\mathcal{L}_{total}$, $\\mathbb{J}\\nabla H_\\theta$, $\\psi_{fis}$, $f_{fisica} + g_\\theta$ (§3)'],
      ['2', 'Qué familias PIML existen para TS (general)', 'F1–F6: PINN, PG-RNN, Neural ODE/SDE, PhyDNet, kernel/GPR, PINT/RFF (§4)'],
      ['3', 'Qué familias data-driven hay en energía (base)', 'E1–E8: SARIMA, SVR/XGBoost, LSTM/GRU, TCN, atención, SSM, fundacionales, VMD (§5a)'],
      ['4', 'Dónde TS ∩ física ∩ energía (patrones A–E)', 'swing, flujo de potencia, pérdidas de forma, RC 2R2C + $\\mathcal{R}_{phys}$, rama física+residual (§5b)'],
      ['5', 'Qué problema resuelve cada enfoque', 'regularizador físico, posterior B-PINN, cuantiles conformales (§6)'],
      ['6', 'Opciones de problema (sin conectar a modelo)', 'anclajes A–D: régimen de escasez, bandas etiquetadas, conformal, evaluación por régimen (§7)'],
    ],
    bullets: [
      'El estado del arte PIML en energía cubre de forma desigual: riguroso en dinámica de red (A/B), de forma en demanda (C), de sustancia en edificios con horizontes cortos (D), moderno en renovables (E).',
      'La decisión informativa es la **Tabla 5 (problemas)**, seguida de las **opciones abiertas (§7)**; su resolución es un paso de investigación pendiente para el siguiente documento (formulación).',
    ],
  },

  // ── §9 Notas + cierre ───────────────────────────────────────────────────
  {
    id: 'notas',
    module: 'cierre',
    tone: 'yellow',
    kind: 'wide',
    kicker: '9 · Notas de uso para la tesis',
    title: 'Cómo usar este mapa en el documento final',
    bullets: [
      'Los surveys ancla (Karniadakis 2021; Hao 2022; Willard 2022; arXiv:2408.09840; Springer 2025; Doumèche 2025) forman la **columna vertebral citable** del capítulo de física-informada.',
      'El review del lado de potencia es Huang & Wang 2023 (IEEE TPS); el de edificios, el "PIML for building performance simulation review".',
      'Los DOIs/arXiv listados fueron verificados a la fecha del encabezado; **re-verificar** al editar la bibliografía final.',
      'La tabla de notación §1 es la **referencia obligada** para el capítulo de formulación: los símbolos del modelo propuesto ($\\rho_k, \\mathbf{W}_k, \\mathbf{b}_k, N_f, K, \\tau, h, \\mathbf{X}, \\hat{\\mathbf{y}}$; RC: $T_{in}, T_{out}, T_m, C_{in}, C_m, R_{ea}, R_{in}, R_{out}, I_{sol}, A_w, \\dot{Q}_{int}, P_{HVAC}, \\mathcal{R}_{phys}, \\lambda_{phys}$) provienen de los documentos matemáticos del proyecto y **no deben renombrarse**.',
    ],
  },
  {
    id: 'closing',
    module: 'cierre',
    tone: 'yellow',
    kind: 'cover',
    kicker: '10 · Cierre',
    title: 'Gracias',
    subtitle: 'Preguntas y discusión — el siguiente paso del documento es la formulación del modelo',
    metaLines: [
      'Revisión PIML — Versión matemática · Series de tiempo y sistemas energéticos',
      'Universidad Nacional de Colombia',
    ],
    year: '2026',
  },
];
