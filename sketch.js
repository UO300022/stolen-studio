// Stolen Studio - programa principal
// Aquí están setup, draw y los eventos. Cada pantalla tiene su archivo:
// menu.js (catálogo) y cancion.js (reproductor y plan).

// Pantalla actual: "menu", "cargando" o "cancion"
let pantalla = "menu";

// Colores de la aplicación
let colorFondo = "#1e1e24";
let colorPanel = "#33333d";
let colorRojo = "#e05555";
let colorVerde = "#3fa89f";
let colorGris = "#55555f";

function preload() {
  catalogo = loadJSON("canciones/catalogo.json");
}

function setup() {
  createCanvas(1000, 620);
  cargarCaratulas();
}

function draw() {
  background(colorFondo);

  if (pantalla == "menu") {
    dibujarMenu();
  } else if (pantalla == "cargando") {
    dibujarCargando();
  } else if (pantalla == "cancion") {
    dibujarCancion();
  }
}

function mousePressed() {
  // el navegador no deja sonar audio hasta que el usuario hace clic
  userStartAudio();

  if (pantalla == "menu") {
    clicMenu();
  } else if (pantalla == "cancion") {
    clicCancion();
  }
}

function keyPressed() {
  if (pantalla == "cancion") {
    teclaCancion();
  }
  // evita que el espacio y las flechas muevan la página
  return false;
}
