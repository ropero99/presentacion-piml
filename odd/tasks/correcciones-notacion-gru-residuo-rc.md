# Feature: Correcciones notacionales en GRU y residuo RC

**Estado:** cerrado y verificado  
**Rama:** `feat/presentacion-notacion-regresores`  
**Solicitud:** corregir los dos problemas detectados en la revisión de notación de la presentación, sin alterar la notación de ridge ni otros símbolos.

## Alcance

1. En `src/data/deckContent.js`, slide `d3-mat-2` (E3 — recurrentes), cambiar el factor recurrente de la compuerta GRU de reinicio de `\\mathbf{U}_u` a `\\mathbf{U}_r`, consistente con `\\mathbf{W}_r`, `\\mathbf{b}_r` y el término de candidato.
2. En el mismo archivo, slide `d4-mat-3` (Patrón D — física RC), añadir al residuo de temperatura interior el acoplamiento `\\frac{T_m(t)-\\hat{T}_{in}(t)}{R_{in}}`, conservando el orden y signo de los términos de la ecuación diferencial declarada arriba.

## Criterios de aceptación

- La GRU usa `U_r` en la ecuación de `r[t]`, mientras que `u[t]` conserva `U_u`.
- El residuo RC incluye todos los términos del balance interior: intercambio con exterior, acoplamiento de masa por `R_in`, radiación solar, cargas internas y HVAC; el estado estimado interior se usa en ambos términos de conducción.
- No se modifica la notación `D`/`X` del bloque ridge.
- Ejecutar verificaciones aplicables y registrar resultados; no crear commit sin petición expresa del usuario.

## Resultado y verificación

- `src/data/deckContent.js`: la compuerta reset de GRU usa `\\mathbf{U}_r`; la de actualización conserva `\\mathbf{U}_u`.
- El residuo RC ahora incluye `(T_m(t)-\\hat{T}_{in}(t))/R_{in}`, igualando los términos de acoplamiento del balance interior mostrado.
- `npm run build`: correcto (Vite transformó 198 módulos). Vite informó únicamente una advertencia no bloqueante de chunk minificado mayor a 500 kB.
- No se creó commit; no se solicitó.
