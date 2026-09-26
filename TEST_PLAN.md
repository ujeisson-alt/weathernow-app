# Plan de Pruebas — WeatherNow App

**Proyecto:** WeatherNow App (SkyPulse Inc.) · **Versión:** 1.0.0 · **Tester:** Jeisson Uribe
**Tipo:** pruebas funcionales manuales (caja negra), responsive, accesibilidad y no funcionales
**Navegadores:** Chrome (último), Firefox (último), Safari iOS / Chrome Android

## 1. Alcance

| Incluido | Excluido (fuera del MVP) |
|---|---|
| Búsqueda, clima actual, pronóstico 5 días, favoritos, estados de error/carga, responsive, accesibilidad básica | Geolocalización, notificaciones, backend, i18n, tests automatizados |

## 2. Criterios de aceptación globales

- 0 errores en la consola del navegador (excepto el 404 esperado de CP-08).
- Lighthouse ≥ 80 en Performance y Accessibility.
- Sin overflow horizontal en 375 px, 768 px y 1280 px.

## 3. Casos de prueba funcionales

Resultado: ✅ Pasa · ❌ Falla · ⏳ Pendiente

| ID | Módulo | Caso | Pasos | Resultado esperado | Resultado |
|---|---|---|---|---|---|
| CP-01 | Inicio | Empty state | Abrir la app sin búsquedas | Mensaje "Buscá una ciudad para ver el clima" | ✅ |
| CP-02 | Búsqueda | Ciudad válida con Enter | Escribir "Bogotá" → Enter | Tarjeta con ciudad, país, temp, humedad, viento e ícono | ✅ |
| CP-03 | Búsqueda | Ciudad válida con botón | Escribir "Lima" → clic en Buscar | Igual a CP-02 | ✅ |
| CP-04 | Búsqueda | Ciudad sin tilde | Buscar "Bogota" | Devuelve "Bogotá, CO" | ✅ |
| CP-05 | Búsqueda | Entrada vacía | Enter con input vacío | Aviso "Escribí al menos 2 letras", sin llamada a la API | ✅ |
| CP-06 | Búsqueda | Entrada de 1 letra | Escribir "a" → Enter | Aviso de validación | ✅ |
| CP-07 | Búsqueda | Espacios extra | Buscar "  Madrid  " | Busca "Madrid" correctamente | ✅ |
| CP-08 | Errores | Ciudad inexistente | Buscar "xyzxyz" | Alerta roja "Ciudad no encontrada…" + botón Reintentar | ✅ |
| CP-08b | Errores | Límite de la API (429) | Muchas búsquedas seguidas | "Demasiadas búsquedas seguidas…" | ✅ |
| CP-09 | Errores | Recuperación tras error | Tras CP-08, buscar "Lima" | Desaparece el error y se muestra el clima | ✅ |
| CP-10 | Errores | Sin conexión | DevTools → Network → Offline → buscar | "Sin conexión. Revisá tu internet…"; Reintentar funciona al volver la red | ✅ |
| CP-11 | Carga | Estado loading | Network → Slow 3G → buscar | Spinner + "Buscando el clima…" y botón con texto "Buscando…" | ✅ |
| CP-12 | Pronóstico | 5 días distintos | Buscar cualquier ciudad | 5 tarjetas con fechas diferentes y máx ≥ mín | ✅ |
| CP-13 | Favoritos | Agregar | Buscar ciudad → clic ☆ Favorito | Aparece el chip y el botón cambia a ★ Guardada | ✅ |
| CP-14 | Favoritos | Sin duplicados | Clic en favorito 3 veces / buscar "bogotá" y agregar | Solo 1 chip por ciudad | ✅ |
| CP-15 | Favoritos | Persistencia | Agregar favorito → F5 | El chip sigue visible | ✅ |
| CP-16 | Favoritos | Consultar desde chip | Clic en el nombre del chip | Se busca y muestra esa ciudad | ✅ |
| CP-17 | Favoritos | Quitar | Clic en × del chip | El chip desaparece y no vuelve tras F5 | ✅ |
| CP-18 | Concurrencia | Búsquedas rápidas | Buscar "Lima" y enseguida "Quito" | Se muestra Quito (la búsqueda vieja se cancela) | ✅ (tras corregir BUG-06) |

## 4. Responsive y accesibilidad

| ID | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| CP-19 | 375 / 768 / 1280 px (Ctrl+Shift+M) | Pronóstico en 1 / 3 / 5 columnas, sin scroll horizontal | ✅ |
| CP-20 | Solo teclado (Tab, Enter) | Se puede buscar, agregar, abrir y quitar favoritos sin mouse; foco visible | ✅ |
| CP-21 | Imágenes y botones | Todos los `img` tienen `alt`; botones de ícono tienen `aria-label` | ✅ |
| CP-22 | Dark mode del sistema | Colores legibles, contraste AA | ✅ |
| CP-23 | Lighthouse (DevTools) | Performance ≥ 80, Accessibility ≥ 80 | ✅ 100 / 100 / 100 / 100 (Perf, A11y, Best Practices, SEO) tras BUG-07 |
| CP-24 | Validador W3C | `index.html` sin errores de conformidad | ✅ (html-validate; confirmar en validator.w3.org tras el deploy) |

## 5. Registro de bugs

| ID | Descripción | Severidad | Causa | Corrección | Estado |
|---|---|---|---|---|---|
| BUG-01 | Mín/Máx del pronóstico casi iguales | Media | Se tomaba solo 1 entrada de 3 h por día | Agrupar las 8 entradas del día y calcular mín/máx reales | Cerrado |
| BUG-02 | Fechas del pronóstico corridas un día en ciudades lejanas | Media | Se usaba la zona horaria del navegador | Usar `city.timezone` de la API | Cerrado |
| BUG-03 | Enter disparaba la búsqueda 2 veces | Baja | `onKeyDown` + `onClick` llamaban a `onSearch` | Un solo `<form onSubmit>` | Cerrado |
| BUG-04 | "Bogotá" y "bogotá" se guardaban duplicadas | Baja | Comparación sensible a mayúsculas | Normalizar con `toLowerCase()` | Cerrado |
| BUG-05 | Ciudades con "&" o "#" rompían la URL | Baja | Query armada con template string | `URLSearchParams` | Cerrado |
| BUG-06 | Durante la carga no se podía buscar otra ciudad (Enter y botón bloqueados) | Media | El botón `submit` deshabilitado bloquea también el envío con Enter | Quitar `disabled`, usar `aria-busy`; `AbortController` cancela la búsqueda vieja | Cerrado |
| BUG-07 | Links del footer con contraste 4.09:1 (WCAG AA pide 4.5:1) | Baja | Azul primario sobre fondo celeste | Usar `--color-secondary` en los links | Cerrado |

## 6. Resumen de ejecución

- **Casos ejecutados:** 25 · **Pasan:** 25 · **Bugs encontrados y cerrados:** 7
- Ejecución con Playwright (Chromium) y respuestas de la API simuladas; repetir CP-02, CP-08 y CP-12 contra la API real tras el deploy.

## 7. Evidencias

Guardar capturas en `docs/evidencias/` con el nombre del caso (ej: `CP-08-error-404.png`).
