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
    
    // Posicionamento baseado no comportamento do inimigo
    this.setInitialPosition();
    
    this.x = this.game.width;
  }
  
  setInitialPosition() {
    // Verificar se é um inimigo voador
    const flyingEnemies = ["bat", "ghost", "ghost02", "necromancer"];
    if (flyingEnemies.includes(this.type) || this.behavior === "flying") {
      // Inimigos voadores ficam bem mais altos para o player passar por baixo
      // Altura entre 70% e 60% da altura total da tela
      const minFlyingHeight = this.game.config.GROUND_Y * 0.7;
      const maxFlyingHeight = this.game.config.GROUND_Y * 0.6;
      const flyingHeight = minFlyingHeight + Math.random() * (maxFlyingHeight - minFlyingHeight);
      
      this.y = flyingHeight - this.height;
      this.isFlying = true;
      this.preferredHeight = this.y + this.height / 2; // Centro do inimigo
    } else {
      // Inimigos terrestres ficam no chão
      this.y = this.game.config.GROUND_Y - this.height;
      this.isFlying = false;
    }
  }
}
