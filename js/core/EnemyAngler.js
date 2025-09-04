// Inimigo específico (herda de Enemy)

import { Enemy } from './Enemy.js';
import { getMobileScaleFactor, isMobile } from './Utils.js';

export class EnemyAngler extends Enemy {
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
