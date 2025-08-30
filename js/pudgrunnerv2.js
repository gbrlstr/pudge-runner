// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 500;

class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.keys = [];
    this.enemies = [];
    this.elements = {};
    this.enemySpawnRate = 60;
    this.particles = [];
    this.backgroundElements = [];
    this.initializeElements();
    this.initializeConfig();
    this.initializeGameState();
    this.spritePool = {};
    this.canvasPool = {};
    this.preRenderedSprites = {};
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.ui = new UI(this);
    this.initializePools();
    this.preCreateCanvasPool();
    this.startLoadingSequence();
  }
  initializeElements() {
    this.elements = {
      loadingScreen: document.getElementById("loadingScreen"),
      loadingProgress: document.getElementById("loadingProgress"),
      loadingText: document.getElementById("loadingText"),
      menuOverlay: document.getElementById("menuOverlay"),
      gameOverOverlay: document.getElementById("gameOverOverlay"),
      pauseOverlay: document.getElementById("pauseOverlay"),
      startButton: document.getElementById("startButton"),
      restartButton: document.getElementById("restartButton"),
      currentScore: document.getElementById("currentScore"),
      bestScore: document.getElementById("bestScore"),
      currentLevel: document.getElementById("currentLevel"),
      finalScore: document.getElementById("finalScore"),
      controlsPanel: document.getElementById("controlsPanel"),
    };
  }
  initializeConfig() {
    this.config = {
      GROUND_Y: this.height - 50,
      GRAVITY: 0.8,
      JUMP_POWER: -16,
      BASE_SPEED: 2,
      OBSTACLE_SPAWN_RATE: 120,
      PARTICLE_COUNT: 100,
      LEVELS: [
        { speed: 5, spawnRate: 120, name: "Iniciante" },
        { speed: 6, spawnRate: 110, name: "Fácil" },
        { speed: 7, spawnRate: 100, name: "Normal" },
        { speed: 8, spawnRate: 90, name: "Difícil" },
        { speed: 9, spawnRate: 80, name: "Expert" },
        { speed: 10, spawnRate: 70, name: "Insano" },
      ],
    };
    this.spriteUrls = {
      pudge: "./assets/imgs/pudg.gif",
      boss: "./assets/imgs/boss.gif",
      meepo: "./assets/imgs/meepo.gif",
      ghost: "./assets/imgs/ghost.gif",
      mad: "./assets/imgs/mad.gif",
      spoon: "./assets/imgs/spoon.gif",
    };
    this.sprites = {
      pudge: null,
      boss: null,
      meepo: null,
      ghost: null,
      mad: null,
      spoon: null,
    };
    this.gifFrames = {
      pudge: [],
      currentFrame: 0,
      frameDelay: 0,
      frameRate: 12,
    };
  }
  initializeGameState() {
    this.gameState = {
      started: false,
      paused: false,
      gameOver: false,
      assetsLoaded: false,
      frame: 0,
      score: 0,
      level: 1,
      speed: this.config.BASE_SPEED,
      spawnRate: this.config.OBSTACLE_SPAWN_RATE,
      nextSpawnFrame: this.config.OBSTACLE_SPAWN_RATE,
    };
    this.enemies = [];
    this.particles = [];
    this.backgroundElements = [];
    this.loadBestScore();
    this.initializeBackground();
  }
  initializeBackground() {
    for (let i = 0; i < 10; i++) {
      this.backgroundElements.push({
        x: Math.random() * this.width * 2,
        y: Math.random() * (this.config.GROUND_Y - 100),
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
  }
  initializePools() {
    this.spritePool = {
      pudge: { instances: [], maxInstances: 5, currentIndex: 0 },
      boss: { instances: [], maxInstances: 3, currentIndex: 0 },
      meepo: { instances: [], maxInstances: 3, currentIndex: 0 },
      ghost: { instances: [], maxInstances: 3, currentIndex: 0 },
      mad: { instances: [], maxInstances: 3, currentIndex: 0 },
      spoon: { instances: [], maxInstances: 3, currentIndex: 0 },
    };
    this.canvasPool = { available: [], active: [], maxSize: 10 };
  }
  preCreateCanvasPool() {
    for (let i = 0; i < this.canvasPool.maxSize; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      this.canvasPool.available.push({
        canvas: canvas,
        ctx: canvas.getContext("2d"),
        inUse: false,
      });
    }
  }
  startGame() {
    this.gameState.started = true;
    this.gameState.paused = false;
    this.gameState.gameOver = false;
    this.hideAllOverlays();
  }
  restartGame() {
    this.clearPools();
    this.enemies = [];
    this.particles = [];
    this.initializeGameState();
    this.loadBestScore();
    this.startGame();
  }
  pauseGame() {
    this.gameState.paused = true;
    this.elements.pauseOverlay.style.display = "flex";
  }
  togglePause() {
    if (this.gameState.paused) {
      this.gameState.paused = false;
      this.elements.pauseOverlay.style.display = "none";
    } else {
      this.pauseGame();
    }
  }
  loadBestScore() {
    const saved = localStorage.getItem("pudgeRunnerBestScore");
    return saved ? parseInt(saved) : 0;
  }
  getBestScore() {
    return this.loadBestScore();
  }
  saveBestScore() {
    const currentBest = this.loadBestScore();
    if (this.gameState.score > currentBest) {
      localStorage.setItem(
        "pudgeRunnerBestScore",
        this.gameState.score.toString()
      );
    }
  }
  clearPools() {
    while (this.canvasPool.active.length > 0) {
      this.returnCanvasToPool(this.canvasPool.active[0]);
    }
    Object.keys(this.spritePool).forEach((type) => {
      this.spritePool[type].currentIndex = 0;
    });
  }
  // Retornar canvas ao pool
  returnCanvasToPool(canvasObj) {
    canvasObj.inUse = false;
    
    // Limpar canvas
    canvasObj.ctx.clearRect(0, 0, canvasObj.canvas.width, canvasObj.canvas.height);
    
    // Remover da lista ativa
    const activeIndex = this.canvasPool.active.indexOf(canvasObj);
    if (activeIndex > -1) {
      this.canvasPool.active.splice(activeIndex, 1);
    }
    
    // Adicionar de volta ao pool disponível
    this.canvasPool.available.push(canvasObj);
  }
  hideAllOverlays() {
    this.elements.menuOverlay.style.display = "none";
    this.elements.gameOverOverlay.style.display = "none";
    this.elements.pauseOverlay.style.display = "none";
  }
  async startLoadingSequence() {
    this.updateLoadingProgress(0, "Inicializando...");
    await this.delay(500);
    this.updateLoadingProgress(25, "Carregando sprites...");
    await this.loadAssets();
    this.updateLoadingProgress(75, "Preparando jogo...");
    await this.delay(800);
    this.updateLoadingProgress(100, "Concluído!");
    await this.delay(500);
    this.showMainMenu();
  }
  async loadAssets() {
    const spriteKeys = Object.keys(this.spriteUrls);
    let loaded = 0;
    for (const key of spriteKeys) {
      try {
        const image = await this.loadImage(this.spriteUrls[key]);
        this.sprites[key] = image;
      } catch (error) {
        console.warn(`Falha ao carregar sprite ${key}:`, error);
        this.sprites[key] = null;
      }
      loaded++;
      const progress = 25 + (loaded / spriteKeys.length) * 50;
      this.updateLoadingProgress(
        progress,
        `Carregando sprites... ${loaded}/${spriteKeys.length}`
      );
      await this.delay(200);
    }
    this.gameState.assetsLoaded = true;
    this.preRenderCommonSprites();
  }
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }
  preRenderCommonSprites() {
    const commonSizes = [
      { width: 70, height: 70 },
      { width: 80, height: 80 },
      { width: 70, height: 90 },
      { width: 75, height: 75 },
      { width: 50, height: 80 },
    ];
    Object.keys(this.sprites).forEach((type) => {
      if (type !== "pudge" && this.sprites[type]) {
        commonSizes.forEach((size) => {
          const canvasObj = this.preRenderSprite(type, size.width, size.height);
          if (canvasObj) {
            this.preRenderedSprites[`${type}_${size.width}x${size.height}`] =
              canvasObj;
          }
        });
      }
    });
  }
  preRenderSprite(type, width, height) {
    const sprite = this.sprites[type];
    if (!sprite) return null;
    const canvasObj = this.getCanvasFromPool();
    if (!canvasObj) return sprite;
    canvasObj.canvas.width = width;
    canvasObj.canvas.height = height;
    canvasObj.ctx.clearRect(0, 0, width, height);
    canvasObj.ctx.drawImage(sprite, 0, 0, width, height);
    return canvasObj;
  }
  getCanvasFromPool() {
    if (this.canvasPool.available.length > 0) {
      const canvasObj = this.canvasPool.available.pop();
      canvasObj.inUse = true;
      this.canvasPool.active.push(canvasObj);
      return canvasObj;
    }
    return null;
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  showMainMenu() {
    this.elements.loadingScreen.style.display = "none";
    this.elements.menuOverlay.style.display = "flex";
    this.elements.controlsPanel.style.display = "flex";
    this.updateUI();
  }
  updateUI() {
    this.elements.currentScore.textContent = this.gameState.score;
    this.elements.currentLevel.textContent = this.gameState.level;
    this.elements.bestScore.textContent = this.getBestScore();
  }
  showMenuControls() {
    const controlsPanel = this.elements.controlsPanel;
    if (controlsPanel.style.display === "none") {
      controlsPanel.style.display = "flex";
    } else {
      controlsPanel.style.display = "none";
    }
  }
  updateLoadingProgress(percentage, text) {
    this.elements.loadingProgress.style.width = percentage + "%";
    this.elements.loadingText.textContent = text;
  }
  update() {

    if (this.gameState.paused || this.gameState.gameOver) return;

    if (this.gameState.started && !this.gameState.gameOver) {

      this.gameState.frame++;
      
      // Update player
      this.player.update();

      // Update enemies
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        enemy.x -= this.gameState.speed;

        // Pontuação
        if (enemy.x < this.player.x && !enemy.passed) {
          this.gameState.score += 10;
          enemy.passed = true;
          this.createScoreParticles(enemy.x + enemy.width / 2, enemy.y - this.player.height / 2);
        }

        // Remoção
        if (enemy.x + enemy.width < 0) {
          this.enemies.splice(i, 1);
          continue;
        }

        // Colisão
        if (this.isColliding(this.player, enemy)) {
          const px = (this.player.x + this.player.width / 2 + enemy.x + enemy.width / 2) / 2;
          const py = (this.player.y + this.player.height / 2 + enemy.y + enemy.height / 2) / 2;
          this.createCollisionParticles(px, py);
          this.gameOver();
          return;
        }

        enemy.update();
      }

      if (this.gameState.frame % this.enemySpawnRate === 0) {
        this.addEnemy();
        this.enemySpawnRate = 180 + Math.floor(Math.random() * 70);
      }
      
      this.updateParticles();
      this.updateUI();
    }
  }
  draw(context) {
    context.clearRect(0, 0, this.width, this.height);
    this.drawBackground(context);
    this.drawBackgroundElements(context);
    this.player.draw(context);
    this.ui.draw(context);
    this.enemies.forEach((enemy) => enemy.draw(context));
    this.drawGround(context);
    this.drawParticles(context);
    this.drawScreenEffects(context);
  }
  addEnemy() {
    const minDistance = this.player.width * 2.5;
    if (
      this.enemies.length === 0 ||
      this.enemies[this.enemies.length - 1].x < this.width - minDistance
    ) {
      const enemy = new EnemyAngler(this);
      this.enemies.push(enemy);
    }
  }
  isColliding(rect1, rect2) {
    // Padding proporcional ao tamanho dos objetos
    // Player maior, hitbox mais justa
    const pudgePadX = Math.max(18, rect1.width * 0.12);
    const pudgePadY = Math.max(18, rect1.height * 0.12);
    const obsPadX = Math.max(8, rect2.width * 0.15);
    const obsPadY = Math.max(8, rect2.height * 0.15);

    // Tolerância extra para evitar game over injusto
    const tolerance = 8;

    // Hitbox do pudge
    const pudgeLeft   = rect1.x + pudgePadX + tolerance;
    const pudgeRight  = rect1.x + rect1.width - pudgePadX - tolerance;
    const pudgeTop    = rect1.y + pudgePadY + tolerance;
    const pudgeBottom = rect1.y + rect1.height - pudgePadY - tolerance;

    // Hitbox do obstáculo
    const obsLeft   = rect2.x + obsPadX;
    const obsRight  = rect2.x + rect2.width - obsPadX;
    const obsTop    = rect2.y + obsPadY;
    const obsBottom = rect2.y + rect2.height - obsPadY;

    // Colisão só ocorre se houver sobreposição real
    return (
      pudgeRight > obsLeft &&
      pudgeLeft < obsRight &&
      pudgeBottom > obsTop &&
      pudgeTop < obsBottom
    );
  }
  gameOver() {
    this.gameState.gameOver = true;
    this.saveBestScore();
    this.elements.finalScore.textContent = `Pontuação Final: ${this.gameState.score}`;
    // this.elements.gameOverOverlay.style.display = "flex";
  }
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  createJumpParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(
        new Particle(
          x, y,
          (Math.random() - 0.5) * 4,
          Math.random() * -3 - 1,
          30,
          30,
          `hsl(${Math.random() * 60 + 200}, 70%, 60%)`)
      );
    }
  }
  createCollisionParticles(x, y) {
    for (let i = 0; i < 28; i++) {
      this.particles.push(
        new Particle(
          x,
          y,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          50,
          50,
          `hsl(${Math.random() * 30}, 100%, ${Math.random() * 30 + 50}%)` // tons de vermelho/laranja
        )
      );
    }
  }
  createScoreParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push(
        new Particle(
          x,
          y,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          25,
          25,
          `hsl(${Math.random() * 60 + 60}, 100%, 60%)`
        )
      );
    }
  }
  drawBackground(context) {
    const gradient = context.createLinearGradient(0, 0, 0, this.height);
    const time = this.gameState.frame * 0.01;
    gradient.addColorStop(0, `hsl(${220 + Math.sin(time) * 10}, 30%, 15%)`);
    gradient.addColorStop(0.5, `hsl(${210 + Math.cos(time) * 10}, 25%, 10%)`);
    gradient.addColorStop(
      1,
      `hsl(${200 + Math.sin(time * 0.7) * 10}, 20%, 5%)`
    );
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.width, this.height);
  }
  drawBackgroundElements(context) {
    this.backgroundElements.forEach((element) => {
      context.save();
      context.globalAlpha = element.opacity;
      context.fillStyle = "#ffffff";
      context.fillRect(element.x, element.y, element.size, element.size);
      context.restore();
    });
  }
  drawGround(context) {
    const groundHeight = this.height - this.config.GROUND_Y;
    context.fillStyle = "#1a1a1a";
    context.fillRect(0, this.config.GROUND_Y, this.width, groundHeight);
    context.fillStyle = "#333333";
    context.fillRect(0, this.config.GROUND_Y, this.width, 4);
    context.strokeStyle = "#404040";
    context.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      context.beginPath();
      context.moveTo(x, this.config.GROUND_Y + 4);
      context.lineTo(x, this.height);
      context.stroke();
    }
  }
  drawParticles(context) {
    this.particles.forEach((particle) => particle.draw(context));
  }
  drawScreenEffects(context) {
    if (this.gameState.gameOver) {
      context.save();
      context.globalAlpha = 0.1;
      context.fillStyle = "#ff0000";
      context.fillRect(0, 0, this.width, this.height);
      context.restore();
    }
    if (this.gameState.speed > 7) {
      context.save();
      context.strokeStyle = "rgba(255, 255, 255, 0.1)";
      context.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const y =
          (this.gameState.frame * (this.gameState.speed - 5) * 2 + i * 40) %
          this.height;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(50, y);
        context.stroke();
      }
      context.restore();
    }
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 130;
    this.height = 130;
    this.x = 30;
    this.y = 190;
    this.grounded = true;
    this.animFrame = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 5;
    this.gravity = 0.8;
    this.jumpPower = -16;
    this.onGround = false;
    this.groundY = this.game.config.GROUND_Y - 90;
  }
  update() {

    // Handle horizontal movement
    if (
      this.game.keys.indexOf("ArrowRight") > -1 ||
      this.game.keys.indexOf("d") > -1
    )
      this.speedX = this.maxSpeed;
    else if (
      this.game.keys.indexOf("ArrowLeft") > -1 ||
      this.game.keys.indexOf("a") > -1
    )
      this.speedX = -this.maxSpeed;
    else this.speedX = 0;
    // Handle vertical movement
    if (
      this.game.keys.indexOf("ArrowUp") > -1 ||
      this.game.keys.indexOf("w") > -1
    )
      this.jump();
    if (this.game.keys.indexOf(" ") > -1) this.jump();


    this.x += this.speedX;
    this.speedY += this.game.config.GRAVITY;
    this.y += this.speedY;
    if (this.y + this.height >= this.game.config.GROUND_Y) {
      this.y = this.game.config.GROUND_Y - this.height;
      this.speedY = 0;
      this.onGround = true;
    }
    this.animFrame += 0.3;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.game.width)
      this.x = this.game.width - this.width;
    if (this.y < 0) this.y = 0;
  }
  jump() {
    if (this.onGround) {
      this.speedY = this.game.config.JUMP_POWER;
      this.onGround = false;
      this.game.createJumpParticles(
        this.x + this.width / 2,
        this.y + this.height
      );
    }
  }
  draw(context) {
    this.drawPudge(context);
  }
  drawPudge(context) {
    const gifFrames = this.game.gifFrames.pudge;
    const currentFrameIndex = this.game.gifFrames.currentFrame;
    let sprite;
    if (gifFrames.length > 0 && gifFrames[currentFrameIndex]) {
      sprite = gifFrames[currentFrameIndex];
    } else {
      sprite = this.getSpriteFromPool("pudge");
    }
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      context.save();
      const bounceOffset = this.grounded ? Math.sin(this.animFrame) * 2 : 0;
      const imageAspectRatio = sprite.naturalWidth / sprite.naturalHeight;
      let drawWidth = this.width;
      let drawHeight = this.width / imageAspectRatio;
      if (drawHeight > this.height) {
        drawHeight = this.height;
        drawWidth = this.height * imageAspectRatio;
      }
      const drawX = this.x + (this.width - drawWidth) / 2;
      const drawY = this.y + (this.height - drawHeight) + bounceOffset;
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
  drawPudgeFallback(context) {
    context.save();
    const bounceOffset = this.grounded ? Math.sin(this.animFrame) * 2 : 0;
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

class Enemy {
  constructor(game) {
    this.game = game;
    this.x = this.game.width;
    this.speedX = -2;
    this.passed = false;
    const types = ["boss", "ghost", "mad", "spoon", "meepo"];
    this.type = types[Math.floor(Math.random() * types.length)];
  }
  update() {
    this.x += this.speedX * 2.0;
  }
  draw(context) {
    // Usar sprite do pool para variação e performance
    let sprite = this.game.player.getSpriteFromPool(this.type);

    // Fallback para sprite original se pool não tiver
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

      // Adiciona animOffset se existir, senão 0
      const animOffset = this.animOffset || 0;
      context.rotate(
        Math.sin(this.game.gameState.frame * 0.1 + animOffset) * 0.1
      );
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
      this.drawPudgeFallback(context);
    }
  }
  drawPudgeFallback(context) {
    context.save();

    const bounceOffset = this.pudge.grounded
      ? Math.sin(this.pudge.animFrame) * 2
      : 0;
    const x = this.pudge.x;
    const y = this.pudge.y + bounceOffset;

    // Body
    context.fillStyle = "#8B4513";
    context.fillRect(x + 15, y + 20, 60, 50);

    // Head
    context.fillStyle = "#D2B48C";
    context.fillRect(x + 20, y, 50, 40);

    // Eyes
    context.fillStyle = "#000000";
    context.fillRect(x + 25, y + 8, 8, 8);
    context.fillRect(x + 45, y + 8, 8, 8);

    // Mouth
    context.fillStyle = "#8B0000";
    context.fillRect(x + 30, y + 20, 20, 6);

    // Arms
    context.fillStyle = "#D2B48C";
    context.fillRect(x + 5, y + 25, 15, 30);
    context.fillRect(x + 70, y + 25, 15, 30);

    // Legs
    context.fillRect(x + 25, y + 65, 15, 25);
    context.fillRect(x + 50, y + 65, 15, 25);

    context.restore();
  }
}

class EnemyAngler extends Enemy {
  constructor(game) {
    super(game);
    this.width = 90;
    this.height = 90;
    // Ajusta para alinhar o inimigo ao chão
    this.y = this.game.config.GROUND_Y - this.height;
    this.x = this.game.width;
  }
}

class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Arial";
    this.color = "white";
  }
  draw(context) {
    // context.fillStyle = this.color;
    // context.font = `${this.fontSize}px ${this.fontFamily}`;
    // context.fillText("Score: " + this.game.gameState.score, 20, 40);
  }
}

class InputHandler {
  constructor(game) {
    this.game = game;

    // Keyboard event listeners
    window.addEventListener("keydown", (e) => {

      // Prevent default behavior for certain keys
      if (
        [
          "ArrowDown",
          "ArrowUp",
          " ",
          "w",
          "a",
          "d",
          "ArrowRight",
          "ArrowLeft",
        ].includes(e.key) &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      }

      switch (e.code) {
        case "Space":
          if (!this.game.gameState.gameOver && !this.game.gameState.paused) {
            this.game.player.jump();
          }
          break;
        case "KeyR":
          if (this.game.gameState.gameOver) {
            this.game.restartGame();
          }
          break;
        case "KeyP":
          if (this.game.gameState.started && !this.game.gameState.gameOver) {
            this.game.togglePause();
          }
          break;
        case "KeyM":
          if (this.game.gameState.started) {
            this.game.showMenuControls();
          }
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (this.game.keys.indexOf(e.key) > -1) {
        this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
      }
    });
    window.addEventListener("touchstart", (e) => {
      this.game.player.jump();
    });
    window.addEventListener("visibilitychange", (e) => {
      if (
        document.hidden &&
        this.game.gameState.started &&
        !this.game.gameState.gameOver
      ) {
        this.game.pauseGame();
      }
    });

    // Start and Restart button event listeners
    this.game.elements.startButton.addEventListener("click", () => {
      this.game.startGame();
    });
    this.game.elements.restartButton.addEventListener("click", () => {
      this.game.restartGame();
    });
  }
}

class Particle {
  constructor(x, y, dx, dy, life, maxLife, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.life = life;
    this.maxLife = maxLife;
    this.color = color;
  }
  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.1; // gravity
    this.life--;
  }
  draw(context) {
    context.save();
    const alpha = this.life / this.maxLife;
    context.globalAlpha = alpha;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, 3, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

const game = new Game(canvas.width, canvas.height);
let lastTime = 0;
function animate(timeStamp) {
  const deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  game.update(deltaTime);
  game.draw(ctx);
  requestAnimationFrame(animate);
}
animate(0);
