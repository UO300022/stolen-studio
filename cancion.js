// Pantalla de la canción: reproductor, secciones, letra y plan

let cancion;            // datos de cancion.json
let instrumental;       // pista sin voz
let voz;                // voz original
let archivosCargados = 0;
let errorCarga = false;

// Plan: el modo de cada sección ("ORIGINAL", "YO" o "SILENCIO")
let modos = [];

// Reproducción
let sonando = false;
let posicion = 0;       // segundo de la canción donde se empezó a sonar o se pausó
let momentoInicio = 0;  // hora del reloj de audio en la que empezó a sonar
let volumenVoz = 1;     // volumen actual de la voz original (1 o 0)

// Medidas de la barra de secciones y de la barra de progreso
let barraX = 50;
let barraAncho = 900;
let seccionesY = 300;
let seccionesAlto = 50;
let modosY = 356;
let modosAlto = 26;
let progresoY = 470;

let botonVolver;
let botonPlay;

// ---------- Carga ----------

function empezarCarga(datos) {
  pantalla = "cargando";
  archivosCargados = 0;
  errorCarga = false;
  let ruta = "canciones/" + datos.carpeta + "/";
  // se cargan los tres archivos a la vez; cada uno avisa al terminar
  cancion = loadJSON(ruta + "cancion.json", archivoCargado, falloCarga);
  instrumental = loadSound(ruta + "instrumental.mp3", archivoCargado, falloCarga);
  voz = loadSound(ruta + "voz.mp3", archivoCargado, falloCarga);
}

function archivoCargado() {
  archivosCargados++;
  if (archivosCargados == 3) {
    prepararCancion();
    pantalla = "cancion";
  }
}

function falloCarga() {
  errorCarga = true;
}

function dibujarCargando() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  if (errorCarga) {
    text("Error al cargar la canción", width / 2, height / 2);
  } else {
    text("Cargando... (" + archivosCargados + "/3)", width / 2, height / 2);
  }
}

// Se llama cuando ya está todo cargado
function prepararCancion() {
  sonando = false;
  posicion = 0;
  // por defecto todas las secciones con la voz original
  modos = [];
  for (let i = 0; i < cancion.secciones.length; i++) {
    modos[i] = "ORIGINAL";
  }
  botonVolver = new Boton(20, 20, 100, 36, "Volver");
  botonPlay = new Boton(width / 2 - 60, 530, 120, 44, "Play");
}

// ---------- Reproducción ----------

// Segundo de la canción que está sonando ahora
function tiempoActual() {
  if (!sonando) {
    return posicion;
  }
  let t = posicion + (getAudioContext().currentTime - momentoInicio);
  if (t < posicion) {
    t = posicion; // todavía no ha empezado (hay un pequeño retraso)
  }
  return t;
}

function reproducir() {
  if (posicion >= instrumental.duration() - 0.1) {
    posicion = 0; // si estaba al final, vuelve a empezar
  }
  // Las dos pistas se lanzan con el mismo retraso y desde el mismo segundo,
  // así empiezan exactamente a la vez y van sincronizadas.
  let retraso = 0.1;
  momentoInicio = getAudioContext().currentTime + retraso;
  volumenVoz = volumenQueToca(posicion);
  instrumental.play(retraso, 1, 1, posicion);
  voz.play(retraso, 1, volumenVoz, posicion);
  sonando = true;
}

function pausar() {
  posicion = tiempoActual();
  instrumental.stop();
  voz.stop();
  sonando = false;
}

// Para saltar se paran las dos pistas y se vuelven a lanzar desde el nuevo punto
function saltarA(segundo) {
  let estabaSonando = sonando;
  if (sonando) {
    pausar();
  }
  posicion = constrain(segundo, 0, instrumental.duration());
  if (estabaSonando) {
    reproducir();
  }
}

// Número de la sección en la que está el segundo t
function seccionEn(t) {
  for (let i = 0; i < cancion.secciones.length; i++) {
    if (t < cancion.secciones[i].fin) {
      return i;
    }
  }
  return cancion.secciones.length - 1;
}

// La voz original solo suena en las secciones en modo ORIGINAL
// (las secciones no cantables la dejan sonar, casi no tienen voz)
function volumenQueToca(t) {
  let i = seccionEn(t);
  if (cancion.secciones[i].cantable && modos[i] != "ORIGINAL") {
    return 0;
  }
  return 1;
}

// Se llama en cada frame mientras suena
function actualizarAudio() {
  let t = tiempoActual();
  // fin de la canción
  if (t >= instrumental.duration()) {
    pausar();
    posicion = 0;
    return;
  }
  // al cambiar de sección se sube o se baja la voz original
  let v = volumenQueToca(t);
  if (v != volumenVoz) {
    voz.setVolume(v, 0.05); // 0.05 s de rampa para que no haga "clic"
    volumenVoz = v;
  }
}

// ---------- Dibujo ----------

function dibujarCancion() {
  if (sonando) {
    actualizarAudio();
  }
  let t = tiempoActual();

  // cabecera
  botonVolver.dibujar(colorPanel);
  textAlign(LEFT, CENTER);
  fill(255);
  textSize(24);
  text(cancion.titulo, 140, 30);
  fill(180);
  textSize(15);
  text(cancion.artista, 140, 55);

  dibujarLetra(t);
  dibujarSecciones(t);
  dibujarLeyenda();
  dibujarProgreso(t);

  if (sonando) {
    botonPlay.texto = "Pausa";
  } else {
    botonPlay.texto = "Play";
  }
  botonPlay.dibujar(colorRojo);

  fill(150);
  textAlign(CENTER, CENTER);
  textSize(13);
  text("Espacio: play/pausa    Flechas: sección anterior/siguiente    Clic en el botón de debajo de una sección: cambiar su modo", width / 2, 600);
}

function dibujarLetra(t) {
  // buscar la última línea que ya ha empezado
  let actual = -1;
  for (let i = 0; i < cancion.letra.length; i++) {
    if (cancion.letra[i].tiempo <= t) {
      actual = i;
    }
  }

  textAlign(CENTER, CENTER);
  // línea actual, grande
  if (actual >= 0) {
    fill(255);
    textSize(32);
    text(cancion.letra[actual].texto, 50, 120, 900, 80);
  }
  // línea siguiente, más pequeña
  if (actual + 1 < cancion.letra.length) {
    fill(140);
    textSize(20);
    text(cancion.letra[actual + 1].texto, 50, 200, 900, 50);
  }
}

function dibujarSecciones(t) {
  let duracion = instrumental.duration();
  let actual = seccionEn(t);

  for (let i = 0; i < cancion.secciones.length; i++) {
    let s = cancion.secciones[i];
    let x = barraX + (s.inicio / duracion) * barraAncho;
    let w = ((s.fin - s.inicio) / duracion) * barraAncho;

    // color según el modo
    if (!s.cantable) {
      fill(colorPanel);
    } else if (modos[i] == "ORIGINAL") {
      fill(colorVerde);
    } else if (modos[i] == "YO") {
      fill(colorRojo);
    } else {
      fill(colorGris);
    }
    // la sección actual con borde blanco
    if (i == actual) {
      stroke(255);
      strokeWeight(3);
    } else {
      noStroke();
    }
    rect(x + 1, seccionesY, w - 2, seccionesAlto, 4);
    noStroke();

    // nombre de la sección (recortado si no cabe)
    fill(255);
    textSize(13);
    textAlign(CENTER, CENTER);
    text(recortar(s.nombre, w - 6), x + w / 2, seccionesY + seccionesAlto / 2);

    // botón del modo debajo de las secciones cantables
    if (s.cantable) {
      if (ratonEncima(x + 1, modosY, w - 2, modosAlto)) {
        fill(90);
      } else {
        fill(colorPanel);
      }
      rect(x + 1, modosY, w - 2, modosAlto, 4);
      fill(255);
      textSize(12);
      text(recortar(modos[i], w - 6), x + w / 2, modosY + modosAlto / 2);
    }
  }

  // línea blanca en el punto que está sonando
  let px = barraX + (t / duracion) * barraAncho;
  fill(255);
  rect(px - 1, seccionesY - 6, 2, seccionesAlto + 12);
}

// Quita letras al final del texto hasta que quepa en el ancho dado
function recortar(texto, ancho) {
  if (textWidth(texto) <= ancho) {
    return texto;
  }
  while (texto.length > 0 && textWidth(texto + ".") > ancho) {
    texto = texto.substring(0, texto.length - 1);
  }
  if (texto.length == 0) {
    return "";
  }
  return texto + ".";
}

function dibujarLeyenda() {
  let y = 410;
  textSize(13);
  textAlign(LEFT, CENTER);

  fill(colorVerde);
  rect(barraX, y, 14, 14);
  fill(200);
  text("ORIGINAL: suena la voz original", barraX + 20, y + 7);

  fill(colorRojo);
  rect(barraX + 250, y, 14, 14);
  fill(200);
  text("YO: cantas tú (de momento, silencio)", barraX + 270, y + 7);

  fill(colorGris);
  rect(barraX + 530, y, 14, 14);
  fill(200);
  text("SILENCIO: sin voz", barraX + 550, y + 7);

  fill(colorPanel);
  rect(barraX + 720, y, 14, 14);
  fill(200);
  text("Sin voz (instrumental)", barraX + 740, y + 7);
}

function dibujarProgreso(t) {
  let duracion = instrumental.duration();
  fill(colorPanel);
  rect(barraX, progresoY, barraAncho, 10, 5);
  fill(colorRojo);
  rect(barraX, progresoY, (t / duracion) * barraAncho, 10, 5);

  fill(200);
  textSize(13);
  textAlign(LEFT, TOP);
  text(formatoTiempo(t), barraX, progresoY + 18);
  textAlign(RIGHT, TOP);
  text(formatoTiempo(duracion), barraX + barraAncho, progresoY + 18);
}

// 125 -> "2:05"
function formatoTiempo(segundos) {
  let m = floor(segundos / 60);
  let s = floor(segundos % 60);
  if (s < 10) {
    return m + ":0" + s;
  }
  return m + ":" + s;
}

// ---------- Eventos ----------

function clicCancion() {
  if (botonVolver.encima()) {
    pausar();
    pantalla = "menu";
    return;
  }

  if (botonPlay.encima()) {
    if (sonando) {
      pausar();
    } else {
      reproducir();
    }
    return;
  }

  // clic en la barra de progreso (zona un poco más alta para acertar fácil)
  if (ratonEncima(barraX, progresoY - 8, barraAncho, 26)) {
    saltarA(((mouseX - barraX) / barraAncho) * instrumental.duration());
    return;
  }

  let duracion = instrumental.duration();
  for (let i = 0; i < cancion.secciones.length; i++) {
    let s = cancion.secciones[i];
    let x = barraX + (s.inicio / duracion) * barraAncho;
    let w = ((s.fin - s.inicio) / duracion) * barraAncho;

    // clic en la sección: saltar a su inicio
    if (ratonEncima(x, seccionesY, w, seccionesAlto)) {
      saltarA(s.inicio);
    }

    // clic en el botón del modo: ORIGINAL -> YO -> SILENCIO -> ORIGINAL
    if (s.cantable && ratonEncima(x, modosY, w, modosAlto)) {
      if (modos[i] == "ORIGINAL") {
        modos[i] = "YO";
      } else if (modos[i] == "YO") {
        modos[i] = "SILENCIO";
      } else {
        modos[i] = "ORIGINAL";
      }
    }
  }
}

function teclaCancion() {
  if (key == " ") {
    if (sonando) {
      pausar();
    } else {
      reproducir();
    }
  } else if (keyCode == LEFT_ARROW) {
    let i = seccionEn(tiempoActual());
    if (i > 0) {
      saltarA(cancion.secciones[i - 1].inicio);
    }
  } else if (keyCode == RIGHT_ARROW) {
    let i = seccionEn(tiempoActual());
    if (i < cancion.secciones.length - 1) {
      saltarA(cancion.secciones[i + 1].inicio);
    }
  }
}
