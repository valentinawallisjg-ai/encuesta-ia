# Encuesta web: IA en empresas de servicios

Formulario de una sola página (`index.html`, sin dependencias) que guarda las respuestas en una planilla de Google Sheets mediante un script de Google (`Code.gs`). Se publica gratis con GitHub Pages.

## Cómo funciona
- Pantalla de consentimiento, bloque A (filtro y tamaño), B (ritmo de adopción), C (14 prácticas con 5 niveles) y D (cierre).
- Incluye a todas las empresas, también microempresas (1 persona o ventas hasta 2.500 UF). El tamaño queda registrado en A2 y A3 para segmentar en el análisis.
- Si responde que no usa IA ni la evalúa, se omiten B2 a B5 y el bloque C.
- La invitación a entrevista es una pantalla aparte, con su propio consentimiento. Los datos de contacto van a otra hoja (o a otra planilla) y no se mezclan con las respuestas.
- Sin `ENDPOINT` configurado, funciona en modo de prueba y no envía nada.

## Puesta en marcha (unos 15 minutos)
1. **Planilla.** En Google Drive crea una planilla nueva (por ejemplo "Respuestas encuesta IA").
2. **Script.** En la planilla: Extensiones > Apps Script. Borra el contenido, pega `Code.gs` y guarda. Si quieres los contactos en otra planilla, crea una segunda y pega su ID en `CONTACT_SHEET_ID`.
3. **Publicar el script.** Implementar > Nueva implementación > Tipo: Aplicación web. Ejecutar como: yo. Quién tiene acceso: cualquier persona. Autoriza los permisos y copia la URL que termina en `/exec`.
4. **Conectar el formulario.** Abre `index.html`, pega esa URL en `CONFIG.ENDPOINT` y, si quieres, tu correo en `CONFIG.CONTACT_EMAIL`.
5. **GitHub.** Crea un repositorio público (por ejemplo `encuesta-ia`), sube `index.html` (no hace falta subir `Code.gs`). En Settings > Pages elige la rama `main` y la carpeta `/ (root)`. Tu encuesta quedará en `https://TU-USUARIO.github.io/encuesta-ia/`.
6. **Prueba.** Responde la encuesta completa con datos falsos, revisa que lleguen filas a las hojas `Encuesta` y `Entrevista`, y borra esas filas antes de empezar.

## Antes de enviarla
- El repositorio es público: la URL de Apps Script quedará visible en el código. No guarda datos por sí solo, pero cualquiera podría enviarle respuestas falsas. Para reducir ese riesgo, revisa las respuestas con duración muy baja (`duracion_seg`) y repetidas.
- Confirma con el profesor guía los textos de consentimiento y si la USM exige aprobación de ética.
- Los datos de contacto deben eliminarse al terminar el estudio, como dice el consentimiento.
