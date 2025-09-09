
export class Player {
  constructor(game) {
    this.game = game;
    
    this.width = 130;
    this.height = 130;
    this.x = 30;
    this.y = 190;
    this.dy = 0;
    this.speedX = 0;
    this.maxSpeed = 10;
    this.gravity = 1.1;
    this.jumpPower = -16;
    this.animFrame = 0;
    this.onGround = false;
    this.groundY = this.game.config.GROUND_Y - 90;
    this.flipped = false;
    this.frameRate = 15; // Aumentado de 10 para 15 FPS para animação mais suave
    this.frameDelay = 0;
    this.currentFrame = 0;
  }
  update(deltaTime = 16.6) {
    // Normalizar deltaTime para 60fps (16.6ms por frame)
    const dt = deltaTime / 16.6;
    
    // Handle horizontal movement
    if (
      this.game.keys.indexOf("ArrowRight") > -1 ||
      this.game.keys.indexOf("d") > -1
    ) {
      this.speedX = this.maxSpeed;
      this.flipped = false;
    }
    else if (
      this.game.keys.indexOf("ArrowLeft") > -1 ||
      this.game.keys.indexOf("a") > -1
    ) {
      this.speedX = -this.maxSpeed;
      this.flipped = true;
    }
    else this.speedX = 0;
    // Handle vertical movement
    if (
      this.game.keys.indexOf("ArrowUp") > -1 ||
      this.game.keys.indexOf("w") > -1
    )
      this.jump();
    if (this.game.keys.indexOf(" ") > -1) this.jump();

    // Atualiza posição do jogador com deltaTime
    this.x += this.speedX * dt;
    // Apply gravity com deltaTime
    this.dy += this.gravity * dt;
    this.y += this.dy * dt;
    // Verifica colisão com o chão
    if (this.y + this.height >= this.game.config.GROUND_Y) {
      this.y = this.game.config.GROUND_Y - this.height;
      this.dy = 0;
      this.onGround = true;
    }
    this.animFrame += 0.3 * dt;
    // Limitar posição do jogador dentro da tela
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > this.game.width)
      this.x = this.game.width - this.width;
    // Atualiza animação do player com sistema simplificado
    if (this.game.playerFrames.length > 1) {
      this.frameDelay += deltaTime; // Usar deltaTime direto em millisegundos
      const frameInterval = 1000 / this.frameRate; // Intervalo em ms (ex: 100ms para 10fps)
      if (this.frameDelay >= frameInterval) {
        this.frameDelay = 0;
        this.currentFrame = (this.currentFrame + 1) % this.game.playerFrames.length;
      }
    }
  }
  jump() {
    if (this.onGround) {
      this.dy = this.game.config.JUMP_POWER;
      this.onGround = false;
      
      // Estatísticas Detalhadas
      this.game.gameState.stats.jumps++;
      
      // Som de pulo
      if (this.game.assetManager) {
        this.game.assetManager.playRandomSound('jump', false);
      }

      // Partículas de pulo
      this.game.createJumpParticles(this.x + this.width / 2, this.y + this.height);
    }
  }
  draw(context) {
    this.drawAnimatedPlayer(context);
  }
  drawAnimatedPlayer(context) {
    const frames = this.game.playerFrames;
    let sprite = frames.length > 0 ? frames[this.currentFrame] : this.getSpriteFromPool("pudge");
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      context.save();
      const bounceOffset = this.onGround ? Math.sin(this.animFrame) * 2 : 0;
      const imageAspectRatio = sprite.naturalWidth / sprite.naturalHeight;
      let drawWidth = this.width;
      let drawHeight = this.width / imageAspectRatio;
      if (drawHeight > this.height) {
        drawHeight = this.height;
        drawWidth = this.height * imageAspectRatio;
      }
      const drawX = this.x + (this.width - drawWidth) / 2;
      const drawY = this.y + (this.height - drawHeight) + bounceOffset;
      if (this.flipped) {
        context.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
        context.scale(-1, 1);
        context.translate(-drawX - drawWidth / 2, -drawY - drawHeight / 2);
      }
      context.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);
      context.restore();
    } else {
      this.drawPudgeFallback(context);
    }
  }
  getSpriteFromPool(type) {
    const pool = this.game.spritePool[type];
    if (!pool || pool.instances.length === 0) {
      return this.game.sprites[type];
    }
    const sprite = pool.instances[pool.currentIndex];
    pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
    return sprite;
  }
  addSpriteToPool(type, spriteImage) {
    const pool = this.game.spritePool[type];
    if (pool && pool.instances.length < pool.maxInstances) {
      // Criar uma cópia da imagem para o pool
      const img = new Image();
      img.onload = () => {
        pool.instances.push(img);
      };
      img.src = spriteImage.src;
    }
  }
  drawPudgeFallback(context) {
    context.save();
    const bounceOffset = this.onGround ? Math.sin(this.animFrame) * 2 : 0;
    const x = this.x;
    const y = this.y + bounceOffset;
    context.fillStyle = "#8B4513";
    context.fillRect(x + 15, y + 20, 60, 50);
    context.fillStyle = "#D2B48C";
    context.fillRect(x + 20, y, 50, 40);
    context.fillStyle = "#000000";
    context.fillRect(x + 25, y + 8, 8, 8);
    context.fillRect(x + 45, y + 8, 8, 8);
    context.fillStyle = "#8B0000";
    context.fillRect(x + 30, y + 20, 20, 6);
    context.fillStyle = "#D2B48C";
    context.fillRect(x + 5, y + 25, 15, 30);
    context.fillRect(x + 70, y + 25, 15, 30);
    context.fillRect(x + 25, y + 65, 15, 25);
    context.fillRect(x + 50, y + 65, 15, 25);
    context.restore();
  }
}
