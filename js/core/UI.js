
export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Arial";
    this.color = "white";
  }
  draw(context) {
    // Exemplo: desenha o score (pode ser expandido)
    // context.save();
    // context.fillStyle = this.color;
    // context.font = `${this.fontSize}px ${this.fontFamily}`;
    // context.fillText("Score: " + (this.game.gameState?.score ?? 0), 20, 40);
    // context.restore();
  }
}
