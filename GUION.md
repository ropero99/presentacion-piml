# Guion de presentación — Revisión PIML (versión matemática)

## Uso del guion

- **Duración objetivo: ~40 minutos** (26 diapositivas; tiempos sugeridos por slide, ajustables). Total sugerido: 40.5 min con los tiempos marcados; margen de ±5 min según ritmo y preguntas intermedias.
- **Público técnico.** Se asume familiaridad con ML y series de tiempo (LSTM/GRU, kernels, sobreajuste, ventanas e horizontes de pronóstico). NO se asume dominio de PIML: las cuatro puertas, la formulación PINN y la notación del proyecto se explican desde cero. No se asume que el público haya leído el documento.
- **Navegación del deck:** flechas izquierda/derecha para avanzar y retroceder; el rail lateral permite saltar a cualquier slide; la tecla `f` activa el modo enfoque (oculta el resto de la interfaz). Este guion va slide por slide, en el mismo orden del deck.
- **Convención de ecuaciones:** cada fórmula se cita de forma hablada ("lambda físico por la pérdida física") y, cuando conviene, la notación exacta va entre paréntesis: (L_total = L_MSE + λ_phys · L_physics). Los subíndices y símbolos siguen la Tabla de notación de la slide 2; los símbolos locales (s, d, D, c de SARIMA; A, B, C del SSM) se aclaran al vuelo y no se reutilizan.

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
  "Antes de los diagramas, la notación, en cinco grupos fijos. El primero es el marco general: la serie observada y sub t, el pronóstico multi-paso directo ŷ en R h, la ventana X de tau por d, y las pérdidas —MSE, física y total— con su peso lambda físico, el residuo R físico y la ley N de u igual a cero en el dominio Omega T. El segundo grupo es el codificador RFF multibanda del artículo guía: K bandas con ancho softplus de rho k, N f features por banda y el mapeo phi k de la Ecuación 24; el embedding z sub t vive en R F con F igual a K por N f, y el pre-set de bandas es seis, veinticuatro y setenta y dos horas. El tercero cubre el bloque espectro-temporal y la recurrencia: dilatación, kernel, GELU, LayerNorm y el módulo f RNN; noten que la compuerta de actualización de la GRU es u sub t, no z sub t, para no colisionar con el embedding espectral. El cuarto grupo es la física térmica RC: temperaturas T in, T out y T m, capacidades C in y C m, resistencias R ea, R in y R out, y las exógenas I sol, A w, Q punto int y P HVAC. El quinto avisa que los símbolos locales viven solo dentro de su ecuación y no se reutilizan."
- **Puente:** "Con la notación fijada, entramos al Diagrama 1: las cuatro puertas."

### Slide 3 — 3 · Diagrama 1 · Las cuatro puertas por las que entra la física

- ⏱ ~2 min
- **Pantalla:** el mapa del Diagrama 1: a la izquierda el núcleo azul oscuro (conocimiento físico, N[u] = 0) y a la derecha el modelo ML/DL; cuatro rutas coloreadas ① pérdida, ② arquitectura, ③ datos/features, ④ híbrido. Señalar que la leyenda etiqueta ① como "débil" y ② como "fuerte".
- **Guion:**
  "Este mapa tiene un solo punto de partida: el predictor paramétrico del modelo ML, ŷ igual a f theta de x, y una ley física conocida, N de u igual a cero. La pregunta del diagrama es: ¿por dónde entra esa ley en el modelo? La puerta 1 es la pérdida: física débil, aplicada como penalización durante el entrenamiento. La puerta 2 es la arquitectura: física fuerte, cableada en la propia estructura de f theta. La puerta 3 actúa sobre los datos: features derivadas de leyes físicas y datos de múltiples fidelidades. Y la puerta 4 es el híbrido: simulador más red residual, f física de x más g theta de x. Toda la taxonomía PIML que veremos hoy se reduce a estas cuatro rutas de inyección."
- **Puente:** "Veamos la puerta 1 en su forma matemática."

### Slide 4 — 3 · Matemática del Diagrama 1 · Puerta ① — Función de pérdida (forma débil)

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: el modelo general (ŷ = f_θ(x), θ ∈ Θ) y la pérdida compuesta del PINN clásico con L_MSE sobre N_d datos y λ_phys por la norma del residuo r_θ sobre N_c puntos de colocación.
- **Guion:**
  "La forma débil vive en la función de pérdida. Todo parte del predictor ŷ igual a f theta de x, con theta en Theta. La pérdida compuesta del PINN clásico, de Raissi 2019, es L total igual a L MSE más lambda físico por L física: el primer término es el error cuadrático medio sobre los N d datos, y el segundo es la norma del residuo r theta evaluado en los N c puntos de colocación. El residuo r theta es exactamente la ley física aplicada a la red: r theta igual a N de f theta. Se llama 'débil' porque la física no se impone exactamente: se penaliza, y cuánto pesa lo decide lambda físico. En la formulación PINN-RC del proyecto, ese residuo es la EDO térmica del edificio evaluada en la predicción."
- **Puente:** "Las otras tres puertas no dependen de lambda físico; veamos por qué."

### Slide 5 — 3 · Matemática del Diagrama 1 · Puertas ② ③ ④ — Arquitectura, datos y híbrido

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones apiladas: la forma hamiltoniana con la matriz J de dos por dos; las features físicas x tilde igual a corchete x coma psi fis de x corchete cerrado y la multi-fidelity y HF igual a alfa mf por f LF más delta mf; y el híbrido en sus dos variantes (suma residual y apilamiento de features).
- **Guion:**
  "La puerta 2 pone la física en la estructura: en la forma hamiltoniana, la derivada temporal del vector q coma p es J por el gradiente de H theta, con J la matriz simpléctica de ceros y unos menos identidad. Esa conservación se cumple para todo theta, sin lambda físico: la garantía es estructural. La puerta 3 actúa en los datos: las features se aumentan con psi física de x, y la multi-fidelity escribe el dato de alta fidelidad como alfa mf por el modelo de baja fidelidad más el delta de discrepancia, con el cuello de botella en el latente z bot igual a E de x. La puerta 4 es el híbrido en dos variantes: suma residual, f física de x más g theta de x, o apilamiento, g theta que recibe x y f física de x. Comparen las garantías: la puerta 1 penaliza, la puerta 2 garantiza, y las puertas 3 y 4 combinan conocimiento y aprendizaje."
- **Puente:** "La pregunta siguiente es qué familias concretas existen para series de tiempo: eso es el Diagrama 2."

### Slide 6 — 4 · Diagrama 2 · Familias PIML para series de tiempo (todas las aplicaciones)

- ⏱ ~2 min
- **Pantalla:** el mapa de las seis familias F1–F6 colgando de la cabeza "serie de tiempo"; la leyenda codifica madurez por color: F1 madura, F3 y F4 de madurez media, F2 y F5 de nicho, F6 emergente.
- **Guion:**
  "El Diagrama 2 ordena seis familias PIML para series de tiempo, en todas las aplicaciones. El punto de partida común: la serie y de t observa un sistema dinámico gobernado por una ley N de u igual a cero, total o parcialmente conocida. F1 es la familia PINN sobre EDO y EDP, la más madura. F2 son las redes recurrentes physics-guided. F3 son las Neural ODE y SDE informadas, y F4 es la física en el espacio latente, con PhyDNet como referencia; ambas de madurez media. F5 son los métodos kernel y GPR, de nicho, y F6 es la física embebida en la arquitectura, la familia emergente, donde vive el RFF multibanda del artículo guía. El color del diagrama codifica exactamente esa madurez, y en los bloques matemáticos veremos las seis de dos en dos."
- **Puente:** "Empezamos por F1 y F2."

### Slide 7 — 4 · Matemática del Diagrama 2 · F1 — PINN sobre EDO/EDP · F2 — Physics-guided RNN

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: la EDO con su residuo r_θ = ∂_t u_θ + N[u_θ]; la pérdida de F1 con N_d datos y N_c puntos de colocación; la recurrencia estándar de F2; y la pérdida L = L_MSE + λ_phys·L_EC con el residuo de consistencia temporal.
- **Guion:**
  "F1 es la PINN clásica: la red aprende la solución del sistema dinámico, u theta de t y x, que debe satisfacer parcial de u respecto de t más N de u igual a cero en Omega T. El residuo r theta es justamente esa suma, evaluado en los N c puntos de colocación t j coma x j, y la pérdida suma el error sobre los N d datos más lambda físico por la norma del residuo. F2 cambia el objeto: la recurrencia es estándar, h sub t igual a f RNN de x sub t y h sub t menos uno, y la predicción sale de g de h sub t; la física entra como consistencia temporal. La pérdida es L MSE más lambda físico por L EC, donde L EC suma la norma del residuo r EC entre predicciones consecutivas. La diferencia clave: F1 aproxima la solución de la ley; F2 solo penaliza que las predicciones la respeten en el tiempo."
- **Puente:** "F3 y F4 llevan la física a la dinámica continua y al espacio latente."

### Slide 8 — 4 · Matemática del Diagrama 2 · F3 — Neural ODE/SDE informados · F4 — Física en el espacio latente

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la dinámica continua de F3 con su integral de t_0 a t_1; la ecuación de Euler–Lagrange de la Lagrangian NN; y la descomposición latente de PhyDNet (z = phys + res).
- **Guion:**
  "En F3 la dinámica es continua: la derivada del estado h es f theta de h de t y t, y entre t cero y t uno el estado se obtiene integrando f theta con un solver diferenciable. La estructura física parcial puede ser la forma hamiltoniana de la puerta 2 del Diagrama 1, o la euler-lagrangeana: la derivada temporal de la derivada parcial de L theta respecto de q punto, menos la derivada parcial de L theta respecto de q, igual a cero. Existe la variante estocástica con el diferencial d W sub t. En F4, PhyDNet separa el latente en dos: z sub t es la componente física más la residual; la componente física evoluciona con el PhyCell y el decoder produce la predicción. Es la puerta 2 traducida a un espacio latente: encoder, física, decoder."
- **Puente:** "F5 y F6 son las dos familias más cercanas al forecasting operativo."

### Slide 9 — 4 · Matemática del Diagrama 2 · F5 — Forecasting restringido · F6 — TS con física embebida

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: el kernel ridge de F5 con su solución cerrada a = (K_GP + λ_rk I)⁻¹y; el predictor de F6 con el prior físico P_fis dentro de g_θ; y el mapeo RFF multibanda de la Ecuación 24 con softplus(ρ_k).
- **Guion:**
  "F5 es kernel ridge con restricciones de forma: la predicción es la suma de a i por kappa de x y x i, y los coeficientes salen del sistema cerrado: a igual a K GP más lambda rk por identidad, todo al inverso, por y. Las restricciones del diagrama —cotas, rampas, parabolicidad, estacionalidad— se imponen sobre esa función; en su variante GPR con prior físico es la línea de Doumèche 2025. F6 es la familia de la física embebida: el predictor es g theta de X con un prior físico P fis dentro de la arquitectura, sin EDP explícita. La instancia que nos interesa es el RFF multibanda de la Ecuación 24: phi k de x sub t igual a raíz de dos sobre N f, por el coseno de softplus de rho k, por W k transpuesta por x sub t, más b k. Cada banda k lleva su propio ancho de banda aprendible, softplus de rho k, siempre positivo; el prior aquí es espectral."
- **Puente:** "Con las familias PIML en la mesa, hace falta el contraste: qué se usa hoy en energía sin física."

### Slide 10 — 5a · Diagrama 3 · Familias data-driven en sistemas energéticos (SIN física)

- ⏱ ~2 min
- **Pantalla:** el mapa de las ocho familias E1–E8; la leyenda agrupa en cuatro bloques: clásicos y tradicionales (E1–E2), DL secuencial (E3–E4), LTSF moderno (E5–E7) y el patrón dominante en carga (E8, en naranja).
- **Guion:**
  "Este diagrama es el contraste necesario: la base contra la que se mide todo PIML energético. Son las ocho familias de la matriz SOTA 2022 a 2026: treinta y dos papers revisados, veinticinco de ellos en la hoja de energía. E1 son los estadísticos clásicos, E2 el ML clásico, E3 los recurrentes, E4 las TCN, E5 los Transformers para LTSF, E6 los SSM y Mamba, E7 los modelos fundacionales, y E8 la descomposición más híbridos. La leyenda los agrupa en cuatro bloques de tradición a frontera, y el naranja marca el patrón dominante en carga, que es E8. Esta base define el nivel de comparación: sin ella no se puede juzgar si la física agrega valor."
- **Puente:** "Veamos la matemática de la base, familia por familia."

### Slide 11 — 5a · Matemática del Diagrama 3 · E1 — Estadísticos clásicos · E2 — ML clásico

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la SARIMA de Box–Jenkins con el operador de rezago B y el ruido blanco gaussiano; y el SVR con pérdida épsilon-insensible, su minimización y la banda |y_i − f(x_i)| ≤ ε + ξ.
- **Guion:**
  "E1 es SARIMA en su forma Box-Jenkins: el polinomio autorregresivo phi p de B, el estacional Phi P de B elevado a s, las diferenciaciones uno menos B a la d y uno menos B a la s a la D, igualadas al polinomio de medias móviles theta q de B por el ruido blanco epsilon sub t. Aquí B es el operador de rezago y s es el período estacional, típicamente veinticuatro o ciento sesenta y ocho horas; s, d, D y c son símbolos locales de esta ecuación. E2 es ML clásico sobre features tabulares duras: rezagos, calendario, meteorología. El caso formal es la SVR: f de x igual al producto interno de w con fi de x más b, minimizando medio w al cuadrado más C svr por las holguras, sujeto a la banda épsilon-insensible. XGBoost, random forest y ANFIS entran en esta familia como ensambles aditivos."
- **Puente:** "El bloque E3 introduce las compuertas que dominan la práctica."

### Slide 12 — 5a · Matemática del Diagrama 3 · E3 — Recurrentes: compuertas de la LSTM y la GRU

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: compuertas de entrada y olvido de la LSTM; compuerta de salida o_t y candidato c̃_t; compuertas de actualización u_t y reinicio r_t de la GRU; y el candidato h̃_t con el estado h_t interpolado.
- **Guion:**
  "La LSTM gobierna su estado con tres compuertas sigmoideas: entrada i sub t, olvido f sub t y salida o sub t. El estado de celda se actualiza como c sub t igual a f sub t hadamard c anterior, más i sub t hadamard c tilde, y la salida es o sub t por la tangente hiperbólica de c sub t. La GRU compacta eso en dos compuertas: actualización u sub t y reinicio r sub t. El candidato es tanh de W h por x, más U h por r sub t hadamard h anterior, más b h; y el estado nuevo interpola: uno menos u sub t por el estado anterior, más u sub t por el candidato. Noten la decisión de notación de la sección 1: la compuerta de actualización es u sub t, no z sub t, para no colisionar con el embedding espectral. El backbone del artículo guía, h breve sub t igual a f RNN de z tilde y h breve anterior, es exactamente una de estas celdas."
- **Puente:** "E4 y E5 son las dos arquitecturas no recurrentes dominantes."

### Slide 13 — 5a · Matemática del Diagrama 3 · E4 — Convolucionales/TCN · E5 — Transformers LTSF

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la convolución causal dilatada (s *_{d̆} f)(t) y la atención escalada softmax(QKᵀ/√d_k)V junto a la multi-cabeza con concatenación de heads.
- **Guion:**
  "E4 es la convolución causal dilatada: la suma desde i cero hasta k breve menos uno de f i por la señal en t menos d breve por i. Es causal, solo mira el pasado, y el campo receptivo crece exponencialmente con la dilatación d breve. El TSB del artículo guía es un bloque TCN: convolución dilatada compuesta con residual, GELU y LayerNorm; los híbridos CNN-LSTM combinan esto con la recurrencia de E3. E5 es la atención escalada: softmax de Q por K transpuesta, sobre raíz de d k, por V; la versión multi-cabeza concatena las n cab cabezas y proyecta con W O. Las familias TFT, Informer, PatchTST, iTransformer y TimeXer son variantes de esta atención que cambian la tokenización; PatchTST trocea cada canal en parches, con independencia de canales."
- **Puente:** "Las tres últimas familias modernizan el bloque secuencial."

### Slide 14 — 5a · Matemática del Diagrama 3 · E6 — SSM/Mamba · E7 — Fundacionales · E8 — Descomposición

- ⏱ ~1.5 min
- **Pantalla:** cuatro ecuaciones: el espacio de estados continuo de E6; la distribución predictiva de E7 con theta congelado; la descomposición y(t) = Σ c_j + r de E8; y el problema variacional de la VMD.
- **Guion:**
  "E6 formula el sistema en espacio de estados continuo: h prima igual a A por h más B por x, con salida C por h. Al discretizar queda la recurrencia lineal: h sub t igual a A barra por h anterior más B barra por x sub t. Mamba, con selective scan, vuelve los parámetros dependientes de la entrada y baja el costo a orden de tau, frente al orden de tau al cuadrado de la atención. E7 son los modelos fundacionales: entregan la distribución predictiva p theta del horizonte completo condicionada a la ventana, con theta fijado en pre-entrenamiento masivo externo; eso es el zero y few-shot: Chronos tokeniza los valores, TimesFM usa parches y Moirai es any-variate. Y E8 descompone la serie: y de t igual a la suma de las J componentes c j más el residuo r; la VMD lo hace resolviendo el problema variacional de modos con frecuencias centrales omega j. El patrón dominante en carga es E8: descomponer, modelar cada componente con su propia red g theta j, y reconstruir sumando."
- **Puente:** "Con la base fijada, entra la física: el Diagrama 4, la intersección."

### Slide 15 — 5b · Diagrama 4 · La intersección: TS + física en sistemas energéticos

- ⏱ ~2 min
- **Pantalla:** el mapa de la intersección TS ∩ física ∩ energía con los cinco patrones A–E; el marcador rojo del cuadrante vacío. Señalar la frase clave del bullet: el cuadrante "dinámica de edificio + multi-horizonte + rigor + UQ conformal" está VACÍO.
- **Guion:**
  "El Diagrama 4 cruza las familias E1 a E8 con las puertas 1 a 4 y entrega cinco patrones. A es dinámica de potencia, con la ecuación de oscilación del generador; B es flujo de red, con las ecuaciones nodales; C es demanda, donde la física es de forma; D es edificios, física de sustancia con circuitos RC; y E es renovables, con rama física más residual. Los patrones A y B son los únicos con rigor matemático maduro; C es física de forma, D es física de sustancia y E es el híbrido moderno. Y está el hallazgo del mapa: el cuadrante dinámica de edificio, más multi-horizonte, más rigor, más UQ conformal, está vacío. Ese vacío es la decisión informativa que alimenta la tesis: nadie combina esas cuatro condiciones a la vez."
- **Puente:** "Veamos la matemática de cada patrón."

### Slide 16 — 5b · Matemática del Diagrama 4 · Patrón A — Dinámica de potencia · Patrón B — Flujo de red

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la ecuación de oscilación del generador síncrono (dos líneas, ángulo y velocidad); el residuo físico r_θ(t) sobre la trayectoria estimada; y las ecuaciones nodales de flujo de potencia P_i y Q_i.
- **Guion:**
  "El patrón A parte de la ecuación de oscilación del generador síncrono: delta punto es omega menos omega s, y M por omega punto es P m menos P e de delta, menos D por omega menos omega s. La PINN de Misyris 2020, puerta 1, penaliza el residuo sobre la trayectoria estimada: r theta de t igual a M por la derivada del omega estimado, menos el corchete físico con P m, P e de delta estimado y el amortiguamiento. En modo inverso, la misma red estima M y D; la variante DAE-PINN añade las restricciones algebraicas: cero igual a g de las variables diferenciales y algebraicas. El patrón B usa las ecuaciones nodales de flujo: P i y Q i suman sobre los N bus buses los productos de módulos de voltaje por las admitancias G y B, con cosenos y senos de theta i j. Las PINN-GNN imponen ese residuo sobre el grafo de admitancias —puertas 2 más 1— y los biases generalizan a redes no vistas."
- **Puente:** "El patrón C cambia el papel de la física: de ley dinámica a restricción de forma."

### Slide 17 — 5b · Matemática del Diagrama 4 · Patrón C — Demanda: física como restricción de forma

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: las penalizaciones de rampas L_rampa y parabolicidad L_par (ERCOT 2026); y la pérdida total del patrón C que las suma con λ_phys sobre L_MSE.
- **Guion:**
  "En demanda no hay EDO del activo: la física entra como regularizadores cualitativos sobre el vector de pronóstico ŷ en R h, por la puerta 1, o por la 2 si se cablea. Primero, rampas: L rampa suma el máximo entre cero y el exceso de la variación absoluta del pronóstico sobre r max. Segundo, parabolicidad: L par suma el cuadrado de la segunda diferencia discreta, y j menos uno menos dos y j más y j más uno. Tercero, monotonía para chillers: la derivada parcial del pronóstico respecto de la variable meteorológica no puede ser negativa, penalizada con L mono, en la línea de Tang 2026. La pérdida total del patrón C es L MSE más lambda físico por la suma de rampa, parabolicidad y monotonía. Ninguna de las tres contiene una EDO del activo: es el regularizador de forma del diagrama, aplicado al forecast de demanda."
- **Puente:** "El patrón D sí vuelve a la física de sustancia: un circuito térmico."

### Slide 18 — 5b · Matemática del Diagrama 4 · Patrón D — Física de sustancia (circuito RC) · Patrón E — rama física + residual

- ⏱ ~1.5 min
- **Pantalla:** tres ecuaciones: la ecuación del nodo interior del circuito 2R2C; el residuo físico R_phys(t) y su pérdida L_physics promediada sobre Ñ muestras y h pasos; y la suma de ramas del PhysEmbedFormer.
- **Guion:**
  "El patrón D es la formulación PINN-RC del proyecto: un circuito térmico equivalente dos R dos C. La ecuación del nodo interior dice: C in por la derivada de T in, igual a la diferencia T out menos T in sobre R ea, más la diferencia con la masa T m sobre R in, más A w por I sol, más Q punto int, más P HVAC. El segundo nodo es la masa de la envolvente, con C m, R in y R out. El residuo físico R phys de t reescribe esa ecuación con la temperatura estimada, y la pérdida física es la norma del residuo promediada sobre los Ñ escenarios y los j pasos del horizonte; la conexión con el Diagrama 1 es directa: puerta 1, pérdida compuesta estándar. El dato crítico del documento: en la literatura no hay evaluación multi-horizonte de este residuo; los horizontes son cortos. El patrón E, en renovables, es la puerta 4 con sabor de la 2: ŷ igual a la rama física f fis de las variables meteorológicas, más la rama residual g theta con contexto; es PhysEmbedFormer, con variante fotovoltaica que penaliza el residuo de P pv por la puerta 1."
- **Puente:** "Con familias y patrones sobre la mesa, la pregunta cambia: ¿qué problema resuelve cada enfoque?"

### Slide 19 — 6 · Diagrama 5 · ¿Qué problema resuelve cada enfoque PIML en energía?

- ⏱ ~2 min
- **Pantalla:** la matriz del Diagrama 5: filas con las cuatro puertas ①–④, columnas con los problemas (escasez, interpretabilidad, OOD, plausibilidad) y estrellas marcando fortalezas; fila inferior con los problemas laterales sin dueño.
- **Guion:**
  "El Diagrama 5 es la lectura informática del documento: cada puerta ataca preferentemente un problema distinto. Los problemas del eje son escasez de datos, interpretabilidad, extrapolación fuera de dominio y plausibilidad física; las fortalezas están marcadas con estrella en la matriz. El documento ancla la evidencia: escasez con Loffa 2025 y Misyris 2020, extrapolación con Tang 2026, transferencia con el arXiv dos cinco cero nueve punto dos cinco uno cinco ocho, y UQ con la posterior B-PINN de Yang, Meng y Karniadakis, dos mil veintiuno. Y subrayo el mensaje del diagrama: hay problemas laterales que ninguna puerta resuelve —incertidumbre, eventos extremos, cómputo y escalabilidad—. Esa fila abierta es la que abre el Diagrama 6."
- **Puente:** "Veamos esa lectura en lenguaje matemático."

### Slide 20 — 6 · Matemática del Diagrama 5 · Lectura matemática de las filas ①–④

- ⏱ ~1.5 min
- **Pantalla:** la posterior del GP con prior físico f̄(x) = k(x)ᵀ(K_GP + σ_n²I)⁻¹y como ecuación central; los bullets con la lectura de ① frente a la escasez y de ②④ en el híbrido.
- **Guion:**
  "Primero, la puerta 1 contra la escasez: el término lambda físico por L física restringe las funciones admisibles a las que casi satisfacen la ley N de u igual a cero; en la práctica aumenta la muestra efectiva, y la ganancia aparece exactamente con pocos datos, según Loffa 2025. Segundo, las puertas 2 y 4: en el híbrido ŷ igual a f fis de las variables meteorológicas más g theta de x y contexto, cada término es inspeccionable; y fuera del dominio, g theta puede fallar pero f fis sigue correcta: el error queda acotado por el componente físico. Tercero, la puerta 3 contra estados no observables: el posterior del GP es f barra de x igual a k de x transpuesta, por K GP más sigma n al cuadrado por identidad, todo al inverso, por y. Con el prior físico f GP de m fis y kappa fis —el PhI-GPR—, la posterior reconstruye estados no medidos, siempre que el modelo dinámico esté bien especificado."
- **Puente:** "Quedan los problemas laterales: incertidumbre, eventos extremos y escala."

### Slide 21 — 6 · Matemática del Diagrama 5 · Problemas laterales: UQ, eventos extremos y escalabilidad

- ⏱ ~1.5 min
- **Pantalla:** dos ecuaciones: la posterior bayesiana de B-PINN con su predictiva marginal integrada sobre Θ; y el cuantil conformal q̂ con el intervalo C(ŷ) = [ŷ − q̂, ŷ + q̂]. Bullets de eventos extremos (partición del test en E) y de cómputo (crecimiento con N_c).
- **Guion:**
  "Para UQ bayesiana, B-PINN computa el posterior de theta por Bayes y la predictiva marginal integrando sobre theta; se muestrea con HMC o métodos variacionales, y ese costo es prohibitivo para forecasting operativo. La alternativa barata son los cuantiles conformales: con puntajes s i igual al valor absoluto del error en una muestra de calibración de tamaño n, el cuantil q hat se toma en el orden n más uno por uno menos alfa, y el intervalo es ŷ más menos q hat. La cobertura es al menos uno menos alfa, sin supuestos distribucionales y sobre cualquier predictor: ese es, de hecho, el hueco más claro del mapa energético. Para eventos extremos, el protocolo es particionar el test en el conjunto E y su complemento, y reportar el MSE sobre E por separado; el caso ERCOT 2026 muestra que las pérdidas de forma mejoran la forma durante el evento, no la magnitud del pico. Y en cómputo: evaluar la pérdida física crece con N c y con el orden de N, y no hay PINNs energéticas sobre datasets de diez a la seis o diez a la siete muestras."
- **Puente:** "Último diagrama: ¿a qué problema apuntar?"

### Slide 22 — 7 · Diagrama 6 · Árbol de opciones de problema (NO vinculado a ningún modelo)

- ⏱ ~2 min
- **Pantalla:** el árbol con la pregunta cabeza y cuatro opciones: A escasez de datos (estándar), B interpretabilidad etiquetada y C UQ conformal (huecos claros), D extremos/OOD (más reciente); nota de combinación al pie.
- **Guion:**
  "El Diagrama 6 es un árbol de opciones de problema, y subrayo el rótulo del título: no está vinculado a ningún modelo. Las opciones son cuatro: A, escasez de datos, la opción estándar; B, interpretabilidad etiquetada, un hueco claro; C, UQ por conformal, el otro hueco claro; y D, extremos y fuera de distribución, la más reciente y abierta. La nota al pie dice algo importante: las opciones no son excluyentes; las combinaciones se refuerzan. Este diagrama no vota: la decisión es posterior a este documento, y esa es precisamente la etapa que sigue en la tesis."
- **Puente:** "Cada opción tiene un anclaje matemático; los de A y B son esta slide."

### Slide 23 — 7 · Matemática del Diagrama 6 · Anclajes A y B — régimen de escasez y bandas etiquetadas

- ⏱ ~1 min
- **Pantalla:** el bullet del anclaje A (dominio de λ_phys·L_physics con Ñ pequeño, umbral del residuo RC) y la ecuación de B: el embedding z_t como concatenación de bandas φ_1…φ_K con F = K·N_f.
- **Guion:**
  "Anclaje A, el régimen de escasez: cuando el número de muestras Ñ es pequeño, domina el término lambda físico por L física, y existe un umbral donde el residuo del circuito RC de la sección cinco b supera al MSE solo; ese es el régimen documentado por Loffa 2025. Anclaje B, interpretabilidad etiquetada: el embedding es z sub t igual a la concatenación de phi uno hasta phi K, con dimensión F igual a K por N f. Cada banda phi k queda etiquetada con su escala temporal: el pre-set de seis, veinticuatro y setenta y dos horas, o el alternativo de cuatro, veinticuatro y ciento sesenta y ocho. Es el análogo aprendible de la descomposición de E8, pero dentro del modelo, no como preprocesamiento externo."
- **Puente:** "Los anclajes C y D cierran el árbol."

### Slide 24 — 7 · Matemática del Diagrama 6 · Anclajes C y D — conformal y evaluación por régimen

- ⏱ ~1 min
- **Pantalla:** dos bullets con las expresiones de los anclajes: el intervalo conformal C(ŷ) = [ŷ − q̂, ŷ + q̂] con cobertura ≥ 1 − α; y la evaluación por régimen con L_MSE|_E más las pérdidas de forma de §5b-C.
- **Guion:**
  "Anclaje C, UQ: la opción conformal da el intervalo ŷ más menos q hat, con cobertura al menos uno menos alfa, sobre cualquier predictor y sin supuestos distribucionales; B-PINN queda descartado por costo en forecasting operativo. Anclaje D, robustez y extremos: la evaluación por régimen reporta el MSE restringido al conjunto de eventos E por separado, y durante el evento añade las pérdidas de rampa y parabolicidad del patrón C. Con esto, cada opción del árbol tiene un anclaje matemático concreto. Y la decisión de cuál tomar no está en este documento."
- **Puente:** "Antes de cerrar, la lectura conjunta de los seis diagramas."

### Slide 25 — 8 · Lectura conjunta · Los seis diagramas en una tabla

- ⏱ ~1.5 min
- **Pantalla:** la tabla de seis filas: número de diagrama, pregunta que responde y matemática asociada, con las referencias de sección (§3 a §7) en la tercera columna.
- **Guion:**
  "Esta tabla compacta los seis diagramas en pregunta y matemática. El Diagrama 1 responde cómo entra la física: L total, la forma hamiltoniana, psi física y el híbrido f física más g theta. El 2, qué familias PIML existen para series de tiempo: de F1, la PINN, a F6, la física embebida con RFF. El 3, cuál es la base data-driven en energía: E1 a E8, de SARIMA a la VMD. El 4, dónde se cruzan las tres cosas: los patrones A a E, del swing al circuito RC con su residuo físico. El 5, qué problema resuelve cada enfoque: regularizador físico, posterior B-PINN y cuantiles conformales. Y el 6, qué opciones de problema quedan abiertas, sin conectar todavía a un modelo. Si deben llevarse una sola imagen de esta charla, que sea esta tabla."
- **Puente:** "Cierro con la recapitulación y abro las preguntas."

---

## Cierre (slide 26)

**Pantalla:** slide de cierre "Gracias", con el subtítulo "Preguntas y discusión — el siguiente paso del documento es la formulación del modelo".

**Guion:**

"Recapitulo en una línea por diagrama. La física entra por cuatro puertas: pérdida, arquitectura, datos e híbrido. Esas puertas organizan seis familias PIML para series de tiempo, de la PINN al RFF multibanda. La base energética sin física son las ocho familias E1 a E8. La intersección muestra cinco patrones y un cuadrante vacío: edificio, multi-horizonte, rigor y UQ conformal. Cada puerta resuelve un problema preferente, y tres problemas quedan abiertos para cualquier puerta. Y las opciones de problema están planteadas, con anclajes matemáticos, pero sin votar. El siguiente paso del documento es la formulación del modelo, con esta notación y este mapa como lenguaje común. Muchas gracias; quedo atento a sus preguntas y a la discusión."

---

## Q&A anticipado

**1. ¿Cuál es la diferencia exacta entre una PINN (F1) y una physics-guided RNN (F2)?**
La F1 aproxima la solución del sistema dinámico: la red es u_θ y el residuo r_θ = ∂_t u_θ + N[u_θ] se penaliza en los N_c puntos de colocación. La F2 mantiene la recurrencia estándar h_t = f_RNN(x_t, h_{t-1}; Θ_r) y solo añade la consistencia temporal: L = L_MSE + λ_phys·L_EC, con L_EC = Σ_t ‖r_EC(ŷ_t, ŷ_{t-1}, x_t)‖². En F1 la red es la solución de la ley; en F2 la ley solo penaliza las predicciones.

**2. ¿Por qué el ancho de banda del RFF multibanda es softplus(ρ_k) y no ρ_k directamente?**
Porque el ancho de una banda espectral debe ser positivo y aprendible. softplus garantiza positividad para cualquier ρ_k real y es diferenciable, de modo que ρ_k se entrena por retropropagación. Cada banda k del mapeo φ_k (Ecuación 24) lleva su propio ancho, y el embedding final es z_t ∈ R^F con F = K·N_f.

**3. ¿Qué es exactamente el cuadrante vacío del Diagrama 4?**
La combinación de las cuatro condiciones: dinámica de edificio (física de sustancia, circuito RC), evaluación multi-horizonte, rigor matemático y UQ por conformal. En la intersección revisada, los patrones maduros (A, B) no son edificios ni multi-horizonte, y el patrón D —el más cercano— no reporta evaluación multi-horizonte del residuo R_phys ("horizontes cortos").

**4. ¿Por qué conformal y no B-PINN para la UQ?**
B-PINN computa el posterior p(Θ | D) y la predictiva marginal integrando sobre Θ, con HMC o métodos variacionales; el costo es prohibitivo para forecasting operativo. Los cuantiles conformales dan C(ŷ) = [ŷ − q̂, ŷ + q̂] con cobertura P{y ∈ C(ŷ)} ≥ 1 − α, sin supuestos distribucionales y sobre cualquier predictor: por eso el documento lo marca como "el hueco más claro del mapa energético".

**5. ¿Cuál de las seis familias F1–F6 está más madura y por qué importa?**
F1 (PINN) es la familia madura (Raissi 2019); F3 (Neural ODE/SDE) y F4 (PhyDNet) son de madurez media; F2 (PG-RNN) y F5 (kernel/GPR) son de nicho; F6 (física embebida, PINT/RFF) es emergente. La madurez importa porque define el riesgo de adoptar cada familia y con quién hay que comparar: la frontera del nicho energético está en F1 y en los patrones A–B del Diagrama 4.

**6. ¿Las puertas ① y ② son intercambiables? ¿Cuándo elegir cada una?**
No. La puerta ① penaliza: la física se satisface solo aproximadamente y la garantía depende de λ_phys. La puerta ② garantiza: la ley vive en la estructura de f_θ (por ejemplo la forma hamiltoniana d/dt[q; p] = J∇H_θ) y se cumple para todo θ, sin λ_phys. La elección depende de qué tan confiable es la ley y de cuánta garantía estructural se exige.

**7. ¿Qué decisión queda pendiente después de esta revisión?**
Elegir el problema objetivo entre las opciones A–D del Diagrama 6 —escasez, interpretabilidad etiquetada, UQ conformal, extremos/OOD—, que no son excluyentes, y recién entonces formular el modelo. El Diagrama 6 no está vinculado a ningún modelo y el documento no vota: la resolución es posterior a la revisión.

**8. ¿Por qué el patrón E8 (descomposición) es el dominante en carga y qué relación tiene con las bandas etiquetadas?**
Porque descomponer la serie (EMD/VMD: y(t) = Σ c_j + r), modelar cada componente con su propia red (ĉ_j = g_{θ_j}) y reconstruir sumando es el patrón predominante en la literatura de carga. Las bandas etiquetadas del anclaje B (z_t = [φ_1, …, φ_K], F = K·N_f, con escalas de 6/24/72 h o 4/24/168 h) son el análogo aprendible de esa descomposición, pero integrado dentro del modelo en lugar de ejecutarse como preprocesamiento externo.
