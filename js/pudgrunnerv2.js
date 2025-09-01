// Canvas setup
const canvas = document.getElementById("gameCanvas");
// Detecta mobile
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// Responsivo: ajusta tamanho do canvas para mobile landscape
function setResponsiveCanvas() {
  if (isMobile()) {
    // Landscape: canvas quadrado, rotacionado
    let size = Math.max(320, Math.min(window.innerWidth, window.innerHeight));
    canvas.width = size;
    canvas.height = size;
  } else {
    canvas.width = 1500;
    canvas.height = 500;
  }
}
setResponsiveCanvas();
window.addEventListener('resize', setResponsiveCanvas);
window.addEventListener('orientationchange', setResponsiveCanvas);
window.addEventListener('DOMContentLoaded', setResponsiveCanvas);

// Otimização de Canvas
const ctx = canvas.getContext("2d", { alpha: false });
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
      playerNameCenter: document.getElementById("playerNameCenter")
    };
  }
  initializeConfig() {
    this.config = {
      GROUND_Y: this.height - 50,
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
      gameOver: [
        "../assets/sounds/pudge_lose_01.mpeg",
        "../assets/sounds/pudge_lose_02.mpeg",
        "../assets/sounds/pudge_lose_03.mpeg",
        "../assets/sounds/pudge_lose_04.mpeg",
        "../assets/sounds/pudge_lose_05.mpeg",
        "../assets/sounds/pudge_lose_06.mpeg"
      ]
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
  // Estrelas pequenas
  for (let i = 0; i < 32; i++) {
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
  for (let i = 0; i < 7; i++) {
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
  for (let i = 0; i < 6; i++) {
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
    this.gameState.started = true;
    this.gameState.paused = false;
    this.gameState.gameOver = false;
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
    await this.loadAudioAssets();
    this.updateLoadingProgress(25, "Carregando sons...");
    await this.delay(200);
    await this.loadPlayerFrames();
    await this.loadMobFrames();
    this.updateLoadingProgress(35, "Carregando sprites...");
    await this.delay(200);
    await this.loadAssets();
    this.updateLoadingProgress(75, "Preparando jogo...");
    await this.delay(200);
    this.updateLoadingProgress(100, "Concluído!");
    await this.delay(500);
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
    await this.updateLoadingProgress(30, "Carregando música de fundo...");

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
    await this.updateLoadingProgress(35, "Carregando efeito de kill...");
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
    let loaded = 0;
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
      this.drawBackground(context);
      this.drawBackgroundElements(context);
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
    btn.onclick = () => {
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
    input.onkeydown = (e) => {
      if (e.key === 'Enter') btn.click();
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
    // Atualiza ranking global
    this.elements.gameOverOverlay.style.display = "flex";
    this.elements.globalRankingContainer.style.display = "none";
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
      let html = `
        <div class="global-ranking" style="
          background: rgba(30,30,40,0.85);
          border-radius: 18px;
          padding: 28px 32px 18px 32px;
          margin: 24px auto 0 auto;
          max-width: 340px;
          box-shadow: 0 0 32px 4px #ff5e7b44;
          text-align: center;
        ">
          <h3 style="
            color: #ff5e7b;
            font-size: 2.1em;
            font-family: 'Orbitron', 'Montserrat', Arial, sans-serif;
            margin-bottom: 10px;
            text-shadow: 0 0 12px #ff5e7b88;
          ">Ranking Global</h3>
          <ol style="
            color: #fff;
            font-size: 1.15em;
            font-family: 'Montserrat', Arial, sans-serif;
            margin: 0;
            padding-left: 0;
            list-style-position: inside;
            text-align: left;
          ">
      `;
      scores.forEach((s, i) => {
  html += `<li style="margin-bottom: 7px;${i === 0 ? 'font-weight:bold;color:#ff5e7b;font-size:1.18em;' : ''}"><span style="letter-spacing:1px;">${s.name}</span>: <span style="color:#ffe082;">${s.score}</span></li>`;
      });
      html += `</ol></div>`;
      this.elements.globalRankingContainer.innerHTML += html;
      this.elements.globalRankingContainer.style.display = "block";
    } catch (e) {
      this.elements.globalRankingContainer.innerHTML += '<br><span style="color:red">Erro ao carregar ranking global.</span>';
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
  updateBackground() {
    // Efeito paralaxe: elementos mais altos e opacos movem mais devagar
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
    this.width = 90;
    this.height = 90;
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
      e.preventDefault();
      // No mobile landscape, só 1 toque para pular
      if (isMobile()) {
        this.game.player.jump();
      } else {
        this.game.player.jump();
      }
    });
    // Suporte a menu via toque (mobile)
    window.addEventListener("touchend", (e) => {
      if (isMobile() && this.game.gameState.started && !this.game.gameState.gameOver && e.touches.length === 0) {
        // Exibe menu se tocar com dois dedos rapidamente
        if (e.changedTouches.length === 2) {
          this.game.showMenuControls();
        }
      }
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
  // Dirty Rectangles: se houver regiões sujas, renderize apenas elas
  if (dirtyRects.length > 0) {
    renderDirtyRects(ctx);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
  }
  requestAnimationFrame(animate);
}
animate(0);
