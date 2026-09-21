import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Núcleo de captura/export del deck PIML.
 *
 * Recorre cada diapositiva en una página limpia (localStorage + reload ⇒ sin
 * transición de 440 ms), espera el render matemático (MathJax → mjx-container),
 * fuentes y estado de ReactFlow, y guarda un PNG 1920x1080 @2x por slide.
 * Si `pdfPath` se proporciona, ensambla un PDF 16:9 (una página por PNG).
 */

const DECK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number(process.env.CAPTURE_PORT || 4179);
const BASE = '/presentacion-piml/';
const URL_ = `http://localhost:${PORT}${BASE}`;
const VIEWPORT = { width: 1920, height: 1080 };

async function startPreviewServer() {
  if (!existsSync(path.join(DECK_ROOT, 'dist', 'index.html'))) {
    throw new Error('Falta dist/ — ejecuta "npm run build" antes de capturar.');
  }
  const proc = spawn(
    process.execPath,
    [
      path.join(DECK_ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
      'preview',
      '--port',
      String(PORT),
      '--strictPort',
    ],
    { cwd: DECK_ROOT, stdio: 'ignore' },
  );
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(URL_);
      if (res.ok) return proc;
    } catch {
      /* servidor aún no listo */
    }
    await sleep(400);
  }
  proc.kill();
  throw new Error('vite preview no respondió a tiempo.');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForMathSettled(page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(
      () => document.querySelectorAll('#viewport .is-active mjx-container').length > 0,
      { timeout: 7000 },
    )
    .catch(() => {
      /* slide sin matemática — aceptable */
    });
}

async function captureDeck(page, capturesDir) {
  await mkdir(capturesDir, { recursive: true });
  const files = [];

  await page.goto(URL_, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.body.classList.add('focus-mode'));
  const counter = await page.textContent('#counter');
  const total = Number(counter.trim().split('/')[1].trim());
  if (!Number.isFinite(total) || total < 1) throw new Error(`Contador inválido: "${counter}"`);

  for (let i = 0; i < total; i += 1) {
    await page.evaluate((idx) => localStorage.setItem('deck-slide-piml', String(idx)), i);
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.body.classList.add('focus-mode'));
    await page.waitForSelector('#viewport .is-active', { timeout: 10000 });
    await waitForMathSettled(page);
    // settle: transiciones de layout/fitView de ReactFlow y tipografía final
    await page.waitForTimeout(700);
    const file = path.join(capturesDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    files.push(file);
    process.stdout.write(`  captura ${i + 1}/${total}\r`);
  }
  process.stdout.write('\n');
  return { files, total };
}

async function assemblePdf(files, pdfPath) {
  const pdf = await PDFDocument.create();
  pdf.setProducer('presentacion-piml export');
  pdf.setCreator('presentacion-piml export script');
  for (const file of files) {
    const img = await pdf.embedPng(await readFile(file));
    const page = pdf.addPage([1280, 720]);
    page.drawImage(img, { x: 0, y: 0, width: 1280, height: 720 });
  }
  await writeFile(pdfPath, Buffer.from(await pdf.save()));
}

export async function runCapture({ capturesDir, pdfPath } = {}) {
  const outCaptures = path.resolve(
    capturesDir || path.join(DECK_ROOT, 'src', 'scripts', 'captures'),
  );
  const server = await startPreviewServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 2 });
    const { files, total } = await captureDeck(page, outCaptures);
    if (pdfPath) {
      await assemblePdf(files, path.resolve(pdfPath));
      console.log(`PDF generado: ${path.resolve(pdfPath)} (${total} páginas)`);
    }
    console.log(`PNGs en: ${outCaptures} (${total} diapositivas)`);
    return { files, total };
  } finally {
    await browser.close();
    server.kill();
  }
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const pdfIdx = args.indexOf('--pdf');
  const pdfPath = pdfIdx >= 0 ? args[pdfIdx + 1] : null;
  const capIdx = args.indexOf('--captures');
  const capturesDir = capIdx >= 0 ? args[capIdx + 1] : null;
  const clean = args.includes('--clean');
  if (clean) {
    await rm(path.resolve(capturesDir || path.join(DECK_ROOT, 'src', 'scripts', 'captures')), {
      recursive: true,
      force: true,
    });
  }
  runCapture({ capturesDir, pdfPath }).catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
