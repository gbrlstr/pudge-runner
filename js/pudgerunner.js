// ==========================
// PUDGE RUNNER - Enhanced Edition
// ==========================

class PudgeRunner {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.width = 1500;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    this.initializeElements();
    this.initializeConfig();
    this.initializeGameState();
    this.initializeAssets();
    this.bindEvents();
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
      GROUND_Y: this.canvas.height - 50,
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

    this.spriteUrls = {
      pudge: "./assets/imgs/pudg.gif",
      boss: "./assets/imgs/boss.gif",
      meepo: "./assets/imgs/meepo.gif",
      ghost: "./assets/imgs/ghost.gif",
      mad: "./assets/imgs/mad.gif",
      spoon: "./assets/imgs/spoon.gif",
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
    };

    this.pudge = {
      x: 30,
      y: this.config.GROUND_Y - 90, // Reduzido significativamente
      width: 90, // Reduzido de 180 para 120
      height: 90, // Reduzido de 180 para 120
      dy: 0,
      grounded: true,
      animFrame: 0,
    };

    this.obstacles = [];
    this.particles = [];
    this.backgroundElements = [];

    // Initialize Object Pools
    this.initializePools();

    this.loadBestScore();
    this.initializeBackground();
  }

  initializeAssets() {
    this.soundEnabled = true;
  }

  initializeBackground() {
    // Create background elements for parallax effect
    for (let i = 0; i < 10; i++) {
      this.backgroundElements.push({
        x: Math.random() * this.canvas.width * 2,
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

  // Obter sprite do pool com rotação de instâncias
  getSpriteFromPool(type) {
    const pool = this.spritePool[type];
    if (!pool || pool.instances.length === 0) {
      return this.sprites[type]; // Fallback para sprite original
    }

    // Rotacionar entre as instâncias para simular animação
    const sprite = pool.instances[pool.currentIndex];
    pool.currentIndex = (pool.currentIndex + 1) % pool.instances.length;
    return sprite;
  }

  // Adicionar instância de sprite ao pool
  addSpriteToPool(type, spriteImage) {
    const pool = this.spritePool[type];
    if (pool && pool.instances.length < pool.maxInstances) {
      // Criar uma cópia da imagem para o pool
      const img = new Image();
      img.onload = () => {
        pool.instances.push(img);
      };
      img.src = spriteImage.src;
    }
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

  updateLoadingProgress(percentage, text) {
    this.elements.loadingProgress.style.width = percentage + "%";
    this.elements.loadingText.textContent = text;
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
            this.addSpriteToPool(key, image);
        } else {
          // Carregar imagem normal
          const image = await this.loadImage(this.spriteUrls[key]);
          this.sprites[key] = image;
          
          // Adicionar ao pool de sprites
          this.addSpriteToPool(key, image);
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

  async loadAnimatedGif(url) {
    return new Promise((resolve, reject) => {
      // Criar múltiplas instâncias da imagem GIF para capturar diferentes frames
      const gifImages = [];
      const frameCount = 8; // Número de frames a capturar
      let loadedImages = 0;

      // Função para criar uma imagem com delay
      const createGifFrame = (index) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          gifImages[index] = img;
          loadedImages++;

          if (loadedImages === frameCount) {
            // Todas as imagens carregadas
            this.sprites.pudge = gifImages[0]; // Usar primeira como padrão
            this.gifFrames.pudge = gifImages;
            resolve(gifImages[0]);
          }
        };

        img.onerror = () => {
          // Se falhar, usar imagem simples
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            this.sprites.pudge = fallbackImg;
            resolve(fallbackImg);
          };
          fallbackImg.src = url;
        };

        // Adicionar timestamp único para forçar recarga e capturar diferentes momentos
        img.src = url + "?frame=" + index + "&t=" + Date.now();
      };

      // Criar múltiplas imagens com intervalos
      for (let i = 0; i < frameCount; i++) {
        setTimeout(() => createGifFrame(i), i * 100); // 100ms entre cada frame
      }
    });
  }

  createGifFrameSimulation(img) {
    if (this.gifFrames.pudge.length === 0) {
      this.gifFrames.pudge.push(img);
    }
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

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  showMainMenu() {
    this.elements.loadingScreen.style.display = "none";
    this.elements.menuOverlay.style.display = "flex";
    this.elements.controlsPanel.style.display = "flex";
    this.updateUI();
  }

  showMenuControls() {
    const controlsPanel = this.elements.controlsPanel;
    if (controlsPanel.style.display === "none") {
      controlsPanel.style.display = "flex";
    } else {
      controlsPanel.style.display = "none";
    }
  }

  bindEvents() {
    this.elements.startButton.addEventListener("click", () => this.startGame());
    this.elements.restartButton.addEventListener("click", () =>
      this.restartGame()
    );

    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    // document.addEventListener("keyup", (e) => this.handleKeyUp(e));

    // Touch support for mobile
    this.canvas.addEventListener("touchstart", (e) => {
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

  handleKeyDown(e) {
    e.preventDefault();

    switch (e.code) {
      case "Space":
        if (!this.gameState.gameOver && !this.gameState.paused) {
          this.jump();
        }
        break;
      case "KeyR":
        if (this.gameState.gameOver) {
          this.restartGame();
        }
        break;
      case "KeyP":
        if (this.gameState.started && !this.gameState.gameOver) {
          this.togglePause();
        }
        break;
      case "KeyM":
        if (this.gameState.started) {
          this.showMenuControls();
        }
        break;
    }
  }

  handleKeyUp(e) {
    // Handle key releases if needed
  }

  startGame() {
    this.gameState.started = true;
    this.gameState.paused = false;
    this.gameState.gameOver = false;
    this.hideAllOverlays();
    this.gameLoop();
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

  togglePause() {
    if (this.gameState.paused) {
      this.gameState.paused = false;
      this.elements.pauseOverlay.style.display = "none";
    } else {
      this.pauseGame();
    }
  }

  hideAllOverlays() {
    this.elements.menuOverlay.style.display = "none";
    this.elements.gameOverOverlay.style.display = "none";
    this.elements.pauseOverlay.style.display = "none";
  }

  jump() {
    if (this.pudge.grounded) {
      this.pudge.dy = this.config.JUMP_POWER;
      this.pudge.grounded = false;
      this.createJumpParticles();
    }
  }

  createJumpParticles() {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.pudge.x + this.pudge.width / 2,
        y: this.pudge.y + this.pudge.height,
        dx: (Math.random() - 0.5) * 4,
        dy: Math.random() * -3 - 1,
        life: 30,
        maxLife: 30,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
      });
    }
  }

  createCollisionParticles(x, y) {
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 8,
        dy: (Math.random() - 0.5) * 8,
        life: 40,
        maxLife: 40,
        color: `hsl(${Math.random() * 60}, 100%, 50%)`,
      });
    }
  }

  updateGame() {
    if (this.gameState.paused || this.gameState.gameOver) return;

    this.gameState.frame++;
    this.updatePudge();
    this.updateObstacles();
    this.updateParticles();
    this.updateBackground();
    this.updateDifficulty();
    this.updateUI();
  }

  updatePudge() {
    // Apply gravity
    this.pudge.dy += this.config.GRAVITY;
    this.pudge.y += this.pudge.dy;

    // Ground collision
    if (this.pudge.y + this.pudge.height >= this.config.GROUND_Y) {
      this.pudge.y = this.config.GROUND_Y - this.pudge.height;
      this.pudge.dy = 0;
      this.pudge.grounded = true;
    }

    // Animation (velocidade aumentada para GIF)
    this.pudge.animFrame += 0.3;

    // Atualizar frame do GIF animado
    this.updateGifAnimation();
  }

  updateGifAnimation() {
    // Atualizar frame do GIF baseado no tempo
    this.gifFrames.frameDelay++;

    const framesPerGameFrame = Math.floor(60 / this.gifFrames.frameRate); // 60 FPS do jogo

    if (this.gifFrames.frameDelay >= framesPerGameFrame) {
      this.gifFrames.frameDelay = 0;
      this.gifFrames.currentFrame =
        (this.gifFrames.currentFrame + 1) % this.gifFrames.pudge.length;
    }
  }

  updateObstacles() {
    // Spawn obstacles
    if (this.gameState.frame % this.gameState.spawnRate === 0) {
      this.spawnObstacle();
    }

    // Update existing obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.x -= this.gameState.speed;

      // Check collision
      if (this.isColliding(this.pudge, obstacle)) {
        this.createCollisionParticles(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2
        );
        this.gameOver();
        return;
      }

      // Remove off-screen obstacles and award points
      if (obstacle.x + obstacle.width < 0) {
        this.obstacles.splice(i, 1);
        this.gameState.score += 10;
      }
    }
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
        element.x = this.canvas.width + 10;
      }
    });
  }

  updateDifficulty() {
    const newLevel = Math.floor(this.gameState.score / 100) + 1;
    if (
      newLevel !== this.gameState.level &&
      newLevel <= this.config.LEVELS.length
    ) {
      this.gameState.level = newLevel;
      const levelConfig = this.config.LEVELS[newLevel - 1];
      this.gameState.speed = levelConfig.speed;
      this.gameState.spawnRate = levelConfig.spawnRate;
    }
  }

  spawnObstacle() {
    const types = ["boss", "meepo", "ghost", "mad", "spoon"];
    const configs = {
      boss: { width: 80, height: 80, color: "#ff4444" },
      meepo: { width: 70, height: 70, color: "#44ff44" },
      ghost: { width: 70, height: 90, color: "#4444ff" },
      mad: { width: 75, height: 75, color: "#ff44ff" },
      spoon: { width: 50, height: 80, color: "#ffff44" },
    };

    // Decide se vai spawnar 1 ou 2 obstáculos
    const spawnCount = Math.random() < 0.7 ? 1 : 2;

    // Espaço mínimo entre obstáculos para garantir pulo
    const minGap = 125;
    const maxGap = 225;

    // Posição inicial do primeiro obstáculo
    let baseX = this.canvas.width;

    // Gerar tipos diferentes para cada obstáculo
    let usedTypes = [];
    for (let i = 0; i < spawnCount; i++) {
      // Escolher tipo não repetido
      let type;
      do {
        type = types[Math.floor(Math.random() * types.length)];
      } while (usedTypes.includes(type) && usedTypes.length < types.length);
      usedTypes.push(type);

      const config = configs[type];
      // Calcular posição X do obstáculo
      let x = baseX;
      if (i > 0) {
        // Espaço entre obstáculos
        const gap = Math.floor(Math.random() * (maxGap - minGap)) + minGap;
        x += gap;
      }

      const obstacle = {
        x: x,
        y: this.config.GROUND_Y - config.height,
        width: config.width,
        height: config.height,
        type: type,
        color: config.color,
        animOffset: Math.random() * Math.PI * 2,
      };
      this.obstacles.push(obstacle);
      // Atualizar baseX para o próximo obstáculo
      baseX = x + config.width;
    }
  }

  isColliding(rect1, rect2) {
    // Ajustar padding baseado no tamanho do herói para uma hitbox mais precisa
    // Com herói de 120x120, usamos um padding proporcional para que a hitbox seja mais próxima da imagem visual
    const padding = 20; // Ajustado de 30 para 20 pixels (proporcional ao novo tamanho)
    return (
      rect1.x + padding < rect2.x + rect2.width - padding &&
      rect1.x + rect1.width - padding > rect2.x + padding &&
      rect1.y + padding < rect2.y + rect2.height - padding &&
      rect1.y + rect1.height - padding > rect2.y + padding
    );
  }

  gameOver() {
    this.gameState.gameOver = true;
    this.saveBestScore();
    this.elements.finalScore.textContent = `Pontuação Final: ${this.gameState.score}`;
    this.elements.gameOverOverlay.style.display = "flex";
  }

  render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();
    this.drawBackgroundElements();

    // Draw ground
    this.drawGround();

    // Draw game objects
    this.drawPudge();
    this.drawObstacles();
    this.drawParticles();

    // Draw effects
    this.drawScreenEffects();
  }

  drawBackground() {
    // Animated gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    const time = this.gameState.frame * 0.01;

    gradient.addColorStop(0, `hsl(${220 + Math.sin(time) * 10}, 30%, 15%)`);
    gradient.addColorStop(0.5, `hsl(${210 + Math.cos(time) * 10}, 25%, 10%)`);
    gradient.addColorStop(
      1,
      `hsl(${200 + Math.sin(time * 0.7) * 10}, 20%, 5%)`
    );

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackgroundElements() {
    this.backgroundElements.forEach((element) => {
      this.ctx.save();
      this.ctx.globalAlpha = element.opacity;
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(element.x, element.y, element.size, element.size);
      this.ctx.restore();
    });
  }

  drawGround() {
    // Ground with texture
    const groundHeight = this.canvas.height - this.config.GROUND_Y;

    // Main ground
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, this.config.GROUND_Y, this.canvas.width, groundHeight);

    // Ground surface
    this.ctx.fillStyle = "#333333";
    this.ctx.fillRect(0, this.config.GROUND_Y, this.canvas.width, 4);

    // Ground pattern
    this.ctx.strokeStyle = "#404040";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.config.GROUND_Y + 4);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
  }

  drawPudge() {
    // Usar frame atual do GIF se disponível, senão usar sprite do pool
    const gifFrames = this.gifFrames.pudge;
    const currentFrameIndex = this.gifFrames.currentFrame;
    let sprite;
    
    if (gifFrames.length > 0 && gifFrames[currentFrameIndex]) {
      sprite = gifFrames[currentFrameIndex];
    } else {
      // Usar sprite do pool para variação
      sprite = this.getSpriteFromPool('pudge');
    }

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Draw animated GIF sprite
      this.ctx.save();

      // Bounce animation when running
      const bounceOffset = this.pudge.grounded
        ? Math.sin(this.pudge.animFrame) * 2
        : 0;

      // Calcular posição para que a imagem fique na parte inferior do box
      const imageAspectRatio = sprite.naturalWidth / sprite.naturalHeight;
      let drawWidth = this.pudge.width;
      let drawHeight = this.pudge.width / imageAspectRatio;

      // Se a altura calculada for maior que o box, ajustar pela altura
      if (drawHeight > this.pudge.height) {
        drawHeight = this.pudge.height;
        drawWidth = this.pudge.height * imageAspectRatio;
      }

      // Posicionar a imagem na parte inferior do box
      const drawX = this.pudge.x + (this.pudge.width - drawWidth) / 2;
      const drawY =
        this.pudge.y + (this.pudge.height - drawHeight) + bounceOffset;

      this.ctx.drawImage(sprite, drawX, drawY, drawWidth, drawHeight);

      this.ctx.restore();
    } else {
      // Enhanced fallback drawing
      this.drawPudgeFallback();
    }
  }

  drawPudgeFallback() {
    this.ctx.save();

    const bounceOffset = this.pudge.grounded
      ? Math.sin(this.pudge.animFrame) * 2
      : 0;
    const x = this.pudge.x;
    const y = this.pudge.y + bounceOffset;

    // Body
    this.ctx.fillStyle = "#8B4513";
    this.ctx.fillRect(x + 15, y + 20, 60, 50);

    // Head
    this.ctx.fillStyle = "#D2B48C";
    this.ctx.fillRect(x + 20, y, 50, 40);

    // Eyes
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(x + 25, y + 8, 8, 8);
    this.ctx.fillRect(x + 45, y + 8, 8, 8);

    // Mouth
    this.ctx.fillStyle = "#8B0000";
    this.ctx.fillRect(x + 30, y + 20, 20, 6);

    // Arms
    this.ctx.fillStyle = "#D2B48C";
    this.ctx.fillRect(x + 5, y + 25, 15, 30);
    this.ctx.fillRect(x + 70, y + 25, 15, 30);

    // Legs
    this.ctx.fillRect(x + 25, y + 65, 15, 25);
    this.ctx.fillRect(x + 50, y + 65, 15, 25);

    this.ctx.restore();
  }

  drawObstacles() {
    this.obstacles.forEach((obstacle) => {
      // Usar sprite do pool para variação e performance
      let sprite = this.getSpriteFromPool(obstacle.type);
      
      // Fallback para sprite original se pool não tiver
      if (!sprite) {
        sprite = this.sprites[obstacle.type];
      }

      if (sprite && sprite.complete && sprite.naturalWidth > 0) {
        // Animate obstacles with slight rotation
        this.ctx.save();
        const centerX = obstacle.x + obstacle.width / 2;
        const centerY = obstacle.y + obstacle.height / 2;

        this.ctx.translate(centerX, centerY);

        // inverter horizontalmente
        const shouldFlip = ["boss", "ghost", "spoon", "meepo"].includes(obstacle.type);
        if (shouldFlip) {
          this.ctx.scale(-1, 1);
        }

        this.ctx.rotate(
          Math.sin(this.gameState.frame * 0.1 + obstacle.animOffset) * 0.1
        );
        this.ctx.translate(-centerX, -centerY);

        // Verificar se existe sprite pré-renderizado para melhor performance
        const preRenderedKey = `${obstacle.type}_${obstacle.width}x${obstacle.height}`;
        const preRendered = this.preRenderedSprites && this.preRenderedSprites[preRenderedKey];
        
        if (preRendered && preRendered.canvas) {
          this.ctx.drawImage(
            preRendered.canvas,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
        } else {
          this.ctx.drawImage(
            sprite,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
        }
        
        this.ctx.restore();
      } else {
        this.drawObstacleFallback(obstacle);
      }
    });
  }

  drawObstacleFallback(obstacle) {
    this.ctx.save();

    // Usar a cor configurada para o tipo de obstáculo
    this.ctx.fillStyle = obstacle.color;

    switch (obstacle.type) {
      case "boss":
        // Desenhar um boss (retângulo com detalhes)
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
        this.ctx.fillStyle = "#aa0000";
        this.ctx.fillRect(
          obstacle.x + 10,
          obstacle.y + 10,
          obstacle.width - 20,
          obstacle.height - 20
        );
        break;

      case "meepo":
        // Desenhar um meepo (círculo)
        this.ctx.beginPath();
        this.ctx.arc(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width / 2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
        break;

      case "ghost":
        // Desenhar um fantasma (forma ondulada)
        this.ctx.beginPath();
        this.ctx.arc(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 3,
          obstacle.width / 2,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
        // Base ondulada
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y + obstacle.height / 2,
          obstacle.width,
          obstacle.height / 2
        );
        break;

      case "mad":
        // Desenhar um personagem irritado (quadrado com spikes)
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
        // Spikes
        this.ctx.fillStyle = "#cc0066";
        for (let i = 0; i < 3; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(obstacle.x + (i * obstacle.width) / 3, obstacle.y);
          this.ctx.lineTo(
            obstacle.x + (i * obstacle.width) / 3 + obstacle.width / 6,
            obstacle.y - 10
          );
          this.ctx.lineTo(
            obstacle.x + ((i + 1) * obstacle.width) / 3,
            obstacle.y
          );
          this.ctx.fill();
        }
        break;

      case "spoon":
        // Desenhar uma colher (retângulo longo)
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
        // Cabo da colher
        this.ctx.fillStyle = "#cccc00";
        this.ctx.fillRect(
          obstacle.x + obstacle.width / 4,
          obstacle.y + obstacle.height - 20,
          obstacle.width / 2,
          15
        );
        break;

      default:
        // Fallback genérico
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y,
          obstacle.width,
          obstacle.height
        );
    }

    this.ctx.restore();
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.save();

      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;

      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  drawScreenEffects() {
    if (this.gameState.gameOver) {
      // Screen shake effect
      this.ctx.save();
      this.ctx.globalAlpha = 0.1;
      this.ctx.fillStyle = "#ff0000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }

    // Speed lines for high speed
    if (this.gameState.speed > 7) {
      this.ctx.save();
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      this.ctx.lineWidth = 2;

      for (let i = 0; i < 10; i++) {
        const y =
          (this.gameState.frame * (this.gameState.speed - 5) * 2 + i * 40) %
          this.canvas.height;
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(50, y);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }
  }

  updateUI() {
    this.elements.currentScore.textContent = this.gameState.score;
    this.elements.currentLevel.textContent = this.gameState.level;
    this.elements.bestScore.textContent = this.getBestScore();
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

  gameLoop() {
    if (!this.gameState.started) return;

    this.updateGame();
    this.render();

    if (!this.gameState.gameOver) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PudgeRunner();
});

// Start immediately if DOM is already loaded
if (document.readyState === "loading") {
  // DOM not ready yet
} else {
  new PudgeRunner();
}
