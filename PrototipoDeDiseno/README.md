# Carolina Joyería — prototipo para GitHub Pages

## Publicar sin instalar nada

1. Descomprime el ZIP.
2. Crea un repositorio público en GitHub.
3. Sube el contenido de esta carpeta a la raíz del repositorio (no subas el ZIP ni una carpeta adicional que envuelva el proyecto). Deben aparecer `docs`, `src` y `package.json` en la raíz.
4. Abre **Settings → Pages**.
5. En **Source**, elige **Deploy from a branch**.
6. En **Branch**, selecciona **main** y **/docs**. Pulsa **Save**.
7. Espera a que termine la publicación y abre el enlace que muestra GitHub Pages.

No necesitas configurar el nombre del repositorio: los recursos usan rutas relativas. La navegación utiliza URLs como `#/login` para que recargar una pantalla no produzca un error 404.

## Acceso del cliente

Usuario: `paola` o `dorie`.
Contraseña: cualquier texto no vacío.

Es una demostración con datos de ejemplo y sesión en memoria, sin servidor, base de datos compartida ni autenticación real. No introducir datos reales o confidenciales. Recargar reinicia la sesión y los cambios que se mantienen en memoria.

La tipografía de Google Fonts y una imagen de Unsplash necesitan conexión a Internet.

## Modificar y regenerar

Instala Node.js 22.12 o posterior (recomendado: Node.js 24 LTS).

```bash
npm ci
npm run dev
```

Después de modificar el código:

```bash
npm run build
```

Vuelve a subir la carpeta `docs` actualizada al repositorio. GitHub Pages publica esta carpeta; el código `src` por sí solo no es un sitio compilado.

## Qué contiene

- `src/`: código original del prototipo, con navegación compatible con Pages.
- `docs/`: versión compilada lista para publicar.
- `public/.nojekyll`: se copia al compilar para servir los archivos estáticos.
- `package-lock.json`: versiones reproducibles para `npm ci`.

Referencia oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
