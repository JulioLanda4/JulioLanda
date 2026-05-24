# Julio Landa - sitio personal

Repositorio del sitio personal de Julio Landa, construido con [Quarto](https://quarto.org/). El sitio publica una version en espanol y una version en ingles, incluye portafolio de proyectos, publicaciones, pagina de contacto, galeria personal y un CV editable desde Quarto con salida HTML y PDF.

## Estructura

```text
.
|-- _quarto.yml          # Configuracion global del sitio
|-- index.qmd            # Inicio en espanol
|-- about.qmd            # Acerca de mi en espanol
|-- cv.qmd               # CV en espanol, fuente HTML/PDF
|-- proyectos.qmd        # Proyectos en espanol
|-- publicaciones.qmd    # Publicaciones en espanol
|-- contacto.qmd         # Contacto en espanol
|-- en/                  # Versiones equivalentes en ingles
|-- docs/                # Sitio renderizado para GitHub Pages
|-- files/               # Archivos descargables y PDFs historicos
|-- images/              # Imagenes usadas por paginas, proyectos y galeria
|-- styles.css           # Estilos globales del sitio
|-- cv-pdf.lua           # Filtro Pandoc para transformar el CV a PDF
|-- cv-pdf.tex           # Estilo LaTeX del CV en PDF
|-- project-links.js     # Mejoras dinamicas: idioma, footer, links y lightbox
|-- lang-pref.*          # Preferencia inicial de idioma
|-- about-gallery.js     # Interaccion de la galeria
|-- _extensions/         # Extensiones Quarto instaladas
`-- notes/legacy/        # Notas antiguas de depuracion o trabajo manual
```

## Flujo de idiomas

La version base del sitio esta en espanol. Las paginas en ingles viven en `en/` y mantienen el mismo nombre de archivo para que el selector de idioma pueda alternar rutas de forma predecible:

- `cv.qmd` <-> `en/cv.qmd`
- `proyectos.qmd` <-> `en/proyectos.qmd`
- `publicaciones.qmd` <-> `en/publicaciones.qmd`
- `about.qmd` <-> `en/about.qmd`
- `contacto.qmd` <-> `en/contacto.qmd`

El selector y la persistencia de idioma se manejan principalmente en `project-links.js`, junto con `lang-pref.html` y `lang-pref.js`.

## CV editable

El CV ya no depende de editar manualmente un PDF. El contenido editable esta en:

- `cv.qmd`
- `en/cv.qmd`

Cada archivo genera:

- una pagina HTML dentro del sitio (`docs/cv.html`, `docs/en/cv.html`);
- un PDF descargable generado por Quarto (`docs/cv.pdf`, `docs/en/cv.pdf`).

El formato PDF se controla con:

- `cv-pdf.lua`: reorganiza el contenido para PDF, pone la experiencia/educacion/publicaciones en la columna principal y contacto/habilidades/idiomas en el panel lateral.
- `cv-pdf.tex`: define la plantilla visual del PDF con la paleta del sitio (`#2C3E50` y `#18BC9C`), el panel lateral derecho, el monograma `JL` y los iconos de contacto.

Los PDFs antiguos se conservan en `files/` por referencia historica, pero no se enlazan desde la pagina actual del CV.

## Comandos utiles

Renderizar todo el sitio:

```powershell
quarto render
```

Renderizar solo el CV en espanol:

```powershell
quarto render cv.qmd
```

Renderizar solo el CV en ingles:

```powershell
quarto render en\cv.qmd
```

Renderizar solo HTML del CV:

```powershell
quarto render cv.qmd --to html
quarto render en\cv.qmd --to html
```

Renderizar solo PDF del CV:

```powershell
quarto render cv.qmd --to pdf
quarto render en\cv.qmd --to pdf
```

Vista previa local:

```powershell
quarto preview
```

Evita renderizar varias paginas en paralelo cuando escriban en `docs/`; Quarto puede chocar al copiar `site_libs`.

## Publicacion

El proyecto esta configurado con:

```yaml
project:
  type: website
  output-dir: docs
```

Esto permite publicar el sitio desde la carpeta `docs/`, por ejemplo con GitHub Pages configurado para servir desde `main` + `/docs`.

## Mantenimiento

Para actualizar contenido:

- Edita las fuentes `.qmd`, no los archivos dentro de `docs/`.
- Si cambias el CV, actualiza `cv.qmd` y `en/cv.qmd`.
- Si agregas imagenes de proyectos, guardalas en `images/` y referencia rutas relativas desde las paginas.
- Si agregas una pagina nueva, crea su equivalente en `en/` para conservar el flujo bilingue.
- Despues de cambios importantes, ejecuta `quarto render` y revisa `docs/`.

Archivos generados o auxiliares:

- `docs/` es salida generada, pero se conserva en el repositorio para publicacion.
- `.quarto/` y `*.quarto_ipynb` estan ignorados.
- `_site/` es una salida antigua de Quarto; no es la salida activa.
- `notes/legacy/` contiene notas historicas que no participan en el render.

## Licencias

- Codigo: MIT, ver `LICENSE`.
- Contenido, textos, imagenes y PDFs: CC BY-NC 4.0, ver `LICENSE-CONTENT`.
