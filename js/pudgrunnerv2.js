window.addEventListener("load", () => {
  // Canvas setup
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (
            // (e.key === "ArrowRight" ) || 
            // (e.key === "ArrowLeft") || 
            (e.key === "ArrowDown") || 
            (e.key === "ArrowUp") || 
            (e.key === " ")
            // (e.key === "w") ||
            // (e.key === "a") ||
            // (e.key === "d")
          )
            && this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
      });

      window.addEventListener("keyup", (e) => {
        if(this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 90;
      this.height = 90;
      this.x = 30;
      this.y = 190; // Reduzido significativamente
      this.grounded = true;
      this.animFrame = 0;
      this.speedX = 0;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.gravity = 0.8;
      this.jumpPower = -16;
      this.onGround = false;
      this.groundY = this.game.config.GROUND_Y - 90; // Posição do chão
    }
    update() {

      if(this.game.keys.indexOf("ArrowRight") > -1 || this.game.keys.indexOf("d") > -1)  this.speedX = this.maxSpeed;
      else if(this.game.keys.indexOf("ArrowLeft") > -1 || this.game.keys.indexOf("a") > -1)  this.speedX = -this.maxSpeed;
      else this.speedX = 0;
      if(this.game.keys.indexOf("ArrowUp") > -1 || this.game.keys.indexOf("w") > -1)  this.jump();
      if(this.game.keys.indexOf(" ") > -1)  this.jump();

      // Movimento horizontal
      this.x += this.speedX;

      // Aplicar gravidade
      this.speedY += this.game.config.GRAVITY;
      this.y += this.speedY;

      // Ground collision
      if (this.y + this.height >= this.game.config.GROUND_Y) {
        this.y = this.game.config.GROUND_Y - this.height;
        this.speedY = 0;
        this.onGround = true;
      }

      // Animation (velocidade aumentada para GIF)
      this.animFrame += 0.3;

      // Boundaries horizontais
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.game.width)
        this.x = this.game.width - this.width;

      // Boundary superior
      if (this.y < 0) this.y = 0;
    }

    jump() {
      if (this.onGround) {
        this.speedY = this.game.config.JUMP_POWER;
        this.onGround = false;
        this.createJumpParticles();
        console.log(this.game.particles);
      }
    }

    createJumpParticles() {
      for (let i = 0; i < 8; i++) {
        this.game.particles.push({
          x: this.x + this.width / 2,
          y: this.y + this.height,
          dx: (Math.random() - 0.5) * 4,
          dy: Math.random() * -3 - 1,
          life: 30,
          maxLife: 30,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        });
      }
    }

    drawPudge(context) {
      // Usar frame atual do GIF se disponível, senão usar sprite do pool
      const gifFrames = this.game.gifFrames.pudge;
      const currentFrameIndex = this.game.gifFrames.currentFrame;
      let sprite;
      
      if (gifFrames.length > 0 && gifFrames[currentFrameIndex]) {
        sprite = gifFrames[currentFrameIndex];
      } else {
        // Usar sprite do pool para variação
        sprite = this.getSpriteFromPool('pudge');
      }

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        // Draw animated GIF sprite
        context.save();

        // Bounce animation when running
        const bounceOffset = this.grounded
          ? Math.sin(this.animFrame) * 2
          : 0;

        // Calcular posição para que a imagem fique na parte inferior do box
        const imageAspectRatio = sprite.naturalWidth / sprite.naturalHeight;
        let drawWidth = this.width;
        let drawHeight = this.width / imageAspectRatio;

        // Se a altura calculada for maior que o box, ajustar pela altura
        if (drawHeight > this.height) {
          drawHeight = this.height;
          drawWidth = this.height * imageAspectRatio;
        }

        // Posicionar a imagem na parte inferior do box
        const drawX = this.x + (this.width - drawWidth) / 2;
        const drawY =
          this.y + (this.height - drawHeight) + bounceOffset;

        context.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);

        context.restore();
      } else {
        // Enhanced fallback drawing
        this.drawPudgeFallback(context);
      }
    }

    draw(context) {
      // context.fillStyle = "black";
      // context.fillRect(this.x, this.y, this.width, this.height);
      this.drawPudge(context);
    }

    // Obter sprite do pool com rotação de instâncias
    getSpriteFromPool(type) {
      const pool = this.game.spritePool[type];
      if (!pool || pool.instances.length === 0) {
        return this.game.sprites[type]; // Fallback para sprite original
      }

      // Rotacionar entre as instâncias para simular animação
      const sprite = pool.instances[pool.currentIndex];
      pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
      return sprite;
    }

    drawPudgeFallback(context) {
      context.save();

      const bounceOffset = this.grounded
        ? Math.sin(this.animFrame) * 2
        : 0;
      const x = this.x;
      const y = this.y + bounceOffset;

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

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = -2;
    }
    update() {
      this.x += this.speedX * 2.0;
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 30;
      this.fontFamily = "Arial";
      this.color = 'white';
    }

    draw(context) {
      context.fillStyle = this.color;
      context.font = `${this.fontSize}px ${this.fontFamily}`;
      context.fillText("Score: " + this.game.score, 20, 40);
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 90;
      this.height = 90;
      this.y = (this.game.height - this.height);
      this.x = this.game.width;
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.keys = [];
      this.enemies = [];
      this.elements = {};
      this.frame = 0;
      this.enemySpawnRate = 60; // frames (1 segundo a 60fps)

      this.initializeElements();
      this.initializeConfig();
      this.initializeGameState();
      this.bindEvents();
      this.startLoadingSequence();

      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
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
        BASE_SPEED: 5,
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

      // Propriedades para GIF animado
      this.gifFrames = {
        pudge: [],
        currentFrame: 0,
        frameDelay: 0,
        frameRate: 12, // frames por segundo
      };
    }
    initializeGameState(){
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

      this.obstacles = [];
      this.particles = [];
      this.backgroundElements = [];

      // Initialize Object Pools
      this.initializePools();

      this.loadBestScore();
      this.initializeBackground();
      
    }
    
    initializeBackground() {
      // Create background elements for parallax effect
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


    // ==========================
    // SPRITE POOL SYSTEM
    // ==========================

    initializePools() {
      // Pool de sprites/imagens dos heróis
      this.spritePool = {
        pudge: {
          instances: [],
          maxInstances: 5, // Múltiplas instâncias para animação
          currentIndex: 0
        },
        boss: {
          instances: [],
          maxInstances: 3,
          currentIndex: 0
        },
        meepo: {
          instances: [],
          maxInstances: 3,
          currentIndex: 0
        },
        ghost: {
          instances: [],
          maxInstances: 3,
          currentIndex: 0
        },
        mad: {
          instances: [],
          maxInstances: 3,
          currentIndex: 0
        },
        spoon: {
          instances: [],
          maxInstances: 3,
          currentIndex: 0
        }
      };

      // Pool de canvas para pré-renderização
      this.canvasPool = {
        available: [],
        active: [],
        maxSize: 10
      };

      this.preCreateCanvasPool();
    }

    preCreateCanvasPool() {
      // Pré-criar canvas para renderização otimizada
      for (let i = 0; i < this.canvasPool.maxSize; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        this.canvasPool.available.push({
          canvas: canvas,
          ctx: canvas.getContext('2d'),
          inUse: false
        });
      }
    }

    startGame() {
      this.gameState.started = true;
      this.gameState.paused = false;
      this.gameState.gameOver = false;
      this.hideAllOverlays();
      // this.gameLoop();
    }

    restartGame() {
      // Limpar pools de sprites antes de reinicializar
      this.clearPools();
      this.obstacles = [];
      this.particles = [];
      this.initializeGameState();
      this.loadBestScore();
      this.startGame();
    }

    pauseGame() {
      this.gameState.paused = true;
      this.elements.pauseOverlay.style.display = "flex";
    }

    bindEvents(){
      this.elements.startButton.addEventListener("click", () => this.startGame());
      this.elements.restartButton.addEventListener("click", () =>
        this.restartGame()
      );

      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
      // document.addEventListener("keyup", (e) => this.handleKeyUp(e));

      // Touch support for mobile
      document.addEventListener("touchstart", (e) => {
        e.preventDefault();
        // this.jump();
      });

      // Visibility API for auto-pause
      document.addEventListener("visibilitychange", () => {
        if (
          document.hidden &&
          this.gameState.started &&
          !this.gameState.gameOver
        ) {
          this.pauseGame();
        }
      });
    }

    loadBestScore() {
      const saved = localStorage.getItem("pudgeRunnerBestScore");
      return saved ? parseInt(saved) : 0;
    }

    // Limpar pools (útil para restart)
    clearPools() {
      // Retornar todos os canvas ativos ao pool
      while (this.canvasPool.active.length > 0) {
        this.returnCanvasToPool(this.canvasPool.active[0]);
      }

      // Resetar índices dos sprites
      Object.keys(this.spritePool).forEach(type => {
        this.spritePool[type].currentIndex = 0;
      });
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
          if (this.spriteUrls[key].endsWith(".gif")) {
              // Para obstáculos, carregar como imagem normal mas preparar para animação futura
              const image = await this.loadImage(this.spriteUrls[key]);
              this.sprites[key] = image;
              
              // Adicionar ao pool de sprites
              // this.addSpriteToPool(key, image);
          } else {
            // Carregar imagem normal
            const image = await this.loadImage(this.spriteUrls[key]);
            this.sprites[key] = image;
            
            // Adicionar ao pool de sprites
            // this.addSpriteToPool(key, image);
          }
          loaded++;
        } catch (error) {
          console.warn(`Falha ao carregar sprite ${key}:`, error);
          this.sprites[key] = null;
          loaded++;
        }

        const progress = 25 + (loaded / spriteKeys.length) * 50;
        this.updateLoadingProgress(
          progress,
          `Carregando sprites... ${loaded}/${spriteKeys.length}`
        );
        await this.delay(200);
      }

      this.gameState.assetsLoaded = true;
      
      // Pré-renderizar sprites mais usados
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

    // Pré-renderizar sprites mais comuns para melhor performance
    preRenderCommonSprites() {
      // Pré-renderizar sprites de obstáculos nos tamanhos mais comuns
      const commonSizes = [
        { width: 70, height: 70 }, // meepo
        { width: 80, height: 80 }, // boss
        { width: 70, height: 90 }, // ghost
        { width: 75, height: 75 }, // mad
        { width: 50, height: 80 }, // spoon
      ];

      Object.keys(this.sprites).forEach(type => {
        if (type !== 'pudge' && this.sprites[type]) {
          commonSizes.forEach(size => {
            // Pré-renderizar em canvas para cache
            const canvasObj = this.preRenderSprite(type, size.width, size.height);
            if (canvasObj) {
              // Armazenar referência para uso futuro
              if (!this.preRenderedSprites) {
                this.preRenderedSprites = {};
              }
              this.preRenderedSprites[`${type}_${size.width}x${size.height}`] = canvasObj;
            }
          });
        }
      });
    }

    // Pré-renderizar sprites para performance
    preRenderSprite(type, width, height) {
      const sprite = this.sprites[type];
      if (!sprite) return null;

      const canvasObj = this.getCanvasFromPool();
      if (!canvasObj) return sprite; // Fallback

      // Ajustar tamanho do canvas
      canvasObj.canvas.width = width;
      canvasObj.canvas.height = height;

      // Renderizar sprite no canvas
      canvasObj.ctx.clearRect(0, 0, width, height);
      canvasObj.ctx.drawImage(sprite, 0, 0, width, height);

      return canvasObj;
    }

    // Obter canvas do pool para pré-renderização
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
      // this.elements.bestScore.textContent = this.getBestScore();
    }

    updateLoadingProgress(percentage, text) {
      this.elements.loadingProgress.style.width = percentage + "%";
      this.elements.loadingText.textContent = text;
    }

    bindEvents() {
      this.elements.startButton.addEventListener("click", () => this.startGame());
      this.elements.restartButton.addEventListener("click", () =>
        this.restartGame()
      );

      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
      // document.addEventListener("keyup", (e) => this.handleKeyUp(e));

      // Touch support for mobile
      document.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.jump();
      });

      // Visibility API for auto-pause
      document.addEventListener("visibilitychange", () => {
        if (
          document.hidden &&
          this.gameState.started &&
          !this.gameState.gameOver
        ) {
          this.pauseGame();
        }
      });
    }

    update(deltaTime) {
      if (this.gameState.started && !this.gameState.gameOver)  {

        this.player.update();
        this.enemies.forEach(enemy => {
          enemy.update();
          if (this.checkCollisions(this.player, enemy)) {
            this.handleCollision();
          }
        });
        this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
        this.frame++;
        if (this.frame % this.enemySpawnRate === 0) {
          this.addEnemy();
          // Sorteia novo intervalo de spawn para o próximo inimigo (entre 180 e 250 frames)
          this.enemySpawnRate = 180 + Math.floor(Math.random() * 70);
        }

        this.updateParticles();

      }
    }

    draw(context) {

      context.clearRect(0, 0, this.width, this.height);

      // Draw background
      this.drawBackground(context);
      this.drawBackgroundElements(context);

      // Draw game objects
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach(enemy => enemy.draw(context));

      // Draw ground
      this.drawGround(context);
      this.drawParticles(context);

      // Draw effects
      this.drawScreenEffects(context);
    }
    addEnemy() {
      // Espaçamento mínimo: pelo menos 1.5x a largura do jogador
      const minDistance = this.player.width * 2.5;
      if (
        this.enemies.length === 0 ||
        (this.enemies[this.enemies.length - 1].x < this.width - minDistance)
      ) {
        const enemy = new Angler1(this);
        this.enemies.push(enemy);
      }
    }
    checkCollisions(rect1, rect2) {
      return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
      )
    }

    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.dy += 0.1; // gravity
        particle.life--;

        if (particle.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    updateBackground() {
      this.backgroundElements.forEach((element) => {
        element.x -= element.speed;
        if (element.x < -10) {
          element.x = this.width + 10;
        }
      });
    }

    drawBackground(context) {
      // Animated gradient background
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
      // Ground with texture
      const groundHeight = this.height - this.config.GROUND_Y;

      // Main ground
      context.fillStyle = "#1a1a1a";
      context.fillRect(0, this.config.GROUND_Y, this.width, groundHeight);

      // Ground surface
      context.fillStyle = "#333333";
      context.fillRect(0, this.config.GROUND_Y, this.width, 4);

      // Ground pattern
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
      this.particles.forEach((particle) => {
        context.save();

        const alpha = particle.life / particle.maxLife;
        context.globalAlpha = alpha;

        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        context.fill();

        context.restore();
      });
    }

    drawScreenEffects(context) {
      if (this.gameState.gameOver) {
        // Screen shake effect
        context.save();
        context.globalAlpha = 0.1;
        context.fillStyle = "#ff0000";
        context.fillRect(0, 0, this.width, this.height);
        context.restore();
      }

      // Speed lines for high speed
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

  const game = new Game(canvas.width, canvas.height);

  // Animation loop
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
});
