# Congreso CSA 2026

Sitio web del **Congreso de Ciencias Sociales y Administrativas: Gobierno, Ciudadanía y Tecnología para el Desarrollo** (UNSIS), 11-13 de noviembre de 2026. Recreación moderna y responsiva del sitio oficial (https://www.unsis.edu.mx/eventos/congresoCSA2026/), con todas sus secciones: inicio, ejes temáticos, fechas, ponencias, publicación, registro, comité organizador, galería y contacto.

## Contenido

- `public/index.html` — página completa de una sola vista con navegación por anclas.
- `public/css/style.css` — sistema de diseño (paleta verde/dorado institucional).
- `public/js/main.js` — menú móvil, scroll-spy, acordeón de ponencias, galería con lightbox.
- `public/img/` — cartel oficial y fotografías de ediciones anteriores, optimizadas para web.
- `server.js` / `package.json` — servidor estático mínimo (Express) para desplegar en Railway.

## Desarrollo local

```bash
npm install
npm start
```

Sirve el sitio en `http://localhost:3000`.

## Despliegue en Railway

Este proyecto vive en una subcarpeta (`congreso csa/`) dentro de un repositorio que ya contiene otro proyecto en la raíz. Para desplegarlo como un servicio independiente:

1. Crea un **nuevo servicio** en Railway y selecciona **Deploy from GitHub repo**, eligiendo este repositorio.
2. En **Settings → Root Directory**, indica `congreso csa`.
3. Railway detecta `package.json` (Nixpacks), instala dependencias y ejecuta `npm start`, que sirve el sitio en el puerto asignado por Railway (`$PORT`).
4. No se necesita configuración adicional ni variables de entorno.
