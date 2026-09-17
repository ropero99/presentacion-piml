# Presentación PIML — Series de Tiempo y Sistemas Energéticos

Deck de diapositivas a pantalla completa con la revisión de **Modelos Informados por Física (PIML)** para series de tiempo y sistemas energéticos (versión matemática).

## 🌐 Ver en línea

**<https://ropero99.github.io/presentacion-piml/>**

## Contenido

- 29 diapositivas en español que cubren el documento `revision_piml_series_tiempo_energia_matematica.md` (§1–§9)
- 6 diagramas de decisión interactivos construidos con [ReactFlow](https://reactflow.dev) desde los bloques Mermaid del documento
- Ecuaciones renderizadas con [MathJax](https://www.mathjax.org) (LaTeX literal del documento)
- Navegación: teclado (flechas / Home / End), clic en el rail de módulos, botones, swipe táctil y modo enfoque (`f`)
- Reanudación automática de la última diapositiva (localStorage)

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · ReactFlow 12 · better-react-mathjax · Oxlint

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173/presentacion-piml/
npm run build      # genera dist/
npm run lint       # oxlint
```

## Despliegue

Automático vía GitHub Actions: cada push a `main` compila y publica en GitHub Pages (`.github/workflows/deploy.yml`).

Basado en: `revision_piml_series_tiempo_energia_matematica.md` — Maestría en Ingeniería, Universidad Nacional de Colombia.
