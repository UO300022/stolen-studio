# Stolen Studio

Práctica de Informática Audiovisual (Universidad de Oviedo), hecha con p5.js.

Eliges una canción, ves sus secciones (intro, estrofa, estribillo...) y en cada una
decides si cantas tú, si suena la voz original o si queda en silencio. La idea final
es grabar tu voz sección a sección sobre el instrumental y escuchar tu propia versión.

**Fase actual:** menú de canciones, reproductor con instrumental + voz sincronizados,
secciones, letra y plan de cada sección (YO / ORIGINAL / SILENCIO). Todavía no se graba.

## Cómo abrirlo

- En internet: https://uo300022.github.io/stolen-studio/
- En local: abre la carpeta con VS Code, instala la extensión **Live Server** y haz
  clic derecho en `index.html` > *Open with Live Server*. (Abrir el `index.html` con
  doble clic no funciona porque el navegador no deja cargar los archivos de audio y JSON.)

## Controles

- Clic en una canción del menú para abrirla.
- `Play` / `Pausa` o la tecla **espacio**.
- **Flechas** izquierda/derecha: sección anterior/siguiente.
- Clic en la barra de progreso o en una sección: saltar ahí.
- Clic en el botón de debajo de una sección: cambiar su modo (ORIGINAL > YO > SILENCIO).

## Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Carga p5, p5.sound y nuestros archivos .js |
| `style.css` | Quita los márgenes y centra el canvas |
| `sketch.js` | `setup`, `draw`, eventos y la variable `pantalla` que dice qué se dibuja |
| `menu.js` | Pantalla del menú: lee el catálogo y dibuja una lista de canciones |
| `cancion.js` | Pantalla de la canción: carga, reproducción, secciones, letra y plan |
| `botones.js` | Clase `Boton` (rectángulo con texto) y la función `ratonEncima` |
| `libraries/` | p5.js 1.11 y p5.sound 1.0.1 |
| `canciones/catalogo.json` | Lista de canciones |
| `canciones/<carpeta>/` | Archivos de cada canción |

**Cómo se sincroniza el audio:** la instrumental y la voz son dos sonidos distintos.
Siempre se lanzan a la vez con `play()` con el mismo retraso y desde el mismo segundo,
así que empiezan juntas. Para pausar o saltar se paran las dos y se vuelven a lanzar.
Para callar la voz no se para: solo se pone su volumen a 0.

## Cómo añadir una canción

1. Separa la voz de la canción con alguna herramienta externa (por ejemplo Demucs)
   para tener dos mp3: la **instrumental** y la **voz**.
2. Crea una carpeta en `canciones/`, por ejemplo `canciones/mi-cancion/`, con:
   - `instrumental.mp3`
   - `voz.mp3`
   - `cancion.json`
   - `caratula.jpg` (opcional)
3. Rellena `cancion.json` así (los tiempos van en segundos):

```json
{
  "titulo": "Mi canción",
  "artista": "Artista",
  "duracion": 180.5,
  "secciones": [
    {"nombre": "Intro", "inicio": 0, "fin": 12.5, "cantable": false},
    {"nombre": "Estrofa 1", "inicio": 12.5, "fin": 40, "cantable": true},
    {"nombre": "Estribillo", "inicio": 40, "fin": 180.5, "cantable": true}
  ],
  "letra": [
    {"tiempo": 13.2, "texto": "Primera línea de la letra"},
    {"tiempo": 16.8, "texto": "Segunda línea"}
  ]
}
```

   - Las secciones tienen que ir en orden y sin huecos: el `fin` de una es el `inicio` de la siguiente,
     y la última termina en la duración de la canción.
   - `cantable: false` para las partes sin voz (intro, solos...). No tienen botón de modo.
   - Cada línea de letra se ve desde su `tiempo` hasta que empieza la siguiente. Una línea
     con `"texto": ""` deja la pantalla sin letra (para los silencios).
   - La letra sincronizada se puede sacar de lrclib.net (formato LRC: `[01:23.45] texto`).
4. Añade la canción a `canciones/catalogo.json`:

```json
{ "carpeta": "mi-cancion", "titulo": "Mi canción", "artista": "Artista", "caratula": "caratula.jpg" }
```

   Si no tiene carátula, quita `"caratula"`.
