// Classe base de inimigo
import { CONFIG } from './Config.js';

export class Enemy {
  constructor(game) {
    this.game = game;
    this.x = this.game.width;
    this.speedX = -this.game.gameState.speed;
    this.passed = false;
    
    // Sistema de tipos baseado no nível
    this.type = this.selectEnemyType();
    this.width = 90;
    this.height = 90;
    this.frameRate = 12;
    this.frameDelay = 0;
    this.currentFrame = 0;
    
    // Propriedades especiais para inimigos avançados
    this.isAdvanced = this.game.gameState.level > 6;
    this.isNightmare = this.game.gameState.level > 10;
    this.isHell = this.game.gameState.level > 15;
    
    // Ajustar comportamento baseado no tipo e nível
    this.setupEnemyBehavior();
    
    // Ajustar frameRate baseado no tipo de inimigo para melhor visual
    const frameRates = {
      // Básicos
      'meepo': this.isNightmare ? 18 : 12,
      'ghost': this.isNightmare ? 20 : 15,
      'mad': this.isHell ? 25 : 18,
      'spoon': this.isAdvanced ? 15 : 10,
      // Intermediários
      'boss': this.isAdvanced ? 12 : 8,
      'ghost02': this.isNightmare ? 18 : 14,
      'glad': this.isAdvanced ? 16 : 12,
      'sad': this.isAdvanced ? 12 : 8,
      // Avançados
      'bat': this.isHell ? 30 : 25,
      'bloodthirsty': this.isHell ? 22 : 18,
      'necromancer': this.isHell ? 15 : 10,
      // Extremos
      'broodmother': this.isHell ? 20 : 15,
      'tb': this.isHell ? 25 : 20
    };
    this.frameRate = frameRates[this.type] || 12;
  }

  selectEnemyType() {
    const level = this.game.gameState.level;
    const config = this.game.config || CONFIG;
    
    // Sistema de seleção baseado no nível
    if (level <= 5) {
      // Níveis 1-5: Apenas inimigos básicos
      const basicTypes = config.ENEMY_TYPES?.BASIC || ["meepo", "ghost", "mad", "spoon"];
      return basicTypes[Math.floor(Math.random() * basicTypes.length)];
    } else if (level <= 10) {
      // Níveis 6-10: Básicos + Intermediários
      const basicTypes = config.ENEMY_TYPES?.BASIC || ["meepo", "ghost", "mad", "spoon"];
      const intermediateTypes = config.ENEMY_TYPES?.INTERMEDIATE || ["boss", "ghost02", "glad", "sad"];
      
      const weights = {
        ...this.createWeightObject(basicTypes, 0.15), // 15% cada básico
        ...this.createWeightObject(intermediateTypes, 0.10) // 10% cada intermediário
      };
      return this.weightedRandomSelect(weights);
    } else if (level <= 15) {
      // Níveis 11-15: Intermediários + Avançados
      const intermediateTypes = config.ENEMY_TYPES?.INTERMEDIATE || ["boss", "ghost02", "glad", "sad"];
      const advancedTypes = config.ENEMY_TYPES?.ADVANCED || ["bat", "bloodthirsty", "necromancer"];
      
      const weights = {
        ...this.createWeightObject(intermediateTypes, 0.20), // 20% cada intermediário
        ...this.createWeightObject(advancedTypes, 0.13) // 13% cada avançado
      };
      return this.weightedRandomSelect(weights);
    } else if (level <= 20) {
      // Níveis 16-20: Avançados + Extremos
      const advancedTypes = config.ENEMY_TYPES?.ADVANCED || ["bat", "bloodthirsty", "necromancer"];
      const extremeTypes = config.ENEMY_TYPES?.EXTREME || ["broodmother", "tb"];
      
      const weights = {
        ...this.createWeightObject(advancedTypes, 0.25), // 25% cada avançado
        ...this.createWeightObject(extremeTypes, 0.125) // 12.5% cada extremo
      };
      return this.weightedRandomSelect(weights);
    } else {
      // Níveis 21+: Principalmente extremos com alguns avançados
      const advancedTypes = config.ENEMY_TYPES?.ADVANCED || ["bat", "bloodthirsty", "necromancer"];
      const extremeTypes = config.ENEMY_TYPES?.EXTREME || ["broodmother", "tb"];
      
      const weights = {
        ...this.createWeightObject(advancedTypes, 0.15), // 15% cada avançado
        ...this.createWeightObject(extremeTypes, 0.425) // 42.5% cada extremo
      };
      return this.weightedRandomSelect(weights);
    }
  }

  createWeightObject(types, weight) {
    const obj = {};
    types.forEach(type => {
      obj[type] = weight;
    });
    return obj;
  }

  weightedRandomSelect(weights) {
    const items = Object.keys(weights);
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      if (random < weights[item]) {
        return item;
      }
      random -= weights[item];
    }
    
    return items[items.length - 1];
  }

  setupEnemyBehavior() {
    // Aplicar configurações específicas do inimigo
    const config = this.game.config?.ENEMY_CONFIGS || {};
    const enemyConfig = config[this.type];
    
    if (enemyConfig) {
      this.width *= enemyConfig.size;
      this.height *= enemyConfig.size;
      this.speedX *= enemyConfig.speed;
      this.health = enemyConfig.health || 1;
      this.frameRate = enemyConfig.frameRate || 12;
      this.behavior = enemyConfig.behavior || "normal";
    }
    
    // Aplicar comportamentos específicos baseados no tipo
    this.setupSpecificBehavior();
    
    // Modificadores baseados no nível de dificuldade - mais suaves
    if (this.isAdvanced) {
      this.speedX *= 1.05; // Reduzido de 1.1 para 1.05
      if (["boss", "broodmother", "tb"].includes(this.type)) {
        this.width *= 1.1;
        this.height *= 1.1;
      }
    }
    
    if (this.isNightmare) {
      this.speedX *= 1.15; // Reduzido de 1.3 para 1.15
      
      // Movimento vertical APENAS para inimigos voadores específicos
      if (["ghost", "ghost02"].includes(this.type) && this.behavior !== "flying") {
        this.verticalMovement = true;
        this.verticalSpeed = (Math.random() - 0.5) * 2; // Reduzido de 3 para 2
        this.verticalRange = 40; // Reduzido de 60 para 40
        this.initialY = this.y;
      }
    }
    
    if (this.isHell) {
      this.speedX *= 1.25; // Reduzido de 1.5 para 1.25
      this.width *= 1.05; // Reduzido de 1.1 para 1.05
      this.height *= 1.05;
      
      // Movimento errático para tipos específicos
      if (["mad", "bloodthirsty", "tb"].includes(this.type)) {
        this.erraticMovement = true;
        this.erraticTimer = 0;
      }
      
      // Habilidades especiais para inimigos extremos
      if (this.type === "broodmother") {
        this.canSpawnMinions = true;
        this.spawnTimer = 0;
      }
      
      if (this.type === "tb") {
        this.canMetamorphosis = true;
        this.metamorphosisTimer = 0;
      }
    }
  }

  setupSpecificBehavior() {
    switch (this.behavior) {
      case "flying":
        this.gravity = 0;
        this.canFly = true;
        this.flyingSpeed = 1.5; // Velocidade de movimento vertical
        break;
        
      case "erratic":
        this.changeDirectionTimer = 0;
        this.directionChangeInterval = 150;
        break;
        
      case "charging":
        this.chargeSpeed = 1.3; // Reduzido de 1.5 para 1.3
        this.isCharging = false;
        break;
        
      case "heavy":
        this.gravity = 1.5;
        this.resistance = 0.9;
        break;
        
      case "defensive":
        this.armor = 2;
        this.speedX *= 0.8;
        break;
        
      case "aggressive":
        this.attackRange = 100;
        this.speedX *= 1.1; // Reduzido de 1.2 para 1.1
        break;
        
      case "magical":
        this.manaPoints = 3;
        this.canCastSpell = true;
        break;
        
      case "spawner":
        this.spawnCooldown = 2000; // 2 segundos
        this.maxMinions = 2;
        break;
        
      case "demon":
        this.canTeleport = true;
        this.teleportCooldown = 3000; // 3 segundos
        break;
    }
  }
  update(deltaTime = 16.6) {
    // Normalizar deltaTime para 60fps (16.6ms por frame)
    const dt = deltaTime / 16.6;
    
    this.x += this.speedX * dt;
    
    // Aplicar comportamentos específicos
    this.updateBehavior(dt);
    
    // Movimento vertical para inimigos nightmare
    if (this.verticalMovement) {
      this.y += this.verticalSpeed * dt;
      
      // Limite do movimento vertical
      if (Math.abs(this.y - this.initialY) > this.verticalRange) {
        this.verticalSpeed *= -1;
      }
      
      // Manter dentro dos limites da tela (ajustado para inimigos voadores)
      const maxY = this.isFlying ? this.game.config.GROUND_Y * 0.6 : this.game.config.GROUND_Y - this.height;
      const minY = this.isFlying ? 10 : 0;
      this.y = Math.max(minY, Math.min(maxY, this.y));
    }
    
    // Movimento errático para inimigos hell
    if (this.erraticMovement) {
      this.erraticTimer += deltaTime;
      if (this.erraticTimer > 300) { // Aumentado de 200 para 300ms
        this.speedX = -this.game.gameState.speed * (0.9 + Math.random() * 0.4); // Range menor: 0.9-1.3 em vez de 0.8-1.4
        this.erraticTimer = 0;
        
        // Pulos ocasionais para tipos específicos - menos frequentes
        if (["mad", "bloodthirsty"].includes(this.type) && Math.random() < 0.2) { // Reduzido de 0.3 para 0.2
          this.y -= 15; // Reduzido de 20 para 15
        }
      }
    }
    
    // Habilidades especiais dos inimigos extremos
    this.updateSpecialAbilities(deltaTime);
    
    // Atualiza animação do mob
    const frames = this.game.mobFrames[this.type];
    if (frames && frames.length > 1) {
      this.frameDelay += deltaTime;
      const frameInterval = 1000 / this.frameRate;
      if (this.frameDelay >= frameInterval) {
        this.frameDelay = 0;
        this.currentFrame = (this.currentFrame + 1) % frames.length;
      }
    }
  }

  updateBehavior(dt) {
    switch (this.behavior) {
      case "flying":
        if (this.canFly) {
          // Usar altura preferida definida no spawn ou calcular uma segura
          const safeMinHeight = this.game.config.GROUND_Y * 0.2; // 20% da altura
          const safeMaxHeight = this.game.config.GROUND_Y * 0.6; // 60% da altura
          
          let targetY;
          if (this.preferredHeight) {
            // Usar altura preferida já definida
            targetY = this.preferredHeight - this.height / 2;
          } else {
            // Calcular altura segura se não foi definida
            targetY = safeMinHeight + Math.random() * (safeMaxHeight - safeMinHeight);
          }
          
          // Garantir que nunca vá muito baixo
          targetY = Math.max(safeMinHeight, targetY);
          targetY = Math.min(safeMaxHeight, targetY);
          
          const deltaY = targetY - this.y;
          
          // Movimento suave em direção à altura alvo
          if (Math.abs(deltaY) > 5) {
            this.y += Math.sign(deltaY) * this.flyingSpeed * dt;
          }
          
          // Movimento horizontal suave para parecer mais natural
          this.x += Math.cos(this.game.gameState.frame * 0.02) * 0.3 * dt;
        }
        break;
        
      case "erratic":
        this.changeDirectionTimer += 16.6; // deltaTime em ms
        if (this.changeDirectionTimer >= this.directionChangeInterval) {
          this.speedX = -this.game.gameState.speed * (0.8 + Math.random() * 0.5); // Range menor: 0.8-1.3 em vez de 0.7-1.5
          this.changeDirectionTimer = 0;
        }
        break;
        
      case "charging":
        if (!this.isCharging && Math.abs(this.x - this.game.player.x) < 200) {
          this.isCharging = true;
          this.speedX *= this.chargeSpeed;
        }
        break;
        
      case "heavy":
        this.speedX *= this.resistance;
        break;
        
      case "aggressive":
        if (Math.abs(this.x - this.game.player.x) < this.attackRange) {
          this.speedX *= 1.2; // Reduzido de 1.3 para 1.2
        }
        break;
    }
    
    // GARANTIR que todos os inimigos terrestres permaneçam no chão
    if (!this.isFlying && this.behavior !== "flying") {
      this.y = this.game.config.GROUND_Y - this.height;
    }
  }

  updateSpecialAbilities(deltaTime) {
    // Broodmother - Spawning de minions
    if (this.canSpawnMinions) {
      this.spawnTimer += deltaTime;
      if (this.spawnTimer >= this.spawnCooldown && this.game.enemies.length < 8) {
        this.spawnMinion();
        this.spawnTimer = 0;
      }
    }
    
    // Terrorblade - Metamorphosis
    if (this.canMetamorphosis) {
      this.metamorphosisTimer += deltaTime;
      if (this.metamorphosisTimer >= 5000) { // 5 segundos
        this.performMetamorphosis();
        this.metamorphosisTimer = 0;
      }
    }
    
    // Necromancer - Death Pulse
    if (this.canCastSpell && this.manaPoints > 0) {
      if (Math.random() < 0.002) { // 0.2% chance por frame
        this.castDeathPulse();
        this.manaPoints--;
      }
    }
  }

  spawnMinion() {
    // Criar mini-inimigo (spider)
    const minion = {
      x: this.x + 20,
      y: this.y + 10,
      width: 20,
      height: 20,
      speedX: this.speedX * 0.8,
      type: "spider_minion",
      isMinion: true
    };
  }

  performMetamorphosis() {
    // Terrorblade fica temporariamente maior e mais rápido
    this.width *= 1.3;
    this.height *= 1.3;
    this.speedX *= 1.4;
    
    // Reverter após 3 segundos
    setTimeout(() => {
      this.width /= 1.3;
      this.height /= 1.3;
      this.speedX /= 1.4;
    }, 3000);
  }

  castDeathPulse() {
    // Criar efeito visual de onda de morte
    this.game.createSpecialEffect(this.x, this.y, 'necromancy', 2);
  }
 draw(context) {
    // Usar frames animados se disponíveis
    const frames = this.game.mobFrames[this.type];
    let sprite = frames && frames.length > 0 ? frames[this.currentFrame] : this.game.player.getSpriteFromPool(this.type);
    if (!sprite) {
      sprite = this.game.sprites[this.type];
    }
    
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      context.save();
      
      // Aplicar efeitos visuais específicos dos inimigos
      this.applyVisualEffects(context);
      
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      context.translate(centerX, centerY);

      // Inverter horizontalmente para tipos específicos
      const shouldFlip = [
        "boss", "ghost", "spoon", "meepo", "ghost02", "glad", "sad", 
        "bloodthirsty", "necromancer", "broodmother", "tb"
      ].includes(this.type);
      
      if (shouldFlip) {
        context.scale(-1, 1);
      }

      // Animação baseada no comportamento
      this.applyBehaviorAnimation(context);

      context.translate(-centerX, -centerY);

      // Verificar se existe sprite pré-renderizado
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
      
      // Desenhar indicadores de saúde para inimigos com múltipla vida
      if (this.health > 1) {
        this.drawHealthBar(context);
      }
      
      context.restore();
    } else {
      // Fallback para inimigos sem sprite
      this.drawFallback(context);
    }
  }

  applyVisualEffects(context) {
    // Efeitos específicos por tipo de inimigo
    switch (this.type) {
      case "ghost":
      case "ghost02":
        context.globalAlpha = 0.8; // Fantasmas semi-transparentes
        break;
        
      case "necromancer":
        // Aura escura
        context.shadowColor = '#8B008B';
        context.shadowBlur = 15;
        break;
        
      case "bloodthirsty":
        // Efeito vermelho sangue
        context.shadowColor = '#DC143C';
        context.shadowBlur = 10;
        break;
        
      case "tb":
        // Efeito demoníaco
        context.shadowColor = '#FF4500';
        context.shadowBlur = 20;
        break;
        
      case "broodmother":
        // Efeito venenoso
        context.shadowColor = '#9ACD32';
        context.shadowBlur = 12;
        break;
        
      case "bat":
        // Efeito de movimento rápido
        if (this.canFly) {
          context.filter = 'blur(1px)';
        }
        break;
    }
    
    // Efeitos para inimigos em níveis extremos
    if (this.isHell && this.game.gameState.level > 20) {
      const intensity = Math.sin(this.game.gameState.frame * 0.1) * 0.3 + 0.7;
      context.filter = `hue-rotate(${this.game.gameState.frame * 2}deg) saturate(${intensity})`;
    }
  }

  applyBehaviorAnimation(context) {
    switch (this.behavior) {
      case "erratic":
        const shake = Math.sin(this.game.gameState.frame * 0.3) * 0.02;
        context.rotate(shake);
        break;
        
      case "aggressive":
        const pulse = Math.sin(this.game.gameState.frame * 0.2) * 0.05 + 0.95;
        context.scale(pulse, pulse);
        break;
        
      case "heavy":
        // Sem animação extra - mantém aparência pesada
        break;
        
      case "demon":
        if (this.canTeleport) {
          const flicker = Math.sin(this.game.gameState.frame * 0.4) * 0.3 + 0.7;
          context.globalAlpha *= flicker;
        }
        break;
    }
  }

  drawHealthBar(context) {
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - 8;
    
    // Fundo da barra
    context.fillStyle = '#333';
    context.fillRect(this.x, barY, barWidth, barHeight);
    
    // Barra de vida
    const healthPercentage = this.health / (this.maxHealth || this.health);
    const healthWidth = barWidth * healthPercentage;
    
    let healthColor = '#00FF00'; // Verde
    if (healthPercentage < 0.5) healthColor = '#FFFF00'; // Amarelo
    if (healthPercentage < 0.25) healthColor = '#FF0000'; // Vermelho
    
    context.fillStyle = healthColor;
    context.fillRect(this.x, barY, healthWidth, barHeight);
  }

  drawFallback(context) {
    context.save();
    
    // Cor baseada no tipo
    const colors = {
      // Básicos
      meepo: "#8B4513",
      ghost: "#DDA0DD", 
      mad: "#FF6347",
      spoon: "#D2691E",
      // Intermediários
      boss: "#b71c1c",
      ghost02: "#9370DB",
      glad: "#DAA520", 
      sad: "#4682B4",
      // Avançados
      bat: "#2F4F4F",
      bloodthirsty: "#8B0000",
      necromancer: "#483D8B",
      // Extremos
      broodmother: "#228B22",
      tb: "#DC143C"
    };
    
    context.fillStyle = colors[this.type] || "#b71c1c";
    context.fillRect(this.x, this.y, this.width, this.height);
    
    // Indicador do tipo
    context.fillStyle = "#FFFFFF";
    context.font = "12px Arial";
    context.textAlign = "center";
    context.fillText(
      this.type.substring(0, 3).toUpperCase(), 
      this.x + this.width/2, 
      this.y + this.height/2 + 4
    );
    
    context.restore();
  }
}
