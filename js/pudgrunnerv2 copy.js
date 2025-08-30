window.addEventListener("load", () => {
  // Canvas setup
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (
            // (e.key === "ArrowRight" ) || 
            // (e.key === "ArrowLeft") || 
            (e.key === "ArrowDown") || 
            (e.key === "ArrowUp") || 
            (e.key === " ")
            // (e.key === "w") ||
            // (e.key === "a") ||
            // (e.key === "d")
          )
            && this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
      });

      window.addEventListener("keyup", (e) => {
        if(this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 90;
      this.height = 90;
      this.x = 20;
      this.y = 190;
      this.speedX = 0;
      this.speedY = 0;
      this.maxSpeed = 5;
      this.gravity = 0.8;
      this.jumpPower = -16;
      this.onGround = false;
      this.groundY = this.game.height - this.height; // Posição do chão
    }
    update() {

      if(this.game.keys.indexOf("ArrowRight") > -1 || this.game.keys.indexOf("d") > -1)  this.speedX = this.maxSpeed;
      else if(this.game.keys.indexOf("ArrowLeft") > -1 || this.game.keys.indexOf("a") > -1)  this.speedX = -this.maxSpeed;
      else this.speedX = 0;
      if(this.game.keys.indexOf("ArrowUp") > -1 || this.game.keys.indexOf("w") > -1)  this.jump();
      if(this.game.keys.indexOf(" ") > -1)  this.jump();

      // Movimento horizontal
      this.x += this.speedX;

      // Aplicar gravidade
      this.speedY += this.gravity;
      this.y += this.speedY;

      // Verificar se está no chão
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.speedY = 0;
        this.onGround = true;
      } else {
        this.onGround = false;
      }

      // Boundaries horizontais
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.game.width)
        this.x = this.game.width - this.width;

      // Boundary superior
      if (this.y < 0) this.y = 0;
    }

    jump() {
      if (this.onGround) {
        this.speedY = this.jumpPower * 1.5;
        this.onGround = false;
      }
    }

    draw(context) {
      context.fillStyle = "black";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = -2;
    }
    update() {
      this.x += this.speedX * 2.0;
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 30;
      this.fontFamily = "Arial";
      this.color = 'white';
    }

    draw(context) {
      context.fillStyle = this.color;
      context.font = `${this.fontSize}px ${this.fontFamily}`;
      context.fillText("Score: " + this.game.score, 20, 40);
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 90;
      this.height = 90;
      this.y = (this.game.height - this.height);
      this.x = this.game.width;
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.keys = [];
      this.enemies = [];
      this.frame = 0;
      this.enemySpawnRate = 60; // frames (1 segundo a 60fps)
    }
    update(deltaTime) {
      this.player.update();
      this.enemies.forEach(enemy => {
        enemy.update();
        if (this.checkCollisions(this.player, enemy)) {
          this.handleCollision();
        }
      });
      this.enemies = this.enemies.filter(enemy => enemy.x + enemy.width > 0);
      this.frame++;
      if (this.frame % this.enemySpawnRate === 0) {
        this.addEnemy();
        // Sorteia novo intervalo de spawn para o próximo inimigo (entre 180 e 250 frames)
        this.enemySpawnRate = 180 + Math.floor(Math.random() * 70);
      }
    }
    draw(context) {
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach(enemy => enemy.draw(context));
    }
    addEnemy() {
      // Espaçamento mínimo: pelo menos 1.5x a largura do jogador
      const minDistance = this.player.width * 2.5;
      if (
        this.enemies.length === 0 ||
        (this.enemies[this.enemies.length - 1].x < this.width - minDistance)
      ) {
        const enemy = new Angler1(this);
        this.enemies.push(enemy);
      }
    }
    checkCollisions(rect1, rect2) {
      return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
      )
    }
  }

  const game = new Game(canvas.width, canvas.height);

  // Animation loop
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});
