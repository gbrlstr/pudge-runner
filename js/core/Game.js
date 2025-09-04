

import { Player } from './Player.js';
import { EnemyAngler } from './EnemyAngler.js';
import { UI } from './UI.js';
import { InputHandler } from './InputHandler.js';
import { Particle } from './Particle.js';
import { isMobile, getMobileScaleFactor } from './Utils.js';
import { CONFIG } from './Config.js';
import { AssetManager } from './AssetManager.js';
import { saveScore, getTopScores } from "../firebase-rank.js";

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.keys = [];
    this.enemies = [];
    this.elements = {};
    this.enemySpawnRate = 60;
    this.particles = [];
    this.backgroundElements = [];
    this.parallaxLayers = [];
    this.initializeElements();
    this.initializeConfig();
    this.initializeGameState();
    this.spritePool = {};
    this.canvasPool = {};
    this.preRenderedSprites = {};
    this.playerNickname = localStorage.getItem("pudgeRunnerPlayerName") || '';
    this.bgMusic = null;
    this.killSound = null;
    this.groundImage = null;
    // Instâncias das classes
    this.assetManager = new AssetManager();
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.ui = new UI(this);
    this.initializePools();
    this.startLoadingSequence();
    this.initializeAudioState();
    this.playerFrames = [];
    this.mobFrames = { boss: [], meepo: [], ghost: [], mad: [], spoon: [] };
    this.playerFrameIndex = 0;
    this.playerFrameDelay = 0;
    this.mobFrameIndex = {};
    this.mobFrameDelay = {};
  }

  // Métodos principais (apenas assinaturas, implementar depois)
  initializeElements() {
    this.elements = {
      loadingScreen: document.getElementById("loadingScreen"),
      loadingProgress: document.getElementById("loadingProgress"),
      loadingText: document.getElementById("loadingText"),
      menuOverlay: document.getElementById("menuOverlay"),
      gameOverOverlay: document.getElementById("gameOverOverlay"),
      startButton: document.getElementById("startButton"),
      restartButton: document.getElementById("restartButton"),
      currentScore: document.getElementById("currentScore"),
      bestScore: document.getElementById("bestScore"),
      currentLevel: document.getElementById("currentLevel"),
      finalScore: document.getElementById("finalScore"),
      controlsPanel: document.getElementById("controlsPanel"),
      nicknameOverlay: document.getElementById('nicknameOverlay'),
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

  // Inicializar estado de áudio
  initializeAudioState() {
    // Verificar preferência salva no localStorage
    const savedSoundState = localStorage.getItem('pudgeRunnerSoundEnabled');
    
    // Usar estado do window.gameAudioEnabled se disponível, senão usar localStorage, senão padrão true
    let audioEnabled = true;
    
    if (typeof window.gameAudioEnabled !== 'undefined') {
      audioEnabled = window.gameAudioEnabled;
    } else if (savedSoundState !== null) {
      audioEnabled = savedSoundState === 'true';
    }
    
    // Aplicar ao AssetManager
    this.assetManager.audioEnabled = audioEnabled;
    this.assetManager.soundVolume = audioEnabled ? 0.5 : 0;
    
    // Definir globalmente para sincronização
    window.gameAudioEnabled = audioEnabled;
  }

  initializeConfig() {
    // Mobile responsive config adjustments
    // (Ajustar para usar importações depois)
    const mobileScale = typeof getMobileScaleFactor === 'function' ? getMobileScaleFactor() : 1;
    const isMobileDevice = typeof isMobile === 'function' ? isMobile() : false;
    const groundOffset = isMobileDevice ? 40 * mobileScale : 50;
    const jumpPower = isMobileDevice ? -14 * mobileScale : -16;
    const baseSpeed = isMobileDevice ? 4 * mobileScale : 5;
    this.config = {
      GROUND_Y: this.height - groundOffset,
      JUMP_POWER: jumpPower,
      BASE_SPEED: baseSpeed,
      OBSTACLE_SPAWN_RATE: isMobileDevice ? 140 : 120,
      PARTICLE_COUNT: isMobileDevice ? 50 : 100,
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
        "../assets/sounds/kill.ogg"
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
      stats: {
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
      this.lazyLoadImage(layer.src).then(img => { 
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

    // Lazy Loading de Assets
    lazyLoadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
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
    
    // Música de fundo com tratamento de erro e verificação de áudio
    if (this.bgMusic && this.assetManager.audioEnabled && this.assetManager.soundVolume > 0) {
      this.bgMusic.volume = this.assetManager.soundVolume * 0.3; // Música mais baixa
      this.bgMusic.play().catch(() => {});
    }
    
    // Som de respawn via AssetManager
    this.playVoice("respawn");
    this.hideAllOverlays();
  }

  restartGame() {
    this.clearPools();
    this.enemies = [];
    this.particles = [];
    if (this.elements.globalRankingContainer) {
      this.elements.globalRankingContainer.style.display = 'none';
      const rankingContent = document.getElementById('rankingContent');
      if (rankingContent) rankingContent.innerHTML = '';
    }
    this.initializeGameState();
    this.loadBestScore();
    this.startGame();
  }

  pauseGame() {
    console.log("⏸️ Pausing game - called from:", new Error().stack);
    this.gameState.paused = true;
    if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = "flex";
  }

  togglePause() {
    if (this.gameState.paused) {
      this.gameState.paused = false;
      if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = "none";
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
    if (this.gameState && this.gameState.score > currentBest) {
      localStorage.setItem(
        "pudgeRunnerBestScore",
        this.gameState.score.toString()
      );
    }
  }
  clearPools() {
    while (this.canvasPool.active && this.canvasPool.active.length > 0) {
      this.returnCanvasToPool(this.canvasPool.active[0]);
    }
    if (this.spritePool) {
      Object.keys(this.spritePool).forEach((type) => {
        this.spritePool[type].currentIndex = 0;
      });
    }
  }
  // Retornar canvas ao pool
  returnCanvasToPool(canvasObj) {
    if (!canvasObj || !this.canvasPool) return;
    canvasObj.inUse = false;
    if (canvasObj.ctx && canvasObj.canvas)
      canvasObj.ctx.clearRect(0, 0, canvasObj.canvas.width, canvasObj.canvas.height);
    const activeIndex = this.canvasPool.active.indexOf(canvasObj);
    if (activeIndex > -1) {
      this.canvasPool.active.splice(activeIndex, 1);
    }
    this.canvasPool.available.push(canvasObj);
  }
  hideAllOverlays() {
    if (!this.elements) return;
    if (this.elements.menuOverlay) this.elements.menuOverlay.style.display = "none";
    if (this.elements.gameOverOverlay) this.elements.gameOverOverlay.style.display = "none";
    if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = "none";
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
  }

  async loadAudioAssets() {
    // Carregar música de fundo
    this.bgMusic = new Audio("../assets/sounds/background.mp3");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.5;
    
    // Carregar som de kill
    this.killSound = new Audio("../assets/sounds/kill.ogg");
    this.killSound.volume = 0.7;
    
    // Carregar sons via AssetManager para melhor performance
    try {
      // Som de pulo único
      const jumpAudio = await AssetManager.loadAudio(`../assets/sounds/kill.ogg`, false, 0.7);
      this.assetManager.sounds[`jump`] = jumpAudio;

      // Sons de level up
      for (let i = 1; i <= 5; i++) {
        const audio = await AssetManager.loadAudio(`../assets/sounds/pudge_levelup_0${i}.mpeg`, false, 0.7);
        this.assetManager.sounds[`pudge_levelup_0${i}`] = audio;
      }
      
      // Sons de morte
      for (let i = 1; i <= 6; i++) {
        const audio = await AssetManager.loadAudio(`../assets/sounds/pudge_lose_0${i}.mpeg`, false, 0.7);
        this.assetManager.sounds[`pudge_lose_0${i}`] = audio;
      }
      
      // Sons de respawn
      for (let i = 1; i <= 7; i++) {
        const audio = await AssetManager.loadAudio(`../assets/sounds/pudge_respawn_0${i}.mpeg`, false, 0.7);
        this.assetManager.sounds[`pudge_respawn_0${i}`] = audio;
      }
    } catch (error) {
      console.warn("Erro ao carregar alguns sons:", error);
    }
  }

  async loadAssets() {
    // Carrega imagens principais
    for (const [key, url] of Object.entries(this.spriteUrls)) {
      this.sprites[key] = await this.loadImage(url);
    }
    // Carrega ground
    this.groundImage = await this.loadImage("../assets/imgs/ground.png");
    // Carrega frames do player e mobs
    await this.loadPlayerFrames();
    await this.loadMobFrames();
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  preRenderCommonSprites() {
    // Exemplo: pré-renderiza sprites em canvas para performance
    Object.keys(this.sprites).forEach(type => {
      if (this.sprites[type]) {
        this.preRenderedSprites[type] = this.preRenderSprite(type, this.sprites[type].width, this.sprites[type].height);
      }
    });
  }

  preRenderSprite(type, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.sprites[type], 0, 0, width, height);
    return canvas;
  }

  getCanvasFromPool() {
    if (this.canvasPool.available.length > 0) {
      const canvasObj = this.canvasPool.available.pop();
      canvasObj.inUse = true;
      this.canvasPool.active.push(canvasObj);
      return canvasObj;
    } else {
      // Se pool esgotado, cria novo (fallback)
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      return {
        canvas: canvas,
        ctx: canvas.getContext("2d"),
        inUse: true
      };
    }
  }

  async gameOver() {
    this.gameState.gameOver = true;
    this.saveBestScore();
    
    // Pausar música de fundo com tratamento de erro
    if (this.bgMusic && typeof this.bgMusic.pause === 'function') {
      try {
        this.bgMusic.pause();
      } catch (error) {
      }
    }

    // Som de morte via AssetManager
    this.playVoice("lose");
    
    if (this.elements.gameOverOverlay) {
      this.elements.gameOverOverlay.style.display = "flex";
      
      // Update new final score design
      this.updateFinalScoreDisplay();
    }

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
    

    // Clear and show ranking within the game over overlay
    const rankingContent = document.getElementById('rankingContent');
    if (rankingContent) rankingContent.innerHTML = '';
    if (this.elements.globalRankingContainer) this.elements.globalRankingContainer.style.display = 'none';
    this.showGlobalRanking();

    this.gameState.combo = 0;
    this.gameState.multiplier = 1;
  }

  playVoice(event) {
    try {
      // Som de pulo único via AssetManager
      if (event === "jump") {
        this.assetManager.playSound("jump");
        return;
      }
      
      // Outros sons via AssetManager
      this.assetManager.playRandomSound(`pudge_${event}_0`, false);
    } catch (error) {
      try {
        const lines = this.voiceLines[event];
        if (!lines || !lines.length) return;
        const idx = Math.floor(Math.random() * lines.length);
        
        // Usar AssetManager para controle de áudio
        if (this.assetManager.audioEnabled && this.assetManager.soundVolume > 0) {
          const audio = new Audio(lines[idx]);
          audio.volume = this.assetManager.soundVolume;
          audio.play().catch(() => {}); // Evitar travamentos de áudio
        }
      } catch (fallbackError) {
      }
    }
  }

  updateFinalScoreDisplay() {
    // Update score value
    const finalScoreValue = document.getElementById('finalScoreValue');
    if (finalScoreValue) {
      finalScoreValue.textContent = this.gameState.score.toLocaleString() || 0;
    }

    // Update level
    const finalLevel = document.getElementById('finalLevel');
    if (finalLevel) {
      finalLevel.textContent = this.gameState.level;
    }

    // Update time
    const finalTime = document.getElementById('finalTime');
    if (finalTime) {
      const timeInSeconds = (this.gameState.gameTime || 0 / 1000).toFixed(1);
      finalTime.textContent = `${timeInSeconds}s`;
    }

    // Update combo (usando o último combo registrado)
    const finalCombo = document.getElementById('finalCombo');
    if (finalCombo) {
      finalCombo.textContent = this.gameState.combo || 0;
    }

    // Check for new personal record
    const currentBest = parseInt(localStorage.getItem('pudgeRunnerBestScore') || '0');
    const scoreAchievement = document.getElementById('scoreAchievement');
    
    if (this.gameState.score > currentBest && scoreAchievement) {
      scoreAchievement.style.display = 'flex';
      // Animação especial para novo recorde
      setTimeout(() => {
        scoreAchievement.style.animation = 'achievementGlow 1s ease-in-out';
      }, 500);
    } else if (scoreAchievement) {
      scoreAchievement.style.display = 'none';
    }
  }

  async showGlobalRanking() {
    if (!this.elements.finalScore) return;
    try {
      const scores = await getTopScores(10);
      const rankingContent = document.getElementById('rankingContent');
      
      if (!rankingContent) {
        console.error('Ranking content element not found');
        return;
      }

      // Limpar conteúdo anterior
      rankingContent.innerHTML = '';
      
      // Criar items do ranking
      scores.forEach((score, index) => {
        const position = index + 1;
        const rankingItem = document.createElement('div');
        rankingItem.className = `ranking-item ${position <= 3 ? `top-${position}` : ''}`;
        rankingItem.style.animationDelay = `${index * 0.1}s`;
        
        // Definir medalhas
        let medal = '';
        if (position === 1) medal = '🥇';
        else if (position === 2) medal = '🥈';
        else if (position === 3) medal = '🥉';
        else medal = `#${position}`;
        
        rankingItem.innerHTML = `
          <div class="ranking-position">
            ${position <= 3 ? `<span class="ranking-medal">${medal}</span>` : ''}
            <span class="ranking-number">${position <= 3 ? '' : medal}</span>
          </div>
          <div class="ranking-player">
            <div class="ranking-name">${score.name}</div>
          </div>
          <div class="ranking-score">
            <span class="ranking-score-value">${score.score.toLocaleString()}</span>
            <span class="ranking-score-label">pts</span>
          </div>
        `;
        
        rankingContent.appendChild(rankingItem);
      });
      
      // Mostrar o container
      this.elements.globalRankingContainer.style.display = "block";
      
    } catch (e) {
      console.error('Erro ao carregar ranking:', e);
      const rankingContent = document.getElementById('rankingContent');
      if (rankingContent) {
        rankingContent.innerHTML = `
          <div class="ranking-error">
            <span class="ranking-error-icon">⚠️</span>
            <div class="ranking-error-text">Erro ao carregar ranking</div>
            <div class="ranking-error-detail">Verifique sua conexão com a internet</div>
          </div>
        `;
      }
      this.elements.globalRankingContainer.style.display = "block";
    }
  }

  updateParticles(deltaTime = 16) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(deltaTime);
      if (p.dead) {
        this.particles.splice(i, 1);
      }
    }
  }

  createJumpParticles(x, y) {
    // Cria burst de partículas de pulo
    const count = isMobile() ? 3 : 5;
    if (typeof Particle === 'function') {
      const burstParticles = Particle.createBurst(x, y, 'jump', count);
      this.particles.push(...burstParticles);
    }
  }

  createCollisionParticles(x, y, intensity = 1) {
    // Cria explosão de partículas de colisão
    if (typeof Particle === 'function') {
      const explosionParticles = Particle.createExplosion(x, y, intensity);
      this.particles.push(...explosionParticles);
      
      // Adiciona algumas partículas mágicas para efeito extra
      const magicCount = Math.floor(3 * intensity);
      for (let i = 0; i < magicCount; i++) {
        this.particles.push(new Particle(x, y, 'magic'));
      }
    }
  }

  createScoreParticles(x, y, score = 100) {
    // Cria partículas de pontuação com intensidade baseada na pontuação
    const baseCount = 6;
    const bonusCount = Math.min(Math.floor(score / 500), 6); // Máximo 6 partículas extras
    const totalCount = baseCount + bonusCount;
    
    if (typeof Particle === 'function') {
      // Partículas principais em burst
      const mainParticles = Particle.createBurst(x, y, 'score', totalCount);
      this.particles.push(...mainParticles);
      
      // Se pontuação alta, adiciona efeito especial
      if (score >= 1000) {
        const specialParticles = Particle.createBurst(x, y - 20, 'magic', 3);
        this.particles.push(...specialParticles);
      }
    }
  }

  // Novo método para criar efeitos especiais
  createSpecialEffect(x, y, type = 'magic', intensity = 1) {
    if (typeof Particle === 'function') {
      const count = Math.floor(5 * intensity);
      const particles = Particle.createBurst(x, y, type, count);
      this.particles.push(...particles);
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
          const posY = !isMobileDevice ? y - 90 : y;
          context.drawImage(layer.img, x, posY, imgW, imgH);
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
        context.drawImage(this.groundImage, 0, this.config.GROUND_Y, this.width, groundHeight);
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
    this.particles.forEach(p => {
      if (typeof p.draw === 'function') p.draw(context);
    });
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

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  updateLoadingProgress(percentage, text) {
    if (this.elements.loadingProgress) this.elements.loadingProgress.style.width = percentage + "%";
    if (this.elements.loadingText) this.elements.loadingText.textContent = text;
  }

  showMainMenu() {
    if (!this.playerNickname || this.playerNickname.length < 3) {
      if (this.elements.loadingScreen) this.elements.loadingScreen.style.display = "none";
      this.showNicknameOverlay();
      this.setupNicknameInput();
    } else {
      if (this.elements.loadingScreen) this.elements.loadingScreen.style.display = "none";
      if (this.elements.nicknameOverlay) this.elements.nicknameOverlay.style.display = "none";
      if (this.elements.menuOverlay) this.elements.menuOverlay.style.display = "flex";
      if (this.elements.controlsPanel) this.elements.controlsPanel.style.display = "flex";
      this.updateUI();
    }
  }
  update(deltaTime) {
    if (this.gameState.paused || this.gameState.gameOver) return;
    if (!this.gameState.started || this.gameState.gameOver) return;
    
    this.gameState.frame++;
    this.gameState.stats.playTime += (deltaTime || 16.6) / 1000;

    // Update player - otimizado
    this.player.update();
    
    // Enemy update loop
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      // Update enemy position
      enemy.x += enemy.speedX;
      
      // Check if enemy passed player (dar pontos quando inimigo passa)
      if (enemy.x < this.player.x && !enemy.passed) {
        enemy.passed = true;
        this.gameState.combo++;
        
        // Calcular multiplier
        if (this.gameState.combo >= 5) {
          this.gameState.multiplier = Math.min(5, 1 + Math.floor(this.gameState.combo / 5));
        }
        
        this.gameState.score += 10 * this.gameState.multiplier;
        this.gameState.stats.enemiesDodged++;
        
        // Criar partículas
        this.createScoreParticles(enemy.x + enemy.width / 2, enemy.y - this.player.height / 2);
        
        // Level up sound (apenas quando necessário)
        if (this.gameState.score % 100 === 0) {
          this.playVoice("levelup");
        }
      }

      // Remove enemies that are off-screen
      if (enemy.x + enemy.width < -50) { // Buffer de -50 para evitar pop-in
        this.enemies.splice(i, 1);
        continue;
      }

      // Collision detection - apenas game over
      if (this.isColliding(this.player, enemy)) {
        this.enemies.splice(i, 1);
        this.gameState.stats.collisions++;

        // Criar partículas de colisão
        const px = (this.player.x + this.player.width / 2 + enemy.x + enemy.width / 2) / 2;
        const py = (this.player.y + this.player.height / 2 + enemy.y + enemy.height / 2) / 2;
        this.createCollisionParticles(px, py);
        
        this.gameOver();
        return;
      }

      // Update enemy
      enemy.update();
    }

    // Spawn enemies
    if (this.gameState.frame % this.enemySpawnRate === 0) {
      this.addEnemy();
      this.gameState.stats.enemiesSpawned++;
      this.enemySpawnRate = 180 + Math.floor(Math.random() * 70);
    }

    // Update subsystems
    this.updateParticles(deltaTime || 16);
    this.updateBackground();
    this.updateDifficulty();
    
    if (this.gameState.frame % 5 === 0) { // UI menos frequente
      this.updateUI();
    }
  }

  draw(context) {
    // Performance otimizada - evitar dirty rectangles desnecessárias
    context.clearRect(0, 0, this.width, this.height);
    
    // Desenhar em ordem de profundidade para otimizar
    this.drawBackgroundElements(context);
    this.drawBackground(context);
    
    // Só desenhar se player existe e está visível
    if (this.player) {
      this.player.draw(context);
    }
    
    // UI básica
    if (this.ui) {
      this.ui.draw(context);
    }
    
    // Enemies - só desenhar os visíveis
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.x + enemy.width > -50 && enemy.x < this.width + 50) {
        enemy.draw(context);
      }
    }
    
    this.drawGround(context);
    
    // Partículas e efeitos - menos frequente
    if (this.gameState.frame % 2 === 0) {
      this.drawParticles(context);
    }
    
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
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
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
  updateUI() {
    if (this.elements.currentScore) this.elements.currentScore.textContent = this.gameState?.score ?? 0;
    if (this.elements.currentLevel) this.elements.currentLevel.textContent = this.gameState?.level ?? 1;
    if (this.elements.bestScore) this.elements.bestScore.textContent = this.getBestScore();
    if (this.elements.playerNameCenter) {
      this.elements.playerNameCenter.textContent = this.playerNickname || localStorage.getItem("pudgeRunnerPlayerName") || "";
    }
    if (this.elements.statsDetails) {
      this.elements.comboValue.textContent = this.gameState?.combo ?? 0;
      this.elements.multiplierValue.textContent = 'x' + (this.gameState?.multiplier ?? 1);
      this.elements.jumpsValue.textContent = this.gameState?.stats?.jumps ?? 0;
      this.elements.dodgesValue.textContent = this.gameState?.stats?.enemiesDodged ?? 0;
      this.elements.collisionsValue.textContent = this.gameState?.stats?.collisions ?? 0;
      this.elements.playTimeValue.textContent = (this.gameState?.stats?.playTime ?? 0).toFixed(1) + 's';
    }
  }

  showMenuControls() {
    const controlsPanel = this.elements.controlsPanel;
    if (!controlsPanel) return;
    if (controlsPanel.style.display === "none") {
      controlsPanel.style.display = "flex";
    } else {
      controlsPanel.style.display = "none";
    }
  }

  showNicknameOverlay() {
    if (this.elements.menuOverlay) this.elements.menuOverlay.style.display = 'none';
    if (this.elements.nicknameOverlay) this.elements.nicknameOverlay.style.display = 'flex';
    if (this.elements.gameOverOverlay) this.elements.gameOverOverlay.style.display = 'none';
    if (this.elements.pauseOverlay) this.elements.pauseOverlay.style.display = 'none';
  }

  hideNicknameOverlay() {
    if (this.elements.nicknameOverlay) this.elements.nicknameOverlay.style.display = 'none';
  }
  setupNicknameInput() {
    const input = this.elements.nicknameInput;
    const btn = this.elements.nicknameConfirmButton;
    if (!input || !btn) return;
    input.value = '';
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
      if (this.elements.menuOverlay) this.elements.menuOverlay.style.display = 'flex';
    };
    btn.onclick = confirmNickname;
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      confirmNickname();
    });
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmNickname();
      }
    };
  }
}
