// Configurações e constantes do jogo
export const CONFIG = {
  BASE_WIDTH: 1500,
  BASE_HEIGHT: 500,
  PLAYER_BASE_SIZE: 130,
  ENEMY_BASE_SIZE: 90,
  GROUND_OFFSET_DESKTOP: 50,
  GROUND_OFFSET_MOBILE: 40,
  JUMP_POWER_DESKTOP: -16,
  JUMP_POWER_MOBILE: -14,
  BASE_SPEED_DESKTOP: 5,
  BASE_SPEED_MOBILE: 4,
  OBSTACLE_SPAWN_RATE_DESKTOP: 120,
  OBSTACLE_SPAWN_RATE_MOBILE: 140,
  PARTICLE_COUNT_DESKTOP: 100,
  PARTICLE_COUNT_MOBILE: 50,
  LEVELS: [
    { speed: 5, spawnRate: 140, name: "Iniciante", multiSpawn: 1 },
    { speed: 6, spawnRate: 130, name: "Fácil", multiSpawn: 1 },
    { speed: 7, spawnRate: 120, name: "Normal", multiSpawn: 1 },
    { speed: 8, spawnRate: 110, name: "Difícil", multiSpawn: 1 },
    { speed: 9, spawnRate: 100, name: "Expert", multiSpawn: 1 },
    { speed: 10, spawnRate: 90, name: "Insano", multiSpawn: 2 },
    { speed: 11, spawnRate: 85, name: "Extremo", multiSpawn: 2 },
    { speed: 12, spawnRate: 80, name: "Lendário", multiSpawn: 2 },
    { speed: 13, spawnRate: 75, name: "Mítico", multiSpawn: 2 },
    { speed: 14, spawnRate: 70, name: "Divino", multiSpawn: 3 },
    { speed: 15, spawnRate: 65, name: "Imortal", multiSpawn: 3 },
    { speed: 16, spawnRate: 60, name: "Ancestral", multiSpawn: 3 },
    { speed: 17, spawnRate: 55, name: "Transcendente", multiSpawn: 3 },
    { speed: 18, spawnRate: 50, name: "Apocalíptico", multiSpawn: 4 },
    { speed: 19, spawnRate: 45, name: "Cataclísmico", multiSpawn: 4 },
    { speed: 20, spawnRate: 40, name: "Impossível", multiSpawn: 4 }
  ],
  // Sistema de dificuldade infinita após level 20
  INFINITE_DIFFICULTY: {
    baseSpeed: 20,
    baseSpawnRate: 40,
    speedIncrement: 0.5,
    spawnRateDecrement: 1,
    multiSpawnIncrement: 0.2,
    maxMultiSpawn: 6
  },
  SPRITE_URLS: {
    pudge: "../assets/imgs/pudge.png",
    // Inimigos Básicos (Níveis 1-5)
    meepo: "../assets/imgs/meepo.png",
    ghost: "../assets/imgs/ghost.png",
    mad: "../assets/imgs/mad.png",
    spoon: "../assets/imgs/spoon.png",
    // Inimigos Intermediários (Níveis 6-10)
    boss: "../assets/imgs/boss.png",
    ghost02: "../assets/imgs/ghost02.png",
    glad: "../assets/imgs/glad.png",
    sad: "../assets/imgs/sad.png",
    // Inimigos Avançados (Níveis 11-15)
    bat: "../assets/imgs/bat.png",
    bloodthirsty: "../assets/imgs/bloodthirsty.png",
    necromancer: "../assets/imgs/necromancer.png",
    // Inimigos Extremos (Níveis 16+)
    broodmother: "../assets/imgs/broodmother.png",
    tb: "../assets/imgs/tb.png"
  },
  // Sistema organizado de tipos de inimigos por nível
  ENEMY_TYPES: {
    BASIC: ["meepo", "ghost", "mad", "spoon"], // Níveis 1-5
    INTERMEDIATE: ["boss", "ghost02", "glad", "sad"], // Níveis 6-10
    ADVANCED: ["bat", "bloodthirsty", "necromancer"], // Níveis 11-15
    EXTREME: ["broodmother", "tb"], // Níveis 16+
    NIGHTMARE: ["broodmother", "tb"] // Níveis 20+ (repetido para maior chance)
  },
  // Configurações específicas de cada inimigo
  ENEMY_CONFIGS: {
    // Inimigos Básicos
    meepo: { size: 0.9, speed: 1.0, health: 1, behavior: "normal", frameRate: 12 },
    ghost: { size: 1.0, speed: 1.1, health: 1, behavior: "normal", frameRate: 15 },
    mad: { size: 0.8, speed: 1.2, health: 1, behavior: "erratic", frameRate: 18 },
    spoon: { size: 0.9, speed: 1.0, health: 1, behavior: "normal", frameRate: 10 },
    
    // Inimigos Intermediários
    boss: { size: 1.3, speed: 0.9, health: 2, behavior: "heavy", frameRate: 8 },
    ghost02: { size: 1.1, speed: 1.2, health: 1, behavior: "normal", frameRate: 16 },
    glad: { size: 1.0, speed: 1.1, health: 1, behavior: "charging", frameRate: 14 },
    sad: { size: 1.0, speed: 0.8, health: 2, behavior: "defensive", frameRate: 10 },
    
    // Inimigos Avançados
    bat: { size: 0.7, speed: 1.8, health: 1, behavior: "flying", frameRate: 25 },
    bloodthirsty: { size: 1.2, speed: 1.4, health: 2, behavior: "aggressive", frameRate: 20 },
    necromancer: { size: 1.1, speed: 1.0, health: 3, behavior: "magical", frameRate: 12 },
    
    // Inimigos Extremos
    broodmother: { size: 1.5, speed: 1.3, health: 3, behavior: "spawner", frameRate: 15 },
    tb: { size: 1.4, speed: 1.6, health: 4, behavior: "demon", frameRate: 18 }
  },
  VOICE_LINES: {
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
  }
};
