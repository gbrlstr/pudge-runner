

import { Player } from './Player.js';
import { EnemyAngler } from './EnemyAngler.js';
import { UI } from './UI.js';
import { InputHandler } from './InputHandler.js';
import { Particle } from './Particle.js';
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
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 1000; // Intervalo em ms (1 segundo)
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
    
    // Inicializar mobFrames dinamicamente baseado no CONFIG
    this.mobFrames = {};
    Object.keys(CONFIG.SPRITE_URLS).forEach(key => {
      if (key !== 'pudge') { // Exclude player sprite
        this.mobFrames[key] = [];
      }
    });
    
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
    // Usar configurações do arquivo Config.js
    this.config = {
      GROUND_Y: this.height - CONFIG.GROUND_OFFSET,
      JUMP_POWER: CONFIG.JUMP_POWER,
      BASE_SPEED: CONFIG.BASE_SPEED,
      OBSTACLE_SPAWN_RATE: CONFIG.OBSTACLE_SPAWN_RATE,
      PARTICLE_COUNT: CONFIG.PARTICLE_COUNT,
      LEVELS: CONFIG.LEVELS,
      INFINITE_DIFFICULTY: CONFIG.INFINITE_DIFFICULTY,
    };
    
    // Usar URLs de sprites do Config.js
    this.spriteUrls = CONFIG.SPRITE_URLS;
    
    // Inicializar sprites como null
    this.sprites = {};
    Object.keys(CONFIG.SPRITE_URLS).forEach(key => {
      this.sprites[key] = null;
    });
    
    // Usar voice lines do Config.js
    this.voiceLines = CONFIG.VOICE_LINES;
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
      multiSpawn: 1, // Quantidade de inimigos por spawn
      nextSpawnTime: 0, // Próximo spawn baseado em tempo
      combo: 0, // Combo/Multiplier
      multiplier: 1, // Combo/Multiplier
      startTime: 0, // Track when game actually started
      isDeveloperMode: false, // Flag para modo desenvolvedor (não salva no Firebase)
      showDeveloperIndicators: false, // Flag para mostrar indicadores visuais (Ctrl+Shift+D)
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
    const layerConfigs = [
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
    // Background elements count
    const starCount = 32;
    const planetCount = 7;
    const nebulaCount = 6;
    
    // Estrelas pequenas
    for (let i = 0; i < starCount; i++) {
        this.backgroundElements.push({
            x: Math.random() * this.width * 2,
            y: Math.random() * (this.config.GROUND_Y - 120),
            size: Math.random() * 1.2 + 0.3,
            speed: Math.random() * 0.3 + 0.08,
            opacity: Math.random() * 0.5 + 0.3,
            type: 'star'
        });
        }
    // Planetas
    for (let i = 0; i < planetCount; i++) {
        this.backgroundElements.push({
            x: Math.random() * this.width * 2,
            y: Math.random() * (this.config.GROUND_Y - 180) + 40,
            size: Math.random() * 1.5 + 2.2,
            speed: Math.random() * 0.18 + 0.08,
            opacity: Math.random() * 0.3 + 0.2,
            type: 'planet'
        });
        }
    // Nebulosas
    for (let i = 0; i < nebulaCount; i++) {
        this.backgroundElements.push({
            x: Math.random() * this.width * 2,
            y: Math.random() * (this.config.GROUND_Y - 200) + 60,
            size: Math.random() * 2.5 + 2.5,
            speed: Math.random() * 0.12 + 0.05,
            opacity: Math.random() * 0.25 + 0.15,
            type: 'nebula'
        });
        }
  }

  initializePools() {
    // Inicializar spritePool dinamicamente baseado no CONFIG
    this.spritePool = {};
    Object.keys(CONFIG.SPRITE_URLS).forEach(key => {
      const maxInstances = key === 'pudge' ? 5 : 
                          ['broodmother', 'tb', 'necromancer'].includes(key) ? 2 :
                          key === 'bat' ? 4 : 3;
      
      this.spritePool[key] = { 
        instances: [], 
        maxInstances: maxInstances, 
        currentIndex: 0 
      };
    });
    
    this.canvasPool = { available: [], active: [], maxSize: 15 }; // Aumentado para mais inimigos
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
    this.gameState.isDeveloperMode = false; // Reset developer mode for normal games
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

  // MÉTODO DE TESTE - Inicia o jogo em um nível específico
  startGameAtLevel(targetLevel) {
    console.log("🧪 Starting game at level:", targetLevel);
    
    // Primeiro, inicializar o jogo normalmente
    this.startGame();
    
    // Marcar como modo desenvolvedor
    this.gameState.isDeveloperMode = true;
    
    // Ajustar o nível e score
    this.gameState.level = targetLevel;
    this.gameState.score = (targetLevel - 1) * 100; // Score baseado no nível
    
    // Atualizar dificuldade para o nível desejado
    this.updateDifficultyForLevel(targetLevel);
    
    console.log(`🧪 Game started at level ${targetLevel} with score ${this.gameState.score} [DEVELOPER MODE]`);
  }

  updateDifficultyForLevel(level) {
    // Sistema de dificuldade: primeiros 20 níveis usam configuração fixa
    if (level <= this.config.LEVELS.length) {
      const levelConfig = this.config.LEVELS[level - 1];
      this.gameState.speed = levelConfig.speed;
      this.gameState.spawnRate = levelConfig.spawnRate;
      this.gameState.multiSpawn = levelConfig.multiSpawn || 1;
    } else {
      // Dificuldade infinita após level 20
      const infiniteConfig = this.config.INFINITE_DIFFICULTY;
      const excessLevels = level - this.config.LEVELS.length;
      
      this.gameState.speed = infiniteConfig.baseSpeed + (excessLevels * infiniteConfig.speedIncrement);
      this.gameState.spawnRate = Math.max(20, infiniteConfig.baseSpawnRate - (excessLevels * infiniteConfig.spawnRateDecrement));
      this.gameState.multiSpawn = Math.min(
        infiniteConfig.maxMultiSpawn, 
        Math.floor(4 + (excessLevels * infiniteConfig.multiSpawnIncrement))
      );
      
      // Tornar o jogo ainda mais difícil em níveis extremos
      if (level > 50) {
        this.gameState.speed += (level - 50) * 0.2; // Aceleração extra
        this.gameState.multiSpawn = Math.min(8, this.gameState.multiSpawn + 1);
      }
    }
  }

  // MÉTODO SECRETO - Toggle dos indicadores visuais de desenvolvedor
  toggleDeveloperModeDisplay() {
    this.gameState.showDeveloperIndicators = !this.gameState.showDeveloperIndicators;
    const status = this.gameState.showDeveloperIndicators ? 'ATIVADOS' : 'DESATIVADOS';
    console.log(`🧪 Indicadores de desenvolvedor ${status}`);
    
    // Se não estiver em modo desenvolvedor e ativou os indicadores, mostrar aviso
    if (this.gameState.showDeveloperIndicators && !this.gameState.isDeveloperMode) {
      console.log('ℹ️ Use as teclas 1-9/0 no menu principal para entrar em modo desenvolvedor');
    }
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

    // Salva score global no Firebase (apenas se não for modo desenvolvedor)
    if (!this.gameState.isDeveloperMode) {
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
    } else {
      console.log("🧪 DEVELOPER MODE: Score não salvo no Firebase");
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
    
    if (this.gameState.score > currentBest && scoreAchievement && !this.gameState.isDeveloperMode) {
      scoreAchievement.style.display = 'flex';
      // Animação especial para novo recorde
      setTimeout(() => {
        scoreAchievement.style.animation = 'achievementGlow 1s ease-in-out';
      }, 500);
    } else if (scoreAchievement) {
      scoreAchievement.style.display = 'none';
    }

    // Show developer mode indicator - só se indicadores estiverem habilitados
    const developerModeIndicator = document.getElementById('developerModeIndicator');
    if (developerModeIndicator) {
      if (this.gameState.isDeveloperMode && this.gameState.showDeveloperIndicators) {
        developerModeIndicator.style.display = 'flex';
        // Animação especial para modo desenvolvedor
        setTimeout(() => {
          developerModeIndicator.style.animation = 'developerGlow 1.5s ease-in-out infinite';
        }, 300);
      } else {
        developerModeIndicator.style.display = 'none';
      }
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
    const count = 5;
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

  // Efeitos específicos para tipos de inimigos
  createEnemyDeathEffect(enemy) {
    if (typeof Particle === 'function') {
      let effectType = 'collision';
      let intensity = 1;
      
      // Efeitos específicos baseados no tipo de inimigo
      switch (enemy.type) {
        case 'necromancer':
          effectType = 'necromancy';
          intensity = 2;
          break;
        case 'bloodthirsty':
          effectType = 'blood';
          intensity = 1.5;
          break;
        case 'broodmother':
          effectType = 'venom';
          intensity = 1.8;
          break;
        case 'tb':
          effectType = 'demon';
          intensity = 2.5;
          break;
        case 'bat':
          effectType = 'bat_trail';
          intensity = 1.2;
          break;
        case 'ghost':
        case 'ghost02':
          effectType = 'magic';
          intensity = 1.3;
          break;
      }
      
      // Criar efeito de morte
      const particles = Particle.createExplosion(
        enemy.x + enemy.width / 2, 
        enemy.y + enemy.height / 2, 
        intensity
      );
      this.particles.push(...particles);
      
      // Efeito específico adicional
      const specialParticles = Particle.createBurst(
        enemy.x + enemy.width / 2, 
        enemy.y + enemy.height / 2, 
        effectType, 
        Math.floor(3 * intensity)
      );
      this.particles.push(...specialParticles);
    }
  }

  // Trail de partículas para inimigos voadores
  createEnemyTrail(enemy) {
    if (typeof Particle === 'function' && enemy.type === 'bat' && Math.random() < 0.3) {
      const trailParticle = new Particle(
        enemy.x + enemy.width / 2, 
        enemy.y + enemy.height / 2, 
        'bat_trail'
      );
      this.particles.push(trailParticle);
    }
  }

  drawBackground(context) {
    // Parallax layers - desktop optimized
    
    this.parallaxLayers.forEach((layer, index) => {
      if (layer.img && layer.loaded && layer.img.complete && layer.img.naturalWidth > 0) {
        let imgW = layer.img.width;
        let imgH = layer.img.height;
        
        let y = 0;
        if (imgH < this.height) {
          y = this.height - imgH;
        }
        
        // Desenha a imagem em loop até cobrir toda a largura do canvas
        let x1 = layer.x % imgW;
        if (x1 > 0) x1 -= imgW; // Garantir cobertura completa
        
        for (let x = x1; x < this.width + imgW; x += imgW) {
          const posY = y - 90;
          context.drawImage(layer.img, x, posY, imgW, imgH);
        }
      }
    });
  }

  drawBackgroundElements(context) {
    // Background image (fallback) - desktop optimized
    
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
    
    this.backgroundElements.forEach((element, index) => {
      context.save();
      context.globalAlpha = element.opacity;

      // Estrela (pequena)
      if (element.size < 2) {
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
    
    // Efeitos visuais baseados no nível de dificuldade
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
    
    // Efeitos especiais para níveis extremos
    if (this.gameState.level > 15) {
      context.save();
      const intensity = Math.min(1, (this.gameState.level - 15) / 10);
      context.globalAlpha = 0.05 + intensity * 0.15;
      
      // Efeito de borda vermelha pulsante
      const pulse = Math.sin(this.gameState.frame * 0.1) * 0.5 + 0.5;
      context.strokeStyle = `rgba(255, 0, 0, ${pulse * intensity})`;
      context.lineWidth = 8;
      context.strokeRect(0, 0, this.width, this.height);
      
      // Linhas de velocidade mais intensas
      context.strokeStyle = `rgba(255, 100, 100, ${intensity * 0.3})`;
      context.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const y = (this.gameState.frame * this.gameState.speed * 3 + i * 25) % this.height;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(this.width * 0.2, y);
        context.stroke();
      }
      
      context.restore();
    }
    
    // Aviso visual para níveis impossíveis
    if (this.gameState.level > 25) {
      context.save();
      context.font = "bold 24px Orbitron";
      context.fillStyle = `rgba(255, 0, 0, ${Math.sin(this.gameState.frame * 0.2) * 0.5 + 0.5})`;
      context.textAlign = "center";
      context.fillText("NIGHTMARE MODE", this.width / 2, 50);
      context.restore();
    }
  }

  updateBackground(deltaTime = 16.6) {
    // Normalizar deltaTime para 60fps (16.6ms por frame)
    const dt = deltaTime / 16.6;
    
    // Parallax das imagens
    this.parallaxLayers.forEach(layer => {
      if (layer.img && layer.loaded) {
        layer.x -= layer.speed * this.gameState.speed * 0.5 * dt; // deltaTime no parallax
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
      element.x -= element.speed * parallax * dt; // deltaTime nos elementos de background
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
    if (newLevel !== this.gameState.level) {
      this.gameState.level = newLevel;
      
      // Sistema de dificuldade: primeiros 20 níveis usam configuração fixa
      if (newLevel <= this.config.LEVELS.length) {
        const levelConfig = this.config.LEVELS[newLevel - 1];
        this.gameState.speed = levelConfig.speed;
        this.gameState.spawnRate = levelConfig.spawnRate;
        this.gameState.multiSpawn = levelConfig.multiSpawn || 1;
      } else {
        // Dificuldade infinita após level 20
        const infiniteConfig = this.config.INFINITE_DIFFICULTY;
        const excessLevels = newLevel - this.config.LEVELS.length;
        
        this.gameState.speed = infiniteConfig.baseSpeed + (excessLevels * infiniteConfig.speedIncrement);
        this.gameState.spawnRate = Math.max(20, infiniteConfig.baseSpawnRate - (excessLevels * infiniteConfig.spawnRateDecrement));
        this.gameState.multiSpawn = Math.min(
          infiniteConfig.maxMultiSpawn, 
          Math.floor(4 + (excessLevels * infiniteConfig.multiSpawnIncrement))
        );
        
        // Tornar o jogo ainda mais difícil em níveis extremos
        if (newLevel > 50) {
          this.gameState.speed += (newLevel - 50) * 0.2; // Aceleração extra
          this.gameState.multiSpawn = Math.min(8, this.gameState.multiSpawn + 1);
        }
      }
      
      // Som de level up apenas se não estiver em níveis extremos (evitar spam)
      if (newLevel <= 20 || newLevel % 5 === 0) {
        this.playVoice("levelup");
      }
    }
  }

  // Método auxiliar para extrair frames de sprite sheet
  async extractFramesFromSpriteSheet(spriteSheetPath, config) {
    const spriteSheet = await this.loadImage(spriteSheetPath);
    const frames = [];
    
    for (let i = 0; i < config.totalFrames; i++) {
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = config.frameWidth;
      frameCanvas.height = config.frameHeight;
      const frameCtx = frameCanvas.getContext('2d');
      
      // Calcular posição do frame na sprite sheet
      const col = i % config.framesPerRow;
      const row = Math.floor(i / config.framesPerRow);
      const sourceX = col * config.frameWidth;
      const sourceY = row * config.frameHeight;
      
      // Extrair o frame da sprite sheet
      frameCtx.drawImage(
        spriteSheet,
        sourceX, sourceY, config.frameWidth, config.frameHeight,
        0, 0, config.frameWidth, config.frameHeight
      );
      
      // Converter canvas para imagem
      const frameImage = new Image();
      frameImage.src = frameCanvas.toDataURL();
      
      await new Promise((resolve) => {
        frameImage.onload = resolve;
      });
      
      frames.push(frameImage);
    }
    
    return frames;
  }

  // Configurações das sprite sheets para todos os sprites
  getSpriteSheetConfigs() {
    return {
      pudge: {
        frameWidth: 66,
        frameHeight: 48,
        totalFrames: 8,
        framesPerRow: 8
      },
      // Inimigos Básicos
      meepo: {
        frameWidth: 45,
        frameHeight: 50,
        totalFrames: 6,
        framesPerRow: 6
      },
      ghost: {
        frameWidth: 54,
        frameHeight: 50,
        totalFrames: 8,
        framesPerRow: 8
      },
      mad: {
        frameWidth: 32,
        frameHeight: 32,
        totalFrames: 4,
        framesPerRow: 4
      },
      spoon: {
        frameWidth: 44,
        frameHeight: 44,
        totalFrames: 45,
        framesPerRow: 45
      },
      // Inimigos Intermediários
      boss: {
        frameWidth: 86,
        frameHeight: 65,
        totalFrames: 9,
        framesPerRow: 9
      },
      ghost02: {
        frameWidth: 32,
        frameHeight: 35,
        totalFrames: 8,
        framesPerRow: 8
      },
      glad: {
        frameWidth: 32,
        frameHeight: 32,
        totalFrames: 4,
        framesPerRow: 4
      },
      sad: {
        frameWidth: 32,
        frameHeight: 32,
        totalFrames: 4,
        framesPerRow: 4
      },
      // Inimigos Avançados
      bat: {
        frameWidth: 96,
        frameHeight: 85,
        totalFrames: 10,
        framesPerRow: 10
      },
      bloodthirsty: {
        frameWidth: 32,
        frameHeight: 32,
        totalFrames: 4,
        framesPerRow: 4
      },
      necromancer: {
        frameWidth: 54,
        frameHeight: 64,
        totalFrames: 8,
        framesPerRow: 8
      },
      // Inimigos Extremos
      broodmother: {
        frameWidth: 140,
        frameHeight: 72,
        totalFrames: 20,
        framesPerRow: 20
      },
      tb: {
        frameWidth: 32,
        frameHeight: 32,
        totalFrames: 4,
        framesPerRow: 4
      }
    };
  }

  async loadPlayerFrames() {
    try {
      const configs = this.getSpriteSheetConfigs();
      
      // Extrair frames da sprite sheet usando CONFIG
      this.playerFrames = await this.extractFramesFromSpriteSheet(
        CONFIG.SPRITE_URLS.pudge, 
        configs.pudge
      );
    } catch (error) {
      console.warn('Erro ao carregar sprite sheet do pudge:', error);
      
      // Fallback: usar sprite padrão
      if (this.sprites.pudge) {
        this.playerFrames.push(this.sprites.pudge);
        console.log('🔄 Usando sprite fallback do pudge');
      }
    }
  }

  async loadMobFrames() {
    const configs = this.getSpriteSheetConfigs();
    
    // Obter todos os mobs dinamicamente do CONFIG, excluindo pudge
    const allMobs = Object.keys(CONFIG.SPRITE_URLS).filter(key => key !== 'pudge');
    
    for (const mob of allMobs) {
      this.mobFrames[mob] = [];
      try {
          this.mobFrames[mob] = await this.extractFramesFromSpriteSheet(
            CONFIG.SPRITE_URLS[mob],
            configs[mob]
          );
      } catch (error) {
        console.warn(`Erro ao carregar sprite sheet do ${mob}:`, error);
      }
      
      // Último fallback: usar sprite padrão
      if (this.mobFrames[mob].length === 0 && this.sprites[mob]) {
        this.mobFrames[mob].push(this.sprites[mob]);
        console.log(`⚠️ Usando sprite único para ${mob}`);
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
    this.player.update(deltaTime);
    
    // Enemy update loop
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      // Check if enemy passed player (dar pontos quando inimigo passa)
      if (enemy.x < this.player.x && !enemy.passed) {
        enemy.passed = true;
        this.gameState.combo++;
        
        // Calcular multiplier
        if (this.gameState.combo >= 5) {
          this.gameState.multiplier = Math.min(5, 1 + Math.floor(this.gameState.combo / 5));
        }
        
        // Sistema de pontuação escalonada - pontos diminuem em níveis muito altos
        let basePoints = 10;
        if (this.gameState.level > 20) {
          // Reduzir pontos base em níveis extremos para tornar mais difícil
          basePoints = Math.max(5, 10 - Math.floor((this.gameState.level - 20) / 5));
        }
        
        // Bonificação por múltiplos inimigos, mas com diminishing returns
        let enemyBonus = 1;
        if (this.gameState.multiSpawn > 1) {
          enemyBonus = 1 + (this.gameState.multiSpawn - 1) * 0.3; // 30% por inimigo extra
        }
        
        const pointsEarned = Math.floor(basePoints * this.gameState.multiplier * enemyBonus);
        this.gameState.score += pointsEarned;
        this.gameState.stats.enemiesDodged++;
        
        // Criar partículas
        this.createScoreParticles(enemy.x + enemy.width / 2, enemy.y - this.player.height / 2, pointsEarned);
        
        // Level up sound (apenas quando necessário)
        if (this.gameState.score % 100 === 0) {
          this.playVoice("levelup");
        }
      }

      // Update enemy
      enemy.update(deltaTime);
      
      // Criar trails para inimigos específicos
      if (enemy.type === 'bat' || enemy.type === 'ghost' || enemy.type === 'ghost02') {
        this.createEnemyTrail(enemy);
      }

      // Remove enemies that are off-screen
      if (enemy.x + enemy.width < -50) { // Buffer de -50 para evitar pop-in
        this.enemies.splice(i, 1);
        continue;
      }

      // Collision detection - apenas game over
      if (this.isColliding(this.player, enemy)) {
        // Criar efeito de morte específico do inimigo
        this.createEnemyDeathEffect(enemy);
        
        this.enemies.splice(i, 1);
        this.gameState.stats.collisions++;

        // Criar partículas de colisão adicionais
        const px = (this.player.x + this.player.width / 2 + enemy.x + enemy.width / 2) / 2;
        const py = (this.player.y + this.player.height / 2 + enemy.y + enemy.height / 2) / 2;
        this.createCollisionParticles(px, py, 1.5);
        
        this.gameOver();
        return;
      }
    }

    // Spawn enemies baseado em tempo - mais agressivo em níveis altos
    this.enemySpawnTimer += deltaTime;
    let currentSpawnInterval = this.enemySpawnInterval;
    
    // Reduzir intervalo de spawn de forma mais gradual
    if (this.gameState.level > 8) { // Começar a redução apenas no nível 8
      currentSpawnInterval *= (1 - Math.min(0.5, (this.gameState.level - 8) * 0.03)); // Redução mais suave
    }
    
    if (this.enemySpawnTimer >= currentSpawnInterval) {
      this.addEnemy();
      this.gameState.stats.enemiesSpawned += this.gameState.multiSpawn || 1;
      this.enemySpawnTimer = 0;
      
      // Variação no intervalo mais generosa nos primeiros níveis
      let baseInterval = 1200; // Intervalo base maior
      let levelReduction = 0;
      
      if (this.gameState.level <= 5) {
        levelReduction = this.gameState.level * 20; // Redução muito suave
      } else if (this.gameState.level <= 10) {
        levelReduction = 100 + (this.gameState.level - 5) * 40; // Redução moderada
      } else {
        levelReduction = 300 + (this.gameState.level - 10) * 30; // Redução mais agressiva
      }
      
      const baseVariation = this.gameState.level > 15 ? 300 : 800;
      const variation = Math.max(200, baseVariation - (this.gameState.level * 15));
      this.enemySpawnInterval = Math.max(400, baseInterval - levelReduction + Math.floor(Math.random() * variation));
    }

    // Update subsystems
    this.updateParticles(deltaTime || 16);
    this.updateBackground(deltaTime || 16.6);
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
    
    // Indicador de modo desenvolvedor
    this.drawDeveloperModeIndicator(context);
  }

  drawDeveloperModeIndicator(context) {
    // Só mostrar se AMBAS as condições forem verdadeiras: está em modo dev E indicadores estão habilitados
    if (this.gameState.isDeveloperMode && this.gameState.showDeveloperIndicators && this.gameState.started) {
      context.save();
      
      // Fundo semi-transparente
      context.fillStyle = 'rgba(255, 179, 0, 0.8)';
      context.fillRect(10, 10, 200, 35);
      
      // Borda
      context.strokeStyle = '#ff6b6b';
      context.lineWidth = 2;
      context.strokeRect(10, 10, 200, 35);
      
      // Texto
      context.fillStyle = '#000';
      context.font = 'bold 14px Arial';
      context.textAlign = 'left';
      context.fillText('🧪 DEVELOPER MODE', 15, 30);
      context.font = '10px Arial';
      context.fillText('Score will not be saved', 15, 42);
      
      context.restore();
    }
  }

  addEnemy() {
    // Distância mínima mais generosa nos primeiros níveis
    const baseMinDistance = this.player.width * 4; // Aumentado de 2.5 para 4
    
    // Multiplicador que diminui gradualmente com o nível
    let levelMultiplier = 1.0;
    if (this.gameState.level <= 5) {
      levelMultiplier = 2.0; // Muito mais espaço nos primeiros 5 níveis
    } else if (this.gameState.level <= 10) {
      levelMultiplier = 1.5; // Espaço médio até nível 10
    } else {
      levelMultiplier = 1.2; // Espaço reduzido apenas após nível 10
    }
    
    const minDistance = baseMinDistance * levelMultiplier;
    const spawnCount = this.gameState.multiSpawn || 1;
    
    // Verificar se há espaço para spawn com distância adequada
    if (this.enemies.length === 0 || 
        this.enemies[this.enemies.length - 1].x < this.width - minDistance) {
      
      // Espaçamento entre inimigos na mesma onda - muito generoso nos primeiros níveis
      const enemySpacing = this.gameState.level <= 5 ? 
        this.player.width * 8 : // Muito espaço nos primeiros níveis
        this.gameState.level <= 10 ? 
          this.player.width * 6 : // Espaço médio
          this.player.width * 4; // Espaço normal apenas após nível 10
      
      for (let i = 0; i < spawnCount; i++) {
        const enemy = new EnemyAngler(this);
        
        // Posição base com espaçamento maior
        enemy.x = this.width + (i * enemySpacing);
        
        // Tornar inimigos mais rápidos em níveis altos (mas de forma mais suave)
        if (this.gameState.level > 10) {
          enemy.speedX *= (1 + (this.gameState.level - 10) * 0.015); // Reduzido de 0.03 para 0.015
        }
        
        // Cap máximo na velocidade para evitar impossibilidade
        const maxSpeedMultiplier = 2.5; // Máximo 250% da velocidade base
        if (Math.abs(enemy.speedX) > Math.abs(this.gameState.speed * maxSpeedMultiplier)) {
          enemy.speedX = -this.gameState.speed * maxSpeedMultiplier;
        }
        
        this.enemies.push(enemy);
      }
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

    // Tolerância diminui em níveis altos para aumentar dificuldade
    let tolerance = 8;
    if (this.gameState.level > 10) {
      tolerance = Math.max(2, 8 - (this.gameState.level - 10) * 0.5);
    }
    if (this.gameState.level > 20) {
      tolerance = 1; // Hitbox quase perfeita em níveis extremos
    }

    // Hitbox do pudge
    const pudgeLeft   = rect1.x + pudgePadX + tolerance;
    const pudgeRight  = rect1.x + rect1.width - pudgePadX - tolerance;
    const pudgeTop    = rect1.y + pudgePadY + tolerance;
    const pudgeBottom = rect1.y + rect1.height - pudgePadY - tolerance;

    // Hitbox do obstáculo - mais rigorosa em níveis altos
    const obsToleranceX = this.gameState.level > 15 ? obsPadX * 0.5 : obsPadX;
    const obsToleranceY = this.gameState.level > 15 ? obsPadY * 0.5 : obsPadY;
    
    const obsLeft   = rect2.x + obsToleranceX;
    const obsRight  = rect2.x + rect2.width - obsToleranceX;
    const obsTop    = rect2.y + obsToleranceY;
    const obsBottom = rect2.y + rect2.height - obsToleranceY;

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
    
    // Mostrar nível com nome se disponível
    if (this.elements.currentLevel) {
      const level = this.gameState?.level ?? 1;
      let levelText = level.toString();
      
      if (level <= this.config.LEVELS.length) {
        const levelConfig = this.config.LEVELS[level - 1];
        levelText = `${level} (${levelConfig.name})`;
      } else {
        // Níveis infinitos
        levelText = `${level} (∞)`;
      }
      
      this.elements.currentLevel.textContent = levelText;
    }
    
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
