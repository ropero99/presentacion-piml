import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCapture } from './capture-slides.mjs';

/**
 * Exporta el deck actual a PDF (una página por diapositiva, 16:9).
 * Uso: node src/scripts/export-pdf.mjs [ruta-del-pdf]
 * Por defecto: presentacion_piml_v2_2026-09.pdf en la raíz del deck.
 */
const DECK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const pdfPath = process.argv[2] || path.join(DECK_ROOT, 'presentacion_piml_v2_2026-09.pdf');

runCapture({ pdfPath }).catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
