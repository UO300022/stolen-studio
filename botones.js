// Botón sencillo: un rectángulo con texto

class Boton {
  constructor(x, y, ancho, alto, texto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.texto = texto;
  }

  dibujar(colorFondo) {
    // si el ratón está encima se ve un poco más claro
    if (this.encima()) {
      fill(lerpColor(color(colorFondo), color(255), 0.2));
    } else {
      fill(colorFondo);
    }
    noStroke();
    rect(this.x, this.y, this.ancho, this.alto, 6);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.texto, this.x + this.ancho / 2, this.y + this.alto / 2);
  }

  encima() {
    return ratonEncima(this.x, this.y, this.ancho, this.alto);
  }
}

// Devuelve true si el ratón está dentro del rectángulo
function ratonEncima(x, y, ancho, alto) {
  return mouseX >= x && mouseX <= x + ancho && mouseY >= y && mouseY <= y + alto;
}
