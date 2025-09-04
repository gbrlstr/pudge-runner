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
    { speed: 5, spawnRate: 140, name: "Iniciante" },
    { speed: 6, spawnRate: 130, name: "Fácil" },
    { speed: 7, spawnRate: 120, name: "Normal" },
    { speed: 8, spawnRate: 110, name: "Difícil" },
    { speed: 9, spawnRate: 100, name: "Expert" },
    { speed: 10, spawnRate: 90, name: "Insano" },
  ],
  SPRITE_URLS: {
    pudge: "../assets/imgs/pudg.gif",
    boss: "../assets/imgs/boss.gif",
    meepo: "../assets/imgs/meepo.gif",
    ghost: "../assets/imgs/ghost.gif",
    mad: "../assets/imgs/mad.gif",
    spoon: "../assets/imgs/spoon.gif",
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
