// Classe base de inimigo
export class Enemy {
  constructor(game) {
    this.game = game;
    this.x = this.game.width;
    this.speedX = -this.game.gameState.speed;
    this.passed = false;
    const types = ["boss", "ghost", "mad", "spoon", "meepo"];
    this.width = 90;
    this.height = 90;
    this.type = types[Math.floor(Math.random() * types.length)];
    this.frameRate = 12;
    this.frameDelay = 0;
    this.currentFrame = 0;
    
    // Ajustar frameRate baseado no tipo de inimigo para melhor visual
    const frameRates = {
      'boss': 8,    // Boss mais lento e imponente
      'ghost': 15,  // Ghost mais fluido
      'mad': 18,    // Mad mais agitado
      'spoon': 10,  // Spoon normal
      'meepo': 12   // Meepo padrão
    };
    this.frameRate = frameRates[this.type] || 12;
  }
  update(deltaTime = 16.6) {
    // Normalizar deltaTime para 60fps (16.6ms por frame)
    const dt = deltaTime / 16.6;
    
    this.x += this.speedX * dt;
    // Atualiza animação do mob
    const frames = this.game.mobFrames[this.type];
    if (frames && frames.length > 1) {
      this.frameDelay += deltaTime; // Usar deltaTime direto em millisegundos
      const frameInterval = 1000 / this.frameRate; // Intervalo em ms (ex: 100ms para 10fps)
      if (this.frameDelay >= frameInterval) {
        this.frameDelay = 0;
        this.currentFrame = (this.currentFrame + 1) % frames.length;
      }
    }
  }
 draw(context) {
    // Usar frames animados se disponíveis
    const frames = this.game.mobFrames[this.type];
    let sprite = frames && frames.length > 0 ? frames[this.currentFrame] : this.game.player.getSpriteFromPool(this.type);
    if (!sprite) {
      sprite = this.game.sprites[this.type];
    }
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Animate enemy with slight rotation
      context.save();
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      context.translate(centerX, centerY);

      // inverter horizontalmente
      const shouldFlip = ["boss", "ghost", "spoon", "meepo"].includes(this.type);
      if (shouldFlip) {
        context.scale(-1, 1);
      }

      // Animação de movimento no mob
      // const animOffset = this.animOffset || 0;
      // context.rotate(
      //   Math.sin(this.game.gameState.frame * 0.1 + animOffset) * 0.1
      // );

      // Animação de movimento no mob
      context.translate(-centerX, -centerY);

      // Verificar se existe sprite pré-renderizado para melhor performance
      const preRenderedKey = `${this.type}_${this.width}x${this.height}`;
      const preRendered = this.game.preRenderedSprites && this.game.preRenderedSprites[preRenderedKey];

      if (preRendered && preRendered.canvas) {
        context.drawImage(
          preRendered.canvas,
          this.x,
          this.y,
          this.width,
          this.height
        );
      } else {
        context.drawImage(
          sprite,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
      context.restore();
    } else {
      context.save();
      context.fillStyle = "#b71c1c";
      context.fillRect(this.x, this.game.config.GROUND_Y - 40, 40, 40);
      context.restore();
    }
  }
}
