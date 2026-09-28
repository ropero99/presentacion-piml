import { makeEdge } from './DeckFlowPanel.jsx';

/**
 * Topología de los tres diagramas de las puertas ①②③ sobre el sistema
 * masa-resorte (MR), en el lenguaje del esquema TikZ de referencia
 * (Slides_PINNs/esquemaPINNs.tex): red neuronal dibujada con neuronas
 * circulares y conexiones completas, llave θ bajo las ocultas, cajas
 * punteadas de rol, línea de composición de la pérdida abajo y
 * minimización → θ*. Solo cambia el punto donde entra la física:
 * la prop `entry` ('ad' | 'modelo' | 'datos') decide qué bloque lleva
 * el resaltado y el color de puerta (① azul #2E86AB, ② morado #7D3C98,
 * ③ teal #16A085).
 *
 * Tipos de nodo: 'deck' (cajas, panel compartido), 'neuron' (círculos),
 * 'label' (etiquetas de capa/llave), 'structure' (caja punteada de
 * estructura física) y 'lossline' (composición de la pérdida). Los tres
 * últimos viven en mrNodeTypes.jsx y se registran vía extraNodeTypes.
 */

const NAVY = '#1E3A5F'; // sistema físico / conocimiento físico
const AZUL = '#2E86AB'; // puerta ① (pérdida) / comparación
const MORADO = '#7D3C98'; // puerta ② (arquitectura)
const TEAL = '#16A085'; // puerta ③ (datos/features)
const GRIS = '#34495E'; // red neuronal
const GRIS_CLARO = '#95A5A6'; // salida
const ROJO = '#C0392B'; // optimización
const TRAMO = '#8fa8c8'; // conexiones de la red (líneas finas sin flecha)

const DOOR_COLOR = { ad: AZUL, modelo: MORADO, datos: TEAL };

const BADGE = '★ PUNTO DE ENTRADA DE LA FÍSICA';

// Geometría de la red dibujada (coordenadas del lienzo en px).
const N_NEURON = 3; // neuronas por capa oculta
const N_HIDDEN = 3; // capas ocultas
const NEURON_SIZE = 46; // lado del círculo
const NEURON_GAP = 22; // separación vertical entre neuronas
const HIDDEN_STEP = 80; // separación horizontal entre capas
const NET_X0 = 440; // x de la primera capa oculta
const NET_Y0 = 132; // y de la primera neurona

const HIDDEN_ROWS = Array.from({ length: N_NEURON }, (_, r) => r);
const HIDDEN_LAYERS = Array.from({ length: N_HIDDEN }, (_, l) => l);

/** Posición (x, y) de la neurona (capa, fila). */
function neuronPos(layer, row) {
  return { x: NET_X0 + layer * HIDDEN_STEP, y: NET_Y0 + row * (NEURON_SIZE + NEURON_GAP) };
}

/** Malla de conexiones entre dos columnas de neuronas (líneas finas). */
function neuronMesh(fromIds, toIds) {
  const edges = [];
  fromIds.forEach((src) => {
    toIds.forEach((tgt) => {
      edges.push({
        id: `mesh-${src}-${tgt}`,
        source: src,
        target: tgt,
        type: 'default',
        style: { stroke: TRAMO, strokeWidth: 1 },
      });
    });
  });
  return edges;
}

/** Neurona circular (conexiones lado a lado vía source/targetPosition). */
function neuron(id, label, color, pos, opts = {}) {
  return {
    id,
    type: 'neuron',
    position: pos,
    sourcePosition: 'right',
    targetPosition: 'left',
    zIndex: 10,
    data: { label, color, fill: opts.fill, heavy: opts.heavy },
  };
}

/** Etiqueta de capa o llave (texto pequeño, sin caja). */
function layerLabel(id, text, x, y, variant = 'layer') {
  return {
    id,
    type: 'label',
    position: { x, y },
    data: { label: text, variant, color: 'var(--subtext1)' },
  };
}

/**
 * Construye { nodes, edges } del diagrama MR para una puerta.
 * @param {{ entry: 'ad' | 'modelo' | 'datos' }} options
 */
export function buildMrDiagram({ entry }) {
  if (!DOOR_COLOR[entry]) {
    throw new Error(`entry desconocido para el diagrama MR: ${entry}`);
  }

  const nodes = [];
  const edges = [];

  // ── Sistema MR y datos (esqueleto aprobado, compacto) ──
  nodes.push({
    id: 'mr',
    type: 'deck',
    position: { x: 0, y: 170 },
    data: {
      color: NAVY,
      title: 'Sistema MR',
      lines: ['■ masa · ∿ k · ⌇ c', 'm·ẍ + c·ẋ + k·x = 0', 'estado: (x, ẋ)'],
    },
  });
  nodes.push({
    id: 'datos',
    type: 'deck',
    position: { x: 185, y: 178 },
    data: {
      color: TEAL,
      title: 'Datos / entrenamiento',
      lines: [entry === 'modelo' ? '(t, x, ẋ) medidos' : '(t, x) medidos'],
    },
  });

  // ── Red neuronal dibujada (f_θ) ──
  const inputs =
    entry === 'datos'
      ? [
          { id: 'in-x', label: 'x', color: TEAL, row: 0 },
          {
            id: 'in-psi',
            label: 'ψ_fis(x)',
            color: TEAL,
            row: 2,
            heavy: true,
            fill: '#e8f7f3',
          },
        ]
      : entry === 'modelo'
        ? [
            { id: 'in-q', label: 'q', color: TEAL, row: 0 },
            { id: 'in-p', label: 'p', color: TEAL, row: 2 },
          ]
        : [{ id: 'in-t', label: 't', color: TEAL, row: 1 }];

  inputs.forEach((inp) => {
    nodes.push(
      neuron(
        inp.id,
        inp.label,
        inp.color,
        { x: 360, y: NET_Y0 + inp.row * (NEURON_SIZE + NEURON_GAP) },
        inp,
      ),
    );
  });

  const hiddenIds = HIDDEN_LAYERS.map((l) =>
    HIDDEN_ROWS.map((r) => {
      const id = `h${l + 1}-${r + 1}`;
      nodes.push(
        neuron(
          id,
          '',
          GRIS,
          neuronPos(l, r),
          entry === 'modelo' ? { fill: '#f6eff9' } : { fill: '#eef4fb' },
        ),
      );
      return id;
    }),
  );

  const outLabel = entry === 'modelo' ? '(q̂, p̂)' : 'x̂_θ(t)';
  nodes.push(
    neuron(
      'out',
      outLabel,
      entry === 'modelo' ? MORADO : ROJO,
      { x: NET_X0 + N_HIDDEN * HIDDEN_STEP, y: NET_Y0 + NEURON_SIZE + NEURON_GAP },
      { fill: entry === 'modelo' ? '#f6eff9' : '#fdeeec', heavy: entry !== 'modelo' },
    ),
  );

  // Etiquetas de capa (sobre las columnas, como en el TikZ).
  // Etiquetas de capa (sobre las columnas, como en el TikZ). Las ocultas
  // usan solo "ℓ=N": el paso entre columnas (80 px) no cabe para más texto.
  nodes.push(layerLabel('lbl-in', 'capa entrada', 340, NET_Y0 - 34));
  HIDDEN_LAYERS.forEach((l) => {
    nodes.push(
      layerLabel(`lbl-h${l + 1}`, `ℓ=${l + 1}`, NET_X0 + l * HIDDEN_STEP + 6, NET_Y0 - 34),
    );
  });
  nodes.push(layerLabel('lbl-out', 'capa salida', NET_X0 + N_HIDDEN * HIDDEN_STEP - 28, NET_Y0 - 34));

  // Malla de conexiones: entrada → ocultas → salida (líneas finas).
  const inputIds = inputs.map((i) => i.id);
  edges.push(...neuronMesh(inputIds, hiddenIds[0]));
  for (let l = 0; l < N_HIDDEN - 1; l += 1) {
    edges.push(...neuronMesh(hiddenIds[l], hiddenIds[l + 1]));
  }
  edges.push(...neuronMesh(hiddenIds[N_HIDDEN - 1], ['out']));

  // ── Estructura física (puerta ②): caja morada punteada DENTRO de la red ──
  // La caja arranca sobre la fila de etiquetas para dar cabida al título
  // arriba; el badge va FUERA (nodo etiqueta propio) para no tapar neuronas.
  let thetaY = NET_Y0 + 3 * (NEURON_SIZE + NEURON_GAP) - 4; // 330 para ① y ③
  if (entry === 'modelo') {
    const first = neuronPos(0, 0);
    const last = neuronPos(N_HIDDEN - 1, N_NEURON - 1);
    nodes.push({
      id: 'estructura',
      type: 'structure',
      position: { x: first.x - 16, y: NET_Y0 - 60 },
      targetPosition: 'left',
      zIndex: 0,
      data: {
        color: MORADO,
        label: 'estructura física (conserva H_θ)',
        eq: 'd/dt [q, p] = J ∇H_θ',
        badge: false,
        style: {
          width: last.x - first.x + NEURON_SIZE + 32,
          height: last.y + NEURON_SIZE + 12 - (NET_Y0 - 60),
        },
      },
    });
    // Badge del punto de entrada, bajo la caja (fuera, como chip).
    nodes.push({
      id: 'badge-estructura',
      type: 'label',
      position: { x: first.x + 28, y: NET_Y0 + 3 * (NEURON_SIZE + NEURON_GAP) + 18 },
      data: { label: BADGE, variant: 'badge', color: MORADO },
    });
    thetaY = NET_Y0 + 3 * (NEURON_SIZE + NEURON_GAP) + 46;
  }

  // Llave θ bajo las ocultas (etiqueta con línea superior).
  const thetaX = NET_X0 + ((N_HIDDEN - 1) * HIDDEN_STEP) / 2;
  nodes.push({
    id: 'theta',
    type: 'label',
    position: { x: thetaX - 52, y: thetaY },
    data: { label: 'θ = {W_ℓ, b_ℓ}_{ℓ=1}^L', variant: 'theta', color: 'var(--fg)' },
  });

  // ── Cajas punteadas de rol (columna derecha) ──
  const BOX_X = 830;
  const cmpData = entry === 'modelo' ? '(t, x, ẋ)' : '(t, x)';
  nodes.push({
    id: 'cmp',
    type: 'deck',
    position: { x: BOX_X, y: entry === 'ad' ? 92 : 172 },
    data: {
      color: AZUL,
      dashed: true,
      title: 'Comparar con datos',
      lines: [`${cmpData} → L_MSE`],
    },
  });

  if (entry === 'ad') {
    // ①: fila horizontal cmp → ad (al lado, pedido ronda 5) → opt;
    // la física entra a la autodiff por bezier bajo la fila; flecha fina
    // baja de la autodiff a la línea de pérdida (estilo TikZ).
    nodes.push({
      id: 'ad',
      type: 'deck',
      position: { x: BOX_X + 260, y: 92 },
      data: {
        color: AZUL,
        dashed: true,
        heavy: true,
        title: 'Diff. automática',
        lines: ['ẋ̂_θ, ẍ̂_θ → r_θ', BADGE],
        targetHandles: [
          { id: 't-cmp', yPct: 30 },
          { id: 't-fis', yPct: 80 },
        ],
      },
    });
    nodes.find((n) => n.id === 'ad').data.targetHandles = [
      { id: 't-cmp', yPct: 30 },
      { id: 't-fis', yPct: 80 },
    ];
  }

  // ── Física (esqueleto aprobado) + su flecha al punto de entrada ──
  const fisPos =
    entry === 'ad'
      ? { x: 640, y: 360 } // bajo la salida: flecha corta a la caja autodiff
      : entry === 'modelo'
        ? { x: 240, y: 415 } // bajo la red: flecha corta a la estructura
        : { x: 0, y: 441 }; // a la izquierda de feat: arista horizontal a t-fis
  nodes.push({
    id: 'fis',
    type: 'deck',
    position: fisPos,
    sourcePosition: 'right',
    data: { color: NAVY, title: 'Física N[u] = 0', lines: ['m·ẍ + c·ẋ + k·x = 0'] },
  });

  // ── Optimización (derecha de las cajas de rol) ──
  nodes.push({
    id: 'opt',
    type: 'deck',
    position: { x: BOX_X + (entry === 'ad' ? 520 : 240), y: entry === 'ad' ? 172 : 176 },
    data: { color: ROJO, title: 'Minimización', lines: ['→ θ*'] },
  });

  // ── Línea de composición de la pérdida (bajo la zona de cajas) ──
  const lossLines =
    entry === 'ad'
      ? ['L_MSE(θ) + λ_phys·L_physics(θ) = L_total(θ)']
      : entry === 'modelo'
        ? ['L_MSE(θ) — no existe L_physics: la física está en la estructura']
        : ['L_MSE(θ) sobre x̃ aumentado — la física entró antes, en los datos'];
  nodes.push({
    id: 'loss',
    type: 'lossline',
    position: { x: entry === 'ad' ? BOX_X + 260 : BOX_X - 30, y: entry === 'ad' ? 360 : 310 },
    data: { lines: lossLines, color: 'var(--fg)' },
  });

  // ── Aristas estructurales (deck smoothstep, color por origen) ──
  edges.push(makeEdge('mr', 'datos', { color: NAVY }));
  inputIds.forEach((tid) => {
    edges.push({
      id: `datos-${tid}`,
      source: 'datos',
      target: tid,
      type: 'default',
      style: { stroke: TEAL, strokeWidth: 1.5 },
    });
  });

  if (entry === 'ad') {
    // ①: salida → comparación → autodiff (residuo) → minimización;
    // la física entra a la autodiff por bezier bajo la fila (sin cruzar
    // la caja de comparación); flecha fina baja a la línea de pérdida.
    edges.push(
      makeEdge('out', 'cmp', { color: GRIS_CLARO }),
      makeEdge('cmp', 'ad', { color: AZUL, targetHandle: 't-cmp' }),
      makeEdge('ad', 'opt', { color: AZUL, offset: 10 }),
      {
        id: 'fis-ad',
        source: 'fis',
        target: 'ad',
        targetHandle: 't-fis',
        type: 'default',
        style: { stroke: NAVY, strokeWidth: 2 },
      },
      thinArrow('ad', 'loss'),
    );
  } else if (entry === 'modelo') {
    // ②: la física entra a la estructura (dentro de la red).
    edges.push(
      makeEdge('out', 'cmp', { color: GRIS_CLARO }),
      makeEdge('cmp', 'opt', { color: AZUL }),
      makeEdge('fis', 'estructura', { color: NAVY }),
    );
  } else {
    // ③: la física entra a los datos/features; ψ_fis alimenta la entrada.
    // Geometría ronda 5: feat DEBAJO de Datos/entrenamiento → conector
    // casi vertical a ψ_fis (sin diagonal); fis a la izquierda en fila.
    // Datos ya alimenta a ψ_fis con su arista corta directa.
    nodes.push({
      id: 'feat',
      type: 'deck',
      position: { x: 185, y: 430 },
      data: {
        color: TEAL,
        dashed: true,
        heavy: true,
        title: 'Features ψ_fis·f_LF',
        lines: ['→ x̃ aumentada', BADGE],
        targetHandles: [{ id: 't-fis', yPct: 50 }],
      },
    });
    edges.push(
      makeEdge('out', 'cmp', { color: GRIS_CLARO }),
      makeEdge('cmp', 'opt', { color: AZUL }),
      makeEdge('fis', 'feat', { color: NAVY, targetHandle: 't-fis' }),
      {
        id: 'feat-in-psi',
        source: 'feat',
        target: 'in-psi',
        type: 'default',
        style: { stroke: TEAL, strokeWidth: 1.5 },
      },
    );
  }

  return { nodes, edges };
}

/** Flecha fina hacia la línea de pérdida (estilo TikZ: flechitas cortas). */
function thinArrow(source, target) {
  return {
    id: `thin-${source}-${target}`,
    source,
    target,
    type: 'default',
    style: { stroke: NAVY, strokeWidth: 1 },
    markerEnd: { type: 'arrowclosed', color: NAVY, width: 12, height: 12 },
  };
}

/**
 * Puerta ② (ronda 7) — flujo completo de una Hamiltonian NN sobre el MR
 * conservativo (c = 0), en 10 etapas con rama de predicción. Ajustes de
 * ronda 7: bloque de entrada de la física resaltado con panel morado
 * (autodiff + grad(H_θ) + ecuaciones de Hamilton), entrenamiento y
 * predicción separados con chips + divisor, integrador numérico
 * (preferiblemente simpléctico), L_HNN(θ) en toda la notación y cajas/
 * texto más grandes con menos espacio vacío (scoping CSS .flow-hnn).
 *   1 sistema físico → 2 datos → 3 conversión canónica → 4 entrada (q, p)
 *   → 5 red (salida única H_θ) → 6 autodiff → 7 estructura Hamiltoniana
 *   (★ LA FÍSICA ENTRA AQUÍ) → 8 comparar dinámicas → L_HNN(θ) → 9 θ → θ*
 *   y rama 10: (q₀,p₀) → H_θ* → grad → ecuaciones de Hamilton → (q̇,ṗ)
 *   → integrador → (q(t),p(t)) → x(t).
 * Colores: azul = sistema/variables físicas, teal = datos, morado = red,
 * Hamiltoniano, autodiff y estructura, naranja = L_HNN, rojo = optimización.
 */
const NARANJA = '#E67E22'; // L_HNN (loss, rojo suave/naranja)

export function buildHnnDiagram() {
  // Tamaño de neurona propio del diagrama HNN (el compartido es 46/22):
  // cajas y texto más grandes (ronda 7) con la malla recalculada.
  // Ronda 7b: malla más alta (HG 24→64) y filas más separadas para
  // aprovechar el lienzo vertical (el fitView es limitado por ancho).
  const HN = 52; // lado del círculo
  const HG = 64; // separación vertical entre neuronas
  const NET_Y0 = 132;

  const nodes = [];
  const edges = [];

  // 0 · Panel de resalte del bloque donde entra la física (bajo los nodos).
  nodes.push({
    id: 'hnn-panel-fisica',
    type: 'label',
    position: { x: 914, y: 216 },
    data: {
      label: '',
      variant: 'panel',
      style: {
        width: 412,
        height: 147,
        background: 'rgba(125, 60, 152, 0.07)',
        border: '2px solid rgba(125, 60, 152, 0.30)',
      },
    },
  });

  // Chip de fila: entrenamiento (arriba).
  nodes.push({
    id: 'hnn-chip-train',
    type: 'label',
    position: { x: 0, y: 195 },
    data: { label: 'ENTRENAMIENTO · ajuste de θ con L_HNN(θ)', variant: 'chip', color: NAVY },
  });

  // 1 · Sistema físico (conservativo)
  nodes.push({
    id: 'hnn-mr',
    type: 'deck',
    position: { x: 0, y: 229 },
    data: {
      color: NAVY,
      title: 'Sistema físico',
      lines: ['m·ẍ + k·x = 0', 'masa-resorte conservativo', 'c = 0 · estado: (x, ẋ)'],
    },
  });

  // 2 · Datos medidos
  nodes.push({
    id: 'hnn-datos',
    type: 'deck',
    position: { x: 215, y: 247 },
    data: { color: TEAL, title: 'Datos medidos', lines: ['(t_n, x_n, ẋ_n)'] },
  });

  // 3 · Conversión a variables canónicas
  nodes.push({
    id: 'hnn-conv',
    type: 'deck',
    position: { x: 408, y: 232 },
    data: {
      color: NAVY,
      title: 'Conversión canónica',
      lines: ['q_n = x_n', 'p_n = m·ẋ_n', '→ (q_n, p_n)'],
    },
  });

  // 4 · Entrada de la HNN (dos nodos de estado)
  nodes.push(neuron('hnn-in-q', 'q', NAVY, { x: 600, y: NET_Y0 }, {}));
  nodes.push(neuron('hnn-in-p', 'p', NAVY, { x: 600, y: NET_Y0 + 2 * (HN + HG) }, {}));
  const hnnInputIds = ['hnn-in-q', 'hnn-in-p'];

  // 5 · Red neuronal (malla compacta, salida ÚNICA H_θ)
  const hnnHiddenIds = [0, 1].map((l) =>
    [0, 1, 2].map((r) => {
      const id = `hnn-h${l + 1}-${r + 1}`;
      nodes.push(
        neuron(id, '', GRIS, { x: 686 + l * 76, y: NET_Y0 + r * (HN + HG) }, { fill: '#f6eff9' }),
      );
      return id;
    }),
  );
  nodes.push(
    neuron('hnn-out', 'H_θ', MORADO, { x: 848, y: NET_Y0 + HN + HG }, { fill: '#f6eff9', heavy: true }),
  );
  edges.push(...neuronMesh(hnnInputIds, hnnHiddenIds[0]));
  edges.push(...neuronMesh(hnnHiddenIds[0], hnnHiddenIds[1]));
  edges.push(...neuronMesh(hnnHiddenIds[1], ['hnn-out']));
  nodes.push(layerLabel('hnn-cap', 'La red aprende el Hamiltoniano', 600, 66));
  nodes.push(layerLabel('hnn-sal', 'salida única: H_θ(q, p)', 770, 308));
  nodes.push(layerLabel('hnn-theta', 'θ = {W_ℓ, b_ℓ}_{ℓ=1}^L', 680, 428, 'theta'));

  // 6 · Autodiff (dentro del panel de la física)
  nodes.push({
    id: 'hnn-autodiff',
    type: 'deck',
    position: { x: 934, y: 240 },
    data: { color: MORADO, dashed: true, title: 'Autodiff', lines: ['∂H_θ/∂q', '∂H_θ/∂p'] },
  });

  // 7 · Estructura Hamiltoniana (punto de entrada de la física)
  nodes.push({
    id: 'hnn-estructura',
    type: 'deck',
    position: { x: 1128, y: 231 },
    data: {
      color: MORADO,
      heavy: true,
      title: 'Estructura Hamiltoniana',
      lines: ['q̇_θ = ∂H_θ/∂p', 'ṗ_θ = −∂H_θ/∂q', 'ż_θ = J ∇H_θ'],
    },
  });
  nodes.push({
    id: 'hnn-badge',
    type: 'label',
    position: { x: 1148, y: 327 },
    data: { label: '★ LA FÍSICA ENTRA AQUÍ', variant: 'badge', color: MORADO },
  });

  // 8 · Comparación con datos (L_HNN(θ))
  nodes.push({
    id: 'hnn-cmp',
    type: 'deck',
    position: { x: 1330, y: 240 },
    data: {
      color: NARANJA,
      dashed: true,
      title: 'Comparar dinámicas',
      lines: ['(q̇_θ, ṗ_θ) vs (q̇_n, ṗ_n)', '→ L_HNN(θ)'],
    },
  });

  // 9 · Optimización
  nodes.push({
    id: 'hnn-opt',
    type: 'deck',
    position: { x: 1564, y: 247 },
    data: { color: ROJO, title: 'Optimización', lines: ['θ → θ*'] },
  });

  // 10 · Rama de predicción (después del entrenamiento, con θ*)
  nodes.push({
    id: 'hnn-divider',
    type: 'label',
    position: { x: 0, y: 500 },
    data: { label: '', variant: 'divider', style: { width: 1740 } },
  });
  nodes.push({
    id: 'hnn-chip-pred',
    type: 'label',
    position: { x: 0, y: 516 },
    data: { label: 'PREDICCIÓN · después del entrenamiento · usando θ*', variant: 'chip', color: TEAL },
  });
  const predChain = [
    { id: 'hnn-p1', x: 0, y: 558, color: NAVY, title: '(q₀, p₀)', lines: ['estado inicial'] },
    { id: 'hnn-p2', x: 200, y: 560, color: MORADO, title: 'H_θ*', lines: [] },
    { id: 'hnn-p3', x: 400, y: 560, color: MORADO, title: 'grad(H_θ*)', lines: [] },
    { id: 'hnn-p4', x: 600, y: 548, color: MORADO, heavy: true, title: 'ecuaciones de Hamilton', lines: ['J ∇H_θ*'] },
    { id: 'hnn-p5', x: 812, y: 560, color: NAVY, title: '(q̇, ṗ)', lines: [] },
    { id: 'hnn-p6', x: 1010, y: 552, color: GRIS, title: 'integrador numérico', lines: ['preferiblemente simpléctico'] },
    { id: 'hnn-p7', x: 1250, y: 558, color: NAVY, title: '(q(t), p(t))', lines: [] },
    { id: 'hnn-p8', x: 1445, y: 558, color: NAVY, title: 'x(t) = q(t)', lines: [] },
  ];
  predChain.forEach((p) => {
    nodes.push({
      id: p.id,
      type: 'deck',
      position: { x: p.x, y: p.y },
      data: { color: p.color, title: p.title, lines: p.lines, ...(p.heavy ? { heavy: true } : {}) },
    });
  });
  for (let i = 0; i < predChain.length - 1; i += 1) {
    edges.push(makeEdge(predChain[i].id, predChain[i + 1].id, { color: NAVY }));
  }

  // Aristas de la fila principal (izquierda → derecha, colores por rol)
  edges.push(
    makeEdge('hnn-mr', 'hnn-datos', { color: NAVY }),
    makeEdge('hnn-datos', 'hnn-conv', { color: TEAL }),
    makeEdge('hnn-conv', 'hnn-in-q', { color: NAVY }),
    makeEdge('hnn-conv', 'hnn-in-p', { color: NAVY }),
    makeEdge('hnn-out', 'hnn-autodiff', { color: MORADO }),
    makeEdge('hnn-autodiff', 'hnn-estructura', { color: MORADO }),
    makeEdge('hnn-estructura', 'hnn-cmp', { color: NARANJA }),
    makeEdge('hnn-cmp', 'hnn-opt', { color: ROJO }),
  );

  return { nodes, edges };
}
