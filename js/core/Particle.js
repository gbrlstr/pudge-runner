
export class Particle {
  constructor(x, y, type = 'score', config = {}) {
    // Posição inicial
    this.initialX = x;
    this.initialY = y;
    this.x = x;
    this.y = y;
    
    // Configuração do tipo
    this.type = type;
    this.config = this.getTypeConfig(type);
    Object.assign(this.config, config); // Override com configurações customizadas
    
    // Propriedades físicas
    this.radius = this.config.radius;
    this.maxLife = this.config.life;
    this.life = this.maxLife;
    this.alpha = 1;
    this.rotation = 0;
    this.rotationSpeed = this.config.rotationSpeed;
    
    // Velocidade inicial com variação baseada no tipo
    const angle = this.config.angle + (Math.random() - 0.5) * this.config.angleVariation;
    const speed = this.config.speed + (Math.random() - 0.5) * this.config.speedVariation;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    // Física
    this.gravity = this.config.gravity;
    this.friction = this.config.friction;
    this.bounce = this.config.bounce;
    
    // Efeitos visuais
    this.colors = this.config.colors;
    this.currentColorIndex = 0;
    this.colorTransition = 0;
    this.scale = 1;
    this.scaleVelocity = this.config.scaleVelocity;
    
    // Efeitos especiais
    this.trail = [];
    this.maxTrailLength = this.config.trailLength;
    this.glowIntensity = this.config.glowIntensity;
    this.sparkles = this.config.sparkles ? this.generateSparkles() : [];
    
    // Performance
    this.dead = false;
    this.lastUpdate = performance.now();
  }

  getTypeConfig(type) {
    const configs = {
      'jump': {
        radius: 2,
        life: 30,
        speed: 3,
        speedVariation: 2,
        angle: -Math.PI/2,
        angleVariation: Math.PI/3,
        gravity: 0.2,
        friction: 0.98,
        bounce: 0.6,
        colors: ['#00e676', '#4caf50', '#81c784'],
        rotationSpeed: 0.1,
        scaleVelocity: 0.02,
        trailLength: 5,
        glowIntensity: 10,
        sparkles: false
      },
      'collision': {
        radius: 6,
        life: 45,
        speed: 5,
        speedVariation: 3,
        angle: 0,
        angleVariation: Math.PI * 2,
        gravity: 0.15,
        friction: 0.95,
        bounce: 0.4,
        colors: ['#e53935', '#ff5722', '#ff9800', '#ffeb3b'],
        rotationSpeed: 0.15,
        scaleVelocity: -0.01,
        trailLength: 8,
        glowIntensity: 15,
        sparkles: true
      },
      'score': {
        radius: 4,
        life: 60,
        speed: 2,
        speedVariation: 1,
        angle: -Math.PI/4,
        angleVariation: Math.PI/8,
        gravity: 0.05,
        friction: 0.99,
        bounce: 0.3,
        colors: ['#ffd600', '#ffeb3b', '#fff176'],
        rotationSpeed: 0.05,
        scaleVelocity: 0.005,
        trailLength: 6,
        glowIntensity: 12,
        sparkles: false
      },
      'magic': {
        radius: 5,
        life: 80,
        speed: 1.5,
        speedVariation: 0.5,
        angle: -Math.PI/2,
        angleVariation: Math.PI,
        gravity: -0.02,
        friction: 0.985,
        bounce: 0.8,
        colors: ['#9c27b0', '#e91e63', '#3f51b5', '#2196f3'],
        rotationSpeed: 0.2,
        scaleVelocity: 0.01,
        trailLength: 10,
        glowIntensity: 20,
        sparkles: true
      },
      // Novos tipos para inimigos específicos
      'necromancy': {
        radius: 7,
        life: 90,
        speed: 1,
        speedVariation: 0.3,
        angle: 0,
        angleVariation: Math.PI * 2,
        gravity: -0.05,
        friction: 0.99,
        bounce: 0,
        colors: ['#8B008B', '#4B0082', '#2F4F4F'],
        rotationSpeed: 0.3,
        scaleVelocity: 0.02,
        trailLength: 12,
        glowIntensity: 25,
        sparkles: true
      },
      'blood': {
        radius: 3,
        life: 40,
        speed: 4,
        speedVariation: 2,
        angle: Math.PI/2,
        angleVariation: Math.PI/4,
        gravity: 0.3,
        friction: 0.95,
        bounce: 0.2,
        colors: ['#DC143C', '#8B0000', '#B22222'],
        rotationSpeed: 0.1,
        scaleVelocity: -0.02,
        trailLength: 6,
        glowIntensity: 8,
        sparkles: false
      },
      'venom': {
        radius: 4,
        life: 70,
        speed: 2,
        speedVariation: 1,
        angle: -Math.PI/3,
        angleVariation: Math.PI/6,
        gravity: 0.1,
        friction: 0.98,
        bounce: 0.5,
        colors: ['#9ACD32', '#228B22', '#32CD32'],
        rotationSpeed: 0.15,
        scaleVelocity: 0.01,
        trailLength: 8,
        glowIntensity: 15,
        sparkles: false
      },
      'demon': {
        radius: 8,
        life: 100,
        speed: 3,
        speedVariation: 2,
        angle: 0,
        angleVariation: Math.PI * 2,
        gravity: 0,
        friction: 0.97,
        bounce: 1,
        colors: ['#FF4500', '#DC143C', '#B22222', '#8B0000'],
        rotationSpeed: 0.25,
        scaleVelocity: 0.015,
        trailLength: 15,
        glowIntensity: 30,
        sparkles: true
      },
      'bat_trail': {
        radius: 2,
        life: 20,
        speed: 1,
        speedVariation: 0.5,
        angle: Math.PI,
        angleVariation: Math.PI/8,
        gravity: 0,
        friction: 0.95,
        bounce: 0,
        colors: ['#2F4F4F', '#696969'],
        rotationSpeed: 0.05,
        scaleVelocity: -0.05,
        trailLength: 3,
        glowIntensity: 5,
        sparkles: false
      }
    };
    
    return configs[type] || configs.score;
  }

  generateSparkles() {
    const sparkles = [];
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      sparkles.push({
        x: this.x + (Math.random() - 0.5) * 20,
        y: this.y + (Math.random() - 0.5) * 20,
        life: 15 + Math.random() * 10,
        maxLife: 25,
        size: 1 + Math.random() * 2
      });
    }
    return sparkles;
  }

  update(deltaTime = 16) {
    const dt = deltaTime / 16; // Normaliza para 60fps
    
    // Atualiza física
    this.vx *= this.friction;
    this.vy = this.vy * this.friction + this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    // Rotação
    this.rotation += this.rotationSpeed * dt;
    
    // Escala
    this.scale += this.scaleVelocity * dt;
    this.scale = Math.max(0.1, this.scale);
    
    // Trail
    if (this.maxTrailLength > 0) {
      this.trail.unshift({ x: this.x, y: this.y, alpha: this.alpha });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.pop();
      }
    }
    
    // Vida e alpha
    this.life -= dt;
    const lifeRatio = this.life / this.maxLife;
    this.alpha = Math.max(0, lifeRatio);
    
    // Transição de cores
    if (this.colors.length > 1) {
      this.colorTransition += 0.02 * dt;
      if (this.colorTransition >= 1) {
        this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
        this.colorTransition = 0;
      }
    }
    
    // Atualiza sparkles
    this.sparkles.forEach(sparkle => {
      sparkle.life -= dt;
      sparkle.x += (Math.random() - 0.5) * 0.5;
      sparkle.y += (Math.random() - 0.5) * 0.5;
    });
    this.sparkles = this.sparkles.filter(sparkle => sparkle.life > 0);
    
    // Verifica se a partícula morreu
    if (this.life <= 0 || this.alpha <= 0) {
      this.dead = true;
    }
  }

  draw(context) {
    if (this.alpha <= 0) return;
    
    context.save();
    context.globalAlpha = this.alpha;
    
    // Desenha trail
    this.drawTrail(context);
    
    // Configuração do brilho
    const glowRadius = this.radius * this.scale + this.glowIntensity;
    context.shadowColor = this.getCurrentColor();
    context.shadowBlur = glowRadius * this.alpha;
    
    // Transforma o contexto
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scale, this.scale);
    
    // Desenha a partícula principal
    this.drawParticle(context);
    
    context.restore();
    
    // Desenha sparkles
    this.drawSparkles(context);
  }

  drawTrail(context) {
    if (this.trail.length < 2) return;
    
    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    
    for (let i = 0; i < this.trail.length - 1; i++) {
      const point = this.trail[i];
      const nextPoint = this.trail[i + 1];
      const trailAlpha = (this.trail.length - i) / this.trail.length * 0.5;
      
      context.globalAlpha = trailAlpha * this.alpha;
      context.strokeStyle = this.getCurrentColor();
      context.lineWidth = (this.radius * this.scale) * (trailAlpha * 0.5);
      
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(nextPoint.x, nextPoint.y);
      context.stroke();
    }
    
    context.restore();
  }

  drawParticle(context) {
    const currentColor = this.getCurrentColor();
    
    // Gradient radial para efeito mais profissional
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, currentColor);
    gradient.addColorStop(0.7, this.adjustColorAlpha(currentColor, 0.8));
    gradient.addColorStop(1, this.adjustColorAlpha(currentColor, 0.2));
    
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();
    
    // Borda brilhante
    context.strokeStyle = currentColor;
    context.lineWidth = 1;
    context.stroke();
  }

  drawSparkles(context) {
    context.save();
    this.sparkles.forEach(sparkle => {
      const sparkleAlpha = sparkle.life / sparkle.maxLife;
      context.globalAlpha = sparkleAlpha * this.alpha;
      context.fillStyle = '#ffffff';
      
      context.beginPath();
      context.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
      context.fill();
      
      // Cruz de brilho
      context.strokeStyle = '#ffffff';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(sparkle.x - sparkle.size * 2, sparkle.y);
      context.lineTo(sparkle.x + sparkle.size * 2, sparkle.y);
      context.moveTo(sparkle.x, sparkle.y - sparkle.size * 2);
      context.lineTo(sparkle.x, sparkle.y + sparkle.size * 2);
      context.stroke();
    });
    context.restore();
  }

  getCurrentColor() {
    if (this.colors.length === 1) {
      return this.colors[0];
    }
    
    const currentColor = this.colors[this.currentColorIndex];
    const nextColor = this.colors[(this.currentColorIndex + 1) % this.colors.length];
    
    return this.interpolateColor(currentColor, nextColor, this.colorTransition);
  }

  interpolateColor(color1, color2, factor) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  adjustColorAlpha(color, alpha) {
    const rgb = this.hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  // Método para criar burst de partículas
  static createBurst(x, y, type, count = 5) {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const config = {
        angle: angle,
        speed: 2 + Math.random() * 3
      };
      particles.push(new Particle(x, y, type, config));
    }
    return particles;
  }

  // Método para criar explosão
  static createExplosion(x, y, intensity = 1) {
    const particles = [];
    const count = Math.floor(8 * intensity);
    
    for (let i = 0; i < count; i++) {
      const config = {
        angle: Math.random() * Math.PI * 2,
        speed: (2 + Math.random() * 4) * intensity,
        life: 30 + Math.random() * 20
      };
      particles.push(new Particle(x, y, 'collision', config));
    }
    
    return particles;
  }
}
