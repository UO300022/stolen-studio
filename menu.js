// Pantalla del menú: lista de canciones del catálogo

let catalogo;            // contenido de canciones/catalogo.json
let caratulas = [];      // una imagen por canción (o null si no tiene)
let botonesMenu = [];    // un botón por canción

// Se llama en setup(): carga las carátulas y crea los botones
function cargarCaratulas() {
  for (let i = 0; i < catalogo.canciones.length; i++) {
    let c = catalogo.canciones[i];
    if (c.caratula) {
      caratulas[i] = loadImage("canciones/" + c.carpeta + "/" + c.caratula);
    } else {
      caratulas[i] = null;
    }
    botonesMenu[i] = new Boton(200, 140 + i * 90, 600, 76, "");
  }
}

function dibujarMenu() {
  fill(colorRojo);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Stolen Studio", width / 2, 60);
  fill(200);
  textSize(16);
  text("Elige una canción", width / 2, 100);

  for (let i = 0; i < catalogo.canciones.length; i++) {
    let c = catalogo.canciones[i];
    let b = botonesMenu[i];
    b.dibujar(colorPanel);

    // carátula a la izquierda (si ya se ha cargado)
    if (caratulas[i] != null && caratulas[i].width > 1) {
      image(caratulas[i], b.x + 8, b.y + 8, 60, 60);
    }

    // título y artista
    textAlign(LEFT, CENTER);
    fill(255);
    textSize(20);
    text(c.titulo, b.x + 85, b.y + 26);
    fill(180);
    textSize(15);
    text(c.artista, b.x + 85, b.y + 52);
  }
}

function clicMenu() {
  for (let i = 0; i < botonesMenu.length; i++) {
    if (botonesMenu[i].encima()) {
      empezarCarga(catalogo.canciones[i]);
    }
  }
}
