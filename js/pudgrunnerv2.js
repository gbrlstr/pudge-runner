// Canvas setup
const canvas = document.getElementById("gameCanvas");
// Otimização de Canvas
const ctx = canvas.getContext("2d", { alpha: false });

// Detecta mobile
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Enhanced Mobile scale factor for better visual consistency
function getMobileScaleFactor() {
  if (!isMobile()) return 1;
  
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const minDimension = Math.min(screenWidth, screenHeight);
  const aspectRatio = Math.max(screenWidth, screenHeight) / minDimension;
  
  // Better scaling based on device characteristics
  if (minDimension <= 360) return 0.6;  // Very small devices
  if (minDimension <= 375) return 0.65; // iPhone SE and smaller
  if (minDimension <= 414) return 0.7;  // Standard phones
  if (minDimension <= 480) return 0.75; // Large phones/small tablets
  if (aspectRatio > 2.0) return 0.7;    // Very tall screens
  return 0.8; // Larger mobile devices
}

// Enhanced responsive canvas with better proportions
function setResponsiveCanvas() {
  if (isMobile()) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleFactor = getMobileScaleFactor();
    
    console.log("📱 Mobile canvas resize:", { vw, vh });
    
    // Calculate optimal dimensions prioritizing gameplay visibility
    const isLandscape = vw > vh;
    
    if (isLandscape) {
      // Landscape mode - maximize canvas size for better gameplay
      let maxWidth, maxHeight;
      
      // Special handling for very small screens (iPhone SE)
      if (vh <= 375) {
        maxWidth = Math.min(vw * 0.95, vh * 2.2);
        maxHeight = Math.min(vh * 0.85, vw / 1.5);
      } else {
        maxWidth = Math.min(vw * 0.98, vh * 2.5);
        maxHeight = Math.min(vh * 0.90, vw / 1.4);
      }
      
      canvas.width = Math.max(500, Math.min(maxWidth, 1200));
      canvas.height = Math.max(280, Math.min(maxHeight, 600));
    } else {
      // Portrait mode - mobile-friendly proportions but much larger
      const maxWidth = Math.min(vw * 0.98, vh * 1.2);
      const maxHeight = Math.min(vh * 0.65, vw / 0.9);
      
      canvas.width = Math.max(600, Math.min(maxWidth, 900));
      canvas.height = Math.max(400, Math.min(maxHeight, 600));
    }
    
    // Ensure good aspect ratio for gameplay (not too wide, not too narrow)
    if (canvas.width / canvas.height < 1.3) {
      canvas.height = canvas.width / 1.4;
    }
    if (canvas.width / canvas.height > 2.1) {
      canvas.width = canvas.height * 2.0;
    }
    
    console.log("📐 Canvas dimensions:", { 
      width: canvas.width, 
      height: canvas.height, 
      aspectRatio: canvas.width / canvas.height 
    });
    
    // Don't override CSS dimensions - let CSS handle the visual size
    // canvas.style.width and height will be handled by CSS
    
    // Apply performance optimizations for mobile
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'low';
  } else {
    // Desktop/web configuration
    canvas.width = 1500;
    canvas.height = 500;
    // For desktop, we can set CSS dimensions
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  
  // Update game dimensions if game exists
  if (window.game) {
    window.game.updateDimensions(canvas.width, canvas.height);
  }
}

// Initial setup
setResponsiveCanvas();

// Responsive event listeners
function handleResize() {
  setResponsiveCanvas();
}

function handleOrientationChange() {
  // Delay to ensure viewport has updated
  setTimeout(() => {
    setResponsiveCanvas();
  }, 100);
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('DOMContentLoaded', setResponsiveCanvas);

// Make function available globally for HTML callback
window.setResponsiveCanvas = setResponsiveCanvas;


ctx.imageSmoothingEnabled = false;

// Dirty Rectangles
let dirtyRects = [];
function markDirty(x, y, w, h) {
  dirtyRects.push({x, y, w, h});
}
function renderDirtyRects(ctx) {
  dirtyRects.forEach(rect => {
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    game.draw(ctx);
    game.player.draw(ctx);
    game.enemies.forEach(enemy => enemy.draw(ctx));
  });
  dirtyRects = [];
}

// Lazy Loading de Assets
function lazyLoadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

import { saveScore, getTopScores } from "./firebase-rank.js";

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
      // Parallax layers
      this.parallaxLayers = [];
      this.initializeElements();
      this.initializeConfig();
      this.initializeGameState();
      this.spritePool = {};
      this.canvasPool = {};
      this.preRenderedSprites = {};
      this.playerNickname = localStorage.getItem("pudgeRunnerPlayerName") || '';

      // --- Sound ---
      this.bgMusic = null;
      this.killSound = null;

      this.groundImage = null;

      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.initializePools();
      this.startLoadingSequence();
      this.playerFrames = [];
      this.mobFrames = {
        boss: [],
        meepo: [],
        ghost: [],
        mad: [],
        spoon: []
      };
      this.playerFrameIndex = 0;
      this.playerFrameDelay = 0;
      this.mobFrameIndex = {};
      this.mobFrameDelay = {};
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
      nicknameOverlay: document.getElementById('nicknameOverlay'),
      menuOverlay: document.getElementById('menuOverlay'),
      gameOverOverlay: document.getElementById('gameOverOverlay'),
      pauseOverlay: document.getElementById('pauseOverlay'),
      nicknameInput: document.getElementById('nicknameInput'),
      nicknameConfirmButton: document.getElementById('nicknameConfirmButton'),
      globalRankingContainer: document.getElementById("globalRankingContainer"),
      playerNameCenter: document.getElementById("playerNameCenter"),
      statsDetails: document.getElementById("statsDetails"),
      comboValue: document.getElementById("comboValue"),
      multiplierValue: document.getElementById("multiplierValue"),
      jumpsValue: document.getElementById("jumpsValue"),
      dodgesValue: document.getElementById("dodgesValue"),
      collisionsValue: document.getElementById("collisionsValue"),
      playTimeValue: document.getElementById("playTimeValue")
    };
  }
  initializeConfig() {
    // Mobile responsive config adjustments
    const mobileScale = getMobileScaleFactor();
    const groundOffset = isMobile() ? 40 * mobileScale : 50;
    const jumpPower = isMobile() ? -14 * mobileScale : -16;
    const baseSpeed = isMobile() ? 4 * mobileScale : 5;
    
    this.config = {
      GROUND_Y: this.height - groundOffset,
      JUMP_POWER: jumpPower,
      BASE_SPEED: baseSpeed,
      OBSTACLE_SPAWN_RATE: isMobile() ? 140 : 120, // Slower spawn on mobile
      PARTICLE_COUNT: isMobile() ? 50 : 100, // Fewer particles on mobile
      LEVELS: [
        { speed: baseSpeed, spawnRate: 140, name: "Iniciante" },
        { speed: baseSpeed * 1.2, spawnRate: 130, name: "Fácil" },
        { speed: baseSpeed * 1.4, spawnRate: 120, name: "Normal" },
        { speed: baseSpeed * 1.6, spawnRate: 110, name: "Difícil" },
        { speed: baseSpeed * 1.8, spawnRate: 100, name: "Expert" },
        { speed: baseSpeed * 2, spawnRate: 90, name: "Insano" },
      ],
    };
    this.spriteUrls = {
      pudge: "../assets/imgs/pudg.gif",
      boss: "../assets/imgs/boss.gif",
      meepo: "../assets/imgs/meepo.gif",
      ghost: "../assets/imgs/ghost.gif",
      mad: "../assets/imgs/mad.gif",
      spoon: "../assets/imgs/spoon.gif",
    };
    this.sprites = {
      pudge: null,
      boss: null,
      meepo: null,
      ghost: null,
      mad: null,
      spoon: null,
    };

    this.voiceLines = {
      respawn: [
        "../assets/sounds/pudge_respawn_01.mpeg",
        "../assets/sounds/pudge_respawn_02.mpeg",
        "../assets/sounds/pudge_respawn_03.mpeg",
        "../assets/sounds/pudge_respawn_04.mpeg",
        "../assets/sounds/pudge_respawn_05.mpeg",
        "../assets/sounds/pudge_respawn_06.mpeg",
        "../assets/sounds/pudge_respawn_07.mpeg"
      ],
      jump: [
        "../assets/sounds/pudge_jump_01.mpeg",
        "../assets/sounds/pudge_jump_02.mpeg",
        "../assets/sounds/pudge_jump_03.mpeg",
        "../assets/sounds/pudge_jump_04.mpeg"
      ],
      levelup: [
        "../assets/sounds/pudge_levelup_01.mpeg",
        "../assets/sounds/pudge_levelup_02.mpeg",
        "../assets/sounds/pudge_levelup_03.mpeg",
        "../assets/sounds/pudge_levelup_04.mpeg",
        "../assets/sounds/pudge_levelup_05.mpeg"
      ],
      lose: [
        "../assets/sounds/pudge_lose_01.mpeg",
        "../assets/sounds/pudge_lose_02.mpeg",
        "../assets/sounds/pudge_lose_03.mpeg",
        "../assets/sounds/pudge_lose_04.mpeg",
        "../assets/sounds/pudge_lose_05.mpeg",
        "../assets/sounds/pudge_lose_06.mpeg"
      ]
    };
  }

  // Add method to update dimensions when canvas is resized
  updateDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.initializeConfig(); // Reinitialize config with new dimensions
    
    // Update player position if it exists
    if (this.player) {
      this.player.groundY = this.config.GROUND_Y;
      // Ensure player stays on ground
      if (this.player.y > this.config.GROUND_Y) {
        this.player.y = this.config.GROUND_Y;
      }
    }
    
    // Update parallax layers for new dimensions
    if (this.parallaxLayers && this.parallaxLayers.length > 0) {
      this.parallaxLayers.forEach(layer => {
        if (layer) {
          layer.width = width;
          layer.height = height;
        }
      });
    }
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
      combo: 0, // Combo/Multiplier
      multiplier: 1, // Combo/Multiplier
      startTime: 0, // Track when game actually started
      stats: { // Estatísticas Detalhadas
        jumps: 0,
        perfectDodges: 0,
        collisions: 0,
        playTime: 0,
        enemiesSpawned: 0,
        enemiesDodged: 0,
      }
    };
    this.enemies = [];
    this.particles = [];
    this.backgroundElements = [];
    this.loadBestScore();
    this.initializeBackground();
    this.initializeParallaxLayers();
  }
  initializeParallaxLayers() {
    // Mobile responsive parallax optimization
    const isMobileDevice = isMobile();
    
    // Better mobile parallax - keep more layers but adjust speeds
    const layerConfigs = isMobileDevice ? [
      { src: "../assets/imgs/background/plx-2.png", speed: 0.15 },
      { src: "../assets/imgs/background/plx-3.png", speed: 0.35 },
      { src: "../assets/imgs/background/plx-4.png", speed: 0.6 },
      { src: "../assets/imgs/background/plx-5.png", speed: 0.9 },
    ] : [
      { src: "../assets/imgs/background/plx-2.png", speed: 0.2 },
      { src: "../assets/imgs/background/plx-3.png", speed: 0.4 },
      { src: "../assets/imgs/background/plx-4.png", speed: 0.7 },
      { src: "../assets/imgs/background/plx-5.png", speed: 1.1 }
    ];
    
    this.parallaxLayers = layerConfigs.map(cfg => ({
      img: null,
      src: cfg.src,
      speed: cfg.speed,
      x: 0,
      loaded: false
    }));
    
    // Carregar imagens com melhor controle de erro
    this.parallaxLayers.forEach((layer, index) => {
      lazyLoadImage(layer.src).then(img => { 
        layer.img = img;
        layer.loaded = true;
        
        // Otimizar apenas imagens muito grandes no mobile
        if (isMobileDevice && img.width > 1200) {
          // Criar uma versão redimensionada para mobile
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const scaleFactor = 0.8; // Menos agressivo
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Substituir a imagem original pela versão otimizada
          const optimizedImg = new Image();
          optimizedImg.onload = () => { 
            layer.img = optimizedImg;
            layer.loaded = true;
          };
          optimizedImg.src = canvas.toDataURL('image/jpeg', 0.85); // Melhor qualidade
        }
      }).catch(error => {
        console.warn(`Erro ao carregar parallax layer ${index}:`, error);
        // Manter a layer mas marcar como não carregada
        layer.loaded = false;
      });
    });
  }
  initializeBackground() {
  // Mobile responsive background adjustments
  const mobileScale = getMobileScaleFactor();
  const isMobileDevice = isMobile();
  
  // Reduce background elements on mobile for better performance
  const starCount = isMobileDevice ? 16 : 32;
  const planetCount = isMobileDevice ? 4 : 7;
  const nebulaCount = isMobileDevice ? 3 : 6;
  
  // Estrelas pequenas
  for (let i = 0; i < starCount; i++) {
      this.backgroundElements.push({
        x: Math.random() * this.width * 2,
        y: Math.random() * (this.config.GROUND_Y - (isMobileDevice ? 80 : 120)),
        size: (Math.random() * 1.2 + 0.3) * mobileScale,
        speed: Math.random() * 0.3 + 0.08,
        opacity: Math.random() * 0.5 + 0.3,
        type: 'star'
      });
    }
  // Planetas
  for (let i = 0; i < planetCount; i++) {
      this.backgroundElements.push({
        x: Math.random() * this.width * 2,
        y: Math.random() * (this.config.GROUND_Y - (isMobileDevice ? 120 : 180)) + (isMobileDevice ? 30 : 40),
        size: (Math.random() * 1.5 + 2.2) * mobileScale,
        speed: Math.random() * 0.18 + 0.08,
        opacity: Math.random() * 0.3 + 0.2,
        type: 'planet'
      });
    }
  // Nebulosas
  for (let i = 0; i < nebulaCount; i++) {
      this.backgroundElements.push({
        x: Math.random() * this.width * 2,
        y: Math.random() * (this.config.GROUND_Y - (isMobileDevice ? 140 : 200)) + (isMobileDevice ? 40 : 60),
        size: (Math.random() * 2.5 + 2.5) * mobileScale,
        speed: Math.random() * 0.12 + 0.05,
        opacity: Math.random() * 0.25 + 0.15,
        type: 'nebula'
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
    this.preCreateCanvasPool();
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
    console.log("🎮 Starting game...");
    this.gameState.started = true;
    this.gameState.paused = false;
    this.gameState.gameOver = false;
    this.gameState.startTime = Date.now(); // Record when game actually started
    console.log("🎮 Game started at:", this.gameState.startTime, "Document hidden:", document.hidden);
    this.bgMusic.play();
    this.playVoice("respawn");
    this.hideAllOverlays();
  }
  restartGame() {
    this.clearPools();
    this.enemies = [];
    this.particles = [];
    this.elements.globalRankingContainer.innerHTML = '';
    this.initializeGameState();
    this.loadBestScore();
    this.startGame();
  }
  pauseGame() {
    console.log("⏸️ Pausing game - called from:", new Error().stack);
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
    console.log("🙈 Hiding all overlays...");
    this.elements.menuOverlay.style.display = "none";
    this.elements.gameOverOverlay.style.display = "none";
    this.elements.pauseOverlay.style.display = "none";
    console.log("🙈 All overlays hidden. PauseOverlay display:", this.elements.pauseOverlay.style.display);
  }
  async startLoadingSequence() {
    // Defina as etapas do loading
    const steps = [
      { fn: async () => await this.delay(500), text: "Inicializando..." },
      { fn: async () => await this.loadAudioAssets(), text: "Carregando sons..." },
      { fn: async () => await this.delay(200), text: "Preparando sons..." },
      { fn: async () => await this.loadPlayerFrames(), text: "Carregando animações do jogador..." },
      { fn: async () => await this.loadMobFrames(), text: "Carregando animações dos mobs..." },
      { fn: async () => await this.delay(200), text: "Preparando sprites..." },
      { fn: async () => await this.loadAssets(), text: "Carregando sprites..." },
      { fn: async () => await this.delay(200), text: "Preparando jogo..." },
      { fn: async () => {}, text: "Finalizando..." },
      { fn: async () => await this.delay(500), text: "Finalizando..." }
    ];
    const totalSteps = steps.length;
    for (let i = 0; i < totalSteps; i++) {
      const percent = Math.round((i / totalSteps) * 100);
      this.updateLoadingProgress(percent, steps[i].text);
      await steps[i].fn();
    }
    this.updateLoadingProgress(100, "Concluído!");
    this.showMainMenu();
    // Tentar tocar bgMusic após assets carregados e menu exibido
    if (this.bgMusic) {
      this.bgMusic.play().catch(() => {
        document.body.addEventListener('click', () => {
          this.bgMusic.play();
        }, { once: true });
      });
    }
  }
  async loadAudioAssets() {
    // Carregar música de fundo
    this.bgMusic = new Audio('../assets/sounds/background.mp3');
    this.bgMusic.loop = false;
    this.bgMusic.volume = 0.5;
    this.bgMusic.loopStart = 12;
    this.bgMusic.loopEnd = 25;
    this.bgMusic.addEventListener('timeupdate', () => {
      if (this.bgMusic.currentTime >= this.bgMusic.loopEnd) {
        this.bgMusic.currentTime = this.bgMusic.loopStart;
        this.bgMusic.play();
      }
    });
    // Fallback: continua após 1.5s se não carregar
    await new Promise((resolve) => {
      let resolved = false;
      const onReady = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      this.bgMusic.addEventListener('canplaythrough', onReady, { once: true });
      this.bgMusic.addEventListener('error', onReady, { once: true });
      setTimeout(onReady, 1500); // Fallback para mobile
    });

    // Carregar efeito de kill
    this.killSound = new Audio('../assets/sounds/kill.ogg');
    this.killSound.volume = 0.7;
    await new Promise((resolve) => {
      let resolved = false;
      const onReady = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };
      this.killSound.addEventListener('canplaythrough', onReady, { once: true });
      this.killSound.addEventListener('error', onReady, { once: true });
      setTimeout(onReady, 1000); // Fallback para mobile
    });
    await this.delay(200);
  }
  async loadAssets() {
    const spriteKeys = Object.keys(this.spriteUrls);
    for (const key of spriteKeys) {
      try {
        // Lazy loading de sprites
        const image = await lazyLoadImage(this.spriteUrls[key]);
        this.sprites[key] = image;
        this.player.addSpriteToPool(key, image);
      } catch (error) {
        console.warn(`Falha ao carregar sprite ${key}:`, error);
        this.sprites[key] = null;
      }
    }
    this.groundImage = await lazyLoadImage("../assets/imgs/ground.png");
    this.gameState.assetsLoaded = true;
    this.preRenderCommonSprites();
    
    // Force canvas resize after assets are loaded
    setTimeout(() => {
      if (window.setResponsiveCanvas) {
        console.log("🔄 Forcing canvas resize after assets load");
        window.setResponsiveCanvas();
      }
    }, 100);
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
    // Mobile responsive sprite sizes
    const mobileScale = getMobileScaleFactor();
    const baseScale = isMobile() ? 0.8 : 1;
    
    // Pré-renderizar sprites de obstáculos nos tamanhos mais comuns
    const commonSizes = [
      { width: Math.floor(70 * baseScale * mobileScale), height: Math.floor(70 * baseScale * mobileScale) }, // meepo
      { width: Math.floor(80 * baseScale * mobileScale), height: Math.floor(80 * baseScale * mobileScale) }, // boss
      { width: Math.floor(70 * baseScale * mobileScale), height: Math.floor(90 * baseScale * mobileScale) }, // ghost
      { width: Math.floor(75 * baseScale * mobileScale), height: Math.floor(75 * baseScale * mobileScale) }, // mad
      { width: Math.floor(50 * baseScale * mobileScale), height: Math.floor(80 * baseScale * mobileScale) }, // spoon
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
    if (!this.playerNickname || this.playerNickname.length < 3) {
      this.elements.loadingScreen.style.display = "none";
      this.showNicknameOverlay();
      this.setupNicknameInput();
    } else {
      this.elements.loadingScreen.style.display = "none";
      this.elements.nicknameOverlay.style.display = "none";
      this.elements.menuOverlay.style.display = "flex";
      this.elements.controlsPanel.style.display = "flex";
      this.updateUI();
    }
  }
  updateUI() {
    this.elements.currentScore.textContent = this.gameState.score;
    this.elements.currentLevel.textContent = this.gameState.level;
    this.elements.bestScore.textContent = this.getBestScore();
    if (this.elements.playerNameCenter) {
      this.elements.playerNameCenter.textContent = this.playerNickname || localStorage.getItem("pudgeRunnerPlayerName") || "";
    }
    // Atualiza estatísticas detalhadas e combo/multiplier na UI
    if (this.elements.statsDetails) {
      this.elements.comboValue.textContent = this.gameState.combo;
      this.elements.multiplierValue.textContent = 'x' + this.gameState.multiplier;
      this.elements.jumpsValue.textContent = this.gameState.stats.jumps;
      this.elements.dodgesValue.textContent = this.gameState.stats.enemiesDodged;
      this.elements.collisionsValue.textContent = this.gameState.stats.collisions;
      this.elements.playTimeValue.textContent = this.gameState.stats.playTime.toFixed(1) + 's';
    }
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
  update(deltaTime) {
    if (this.gameState.paused || this.gameState.gameOver) return;

    if (this.gameState.started && !this.gameState.gameOver) {
      this.gameState.frame++;
      this.gameState.stats.playTime += (deltaTime || 16.6) / 1000; // segundos

      // Update player
      this.player.update();

      // Update enemies
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        // Corrigir movimento dos inimigos para usar speedX
        enemy.x += enemy.speedX;

        // Pontuação e Combo/Multiplier
        if (enemy.x < this.player.x && !enemy.passed) {
          this.gameState.combo++;
          if (this.gameState.combo >= 5) {
            this.gameState.multiplier = Math.min(5, 1 + Math.floor(this.gameState.combo / 5));
          }
          this.gameState.score += 10 * this.gameState.multiplier;
          enemy.passed = true;
          this.gameState.stats.enemiesDodged++;
          this.createScoreParticles(enemy.x + enemy.width / 2, enemy.y - this.player.height / 2);
          // Tocar som de kill
          if (this.killSound) {
            this.killSound.currentTime = 0;
            this.killSound.play();
          }
          if(this.gameState.score % 100 === 0) {
            this.playVoice("levelup");
          }
        }

        // Remoção
        if (enemy.x + enemy.width < 0) {
          this.enemies.splice(i, 1);
          continue;
        }

        // Colisão
        if (this.isColliding(this.player, enemy)) {
          this.gameState.stats.collisions++;
          this.gameState.combo = 0;
          this.gameState.multiplier = 1;
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
        this.gameState.stats.enemiesSpawned++;
        this.enemySpawnRate = 180 + Math.floor(Math.random() * 70);
      }
      
      this.updateParticles();
      this.updateBackground();
      this.updateDifficulty();
      this.updateUI();
    }
  }
  draw(context) {
    // Dirty Rectangles: se houver regiões sujas, renderize apenas elas
    if (dirtyRects.length > 0) {
      renderDirtyRects(context);
    } else {
      context.clearRect(0, 0, this.width, this.height);
      this.drawBackgroundElements(context);
      this.drawBackground(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.drawGround(context);
      this.drawParticles(context);
      this.drawScreenEffects(context);
    }
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
  showNicknameOverlay() {
    this.elements.menuOverlay.style.display = 'none';
    this.elements.nicknameOverlay.style.display = 'flex';
    this.elements.gameOverOverlay.style.display = 'none';
    this.elements.pauseOverlay.style.display = 'none';
  }
  hideNicknameOverlay() {
    this.elements.nicknameOverlay.style.display = 'none';
  }
  setupNicknameInput() {
    const input = this.elements.nicknameInput;
    const btn = this.elements.nicknameConfirmButton;
    input.value = '';
    
    // Função para confirmar nickname
    const confirmNickname = () => {
      const nick = input.value.trim();
      if (nick.length < 3) {
        input.style.borderColor = '#e53935';
        input.placeholder = 'Mínimo 3 letras';
        input.value = '';
        input.focus();
        return;
      }
      this.playerNickname = nick;
      localStorage.setItem("pudgeRunnerPlayerName", nick);
      this.hideNicknameOverlay();
      this.elements.menuOverlay.style.display = 'flex';
    };
    
    // Event listeners para click e touch
    btn.onclick = confirmNickname;
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      confirmNickname();
    });
    
    // Enter no input
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmNickname();
      }
    };
  }
  async gameOver() {
    this.gameState.gameOver = true;
    this.bgMusic.pause();
    this.saveBestScore();
    this.elements.finalScore.textContent = `Pontuação Final: ${this.gameState.score}`;
    this.playVoice("gameOver");
    
    // Salva score global no Firebase
      let playerName = this.playerNickname || localStorage.getItem("pudgeRunnerPlayerName");
    if (!playerName) {
      playerName = prompt("Digite seu nome para o ranking global:") || "Anônimo";
      localStorage.setItem("pudgeRunnerPlayerName", playerName);
    }
    try {
        await saveScore(this.playerNickname || playerName, this.gameState.score);
    } catch (e) {
      console.warn("Erro ao salvar score global:", e);
    }
    
    // Show game over overlay first
    this.elements.gameOverOverlay.style.display = "flex";
    
    // Clear and show ranking within the game over overlay
    this.elements.globalRankingContainer.innerHTML = '';
    this.showGlobalRanking();
  }
  playVoice(event) {
    const lines = this.voiceLines[event];
    if (!lines) return;
    const pick = lines[Math.floor(Math.random() * lines.length)];
    const audio = new Audio(pick);
    audio.play();
  }
  async showGlobalRanking() {
    if (!this.elements.finalScore) return;
    try {
      const scores = await getTopScores(10);
      const isMobileDevice = isMobile();
      const mobileScale = getMobileScaleFactor();
      
      // Mobile-responsive styling mais aprimorado
      const containerStyle = isMobileDevice ? `
        background: rgba(15, 20, 25, 0.95);
        border-radius: 12px;
        padding: ${Math.max(12, 16 * mobileScale)}px ${Math.max(16, 20 * mobileScale)}px;
        margin: ${Math.max(12, 16 * mobileScale)}px auto 0 auto;
        max-width: ${Math.min(320, 280 * mobileScale)}px;
        width: 85vw;
        box-shadow: 0 0 ${Math.max(15, 20 * mobileScale)}px 2px #ff5e7b44;
        text-align: center;
        border: 1px solid #ff5e7b33;
        backdrop-filter: blur(8px);
      ` : `
        background: rgba(15, 20, 25, 0.92);
        border-radius: 18px;
        padding: 24px 28px 16px 28px;
        margin: 20px auto 0 auto;
        max-width: 360px;
        box-shadow: 0 0 28px 3px #ff5e7b44;
        text-align: center;
        border: 1px solid #ff5e7b33;
        backdrop-filter: blur(10px);
      `;
      
      const titleStyle = isMobileDevice ? `
        color: #ff5e7b;
        font-size: ${Math.max(1.1, 1.3 * mobileScale)}em;
        font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
        margin-bottom: ${Math.max(6, 8 * mobileScale)}px;
        text-shadow: 0 0 8px #ff5e7b88;
        font-weight: 700;
      ` : `
        color: #ff5e7b;
        font-size: 1.9em;
        font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
        margin-bottom: 12px;
        text-shadow: 0 0 12px #ff5e7b88;
        font-weight: 700;
      `;
      
      const listStyle = isMobileDevice ? `
        color: #fff;
        font-size: ${Math.max(0.8, 0.85 * mobileScale)}em;
        font-family: 'Montserrat', Arial, sans-serif;
        margin: 0;
        padding-left: 0;
        list-style-position: inside;
        text-align: left;
        line-height: 1.4;
        font-weight: 500;
      ` : `
        color: #fff;
        font-size: 1.05em;
        font-family: 'Montserrat', Arial, sans-serif;
        margin: 0;
        padding-left: 0;
        list-style-position: inside;
        text-align: left;
        line-height: 1.5;
        font-weight: 500;
      `;
      
      let html = `
        <div class="global-ranking" style="${containerStyle}">
          <h3 style="${titleStyle}">🏆 Ranking Global</h3>
          <ol style="${listStyle}">
      `;
      
      scores.forEach((s, i) => {
        const marginBottom = isMobileDevice ? `${Math.max(3, 4 * mobileScale)}px` : '6px';
        const isFirst = i === 0;
        const isTop3 = i < 3;
        
        // Estilo especial para top 3
        let itemStyle = `margin-bottom: ${marginBottom};`;
        if (isFirst) {
          itemStyle += `font-weight: bold; color: #ffd700; font-size: ${isMobileDevice ? Math.max(1.05, 1.15 * mobileScale) : 1.2}em; text-shadow: 0 0 6px #ffd70088;`;
        } else if (isTop3) {
          itemStyle += `font-weight: 600; color: #ff5e7b; font-size: ${isMobileDevice ? Math.max(1.02, 1.08 * mobileScale) : 1.1}em;`;
        }
        
        const trophy = isFirst ? '🥇 ' : (i === 1 ? '🥈 ' : (i === 2 ? '🥉 ' : ''));
        
        html += `<li style="${itemStyle}">
          ${trophy}<span style="letter-spacing: 0.5px;">${s.name}</span>: 
          <span style="color: #ffe082; font-weight: 600;">${s.score}</span>
        </li>`;
      });
      
      html += `</ol></div>`;
      this.elements.globalRankingContainer.innerHTML += html;
      this.elements.globalRankingContainer.style.display = "block";
    } catch (e) {
      console.error('Erro ao carregar ranking:', e);
      this.elements.globalRankingContainer.innerHTML += `
        <div style="
          background: rgba(30, 30, 40, 0.9);
          border-radius: 8px;
          padding: 12px;
          margin: 12px auto;
          text-align: center;
          color: #ff6b6b;
          border: 1px solid #ff6b6b44;
        ">
          ⚠️ Erro ao carregar ranking global
        </div>
      `;
      this.elements.globalRankingContainer.style.display = "block";
    }
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
    // Parallax layers - optimized for mobile
    const isMobileDevice = isMobile();
    
    this.parallaxLayers.forEach((layer, index) => {
      if (layer.img && layer.loaded && layer.img.complete && layer.img.naturalWidth > 0) {
        let imgW = layer.img.width;
        let imgH = layer.img.height;
        
        // Scale images for mobile if needed
        if (isMobileDevice) {
          const mobileScale = getMobileScaleFactor();
          imgW *= Math.max(mobileScale, 0.7); // Mínimo 0.7 para manter visibilidade
          imgH *= Math.max(mobileScale, 0.7);
        }
        
        let y = 0;
        if (imgH < this.height) {
          y = this.height - imgH;
        }
        
        // Desenha a imagem em loop até cobrir toda a largura do canvas
        let x1 = layer.x % imgW;
        if (x1 > 0) x1 -= imgW; // Garantir cobertura completa
        
        for (let x = x1; x < this.width + imgW; x += imgW) {
          context.drawImage(layer.img, x, y, imgW, imgH);
        }
      }
    });
  }
  drawBackgroundElements(context) {
    // Background image (fallback) - optimized for mobile
    const isMobileDevice = isMobile();
    const mobileScale = getMobileScaleFactor();
    
    // Reduce gradient complexity on mobile for performance
    const gradient = context.createLinearGradient(0, 0, 0, this.height);
    const time = this.gameState.frame * (isMobileDevice ? 0.005 : 0.01); // Slower animation on mobile
    gradient.addColorStop(0, `hsl(${220 + Math.sin(time) * 10}, 30%, 15%)`);
    gradient.addColorStop(0.5, `hsl(${210 + Math.cos(time) * 10}, 25%, 10%)`);
    gradient.addColorStop(
      1,
      `hsl(${200 + Math.sin(time * 0.7) * 10}, 20%, 5%)`
    );
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.width, this.height);

    // Skip every other background element on very small screens for performance
    const skipElements = isMobileDevice && window.innerWidth < 400;
    
    this.backgroundElements.forEach((element, index) => {
      if (skipElements && index % 2 === 0) return; // Skip every other element on small screens
      
      context.save();
      context.globalAlpha = element.opacity * (isMobileDevice ? 0.8 : 1); // Slightly more transparent on mobile

      // Estrela (pequena) - scaled for mobile
      if (element.size < 2 * mobileScale) {
        context.beginPath();
        context.arc(element.x, element.y, element.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${element.opacity})`;
        context.shadowColor = '#fff';
        context.shadowBlur = 8 * element.opacity;
        context.fill();
      }
      // Planeta (maior)
      else if (element.size >= 2 && element.size < 4) {
        context.beginPath();
        context.arc(element.x, element.y, element.size * 1.5, 0, Math.PI * 2);
        context.fillStyle = `hsl(${180 + element.x % 60}, 60%, 40%)`;
        context.shadowColor = '#aaf';
        context.shadowBlur = 12 * element.opacity;
        context.fill();
        // Anel do planeta
        context.beginPath();
        context.ellipse(element.x, element.y, element.size * 2, element.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
        context.strokeStyle = `rgba(200,200,255,${element.opacity * 0.5})`;
        context.lineWidth = 1.2;
        context.stroke();
      }
      // Nebulosa ou brilho especial
      else {
        const grad = context.createRadialGradient(element.x, element.y, 0, element.x, element.y, element.size * 2.5);
        grad.addColorStop(0, `rgba(180,80,255,${element.opacity * 0.7})`);
        grad.addColorStop(0.5, `rgba(80,0,120,${element.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(0,0,0,0)`);
        context.beginPath();
        context.arc(element.x, element.y, element.size * 2.5, 0, Math.PI * 2);
        context.fillStyle = grad;
        context.fill();
      }
      context.restore();
    });
  }
  async drawGround(context) {
      const groundHeight = this.height - this.config.GROUND_Y;
      // image ground
      if (this.groundImage) {
        context.save();
        context.drawImage(this.groundImage, 0, this.config.GROUND_Y, this.width, groundHeight);
        context.restore();
      }

      // borda
      // context.fillStyle = "#333333";
      // context.fillRect(0, this.config.GROUND_Y, this.width, 4);
      // context.strokeStyle = "#404040";
      // context.lineWidth = 1;

      // for (let x = 0; x < this.width; x += 40) {
      //   context.beginPath();
      //   context.moveTo(x, this.config.GROUND_Y + 4);
      //   context.lineTo(x, this.height);
      //   context.stroke();
      // }
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
  updateBackground() {
    // Parallax das imagens
    this.parallaxLayers.forEach(layer => {
      if (layer.img && layer.loaded) {
        layer.x -= layer.speed * this.gameState.speed * 0.5; // Reduzir velocidade geral do parallax
        // Loop horizontal melhorado
        if (layer.x <= -layer.img.width) {
          layer.x = 0;
        }
      }
    });
    
    // Parallax dos elementos gerados
    this.backgroundElements.forEach((element) => {
      // Parallax: quanto maior, mais devagar
      const parallax = 0.5 + (1 - element.opacity) * 1.5 + (element.size / 5);
      element.x -= element.speed * parallax;
      if (element.x < -element.size) {
        // Recicla elemento para o lado direito, com nova altura/opacidade/tamanho
        element.x = this.width + Math.random() * 40;
        element.y = Math.random() * (this.config.GROUND_Y - 100);
        element.size = Math.random() * 3 + 1;
        element.speed = Math.random() * 0.5 + 0.1;
        element.opacity = Math.random() * 0.3 + 0.1;
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
  async loadPlayerFrames() {
    // pudge animation
    const frameCount = 7;
    for (let i = 0; i <= frameCount; i++) {
      try {
        const img = await this.loadImage(`../assets/imgs/pudge/pudge_frame_${i}.gif`);
        this.playerFrames.push(img);
      } catch (e) {
        break;
      }
    }
    // fallback
    if (this.playerFrames.length === 0 && this.sprites.pudge) {
      this.playerFrames.push(this.sprites.pudge);
    }
  }
  async loadMobFrames() {
    const mobList = ["boss", "meepo", "ghost", "mad", "spoon"];
    // Defina o número de frames para cada mob
    const mobFrameCounts = {
      boss: 8,
      meepo: 5,
      ghost: 7,
      mad: 3,
      spoon: 43
    };
    for (const mob of mobList) {
      this.mobFrames[mob] = [];
      const frameCount = mobFrameCounts[mob] !== undefined ? mobFrameCounts[mob] : 7;
      for (let i = 0; i <= frameCount; i++) {
        try {
          const img = await this.loadImage(`../assets/imgs/${mob}/${mob}_frame_${i}.png`);
          this.mobFrames[mob].push(img);
        } catch (e) {
          // Para de tentar se não encontrar o frame
          break;
        }
      }
      // fallback
      if (this.mobFrames[mob].length === 0 && this.sprites[mob]) {
        this.mobFrames[mob].push(this.sprites[mob]);
      }
      this.mobFrameIndex[mob] = 0;
      this.mobFrameDelay[mob] = 0;
    }
  }
}

 /**
 * Class representing the player
 */
class Player {
  constructor(game) {
    this.game = game;
    
    // Mobile responsive sizing
    const mobileScale = getMobileScaleFactor();
    const baseSize = isMobile() ? 100 : 130;
    
    this.width = baseSize * mobileScale;
    this.height = baseSize * mobileScale;
    this.x = 30 * mobileScale;
    this.y = 190 * mobileScale;
    this.dy = 0;
    this.speedX = 0;
    this.maxSpeed = isMobile() ? 8 * mobileScale : 10;
    this.gravity = isMobile() ? 0.9 : 1.1;
    this.jumpPower = isMobile() ? -14 * mobileScale : -16;
    this.animFrame = 0;
    this.onGround = false;
    this.groundY = this.game.config.GROUND_Y - (isMobile() ? 70 * mobileScale : 90);
    this.flipped = false;
    this.frameRate = 10; // frames por segundo
    this.frameDelay = 0;
    this.currentFrame = 0;
  }
  update() {
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

    // Atualiza posição do jogador
    this.x += this.speedX;
    
    // Apply gravity
    this.dy += this.gravity;
    this.y += this.dy;

    // Verifica colisão com o chão
    if (this.y + this.height >= this.game.config.GROUND_Y) {
      this.y = this.game.config.GROUND_Y - this.height;
      this.dy = 0;
      this.onGround = true;
    }

    this.animFrame += 0.3;

    // Limitar posição do jogador dentro da tela
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;

    // Limitar posição do jogador dentro da tela
    if (this.x + this.width > this.game.width)
      this.x = this.game.width - this.width;

    // Atualiza animação do player
    if (this.game.playerFrames.length > 1) {
      this.frameDelay++;
      if (this.frameDelay >= Math.floor(60 / this.frameRate)) {
        this.frameDelay = 0;
        this.currentFrame = (this.currentFrame + 1) % this.game.playerFrames.length;
      }
    }
  }
  jump() {
    if (this.onGround) {
      this.dy = this.game.config.JUMP_POWER;
      this.onGround = false;
      this.game.createJumpParticles(
        this.x + this.width / 2,
        this.y + this.height
      );
      // Estatísticas Detalhadas
      this.game.gameState.stats.jumps++;
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

/**
 * Class representing an enemy
 */
class Enemy {
  constructor(game) {
    this.game = game;
    this.x = this.game.width;
    this.speedX = -this.game.gameState.speed;
    this.passed = false;
    const types = ["boss", "ghost", "mad", "spoon", "meepo"];
    this.type = types[Math.floor(Math.random() * types.length)];
    this.frameRate = 10;
    this.frameDelay = 0;
    this.currentFrame = 0;
  }
  update() {
    this.x += this.speedX;
    // Atualiza animação do mob
    const frames = this.game.mobFrames[this.type];
    if (frames && frames.length > 1) {
      this.frameDelay++;
      if (this.frameDelay >= Math.floor(60 / this.frameRate)) {
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
      this.drawPudgeFallback(context);
    }
  }
  drawPudgeFallback(context) {
    context.save();

    const bounceOffset = this.game.player.onGround
      ? Math.sin(this.game.player.animFrame) * 2
      : 0;
    const x = this.game.player.x;
    const y = this.game.player.y + bounceOffset;

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

/**
 * Class representing an enemy angler
 */
class EnemyAngler extends Enemy {
  constructor(game) {
    super(game);
    
    // Mobile responsive sizing for enemies
    const mobileScale = getMobileScaleFactor();
    const baseSize = isMobile() ? 70 : 90;
    
    this.width = baseSize * mobileScale;
    this.height = baseSize * mobileScale;
    
    // Ajusta para alinhar o inimigo ao chão
    this.y = this.game.config.GROUND_Y - this.height;
    this.x = this.game.width;
  }
}

/**
 * Class representing the user interface
 */
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

/**
 * Class representing the input handler
 */
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
      const target = e.target;
      
      // Enhanced UI element detection to prevent accidental game actions
      if (target.closest('button') || 
          target.closest('input') || 
          target.closest('.menu-overlay') ||
          target.closest('.sound-toggle') ||
          target.closest('.mobile-panel-toggle') ||
          target.closest('.score-panel') ||
          target.closest('.stats-details') ||
          target.closest('.controls-panel') ||
          target.closest('#globalRankingContainer')) {
        return;
      }
      
      e.preventDefault();
      
      if (isMobile()) {
        // Single touch to jump - improved for mobile
        if (e.touches.length === 1) {
          // Só pular se o jogo estiver ativo
          if (this.game.gameState.started && !this.game.gameState.gameOver && !this.game.gameState.paused) {
            this.game.player.jump();
          }
        }
        // Two finger touch for pause/menu (only during game)
        else if (e.touches.length === 2 && this.game.gameState.started && !this.game.gameState.gameOver) {
          this.game.togglePause();
        }
      } else {
        // Desktop - só pular se jogo ativo
        if (this.game.gameState.started && !this.game.gameState.gameOver && !this.game.gameState.paused) {
          this.game.player.jump();
        }
      }
    }, { passive: false });
    
    // Better mobile gesture support - sem auto restart
    window.addEventListener("touchend", (e) => {
      // Enhanced UI element detection to prevent accidental game actions
      const target = e.target;
      if (target.closest('button') || 
          target.closest('input') || 
          target.closest('.menu-overlay') ||
          target.closest('.sound-toggle') ||
          target.closest('.mobile-panel-toggle') ||
          target.closest('.score-panel') ||
          target.closest('.stats-details') ||
          target.closest('.controls-panel') ||
          target.closest('#globalRankingContainer')) {
        return; 
      }
      
      e.preventDefault();
      
    }, { passive: false });
    
    // Prevent default touch behaviors that might interfere
    window.addEventListener("touchmove", (e) => {
      e.preventDefault();
    }, { passive: false });
    // Enhanced visibilitychange for mobile - more selective pausing
    window.addEventListener("visibilitychange", (e) => {
      // Debug logging
      console.log("🔄 Visibility change:", {
        hidden: document.hidden,
        started: this.game.gameState.started,
        gameOver: this.game.gameState.gameOver,
        paused: this.game.gameState.paused,
        assetsLoaded: this.game.gameState.assetsLoaded,
        startTime: this.game.gameState.startTime,
        timeSinceStart: this.game.gameState.startTime > 0 ? Date.now() - this.game.gameState.startTime : 0
      });
      
      // Only pause if all conditions are met - very strict to avoid unwanted pausing
      if (
        document.hidden &&
        this.game.gameState.started &&
        !this.game.gameState.gameOver &&
        !this.game.gameState.paused &&
        this.game.gameState.assetsLoaded && // Assets must be loaded
        this.game.gameState.startTime > 0 && // Game must have actually started
        Date.now() - this.game.gameState.startTime > 2000 // Only after 2 seconds of actual gameplay
      ) {
        console.log("⏸️ Auto-pausing game due to visibility change");
        this.game.pauseGame();
      } else {
        console.log("🚫 Visibility change ignored - conditions not met for auto-pause");
      }
    });

    // Start and Restart button event listeners - melhorados para mobile
    this.game.elements.startButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.startGame();
    });
    
    this.game.elements.startButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.startGame();
    });
    
    this.game.elements.restartButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.restartGame();
    });
    
    this.game.elements.restartButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
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

// Game initialization function
function initializeGame() {
  // Ensure canvas has correct dimensions before creating game
  setResponsiveCanvas();
  
  // Create game instance with proper dimensions
  const game = new Game(canvas.width, canvas.height);
  
  // Make game globally accessible for sound control and other features
  window.game = game;
  
  return game;
}

// Initialize the game
const game = initializeGame();

let lastTime = 0;
let fps = 0;
let frames = 0;
let fpsLastUpdate = 0;

function drawPerformanceMonitor(ctx) {
  ctx.save();
  ctx.font = "bold 16px Orbitron, Arial";
  ctx.fillStyle = "#ffe082";
  ctx.globalAlpha = 0.85;
  ctx.fillText(`FPS: ${fps}`, 18, 28);
  ctx.restore();
}

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // FPS calculation
    frames++;
    if (timeStamp - fpsLastUpdate > 500) {
      fps = Math.round((frames * 1000) / (timeStamp - fpsLastUpdate));
      fpsLastUpdate = timeStamp;
      frames = 0;
    }
    // Dirty Rectangles: se houver regiões sujas, renderize apenas elas
    if (dirtyRects.length > 0) {
      renderDirtyRects(ctx);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update(deltaTime);
      game.draw(ctx);
      drawPerformanceMonitor(ctx); // Adiciona o monitor de FPS
    }
    requestAnimationFrame(animate);
  }
  
  animate(0);
