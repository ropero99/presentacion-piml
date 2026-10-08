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

  // ── §1 Notación ─────────────────────────────────────────────────────────
  {
    id: 'notacion',
    module: 'notacion',
    tone: 'purple',
    kind: 'wide',
    kicker: '2 · Notación',
    title: 'Tabla de notación: grupos, símbolos y su uso',
    table: [
      ['Grupo', 'Símbolos', 'Uso'],
      [
        'Convención temporal (continuo y discreto)',
        'continuo, paréntesis $(\\,)$: $x(t)$, $\\dot{x}(t)$, $u(t,\\mathbf{x})$; discreto, corchetes $[\\,]$ con índice entero: $y[t]$, $\\mathbf{z}[t]$, $\\mathbf{h}[t-1]$, $\\hat{y}[j]$.',
        'Regla transversal: toda magnitud dependiente del tiempo lleva argumento explícito —paréntesis en continuo, corchetes con índice entero en discreto—; los paréntesis con argumento no temporal conservan su sentido.',
      ],
      [
        'Series y marco general',
        '$y[t]$ observada, $\\hat{\\mathbf{y}} \\in \\mathbb{R}^h$ multi-paso directa, ventana $\\mathbf{X} \\in \\mathbb{R}^{\\tau \\times d}$, pérdidas $\\mathcal{L}_{MSE}$, $\\mathcal{L}_{phys}$, $\\mathcal{L}_{total}$, peso $\\lambda_{phys}$, residuo $\\mathcal{R}_{phys}$, ley $\\mathcal{F}[u] = 0$ en dominio $\\Omega_T$.',
        'Marco común: series, pérdidas y ley física. Toda penalización es $\\lambda_{\\cdot}$ y la rama física se escribe $f_{fis}$.',
      ],
      [
        'Codificador RFF multibanda (artículo guía)',
        'kernel $\\kappa$, bandas $K$ con ancho $\\mathrm{softplus}(\\rho_k)$, $N_f$ features por banda, mapeo $\\boldsymbol{\\phi}_k$ (Ecuación 24), embedding $\\mathbf{z}[t] \\in \\mathbb{R}^{F}$ con $F = K N_f$, secuencia $\\mathbf{Z} = \\Phi_{MB}(\\mathbf{X})$; pre-set $B = (6, 24, 72)$ h.',
        'Codificador espectral del artículo guía (familia F6): el mapeo RFF canónico es la Ecuación (24) y la densidad espectral, $p(\\mathbf{w}) = \\mathcal{N}(\\mathbf{0}, \\rho^{-2}\\mathbf{I})$.',
      ],
      [
        'TSB y recurrencia',
        'convolución con dilatación $\\breve{d}$ y kernel $\\breve{k}$, GELU $\\breve{\\sigma}$, LayerNorm $\\mathrm{LN}$, estado $\\breve{\\mathbf{h}}[t]$, módulo $f_{RNN}$.',
        'Backbone secuencial del artículo guía (bloque TCN: residual + GELU + LN); en GRU la compuerta de actualización es $\\mathbf{u}[t]$ (**no** $\\mathbf{z}[t]$, para no colisionar con el embedding espectral).',
      ],
      [
        'Física térmica RC (PINN-RC)',
        'temperaturas $T_{in}, T_{out}, T_m$; capacidades $C_{in}, C_m$; resistencias $R_{ea}, R_{in}, R_{out}$.',
        'Variables de estado y parámetros del circuito térmico 2R2C (patrón D, §5b) cuyo residuo penaliza la PINN-RC.',
      ],
      [
        'Exógenas y drivers',
        '$I_{sol}$, $A_w$, $\\dot{Q}_{int}$, $P_{HVAC}$; drivers de calendario y ocupación.',
        'Forzamientos (entradas exógenas) del modelo RC y covariables de calendario/ocupación del forecasting.',
      ],
      [
        'Símbolos locales',
        '$\\mathcal{B}$ (E1), $\\mathbf{A}, \\mathbf{B}, \\mathbf{C}$ (E6), instantes $t_i$, $t_j$ y muestras $i$, convolución E4 $f[i]$, $s[t]$; E2: $\\theta \\in \\mathbb{R}^{d}$, $\\mathbf{D}$, $\\varepsilon_i$, $\\lambda_{reg}$, $c$, $(\\cdot)_{+}$, $\\varepsilon_{svr}$, $\\lambda_{svr}$; SVD: $\\mathbf{U}, \\mathbf{S}, \\mathbf{V}$.',
        'Existen solo dentro de su ecuación. $t_i$ son valores de $t$ continuo: paréntesis, $x(t_i)$; $i$ numera muestras, no tiempo: subíndice, nunca corchete. Colisiones: $\\varepsilon_i$ (ruido), $\\varepsilon[t]$ (innovación) y $\\varepsilon_{svr}$ (tolerancia del tubo) son conceptos distintos; $\\mathbf{U}$ es factor del SVD y $\\mathbf{U}_i$ compuerta; $\\mathcal{N}$ es sólo la normal —la ley física es $\\mathcal{F}[u] = 0$—.',
      ],
      [
        'Decisiones de unificación',
        '$\\theta$ parámetros del modelo (único); $\\Theta$ conjunto de parámetros; $\\lambda_{phys}, \\lambda_{reg}, \\lambda_{svr}, \\lambda_{rk}$ penalizaciones; $\\mathcal{L}$ pérdida; $\\mathbf{u}[t]$ compuerta GRU; $f_{fis}$ rama física.',
        '$\\theta$ es el **único** símbolo de los parámetros: los coeficientes de una regresión, los pesos de una red y las matrices de compuerta son $\\theta$ o bloques con nombre de $\\theta$; $\\Theta$ es el conjunto donde vive.',
      ],
    ],
  },

  // ── §3 Diagrama 1 — Cuatro puertas ──────────────────────────────────────
  {
    id: 'd1-figura',
    module: 'd1',
    tone: 'blue',
    kind: 'diagram',
    kicker: '3 · Diagrama 1',
    title: 'Las cuatro puertas por las que entra la física',
    lead: [
      'Un solo punto de partida: el modelo ML $\\hat{y} = f_\\theta(\\mathbf{x})$ y el conocimiento físico $\\mathcal{F}[u] = 0$.',
      'De ese binomio **modelo + ley física** salen cuatro canales de entrada, ordenados por fuerza de garantía: **① penalización débil → ② arquitectura → ③ datos/features → ④ híbrido**.',
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
    id: 'd1-mr',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '3 · Sistema ejemplar',
    title: 'El sistema ejemplar: masa-resorte-amortiguador (MR)',
    bullets: [
      'Un solo sistema físico para comparar las tres puertas: la ley $\\mathcal{F}[u]=0$ instanciada en el MR.',
      '**Envolvente amortiguada:** en régimen subamortiguado la solución $x(t) \\sim e^{-\\gamma t}\\cos(\\omega t)$, con $\\omega = \\sqrt{k/m - \\gamma^2}$, decae dentro de una envolvente exponencial $\\pm e^{-\\gamma t}$; $\\gamma = c/2m$ controla cuánto tarda en apagarse la oscilación — conexión directa con la disipación térmica que la puerta ① inyecta como pérdida.',
    ],
    equations: [
      {
        heading: 'Ecuación de movimiento (residuo físico)',
        tex: '\\mathcal{F}[x] \\;\\equiv\\; m\\,\\ddot{x}(t) + c\\,\\dot{x}(t) + k\\,x(t) = 0',
        conn: '**MR:** masa $m$, rigidez $k$, amortiguamiento $c$; la trayectoria $x(t)$ es lo que cada puerta predice.',
      },
      {
        heading: 'Estado canónico y energía',
        tex: 'q(t) = x(t), \\quad p(t) = m\\,\\dot{x}(t), \\quad H(q(t), p(t)) = \\frac{p(t)^2}{2m} + \\frac{k\\,q(t)^2}{2} \\quad (c = 0)',
        conn: '**Conexión:** el caso conservativo ($c=0$) es hamiltoniano puro; es la forma que exige la puerta ②. $q(t)$ y $p(t)$ son los estados (posición y momento) en cada instante; $H$ se evalúa sobre esa trayectoria.',
      },
      {
        heading: 'Datos disponibles',
        tex: '\\mathbf{x}_i = (t_i, x(t_i), \\dot{x}(t_i)), \\qquad i = 1, \\dots, N_d',
        conn: '**Conexión:** las tres puertas consumen el mismo dato básico: trayectoria medida del MR.',
      },
    ],
    notes:
      'Las tres páginas siguientes instancian $\\mathcal{F}[u]=0$ sobre este sistema: misma física, distinto punto de entrada.',
  },
  {
    id: 'd1-puerta1',
    module: 'd1',
    tone: 'blue',
    kind: 'door',
    kicker: '3 · Puerta ① · Forma débil',
    title: 'Puerta ① — Función de pérdida (PINN)',
    lema: 'La física entra en la **función de pérdida (costo)**: se penaliza, no se garantiza.',
    equations: [
      {
        heading: 'Modelo',
        tex: '\\hat{x}(t) = f_\\theta(t), \\qquad \\theta \\in \\Theta',
        conn: '**Conexión:** la red aproxima la solución del sistema masa-resorte; es el bloque "Modelo ML f_θ" del diagrama.',
      },
      {
        heading: 'Residuo físico (diferenciación automática)',
        tex: 'r_\\theta(t_j) = m\\,\\ddot{\\hat{x}}_\\theta(t_j) + c\\,\\dot{\\hat{x}}_\\theta(t_j) + k\\,\\hat{x}_\\theta(t_j)',
        conn: '**Conexión:** la caja punteada "Diff. automática" produce $r_\\theta$ en los puntos de colocación $t_j$; es $\\mathcal{F}[\\hat{x}_\\theta]$ de la ley $\\mathcal{F}[u]=0$.',
      },
      {
        heading: 'Función de pérdida',
        tex: '\\mathcal{L}_{total}(\\theta) = \\underbrace{\\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| f_\\theta(t_i) - x(t_i) \\right|^2}_{\\mathcal{L}_{MSE}} \\;+\\; \\lambda_{phys}\\,\\underbrace{\\frac{1}{N_c}\\sum_{j=1}^{N_c} \\left\\| r_\\theta(t_j) \\right\\|^2}_{\\mathcal{L}_{phys}}',
        conn: '**Conexión:** la línea inferior del diagrama es exactamente esta suma: la física entra en el segundo término, no en la estructura.',
      },
      {
        heading: 'Problema de optimización',
        tex: '\\theta^* = \\arg\\min_{\\theta \\in \\Theta}\\; \\mathcal{L}_{total}(\\theta)',
        conn: 'El residuo entra en la pérdida, no en la estructura: el cumplimiento depende de $\\lambda_{phys}$ y del entrenamiento.',
      },
    ],
    refs: [
      'Raissi, Perdikaris, Karniadakis. Physics-informed neural networks. J. Comput. Phys. 378, 686–707, 2019.',
      'Karniadakis et al. Physics-informed machine learning. Nat. Rev. Phys. 3(6), 422–440, 2021. DOI: 10.1038/s42254-021-00314-5.',
      'Doumèche. Physics-informed ML: time series forecasting. Tesis Sorbonne, arXiv:2507.08906, 2025.',
    ],
  },
  {
    id: 'd1-puerta1-diagram',
    module: 'd1',
    tone: 'blue',
    kind: 'diagram',
    kicker: '3 · Puerta ① · Forma débil · diagrama',
    diagram: 'mr1',
    diagramTitle: 'MR · Puerta ① — la física entra en la función de pérdida',
    legend: [
      { color: '#1E3A5F', label: 'Sistema MR / física' },
      { color: '#2E86AB', label: '① Pérdida (débil)' },
      { color: '#34495E', label: 'Modelo ML $f_\\theta$' },
      { color: '#C0392B', label: 'Minimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta2',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '3 · Puerta ② · Forma fuerte',
    title: 'Puerta ② — Arquitectura (Hamiltonian NN)',
    lema: 'La física entra en la **estructura del modelo**: se cumple **por construcción** para todo $\\theta$.',
    derivation: [
      '$(q(t), p(t))$',
      '$f_\\theta$ — red neuronal',
      '$H_\\theta(q(t),p(t))$',
      '$\\nabla H_\\theta$ (autodiff)',
      '$\\mathbb{J}\\,\\nabla H_\\theta$ → dinámica',
    ],
    equations: [
      {
        heading: 'Estado canónico y Hamiltoniano físico',
        tex: 'q(t) = x(t), \\qquad p(t) = m\\,\\dot{x}(t), \\qquad H(q(t), p(t)) = \\frac{p(t)^2}{2m} + \\frac{k\\,q(t)^2}{2} \\quad (c = 0)',
        conn: '**Conexión:** para el sistema masa-resorte conservativo, el Hamiltoniano representa la energía mecánica total. $q(t)$: posición generalizada · $p(t)$: momento — estados en cada instante $t$ · $H$: energía total instantánea.',
      },
      {
        heading: 'La red aprende el Hamiltoniano (función escalar)',
        tex: 'f_\\theta:\\ (q(t), p(t)) \\;\\longmapsto\\; H_\\theta(q(t), p(t)) \\approx H(q(t), p(t))',
        conn: '**Conexión:** la red **no predice directamente** $q(t)$ ni $p(t)$: aprende una función escalar. $H_\\theta$ **no se compara necesariamente con etiquetas de energía**: se aprende porque su gradiente debe reproducir la dinámica observada. Entrada de la red $= (q(t), p(t))$ · salida $= H_\\theta(q(t), p(t))$.',
      },
      {
        heading: 'Autodiff y ecuaciones de Hamilton — ★ PUNTO DONDE ENTRA LA FÍSICA',
        tex: '\\dot{q}_\\theta(t) = \\frac{\\partial H_\\theta}{\\partial p}, \\qquad \\dot{p}_\\theta(t) = -\\frac{\\partial H_\\theta}{\\partial q}, \\qquad \\frac{d}{dt}\\begin{bmatrix} q(t) \\\\ p(t) \\end{bmatrix} = \\mathbb{J}\\,\\nabla H_\\theta',
        bridge: {
          chain: [
            { tex: 'H_\\theta(q(t),\\,p(t))' },
            { step: 'Autodiff' },
            { tex: '\\left( \\partial H_\\theta / \\partial q,\\; \\partial H_\\theta / \\partial p \\right)' },
            { step: 'Ecs. de Hamilton' },
            { tex: '\\left( \\dot{q}_\\theta(t),\\; \\dot{p}_\\theta(t) \\right)' },
          ],
        },
        conn: '**La física NO entra como penalización: entra en la estructura.** Las ecs. de Hamilton (con $\\mathbb{J} = \\begin{bmatrix} 0 & 1 \\\\ -1 & 0 \\end{bmatrix}$) no «transforman» mágicamente una derivada en otra: son la regla física que convierte las pendientes de $H_\\theta$ respecto al estado $(q(t), p(t))$ en las tasas de cambio temporal $(\\dot{q}_\\theta(t), \\dot{p}_\\theta(t))$.',
      },
      {
        heading: 'Función de pérdida (dinámica) y optimización',
        tex: '\\mathcal{L}_{HNN}(\\theta) = \\frac{1}{N}\\sum_{n=1}^{N}\\left[ \\left| \\dot{q}_\\theta(t_n) - \\dot{q}(t_n) \\right|^2 + \\left| \\dot{p}_\\theta(t_n) - \\dot{p}(t_n) \\right|^2 \\right], \\qquad \\theta^* = \\arg\\min_{\\theta}\\, \\mathcal{L}_{HNN}(\\theta)',
        conn: '**Conexión:** los objetivos salen de los datos: $\\dot{q}(t_n) = \\dot{x}(t_n)$ y $\\dot{p}(t_n) = m\\,\\ddot{x}(t_n)$; si no hay aceleración medida, $\\dot{p}(t_n)$ se estima por diferencias finitas. Con $\\dot{q}_\\theta(t) = \\partial H_\\theta/\\partial p$ y $\\dot{p}_\\theta(t) = -\\partial H_\\theta/\\partial q$, no existe $\\mathcal{L}_{phys}$ separado: la física ya está incorporada en la arquitectura.',
      },
    ],
    notes:
      'Mensaje clave: la HNN no aprende directamente la trayectoria — aprende $H_\\theta(q(t), p(t))$; las ecuaciones de Hamilton convierten su gradiente en la dinámica y un integrador recupera $(q(t), p(t))$.',
    refs: [
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018.',
    ],
  },
  {
    id: 'd1-puerta2-deriv',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '3 · Puerta ② · Desglose matemático',
    title: 'Puerta ② — Del Hamiltoniano a la dinámica del masa-resorte',
    lema: 'De dónde salen las ecuaciones que la puerta ② impone como estructura: tres pasos desde la energía hasta la EDO del MR ($c = 0$).',
    equations: [
      {
        heading: 'Paso 1 · Construcción del Hamiltoniano',
        tex: 'q(t) = x(t), \\quad p(t) = m\\,\\dot{x}(t), \\quad T = \\frac{p(t)^2}{2m}, \\quad V = \\frac{k\\,q(t)^2}{2} \\;\\Rightarrow\\; H = T + V = \\frac{p(t)^2}{2m} + \\frac{k\\,q(t)^2}{2}',
        conn: '**Conexión:** el Hamiltoniano representa la energía total del sistema conservativo: energía cinética más energía potencial del resorte.',
      },
      {
        heading: 'Paso 2 · Ecuaciones de Hamilton',
        tex: '\\dot{q}(t) = \\frac{\\partial H}{\\partial p} = \\frac{p(t)}{m}, \\qquad \\dot{p}(t) = -\\frac{\\partial H}{\\partial q} = -k\\,q(t)',
        conn: '**Conexión:** las derivadas del Hamiltoniano determinan cómo cambia el estado del sistema. $H$ no entrega directamente la trayectoria: entrega la regla de evolución del sistema.',
      },
      {
        heading: 'Paso 3 · Recuperación de la ecuación física',
        tex: 'p(t) = m\\,\\dot{q}(t) \\;\\Rightarrow\\; \\dot{p}(t) = m\\,\\ddot{q}(t) \\;\\Rightarrow\\; m\\,\\ddot{q}(t) + k\\,q(t) = 0 \\;\\Rightarrow\\; m\\,\\ddot{x}(t) + k\\,x(t) = 0',
        conn: '**Conexión:** las ecuaciones de Hamilton recuperan exactamente la ecuación original del masa-resorte (identificación $q(t) \\equiv x(t)$ del Paso 1): la dinámica sale de $H$ por derivación, no se aprende.',
      },
      {
        heading: 'Conservación de energía (por construcción)',
        tex: '\\frac{dH}{dt} = \\nabla H^{\\top}\\, \\mathbb{J}\\, \\nabla H = 0 \\quad\\Rightarrow\\quad H(t) = \\text{constante a lo largo de la trayectoria}',
        conn: '**Destacado:** la conservación de energía aparece por construcción debido a la estructura Hamiltoniana — aplica al caso conservativo $c = 0$ y sin fuerza externa; en la HNN, vale para todo $\\theta$.',
      },
    ],
    notes:
      'Nota: la formulación alternativa basada en Euler–Lagrange, la Lagrangian Neural Network (§F3 del documento), se desarrolla en las dos diapositivas siguientes.',
    refs: [
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018.',
    ],
  },
  {
    id: 'd1-puerta2-lagrange',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '3 · Puerta ② · Forma fuerte (Lagrangian NN)',
    title: 'Puerta ② — Arquitectura (Lagrangian NN)',
    lema: 'La física entra en la **estructura del modelo**: se cumple **por construcción** para todo $\\theta$, ahora a través del principio de acción.',
    derivation: [
      '$(q(t), \\dot{q}(t))$',
      '$f_\\theta$ — red neuronal',
      '$L_\\theta(q(t),\\dot{q}(t))$',
      '$\\partial L_\\theta$ (autodiff)',
      'Euler–Lagrange → dinámica',
    ],
    equations: [
      {
        heading: 'Estado generalizado y Lagrangiano físico',
        tex: 'q(t) = x(t), \\qquad \\dot{q}(t) = \\dot{x}(t), \\qquad L(q(t), \\dot{q}(t)) = T - V = \\frac{m\\dot{q}(t)^2}{2} - \\frac{k\\,q(t)^2}{2} \\quad (c = 0)',
        conn: '**Conexión:** para el sistema masa-resorte conservativo, el Lagrangiano es energía cinética menos energía potencial — misma notación $q(t)$, $\\dot{q}(t)$ y los mismos $m$, $k$ del bloque hamiltoniano ($H = T + V$, $L = T - V$). $L$: función escalar.',
      },
      {
        heading: 'La red aprende el Lagrangiano (función escalar)',
        tex: 'f_\\theta:\\ (q(t), \\dot{q}(t)) \\;\\longmapsto\\; L_\\theta(q(t), \\dot{q}(t)) \\approx L(q(t), \\dot{q}(t))',
        conn: '**Conexión:** igual que la HNN, la LNN **no predice directamente** $q(t)$: aprende una función escalar. $L_\\theta$ **no se compara con etiquetas de energía**: se aprende porque sus derivadas deben reproducir la dinámica observada. Entrada de la red $= (q(t), \\dot{q}(t))$ · salida $= L_\\theta(q(t), \\dot{q}(t))$.',
      },
      {
        heading: 'Autodiff y ecuación de Euler–Lagrange — ★ PUNTO DONDE ENTRA LA FÍSICA',
        tex: '\\frac{d}{dt}\\,\\frac{\\partial L_\\theta}{\\partial \\dot{q}} - \\frac{\\partial L_\\theta}{\\partial q} = 0',
        bridge: {
          chain: [
            { tex: 'L_\\theta(q(t),\\,\\dot{q}(t))' },
            { step: 'Autodiff' },
            { tex: '\\left( \\partial L_\\theta / \\partial q,\\; \\partial L_\\theta / \\partial \\dot{q} \\right)' },
            { step: 'Ecs. de Euler–Lagrange' },
            { tex: '\\ddot{q}_\\theta(t) \\Rightarrow \\text{dinámica}' },
          ],
        },
        conn: '**La física NO entra como penalización: entra en la estructura.** La ec. de Euler–Lagrange (principio de acción) es la regla física que convierte las derivadas parciales de $L_\\theta$ respecto al estado $(q(t), \\dot{q}(t))$ en la aceleración $\\ddot{q}_\\theta(t)$: el análogo lagrangiano de $\\mathbb{J}\\,\\nabla H_\\theta$, con $\\partial L_\\theta$ en lugar de $\\nabla H_\\theta$.',
      },
      {
        heading: 'Función de pérdida (dinámica) y optimización',
        tex: '\\mathcal{L}_{LNN}(\\theta) = \\frac{1}{N}\\sum_{n=1}^{N}\\left| \\ddot{q}_\\theta(t_n) - \\ddot{q}(t_n) \\right|^2, \\qquad \\theta^* = \\arg\\min_{\\theta}\\, \\mathcal{L}_{LNN}(\\theta)',
        conn: '**Conexión:** los objetivos salen de los datos: $\\ddot{q}(t_n) = \\ddot{x}(t_n)$ (diferencias finitas si solo hay posición medida); $\\ddot{q}_\\theta(t_n)$ se obtiene resolviendo la ec. de Euler–Lagrange para $L_\\theta$. No existe $\\mathcal{L}_{phys}$ separado: la física ya está incorporada en la arquitectura, igual que en la HNN.',
      },
    ],
    notes:
      'Mensaje clave: la LNN tampoco aprende directamente la trayectoria — aprende $L_\\theta(q(t), \\dot{q}(t))$; la ecuación de Euler–Lagrange convierte sus derivadas en la aceleración y un integrador recupera $(q(t), \\dot{q}(t))$.',
    refs: [
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018.',
    ],
  },
  {
    id: 'd1-puerta2-lagrange-deriv',
    module: 'd1',
    tone: 'purple',
    kind: 'door',
    kicker: '3 · Puerta ② · Desglose matemático (Lagrangian NN)',
    title: 'Puerta ② — Del Lagrangiano a la dinámica del masa-resorte',
    lema: 'De dónde sale la regla de evolución que la LNN impone como estructura: tres pasos desde $L = T - V$ hasta la EDO del MR ($c = 0$), y su equivalencia con la formulación hamiltoniana.',
    equations: [
      {
        heading: 'Paso 1 · Construcción del Lagrangiano',
        tex: 'q(t) = x(t), \\quad \\dot{q}(t) = \\dot{x}(t), \\quad T = \\frac{m\\dot{q}(t)^2}{2}, \\quad V = \\frac{k\\,q(t)^2}{2} \\;\\Rightarrow\\; L = T - V = \\frac{m\\dot{q}(t)^2}{2} - \\frac{k\\,q(t)^2}{2}',
        conn: '**Conexión:** el Lagrangiano usa las mismas $m$, $k$ y la misma trayectoria $x(t)$ que el Hamiltoniano: energía cinética menos potencial en lugar de más.',
      },
      {
        heading: 'Paso 2 · Ecuación de Euler–Lagrange',
        tex: '\\frac{\\partial L}{\\partial \\dot{q}} = m\\,\\dot{q}(t), \\qquad \\frac{\\partial L}{\\partial q} = -k\\,q(t) \\;\\Rightarrow\\; \\frac{d}{dt}\\,\\frac{\\partial L}{\\partial \\dot{q}} - \\frac{\\partial L}{\\partial q} = m\\,\\ddot{q}(t) + k\\,q(t) = 0',
        conn: '**Conexión:** las derivadas del Lagrangiano determinan cómo cambia el estado del sistema. $L$ no entrega directamente la trayectoria: entrega la regla de evolución (principio de acción), igual que $H$ en la formulación anterior.',
      },
      {
        heading: 'Paso 3 · Recuperación de la ecuación física',
        tex: 'm\\,\\ddot{q}(t) + k\\,q(t) = 0 \\;\\Rightarrow\\; m\\,\\ddot{x}(t) + k\\,x(t) = 0',
        conn: '**Conexión:** la ecuación de Euler–Lagrange recupera exactamente la ecuación original del masa-resorte (identificación $q(t) \\equiv x(t)$ del Paso 1): la dinámica sale de $L$ por derivación, no se aprende.',
      },
      {
        heading: 'Equivalencia con la formulación hamiltoniana (transformada de Legendre)',
        tex: 'p(t) = \\frac{\\partial L}{\\partial \\dot{q}} = m\\,\\dot{q}(t) \\;\\Rightarrow\\; H = p(t)\\,\\dot{q}(t) - L = \\frac{p(t)^2}{2m} + \\frac{k\\,q(t)^2}{2} = T + V',
        conn: '**Destacado:** para el MR conservativo ($c = 0$) las dos puertas ② son equivalentes: la transformada de Legendre lleva de $L$ a $H$ y recupera exactamente el Hamiltoniano del bloque anterior, con su conservación de energía incluida.',
      },
    ],
    notes:
      'Nota: misma estructura de tres pasos que el desglose hamiltoniano — cambia la variable de partida ($L = T - V$ en lugar de $H = T + V$) y la regla de evolución (Euler–Lagrange en lugar de las ecs. de Hamilton).',
    refs: [
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Chen et al. Neural Ordinary Differential Equations. NeurIPS 2018.',
    ],
  },
  {
    id: 'd1-puerta2-vs',
    module: 'd1',
    tone: 'purple',
    kind: 'wide',
    kicker: '3 · Puerta ② · Comparativa',
    title: 'Hamiltoniano vs Lagrangiano: cuándo usar una u otra',
    table: [
      ['Criterio', 'Hamiltoniano $H(q, p)$', 'Lagrangiano $L(q, \\dot{q})$'],
      [
        'Variables de estado',
        'Coordenadas canónicas $(q(t), p(t))$: el momento $p = m\\,\\dot{q}(t)$ hay que construirlo.',
        'Coordenadas generalizadas $(q(t), \\dot{q}(t))$ directas de los datos; el momento se deriva después: $p = \\partial L / \\partial \\dot{q}$.',
      ],
      [
        'Función escalar',
        '$H = T + V$ — energía total (cinética + potencial).',
        '$L = T - V$ — densidad de acción (cinética − potencial).',
      ],
      [
        'Regla de evolución',
        'Dos ecuaciones de primer orden: $\\dot{q}(t) = \\partial H / \\partial p$, $\\dot{p}(t) = -\\partial H / \\partial q$ (forma matricial $\\mathbb{J}\\,\\nabla H$).',
        'Una ecuación de Euler–Lagrange de segundo orden: $\\frac{d}{dt}\\,\\frac{\\partial L}{\\partial \\dot{q}} - \\frac{\\partial L}{\\partial q} = 0$.',
      ],
      [
        'Marco y conservación',
        'Espacio de fases simpléctico; $H(t) =$ constante por construcción (integradores simplécticos).',
        'Principio de acción (extremizar la acción); la conservación se hereda de la simetría temporal.',
      ],
      [
        'Red equivalente (puerta ②)',
        'HNN: $f_\\theta(q(t), p(t)) \\mapsto H_\\theta$; pérdida sobre $(\\dot{q}, \\dot{p})$ en $t_n$.',
        'LNN: $f_\\theta(q(t), \\dot{q}(t)) \\mapsto L_\\theta$; pérdida sobre las aceleraciones $\\ddot{q}(t_n)$.',
      ],
      [
        'Paso de una a otra (Legendre)',
        '$H(q, p) = p\\,\\dot{q} - L(q, \\dot{q})$ con $p = \\partial L / \\partial \\dot{q}$ (inversa: $\\dot{q} = \\partial H / \\partial p$).',
        'Para el MR ($c = 0$): $p = m\\,\\dot{q}(t) \\Rightarrow L = T - V \\Leftrightarrow H = T + V$ — misma trayectoria.',
      ],
      [
        'Cuándo recomendarla',
        'Sistema conservativo con $(q, p)$ a mano o construibles; predicción a largo plazo donde importa la energía exacta (órbitas, osciladores, estructura simpléctica).',
        'Datos en $(q, \\dot{q})$ o coordenadas generalizadas con restricciones/vínculos; cuando los momentos deben derivarse y no se miden.',
      ],
    ],
    bullets: [
      '**Regla práctica:** si necesitas momento y espacio de fases explícitos → **hamiltoniano**; si trabajas con posiciones y velocidades (o coordenadas con vínculos) → **lagrangiano**.',
      '**Advertencia:** las dos formas estándar asumen $c = 0$ (sin disipación); con amortiguamiento hay que añadir fuerzas generalizadas o disipación de Rayleigh — fuera del alcance de la puerta ② en este deck.',
    ],
    equations: [
      {
        heading: 'Paso de una a otra: transformada de Legendre',
        tex: 'p = \\frac{\\partial L}{\\partial \\dot{q}} \\;\\Longleftrightarrow\\; \\dot{q} = \\frac{\\partial H}{\\partial p}, \\qquad H(q, p) = p\\,\\dot{q} - L(q, \\dot{q})',
        conn: '**Conexión:** puente exacto entre las dos columnas — para el MR ($c = 0$), $p = m\\,\\dot{q}(t)$ lleva de $L = T - V$ a $H = T + V$ y ambas producen la misma trayectoria $x(t)$.',
      },
    ],
    refs: [
      'Greydanus, Dzamba, Yosinski. Hamiltonian Neural Networks. NeurIPS 2019.',
      'Cranmer et al. Lagrangian Neural Networks. arXiv:2003.04630, 2020.',
      'Goldstein, Poole, Safko. Classical Mechanics — coordenadas canónicas y transformada de Legendre.',
    ],
  },
  {
    id: 'd1-puerta2-diagram',
    module: 'd1',
    tone: 'purple',
    kind: 'diagram',
    kicker: '3 · Puerta ② · Forma fuerte · diagrama',
    diagram: 'mr2',
    diagramTitle: 'MR · Puerta ② — flujo de una HNN · la física entra en la estructura',
    legend: [
      { color: '#1E3A5F', label: 'Sistema físico / variables (q, p)' },
      { color: '#16A085', label: 'Datos y medición' },
      { color: '#7D3C98', label: 'Red HNN · $H_\\theta$ · autodiff · estructura' },
      { color: '#E67E22', label: 'Comparación $\\to \\mathcal{L}_{HNN}(\\theta)$' },
      { color: '#C0392B', label: 'Optimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta3',
    module: 'd1',
    tone: 'cyan',
    kind: 'door',
    kicker: '3 · Puerta ③ · Física en los datos',
    title: 'Puerta ③ — Física en los datos / features',
    lema: 'La física entra **en los datos/features**: indirectamente, antes del modelo.',
    equations: [
      {
        heading: 'Modelo (entrada aumentada)',
        tex: '\\tilde{\\mathbf{x}} = \\left[ \\mathbf{x},\\; \\psi_{fis}(\\mathbf{x}) \\right], \\qquad \\psi_{fis} = \\left[\\, x(t),\\; \\dot{x}(t),\\; E(t) \\,\\right], \\qquad E(t) = \\tfrac{1}{2} m \\dot{x}(t)^2 + \\tfrac{1}{2} k\\,x(t)^2',
        conn: '**Conexión:** para el MR las features son el espacio de fases y la energía; el bloque "Features ψ_fis" transforma la entrada antes de $f_\\theta$.',
      },
      {
        heading: 'Multi-fidelity (simulador MR de baja fidelidad)',
        tex: 'y_{HF}(\\mathbf{x}) = \\alpha_{mf}\\, f_{LF}(\\mathbf{x}) + \\delta_{mf}(\\mathbf{x})',
        conn: '**Conexión:** el simulador MR barato $f_{LF}$ genera datos; la discrepancia $\\delta_{mf}$ se aprende (Kennedy–O\'Hagan).',
      },
      {
        heading: 'Función de pérdida (sobre datos aumentados)',
        tex: '\\mathcal{L}_{MSE}(\\theta) = \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| f_\\theta(\\tilde{\\mathbf{x}}_i) - y(t_i) \\right|^2',
        conn: '**Conexión:** la física no aparece como término de penalización; vive en $\\tilde{\\mathbf{x}}$ y en los datos del simulador.',
      },
      {
        heading: 'Problema de optimización (+ physical bottleneck)',
        tex: '\\theta^* = \\arg\\min_{\\theta \\in \\Theta}\\; \\mathcal{L}_{MSE}(\\theta; \\tilde{\\mathbf{x}}), \\qquad \\mathbf{z}_{bot} = E(t)',
        conn: '**Conexión:** variante con bottleneck: la latente $\\mathbf{z}_{bot}$ queda restringida a significado físico explícito (Hao 2022).',
      },
    ],
    refs: [
      'Hao et al. PIML: A Survey on Problems, Methods and Applications. arXiv:2211.08064, 2022.',
      'Kennedy, O\'Hagan. Predicting with engineering models (multi-fidelity). Biometrika 87, 2000.',
      'Willard et al. ACM Computing Surveys, 2022.',
      'Machine Learning with Physics Knowledge for Prediction: A Survey. arXiv:2408.09840.',
    ],
  },
  {
    id: 'd1-puerta3-diagram',
    module: 'd1',
    tone: 'cyan',
    kind: 'diagram',
    kicker: '3 · Puerta ③ · Física en los datos · diagrama',
    diagram: 'mr3',
    diagramTitle: 'MR · Puerta ③ — la física entra en los datos / features',
    legend: [
      { color: '#1E3A5F', label: 'Sistema MR / física' },
      { color: '#16A085', label: '③ Datos / features' },
      { color: '#34495E', label: 'Modelo ML $f_\\theta$' },
      { color: '#C0392B', label: 'Minimización → $\\theta^{*}$' },
    ],
  },
  {
    id: 'd1-puerta4',
    module: 'd1',
    tone: 'blue',
    kind: 'wide',
    kicker: '3 · Puerta ④ · Híbrido',
    title: 'Puerta ④ — Híbrido simulador + red (grey-box)',
    bullets: [
      '**¿Por qué existen?:** un simulador confiable **subvenciona** a la red: $f_{fis}$ da la predicción base —interpretable y físicamente correcta— y $g_\\theta$ aprende solo el residuo.',
      '**¿Cuándo se eligen sobre la PINN pura?:** cuando existe un simulador/ley confiable y el riesgo de soluciones no físicas del entrenamiento PINN es alto; hereda la tradición grey-box de identificación de parámetros.',
    ],
    equations: [
      {
        heading: '④ Híbrido simulador + red (grey-box)',
        tex: '\\hat{y} = \\underbrace{f_{fis}(\\mathbf{x})}_{\\text{predicción base física}} + \\underbrace{g_\\theta(\\mathbf{x})}_{\\text{residuo aprendido}} \\quad \\text{o} \\quad \\hat{y} = g_\\theta\\bigl(\\mathbf{x},\\, f_{fis}(\\mathbf{x})\\bigr)',
        conn: '**Conexión:** residual learning y feature stacking; tradición grey-box (Bacher & Madsen 2011).',
      },
    ],
    refs: [
      'Bacher & Madsen. Identifying suitable models for the heat dynamics of buildings. Energy and Buildings 43, 2011.',
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
      'Punto de partida común: la serie $y[t]$ observa un sistema dinámico gobernado por una ley $\\mathcal{F}[u] = 0$ total o parcialmente conocida.',
      '**F1** PINN · **F2** PG-RNN · **F3** Neural ODE/SDE · **F4** física latente (PhyDNet) · **F5** kernel/GPR · **F6** física embebida (PINT/RFF).',
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
        tex: '\\partial_t u + \\mathcal{F}[u] = 0 \\;\\; \\text{en } \\Omega_T, \\qquad r_\\theta(t, \\mathbf{x}) = \\partial_t u_\\theta + \\mathcal{F}[u_\\theta]',
        conn:
          '**Conexión:** "la red aprende LA SOLUCIÓN" ↔ $u_\\theta(t, \\mathbf{x})$; el residuo se evalúa en los $N_c$ puntos de colocación $(t_j, \\mathbf{x}_j)$.',
      },
      {
        heading: 'F1 · Pérdida con puntos de colocación',
        tex: '\\mathcal{L}(\\theta) = \\frac{1}{N_d}\\sum_{i=1}^{N_d} \\left| u_\\theta(t_i, \\mathbf{x}_i) - u(t_i, \\mathbf{x}_i) \\right|^2 + \\lambda_{phys}\\,\\frac{1}{N_c}\\sum_{j=1}^{N_c} \\left\\| r_\\theta(t_j, \\mathbf{x}_j) \\right\\|^2',
      },
      {
        heading: 'F2 · Recurrencia estándar + término físico',
        tex: '\\mathbf{h}[t] = f_{RNN}(\\mathbf{x}[t], \\mathbf{h}[t-1]; \\Theta_r), \\qquad \\hat{y}[t] = g(\\mathbf{h}[t])',
        conn:
          '**Conexión:** "recurrencia estándar" ↔ $f_{RNN}$; "consistencia temporal" ↔ $\\mathcal{L}_{EC}$ (línea PGML de Karpatne).',
      },
      {
        heading: 'F2 · Pérdida de consistencia temporal',
        tex: '\\mathcal{L} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,\\mathcal{L}_{EC}, \\qquad \\mathcal{L}_{EC} = \\sum_t \\left\\| r_{EC}(\\hat{y}[t], \\hat{y}[t-1], \\mathbf{x}[t]) \\right\\|^2',
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
          '**Conexión:** "estructura física parcial" ↔ forma hamiltoniana (puerta ② del D1) o lagrangiana Euler–Lagrange (siguiente ecuación); variante estocástica con $dW_t$.',
      },
      {
        heading: 'F3 · Lagrangian NN (Euler–Lagrange)',
        tex: '\\frac{d}{dt}\\,\\frac{\\partial L_\\theta}{\\partial \\dot{q}} - \\frac{\\partial L_\\theta}{\\partial q} = 0',
        conn:
          '**Conexión:** $q = q(t)$ y $\\dot{q} = \\dot{q}(t)$ dependen del tiempo; las derivadas parciales son respecto a esas variables (puerta ②, formulación lagrangiana).',
      },
      {
        heading: 'F4 · PhyDNet: latente descompuesta física + residual',
        tex: '\\mathbf{z}[t] = \\mathbf{z}[t]^{phys} + \\mathbf{z}[t]^{res}, \\qquad \\hat{y}[t] = \\mathrm{Dec}(\\mathbf{z}[t]), \\qquad \\mathbf{z}[t]^{phys} = \\mathrm{PhyCell}(\\mathbf{z}[t-1]^{phys})',
        conn:
          '**Conexión:** "encoder → latente donde actúa la física → decoder" ↔ $\\mathrm{Enc}$, PhyCell, $\\mathrm{Dec}$; "física + residual" ↔ $\\mathbf{z}[t]^{phys} + \\mathbf{z}[t]^{res}$.',
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
        tex: '\\hat{f}_\\theta(\\mathbf{x}) = \\sum_{i=1}^{N} \\theta_i\\, \\kappa(\\mathbf{x}, \\mathbf{x}_i), \\qquad \\theta = (\\mathbf{K}_{GP} + \\lambda_{rk} \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** "bounds, rampas, parabolicidad, estacionalidad" ↔ las restricciones sobre $f$; GPR con prior físico (formulación de Doumèche 2025 / PhI-GPR).',
      },
      {
        heading: 'F6 · Prior físico cableado, sin EDP explícita',
        tex: '\\hat{\\mathbf{y}} = g_\\theta\\bigl(\\mathbf{X};\\, \\mathcal{P}_{fis}\\bigr)',
        conn:
          '**Conexión:** "inductive biases específicas" ↔ $\\mathcal{P}_{fis}$ dentro de $g_\\theta$; el RFF multibanda (Ecuación 24) es una instancia con prior espectral.',
      },
      {
        heading: 'F6 · RFF multibanda del artículo guía (Ecuación 24)',
        tex: '\\boldsymbol{\\phi}_k(\\mathbf{x}[t]) = \\sqrt{\\frac{2}{N_f}}\\,\\cos\\!\\left(\\mathrm{softplus}(\\rho_k)\\,\\mathbf{W}_k^\\top \\mathbf{x}[t] + \\mathbf{b}_k\\right)',
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
      'El contraste necesario: la base contra la que se mide todo PIML energético — las 8 familias de la matriz SOTA 2022–2026.',
      '**E1** Estadísticos · **E2** ML clásico · **E3** Recurrentes · **E4** TCN · **E5** Transformers LTSF · **E6** SSM/Mamba · **E7** Fundacionales · **E8** Descomposición + híbridos (patrón dominante en carga).',
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
        tex: '\\phi_p(\\mathcal{B})\\,\\Phi_P(\\mathcal{B}^s)\\,(1-\\mathcal{B})^d\\,(1-\\mathcal{B}^s)^D\\, y[t] = c + \\theta_q(\\mathcal{B})\\,\\Theta_Q(\\mathcal{B}^s)\\,\\varepsilon[t], \\qquad \\varepsilon[t] \\sim \\mathcal{N}(0, \\sigma_\\varepsilon^2)',
        conn:
          '**Conexión:** "ARIMA/SARIMA/ETS" ↔ esta ecuación ($s$ = período estacional 24 h o 168 h); símbolos $s, d, D, c$ son **locales** de esta sección.',
      },
      {
        heading: 'E2 · SVR con pérdida $\\varepsilon_{svr}$-insensible y ensambles aditivos',
        tex: 'f_\\theta(\\mathbf{x}) = \\langle \\theta, \\varphi(\\mathbf{x}) \\rangle, \\qquad \\min_{\\theta, \\boldsymbol{\\xi}, \\boldsymbol{\\xi}^*} \\frac{1}{2}\\lVert \\theta \\rVert_2^2 + \\lambda_{svr} \\sum_{i=1}^{N} (\\xi_i + \\xi_i^*) \\;\\; \\text{s.a. } \\left| y_i - f_\\theta(\\mathbf{x}_i) \\right| \\le \\varepsilon_{svr} + \\xi_i^{(*)}',
        conn:
          '**Conexión:** "SVR, RF, XGBoost, ANFIS — features duras tabulares" ↔ $f_\\theta(\\mathbf{x})$ sobre $\\mathbf{x}$ tabular (rezagos, calendario, meteorología); ensambles aditivos para XGBoost/RF.',
      },
    ],
  },
  {
    id: 'd3-reg-ols',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E2 — Regresión lineal por mínimos cuadrados',
    bullets: [
      'Gauss–Markov: con los supuestos clásicos, $\\hat{\\theta}_{OLS}$ es el mejor estimador **lineal** insesgado (BLUE).',
      'Su dispersión es $\\sigma^{2}\\left(\\mathbf{D}^{\\top}\\mathbf{D}\\right)^{-1}$: el modelo lineal no sólo ajusta, también permite inferir.',
      'Se rompe con colinealidad o con $d > N$; de esas dos fallas nacen ridge y lasso.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo lineal y sus supuestos',
        tex: 'f_{\\theta}(\\mathbf{x}) = \\mathbf{x}^{\\top}\\theta, \\qquad \\mathbf{y} = \\mathbf{D}\\theta + \\boldsymbol{\\varepsilon}, \\qquad \\mathbb{E}[\\boldsymbol{\\varepsilon}] = \\mathbf{0}, \\ \\mathrm{Var}(\\boldsymbol{\\varepsilon}) = \\sigma^{2}\\mathbf{I}',
        conn: '**Conexión:** el sesgo $\\theta_0$ va absorbido en $\\mathbf{x}_i$, así que $\\theta \\in \\mathbb{R}^{d}$; $\\mathbf{D} \\in \\mathbb{R}^{N \\times d}$ es la matriz de diseño (no la ventana $\\mathbf{X}$). Cada $\\theta_j$ es el **efecto marginal** de la variable $j$ con el resto fijo: de ahí la interpretabilidad del modelo lineal frente a las familias E3–E7. Los dos supuestos escritos —media cero y varianza constante— son los que usa Gauss–Markov.',
      },
      {
        heading: 'E2 · El criterio: residuo cuadrático mínimo',
        tex: '\\hat{\\theta} = \\arg\\min_{\\theta} \\sum_{i=1}^{N} \\left( y_i - \\mathbf{x}_i^{\\top}\\theta \\right)^{2}',
        conn: '**Conexión:** $i$ numera muestras y no es tiempo, por eso va como subíndice y nunca con corchetes. El criterio tampoco es arbitrario: es la pérdida $\\mathcal{L}_{MSE}$ sin normalizar, equivalente a $\\arg\\min_{\\theta} \\lVert \\mathbf{y}-\\mathbf{D}\\theta \\rVert_2^{2}$, la misma que el resto del deck usa para comparar predicciones. Y sobrevive intacto cuando se le añade la penalización de ridge y lasso en las tres slides siguientes: lo único que cambia es el término que se suma.',
      },
      {
        heading: 'E2 · La solución: ecuación normal y proyección ortogonal',
        tex: '\\hat{\\theta} = \\left( \\mathbf{D}^{\\top}\\mathbf{D} \\right)^{-1}\\mathbf{D}^{\\top}\\mathbf{y}, \\qquad \\mathbf{H} = \\mathbf{D}\\left( \\mathbf{D}^{\\top}\\mathbf{D} \\right)^{-1}\\mathbf{D}^{\\top}',
        conn: '**Conexión:** igualar a cero el gradiente $-2\\mathbf{D}^{\\top}(\\mathbf{y}-\\mathbf{D}\\theta)$ da la ecuación normal $\\mathbf{D}^{\\top}\\mathbf{D}\\hat{\\theta} = \\mathbf{D}^{\\top}\\mathbf{y}$. $\\hat{\\mathbf{y}} = \\mathbf{H}\\mathbf{y}$, con $\\mathbf{H}$ la **matriz sombrero**, proyecta $\\mathbf{y}$ sobre el espacio columna de $\\mathbf{D}$: el residuo $\\mathbf{e} = \\mathbf{y}-\\hat{\\mathbf{y}}$ queda ortogonal a las columnas ($\\mathbf{D}^{\\top}\\mathbf{e} = \\mathbf{0}$) y se cumple Pitágoras, $\\lVert\\mathbf{y}\\rVert^{2} = \\lVert\\hat{\\mathbf{y}}\\rVert^{2} + \\lVert\\mathbf{e}\\rVert^{2}$. Solución única sii $\\mathrm{rango}(\\mathbf{D}) = d$.',
      },
    ],
    notes: '**Idea central:** mínimos cuadrados no elige el modelo, elige los coeficientes: es la proyección ortogonal de $\\mathbf{y}$ sobre lo que el modelo puede representar. Todo lo que sigue —verosimilitud, ridge, lasso— cambia el criterio o le añade un término, pero conserva esta geometría. Ojo con el vocabulario: $\\mathbf{e}$ es residuo (observable), $\\boldsymbol{\\varepsilon}$ es error (no observable), y $R^{2} = 1 - \\lVert\\mathbf{e}\\rVert_2^{2}/\\lVert\\mathbf{y}-\\bar{y}\\mathbf{1}\\rVert_2^{2}$ crece siempre al añadir variables, por eso se reporta el ajustado.',
  },
  {
    id: 'd3-reg-mle',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E2 — Máxima verosimilitud con ruido gaussiano',
    bullets: [
      'La verosimilitud convierte un supuesto sobre el **ruido** en un criterio de ajuste.',
      'Añade dos cosas: la varianza $\\hat{\\sigma}^{2}$ —y con ella la inferencia— y la lectura bayesiana de ridge y lasso.',
      'No valida la linealidad del modelo: sólo describe el error.',
    ],
    equations: [
      {
        heading: 'E2 · El modelo generativo y la verosimilitud',
        tex: 'p(\\mathbf{y}\\mid\\mathbf{D},\\theta,\\sigma^{2}) = \\left( 2\\pi\\sigma^{2} \\right)^{-N/2} \\exp\\!\\left( -\\lVert \\mathbf{y} - \\mathbf{D}\\theta \\rVert_2^{2}/(2\\sigma^{2}) \\right)',
        conn: '**Conexión:** el modelo generativo es $y_i = \\mathbf{x}_i^{\\top}\\theta + \\varepsilon_i$ con $\\varepsilon_i \\sim \\mathcal{N}(0,\\sigma^{2})$ **iid**, donde $\\varepsilon_i$ es el ruido **por muestra** (subíndice porque $i$ no es tiempo): no confundirlo con la innovación $\\varepsilon[t]$ de SARIMA, que sí va con corchete. El paso de «iid» al producto es todo lo que hace la verosimilitud: multiplica las densidades porque las muestras son independientes. Y al ser lineal-gaussiano, la densidad conjunta queda en **forma cerrada** — sin optimización numérica, a diferencia de E3–E7.',
      },
      {
        heading: 'E2 · Log-verosimilitud negativa: el puente con mínimos cuadrados',
        tex: '-\\log p(\\mathbf{y}\\mid\\mathbf{D},\\theta,\\sigma^{2}) = \\;\\propto\\; \\lVert \\mathbf{y} - \\mathbf{D}\\theta \\rVert_2^{2}',
        conn: '**Conexión:** con $\\sigma^{2}$ fijo, ni la constante $\\frac{N}{2}\\log(2\\pi\\sigma^{2})$ ni el factor $\\frac{1}{2\\sigma^{2}}$ afectan al óptimo sobre $\\theta$: queda una **proporcionalidad** con el residuo cuadrático. Por tanto **maximizar la verosimilitud es minimizar el error cuadrático**: el criterio de mínimos cuadrados de la slide anterior no era una elección estética, es lo que produce suponer ruido gaussiano iid. Con otra distribución la equivalencia se rompe y la pérdida óptima puede no ser la cuadrática.',
      },
      {
        heading: 'E2 · Los estimadores y su dispersión',
        tex: '\\hat{\\theta} = \\left( \\mathbf{D}^{\\top}\\mathbf{D} \\right)^{-1}\\mathbf{D}^{\\top}\\mathbf{y}, \\qquad \\hat{\\sigma}^{2}_{MLE} = \\frac{1}{N}\\lVert \\mathbf{y} - \\mathbf{D}\\hat{\\theta} \\rVert_2^{2}',
        conn: '**Conexión:** el estimador de $\\theta$ coincide con OLS, y con él llega la **matriz de covarianza** $\\mathrm{Var}(\\hat{\\theta}) = \\sigma^{2}\\left(\\mathbf{D}^{\\top}\\mathbf{D}\\right)^{-1}$: de ahí salen los errores estándar, los contrastes $t$ y los intervalos de confianza. Cuidado con $\\hat{\\sigma}^{2}_{MLE}$: divide por $N$ y es **sesgado**; el insesgado divide por $N-d$. La verosimilitud no mejora el estimador puntual, le añade la incertidumbre.',
      },
    ],
    notes: '**Idea central:** MLE no cambia a $\\hat{\\theta}$; justifica el criterio, da varianza e inferencia, y abre el punto de vista bayesiano. **Puente:** un prior sobre $\\theta$ más esta verosimilitud produce un estimador MAP —gaussiano da ridge, Laplace da lasso—; regularizar es declarar una creencia previa.',
  },
  {
    id: 'd3-reg-ridge',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E2 — Ridge: penalización cuadrática y contracción',
    bullets: [
      'Añade un castigo cuadrático al ajuste: $\\ell_2$ contrae los coeficientes hacia cero **sin anularlos**.',
      'Gana cuando $\\mathbf{D}^{\\top}\\mathbf{D}$ está mal condicionada: la penalización vuelve el problema invertible.',
      'Es el estimador **MAP** con prior gaussiano sobre $\\theta$: regularizar es imponer una creencia previa.',
      'El precio es sesgo deliberado, y $\\lambda_{reg}$ se elige por validación cruzada.',
    ],
    equations: [
      {
        heading: 'E2 · El objetivo penalizado',
        tex: '\\mathcal{L}_{ridge}(\\theta) = \\lVert \\mathbf{y} - \\mathbf{D}\\theta \\rVert_2^{2} + \\lambda_{reg} \\lVert \\theta \\rVert_2^{2}',
        conn: '**Conexión:** $\\hat{\\theta}_{ridge} = \\arg\\min_{\\theta} \\mathcal{L}_{ridge}(\\theta)$. Aquí $\\lambda_{reg} \\ge 0$ es la fuerza de penalización y lleva símbolo propio: no es $\\lambda_{phys}$ (el peso físico de las puertas ① y ④) ni $\\lambda_{rk}$ (kernel ridge, familia F5). Con $\\lambda_{reg} = 0$ se recupera OLS exactamente. La forma es idéntica a la pérdida compuesta $\\mathcal{L}_{MSE} + \\lambda_{phys}\\mathcal{L}_{phys}$: cambia qué se castiga, no la estructura. (Hoerl & Kennard, 1970.)',
      },
      {
        heading: 'E2 · Solución cerrada y buen planteamiento',
        tex: '\\hat{\\theta}_{ridge} = \\left( \\mathbf{D}^{\\top}\\mathbf{D} + \\lambda_{reg}\\mathbf{I} \\right)^{-1} \\mathbf{D}^{\\top}\\mathbf{y}, \\qquad \\mathbf{D}^{\\top}\\mathbf{D} + \\lambda_{reg}\\mathbf{I} \\succ 0',
        conn: '**Conexión:** para todo $\\lambda_{reg} > 0$, sumar $\\lambda_{reg}\\mathbf{I}$ desplaza todos los autovalores a $\\mu_k + \\lambda_{reg} > 0$, así que la matriz es definida positiva —y por tanto invertible— **siempre**. El problema queda bien puesto incluso en los dos casos que dejan a OLS sin solución única: colinealidad perfecta y $d > N$.',
      },
      {
        heading: 'E2 · Contracción espectral, vía la SVD de $\\mathbf{D}$',
        tex: '\\hat{\\theta}_{ridge} = \\sum_k \\kappa_k\\, \\mathbf{v}_k \\mathbf{u}_k^{\\top} \\mathbf{y}, \\qquad \\mathbf{D} = \\mathbf{U}\\mathbf{S}\\mathbf{V}^{\\top}',
        conn: '**Conexión:** con la SVD $\\mathbf{D} = \\mathbf{U}\\mathbf{S}\\mathbf{V}^{\\top}$, cada dirección singular $k$ se contrae por el factor $\\kappa_k = s_k^{2}/(s_k^{2}+\\lambda_{reg}) \\in (0,1)$, que **nunca llega a cero**. De ahí las dos propiedades que definen a ridge: ninguna dirección se elimina, y la contracción es más fuerte precisamente donde $s_k$ es pequeño, es decir, en las direcciones peor condicionadas. La suma de esos factores es el número efectivo de parámetros $\\mathrm{df}(\\lambda_{reg})$, que decrece con $\\lambda_{reg}$.',
      },
    ],
    notes: '**Sesgo–varianza:** OLS es insesgado y de varianza mínima dentro de su clase lineal; ridge acepta sesgo a cambio de menos varianza, y por eso gana cuando $\\mathbf{D}^{\\top}\\mathbf{D}$ está mal condicionada. **Lo que lo separa de lasso:** reparte el peso entre variables correlacionadas y nunca produce un modelo esparso: un coeficiente puede quedar diminuto, pero no exactamente cero.',
  },
  {
    id: 'd3-reg-lasso',
    module: 'd3',
    tone: 'orange',
    kind: 'wide',
    kicker: '5a · Matemática del Diagrama 3',
    title: 'E2 — Lasso: penalización en valor absoluto y selección',
    bullets: [
      'Cambia la norma: $\\ell_1$ en vez de $\\ell_2$, y con ella la penalización deja de ser diferenciable en el origen.',
      'Consecuencia: anula coeficientes **exactamente**. Selecciona variables, no sólo las contrae.',
      'Es el estimador **MAP** con prior Laplace: la masa del prior en cero produce la esparsidad.',
    ],
    equations: [
      {
        heading: 'E2 · El objetivo penalizado y su forma restringida',
        tex: '\\mathcal{L}_{lasso}(\\theta) = \\lVert \\mathbf{y} - \\mathbf{D}\\theta \\rVert_2^{2} + \\lambda_{reg} \\lVert \\theta \\rVert_1',
        conn: '**Conexión:** $\\hat{\\theta}_{lasso} = \\arg\\min_{\\theta} \\mathcal{L}_{lasso}(\\theta)$. Misma familia que ridge, con $\\lVert \\theta \\rVert_1 = \\sum_j |\\theta_j|$; pero la norma $\\ell_1$ no es diferenciable en el origen y por eso **no tiene solución cerrada general**. $\\lambda_{reg}$ tiene aquí una lectura distinta y directamente interpretable: es el umbral por debajo del cual un coeficiente se anula, no una simple contracción. Su forma restringida equivalente es $\\min \\lVert \\mathbf{y}-\\mathbf{D}\\theta \\rVert_2^{2}$ sujeto a $\\lVert \\theta \\rVert_1 \\le c$, con $c$ decreciente en $\\lambda_{reg}$. (Tibshirani, 1996.)',
      },
      {
        heading: 'E2 · Condiciones KKT: por qué anula coeficientes',
        tex: '\\mathbf{d}_j^{\\top}\\left( \\mathbf{y} - \\mathbf{D}\\theta \\right) = \\lambda_{reg}\\,\\mathrm{sign}(\\theta_j) \\ \\text{si } \\theta_j \\neq 0, \\qquad \\left| \\mathbf{d}_j^{\\top}\\left( \\mathbf{y} - \\mathbf{D}\\theta \\right) \\right| \\le \\lambda_{reg} \\ \\text{si } \\theta_j = 0',
        conn: '**Conexión:** $j = 1 \\dots d$ indexa variables, ni muestras ni tiempo. Mientras la correlación de la variable $j$ con el residuo no supere $\\lambda_{reg}$ en valor absoluto, su coeficiente queda **exactamente** en cero — así es como $\\ell_1$ selecciona. Con diseño ortonormal el sistema se resuelve a mano y aparece el operador de umbral suave de la ecuación siguiente.',
      },
      {
        heading: 'E2 · Umbral suave (ortonormal) y geometría del politopo',
        tex: '\\hat{\\theta}^{lasso}_j = \\mathrm{sign}(\\hat{\\theta}^{OLS}_j)\\max\\left( | \\hat{\\theta}^{OLS}_j | - \\lambda_{reg},\\ 0 \\right)',
        conn: '**Conexión:** $(\\cdot)_{+} = \\max(\\cdot, 0)$; la forma cerrada vale con diseño ortonormal, y en general se resuelve por programación convexa (descenso por coordenadas, LARS). La restricción $\\ell_1$ es un politopo —un rombo en dos dimensiones— con **vértices sobre los ejes**, y el óptimo cae en un vértice: ahí la mayoría de las coordenadas son cero. La bola $\\ell_2$ de ridge, al ser lisa, sólo contrae. Ésa es toda la diferencia entre **seleccionar** y **repartir**.',
      },
    ],
    refs: [
      'Referencias: Hoerl & Kennard, Technometrics 12(1), 1970 (ridge) · Tibshirani, JRSS-B 58(1), 1996 (lasso) · Zou & Hastie, JRSS-B 67(2), 2005 (red elástica) · Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, 2.ª ed., 2009, cap. 3.',
    ],
    notes: '**Cierre del bloque:** las cuatro comparten el esqueleto —ajuste más castigo— y ese esqueleto reaparece en $\\mathcal{L}_{MSE} + \\lambda_{phys}\\mathcal{L}_{phys}$. **Límites de lasso:** con $d > N$ selecciona a lo sumo $N$ variables y ante variables correlacionadas elige de forma inestable; la red elástica ($\\ell_1 + \\ell_2$) corrige ambos casos.',
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
        tex: '\\mathbf{i}[t] = \\sigma(\\mathbf{W}_i \\mathbf{x}[t] + \\mathbf{U}_i \\mathbf{h}[t-1] + \\mathbf{b}_i), \\qquad \\mathbf{f}[t] = \\sigma(\\mathbf{W}_f \\mathbf{x}[t] + \\mathbf{U}_f \\mathbf{h}[t-1] + \\mathbf{b}_f)',
        conn:
          'Estado de celda y salida: $\\mathbf{c}[t] = \\mathbf{f}[t] \\odot \\mathbf{c}[t-1] + \\mathbf{i}[t] \\odot \\tilde{\\mathbf{c}}[t]$ y $\\mathbf{h}[t] = \\mathbf{o}[t] \\odot \\tanh(\\mathbf{c}[t])$.',
      },
      {
        heading: 'LSTM · estado de celda (compuerta de salida $\\mathbf{o}[t]$)',
        tex: '\\mathbf{o}[t] = \\sigma(\\mathbf{W}_o \\mathbf{x}[t] + \\mathbf{U}_o \\mathbf{h}[t-1] + \\mathbf{b}_o), \\qquad \\tilde{\\mathbf{c}}[t] = \\tanh(\\mathbf{W}_c \\mathbf{x}[t] + \\mathbf{U}_c \\mathbf{h}[t-1] + \\mathbf{b}_c)',
      },
      {
        heading: 'GRU · compuertas de actualización $\\mathbf{u}[t]$ y reinicio $\\mathbf{r}[t]$ (decisión 5 de §1)',
        tex: '\\mathbf{u}[t] = \\sigma(\\mathbf{W}_u \\mathbf{x}[t] + \\mathbf{U}_u \\mathbf{h}[t-1] + \\mathbf{b}_u), \\qquad \\mathbf{r}[t] = \\sigma(\\mathbf{W}_r \\mathbf{x}[t] + \\mathbf{U}_r \\mathbf{h}[t-1] + \\mathbf{b}_r)',
        conn:
          '**Conexión:** "LSTM / GRU / BiLSTM + atención" ↔ estos sistemas de compuertas; el backbone del artículo guía ($\\breve{\\mathbf{h}}[t] = f_{RNN}(\\tilde{\\mathbf{z}}[t], \\breve{\\mathbf{h}}[t-1]; \\Theta_r)$) es exactamente una de estas celdas.',
      },
      {
        heading: 'GRU · candidato y estado oculto',
        tex: '\\tilde{\\mathbf{h}}[t] = \\tanh\\!\\bigl(\\mathbf{W}_h \\mathbf{x}[t] + \\mathbf{U}_h (\\mathbf{r}[t] \\odot \\mathbf{h}[t-1]) + \\mathbf{b}_h\\bigr), \\qquad \\mathbf{h}[t] = (1 - \\mathbf{u}[t]) \\odot \\mathbf{h}[t-1] + \\mathbf{u}[t] \\odot \\tilde{\\mathbf{h}}[t]',
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
        tex: '(\\mathbf{s} *_{\\breve{d}} \\mathbf{f})[t] = \\sum_{i=0}^{\\breve{k}-1} f[i]\\, s[t-\\breve{d}\\,i]',
        conn:
          '**Conexión:** "CNN, TCN, híbridos CNN-LSTM" ↔ la convolución dilatada compuesta con una recurrencia E3; el TSB del artículo guía es un bloque TCN (residual + GELU + LN).',
      },
      {
        heading: 'E5 · Atención escalada y multi-cabeza',
        tex: '\\mathrm{Att}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\mathrm{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}}\\right)\\mathbf{V}, \\qquad \\mathrm{MHA}(\\mathbf{X}) = \\mathrm{Concat}(\\mathrm{head}_1, \\dots, \\mathrm{head}_{n_{cab}})\\,\\mathbf{W}^O',
        conn:
          '**Conexión:** "TFT, Informer, PatchTST, iTransformer, TimeXer" ↔ variantes de $\\mathrm{Att}$ con distinta tokenización; PatchTST trocea cada canal en parches (channel-independence).',
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
          'Discretización → recurrencia $\\mathbf{h}[t] = \\bar{\\mathbf{A}}\\,\\mathbf{h}[t-1] + \\bar{\\mathbf{B}}\\,x[t]$; Mamba (selective scan) vuelve los parámetros dependientes de la entrada: $\\mathcal{O}(\\tau)$ frente al $\\mathcal{O}(\\tau^2)$ de la atención.',
      },
      {
        heading: 'E7 · Distribución predictiva pre-entrenada (zero/few-shot)',
        tex: 'p_\\theta\\bigl(y[\\tau+1], \\dots, y[\\tau+h] \\mid \\mathbf{X}\\bigr) \\quad \\text{con } \\theta \\text{ fijado en pre-entrenamiento masivo externo}',
        conn:
          '**Conexión:** "zero/few-shot" ↔ evaluar $p_\\theta$ sin re-entrenar $\\theta$ (Chronos tokeniza valores; TimesFM parches; Moirai any-variate).',
      },
      {
        heading: 'E8 · Descomposición (EMD: IMFs + residuo) y VMD variacional',
        tex: 'y(t) = \\sum_{j=1}^{J} c_j(t) + r(t)',
        conn:
          '**Conexión:** "VMD/EMD/CEEMDAN + red profunda" ↔ $\\hat{c}_j = g_{\\theta_j}(\\mathbf{X}_j)$ por componente y $\\hat{y} = \\sum_j \\hat{c}_j + \\hat{r}$; la descomposición se implementa sobre la serie muestreada $y[t]$; preprocesamiento externo.',
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
      'Dónde se cruzan las familias E1–E8 con las puertas ①–④: cinco patrones (A–E).',
      '**A** Dinámica de potencia (swing) · **B** Flujo de red · **C** Demanda (física de forma) · **D** Edificios (RC) · **E** Renovables (física + residual).',
      '**El cuadrante "dinámica de edificio + multi-horizonte + rigor + UQ conformal" está VACÍO.**',
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
          '**Conexión:** puerta ① — la PINN (Misyris 2020) penaliza el residuo $r_\\theta(t)$ (ecuación siguiente); en modo inverso estima $M$ y $D$; DAE-PINN añade $0 = g(\\mathbf{x}_{dif}, \\mathbf{y}_{alg})$.',
      },
      {
        heading: 'A · Residuo físico sobre la trayectoria estimada',
        tex: 'r_\\theta(t) = M\\,\\frac{d\\hat{\\omega}(t)}{dt} - \\left[ P_m - P_e(\\hat{\\delta}) - D\\,(\\hat{\\omega} - \\omega_s) \\right]',
      },
      {
        heading: 'B · Ecuaciones nodales de flujo de potencia',
        tex: 'P_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\cos\\theta_{ij} + B_{ij}\\sin\\theta_{ij} \\right), \\qquad Q_i = \\sum_{j=1}^{N_{bus}} \\lvert V_i \\rvert \\lvert V_j \\rvert \\left( G_{ij}\\sin\\theta_{ij} - B_{ij}\\cos\\theta_{ij} \\right)',
        conn:
          '**Conexión:** "voltajes, ángulos" ↔ $(\\lvert V_i \\rvert, \\theta_i)$; las PINN-GNN usan el residuo de estas ecuaciones sobre el grafo de admitancias (puertas ②+①), con biases que generalizan a redes no vistas.',
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
      'No hay EDO del activo: la física entra como **regularizadores cualitativos** sobre $\\hat{\\mathbf{y}} \\in \\mathbb{R}^h$ (puerta ①, o ② si se cablea).',
    ],
    equations: [
      {
        heading: 'Penalización de rampas y de parabolicidad (ERCOT 2026)',
        tex: '\\mathcal{L}_{rampa} = \\sum_{j=1}^{h-1} \\max\\!\\bigl(0,\\; \\left| \\hat{y}[j+1] - \\hat{y}[j] \\right| - r_{max}\\bigr), \\qquad \\mathcal{L}_{par} = \\sum_{j=2}^{h-1} \\left( \\hat{y}[j-1] - 2\\hat{y}[j] + \\hat{y}[j+1] \\right)^2',
        conn:
          '**Conexión:** "loss parabólica/ramp" ↔ $\\mathcal{L}_{par}$, $\\mathcal{L}_{rampa}$; monotonía para chillers (Tang 2026): $\\frac{\\partial \\hat{y}}{\\partial x_m} \\ge 0$ penalizada con $\\mathcal{L}_{mono}$.',
      },
      {
        heading: 'Pérdida total del patrón C',
        tex: '\\mathcal{L}_{total} = \\mathcal{L}_{MSE} + \\lambda_{phys}\\,(\\mathcal{L}_{rampa} + \\mathcal{L}_{par} + \\mathcal{L}_{mono})',
        conn:
          'Ninguna contiene una EDO del activo: es el "REGULARIZADOR DE FORMA" del diagrama aplicado al forecast de demanda.',
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
          'Segundo nodo (masa de la envolvente): $C_{m} \\frac{d T_{m}(t)}{dt} = \\frac{T_{in}(t) - T_{m}(t)}{R_{in}} + \\frac{T_{out}(t) - T_{m}(t)}{R_{out}}$; "Modelos RC" ↔ $(R_{ea}, R_{in}, R_{out}, C_{in}, C_m)$.',
      },
      {
        heading: 'D · Residuo físico y pérdida compuesta',
        tex: '\\mathcal{R}_{phys}(t) = C_{in} \\frac{d \\hat{T}_{in}(t)}{dt} - \\left[ \\frac{T_{out}(t) - \\hat{T}_{in}(t)}{R_{ea}} + \\frac{T_m(t) - \\hat{T}_{in}(t)}{R_{in}} + A_w I_{sol}(t) + \\dot{Q}_{int}(t) + P_{HVAC}(t) \\right]',
        conn:
          'La pérdida $\\mathcal{L}_{phys} = \\frac{1}{\\tilde{N} \\cdot h} \\sum_{n,j} \\lVert \\mathcal{R}_{phys}(t_{n,j}; \\Theta) \\rVert^2$ con $\\mathcal{L}_{total}$ estándar (puerta ①); sin evaluación multi-horizonte en la literatura ("horizontes cortos").',
      },
      {
        heading: 'E · Rama física + rama residual + contexto (PhysEmbedFormer)',
        tex: '\\hat{y} = \\underbrace{f_{fis}(\\mathbf{x}_{met})}_{\\text{rama física}} + \\underbrace{g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})}_{\\text{rama residual + contexto}}',
        conn:
          '**Conexión:** puerta ④ con sabor de ② (rama física explícita e interpretable); la variante "PV con corrección de temperatura PINN" penaliza el residuo de $P_{pv}(t)$ (puerta ①).',
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
      'Cada puerta ataca preferentemente un problema distinto: la decisión informativa del documento.',
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
      '**① vs escasez:** $\\lambda_{phys}\\,\\mathcal{L}_{phys}$ restringe las funciones admisibles a las que casi satisfacen $\\mathcal{F}[u] = 0$ → aumenta la muestra efectiva; la ganancia aparece "EXACTAMENTE con pocos datos" (Loffa 2025).',
      '**② y ④:** con $\\hat{y} = f_{fis}(\\mathbf{x}_{met}) + g_\\theta(\\mathbf{x}, \\mathbf{c}_{met})$ cada término es inspeccionable, y fuera del dominio $g_\\theta$ puede fallar pero $f_{fis}$ sigue correcta (error acotado por el componente físico).',
    ],
    equations: [
      {
        heading: '③ vs estados no observables: posterior del GP con prior físico',
        tex: '\\bar{f}(\\mathbf{x}) = \\mathbf{k}(\\mathbf{x})^\\top (\\mathbf{K}_{GP} + \\sigma_n^2 \\mathbf{I})^{-1} \\mathbf{y}',
        conn:
          '**Conexión:** puerta ③ — con prior físico $f \\sim \\mathcal{GP}(m_{fis}, \\kappa_{fis})$ (PhI-GPR), la posterior reconstruye estados no medidos si el modelo dinámico está bien especificado.',
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
          'Muestreada con HMC o variacional: costo prohibitivo para forecasting operativo; alternativa barata: **cuantiles conformales**.',
      },
      {
        heading: 'Cuantiles conformales: cobertura $\\ge 1-\\alpha$ sin supuestos distribucionales',
        tex: '\\hat{q} = \\mathrm{Quantile}\\!\\left(\\{s_i\\}_{i=1}^{n};\\; \\frac{\\lceil (n+1)(1-\\alpha) \\rceil}{n}\\right), \\qquad C(\\hat{y}) = \\left[ \\hat{y} - \\hat{q},\\; \\hat{y} + \\hat{q} \\right]',
        conn:
          'Con puntajes $s_i = |y_i - \\hat{y}_i|$ sobre calibración de tamaño $n$: $\\mathbb{P}\\{y \\in C(\\hat{y})\\} \\ge 1 - \\alpha$ — el hueco más claro del mapa energético.',
      },
    ],
    bullets: [
      '**Eventos extremos:** particionar el test en $\\mathcal{E}$ y su complemento, reportando $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ por separado — ERCOT 2026: $\\mathcal{L}_{par} + \\mathcal{L}_{rampa}$ mejora la forma durante $\\mathcal{E}$, no la magnitud del pico.',
      '**Cómputo:** evaluar $\\mathcal{L}_{phys}$ crece con $N_c$ y el orden de $\\mathcal{N}$; no hay PINNs energéticas sobre datasets de $\\sim 10^6$–$10^7$ muestras.',
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
      'Opciones de problema que la tesis podría abarcar — **sin votar todavía**; la decisión es posterior.',
      '**A** Escasez de datos · **B** Interpretabilidad etiquetada · **C** UQ (conformal) · **D** Extremos/OOD.',
      'Las opciones **no son excluyentes**: las combinaciones se refuerzan.',
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
      '**Opción A (escasez de datos):** con $\\tilde{N}$ pequeño domina $\\lambda_{phys}\\,\\mathcal{L}_{phys}$; existe un umbral donde el residuo RC (§5b-D) supera a $\\mathcal{L}_{MSE}$ sola (Loffa 2025).',
    ],
    equations: [
      {
        heading: 'B · Descomposición por bandas espectralmente etiquetadas',
        tex: '\\mathbf{z}[t] = [\\boldsymbol{\\phi}_1(\\mathbf{x}[t]), \\dots, \\boldsymbol{\\phi}_K(\\mathbf{x}[t])] \\in \\mathbb{R}^{F}, \\qquad F = K\\,N_f',
        conn:
          '**Conexión:** cada banda $\\boldsymbol{\\phi}_k$ queda *etiquetada* con su escala temporal ($B = (6, 24, 72)$ h o $(4, 24, 168)$ h): el análogo **aprendible** de la descomposición E8, dentro del modelo.',
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
      '**Opción C (UQ):** conformal — $C(\\hat{y}) = [\\hat{y} - \\hat{q},\\, \\hat{y} + \\hat{q}]$ con cobertura $\\ge 1 - \\alpha$ sobre cualquier predictor; B-PINN es prohibitivo en forecasting.',
      '**Opción D (robustez/extremos):** evaluación por régimen — $\\mathcal{L}_{MSE}\\vert_{\\mathcal{E}}$ por separado, más $\\mathcal{L}_{rampa}$ y $\\mathcal{L}_{par}$ (§5b-C) durante el evento.',
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
      ['1', 'Cómo entra la física (4 puertas)', '$\\mathcal{L}_{total}$, $\\mathbb{J}\\nabla H_\\theta$, $\\psi_{fis}$, $f_{fis} + g_\\theta$ (§3)'],
      ['2', 'Qué familias PIML existen para TS (general)', 'F1–F6: PINN, PG-RNN, Neural ODE/SDE, PhyDNet, kernel/GPR, PINT/RFF (§4)'],
      ['3', 'Qué familias data-driven hay en energía (base)', 'E1–E8: SARIMA, SVR/XGBoost, LSTM/GRU, TCN, atención, SSM, fundacionales, VMD (§5a)'],
      ['4', 'Dónde TS ∩ física ∩ energía (patrones A–E)', 'swing, flujo de potencia, pérdidas de forma, RC 2R2C + $\\mathcal{R}_{phys}$, rama física+residual (§5b)'],
      ['5', 'Qué problema resuelve cada enfoque', 'regularizador físico, posterior B-PINN, cuantiles conformales (§6)'],
      ['6', 'Opciones de problema (sin conectar a modelo)', 'anclajes A–D: régimen de escasez, bandas etiquetadas, conformal, evaluación por régimen (§7)'],
    ],
  },

  // ── Cierre ──────────────────────────────────────────────────────────────
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
