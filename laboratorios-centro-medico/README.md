# Laboratorios Centro Médico — Angular 22

Migración local del portal Cliente Consentido a Angular **22.2.3**, TypeScript **6.0.3** y Node **24.x** (mínimo **24.15.0**). Verificada con Node **24.22.1**. La aplicación nueva no ejecuta PHP, jQuery ni Bootstrap JavaScript.

## Ejecutar

Ejecutar estos comandos desde `laboratorios-centro-medico/`, que es la raíz preparada para el repositorio GitHub.

```powershell
npm ci
npm run build
npm run serve
```

Abrir **http://127.0.0.1:3000**. El servidor Node sirve exclusivamente `dist/lcm/browser` y la API; no expone la copia histórica, sus cookies ni los registros de HTTrack.

Para desarrollar, iniciar `npm run serve` en una terminal y `npm start` en otra. Angular estará en **http://127.0.0.1:4200** y enviará `/api` al servidor Node de puerto 3000. Reiniciar Node si se modifica su código. `PORT` y `HOST` permiten configurar el servidor de producción.

```powershell
npm test
npm run test:e2e
npm run build -- --base-href /DEBITO/LEALTAD/HN_LCM/
```

El último comando compila para una subcarpeta. En ese caso configurar el servidor web o proxy para retirar `/DEBITO/LEALTAD/HN_LCM` antes de reenviar solicitudes a Node (incluyendo assets y API), y devolver la aplicación para rutas Angular. Para servir en la raíz basta `npm run build`.

Las pruebas de navegador usan Microsoft Edge instalado y requieren una compilación previa. Playwright inicia el servidor si no está activo. Se validaron dos pruebas de API y dos recorridos de navegador en escritorio y móvil. Las capturas están en `test-results/preview-desktop.png` y `test-results/preview-mobile.png`.

## Alcance

- Diseño, logotipos, fondos, tipografías, promociones y pie originales.
- Siete rutas Angular, menú adaptable, estado activo y navegación sin recargas.
- Carrusel con las once posiciones originales (incluida la repetición de Fondo_8), indicadores, avance automático, controles y pausa.
- Acerca de y Reglamento con las imágenes recuperadas del servidor; PDF local del reglamento.
- Formularios de cuenta, catálogo y contacto con validación y estados de carga/error.
- API Node con validación y respuestas explícitas; sin almacenamiento de contraseñas.

**No hay código fuente PHP ni base de datos en la entrega original:** es una copia HTTrack de las respuestas HTML. Por eso autenticación, perfiles, puntos, movimientos, canjes, catálogos privados y envío real de correo requieren implementar o conectar servicios de negocio. `POST /api/session` y `POST /api/contact` devuelven **503** después de validar, sin simular sesiones ni mensajes enviados. Los puntos de integración están en `server/index.mjs`; reemplazarlos por servicios reales antes de producción. No se realizan peticiones a PHP desde la aplicación nueva.

La sección Aliados devuelve **HTTP 500** en el sitio de origen. Se conserva su ruta con una explicación y un enlace de consulta; no se inventó un listado.

La casilla antigua «Recordar contraseña» se omitió porque no existe servicio de sesiones persistentes. Los campos usan el autocompletado del navegador. El texto «Por favor Regístrate» se conserva por fidelidad, aunque el formulario del original realmente inicia sesión.

## Diseño

El portal utiliza un diseño de ancho completo, navegación moderna, formularios en tarjetas, carrusel con controles separados y modos claro/oscuro. Los estilos se encuentran en src/styles.css y src/ui.css. Este proyecto funciona con Angular y Node, sin herramientas ni configuración de Live Server.

La carpeta .github/workflows incluye compilación y pruebas Node para GitHub.
