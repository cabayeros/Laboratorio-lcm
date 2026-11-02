# Laboratorios Centro Médico — Angular 22

Migración local del portal Cliente Consentido a Angular **22.2.3**, TypeScript **6.0.3** y Node **24.x** (mínimo **24.15.0**). Verificada con Node **24.22.1**. La aplicación nueva no ejecuta PHP, jQuery ni Bootstrap JavaScript.

## Ejecutar en desarrollo

Desde esta carpeta, instala las dependencias y arranca el servidor de desarrollo Angular:

```powershell
npm install
npm start
```

Abrir **http://127.0.0.1:4200**. Para habilitar los formularios de cuenta y contacto, iniciar también la API Node en otra terminal:

```powershell
npm run serve
```

Angular envía las solicitudes `/api` al servidor Node en el puerto 3000. Reiniciar Node si se modifica su código.

Para compilar y servir la versión de producción, ejecutar `npm run build` y después `npm run serve`. El servidor Node sirve exclusivamente `dist/lcm/browser` y la API; no expone la copia histórica, sus cookies ni los registros de HTTrack. Las variables `PORT` y `HOST` permiten configurar el servidor.

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

La carpeta .github/workflows valida la compilación y las pruebas Node al publicar cambios.
