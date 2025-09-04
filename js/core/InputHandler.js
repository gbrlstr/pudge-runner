
import { isMobile } from './Utils.js';

export class InputHandler {
  constructor(game) {
    this.game = game;
    console.log("InputHandler initialized", this.game);

    // Keyboard event listeners
    window.addEventListener("keydown", (e) => {
      if ([
        "ArrowDown", "ArrowUp", " ", "w", "a", "d", "ArrowRight", "ArrowLeft"
      ].includes(e.key) && this.game.keys.indexOf(e.key) === -1) {
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
      const target = e.target;
      if (target.closest('button') || 
          target.closest('input') || 
          target.closest('.menu-overlay') ||
          target.closest('.sound-toggle') ||
          target.closest('.mobile-panel-toggle') ||
          target.closest('.score-panel') ||
          target.closest('.stats-details') ||
          target.closest('.controls-panel') ||
          target.closest('#globalRankingContainer')) {
        return;
      }
      e.preventDefault();
      if (isMobile()) {
        // Single touch to jump - improved for mobile
        if (!this.game.gameState.gameOver && !this.game.gameState.paused) {
          this.game.player.jump();
        }
      }
    });

    // Better mobile gesture support - sem auto restart
    window.addEventListener("touchend", (e) => {
      // Enhanced UI element detection to prevent accidental game actions
      const target = e.target;
      if (target.closest('button') || 
          target.closest('input') || 
          target.closest('.menu-overlay') ||
          target.closest('.sound-toggle') ||
          target.closest('.mobile-panel-toggle') ||
          target.closest('.score-panel') ||
          target.closest('.stats-details') ||
          target.closest('.controls-panel') ||
          target.closest('#globalRankingContainer')) {
        return; 
      }
      
      e.preventDefault();
      
    }, { passive: false });

    // Prevent default touch behaviors that might interfere
    window.addEventListener("touchmove", (e) => {
      e.preventDefault();
    }, { passive: false });

        // Enhanced visibilitychange for mobile - more selective pausing
    window.addEventListener("visibilitychange", (e) => {
      // Debug logging
      console.log("🔄 Visibility change:", {
        hidden: document.hidden,
        started: this.game.gameState.started,
        gameOver: this.game.gameState.gameOver,
        paused: this.game.gameState.paused,
        assetsLoaded: this.game.gameState.assetsLoaded,
        startTime: this.game.gameState.startTime,
        timeSinceStart: this.game.gameState.startTime > 0 ? Date.now() - this.game.gameState.startTime : 0
      });
      
      // Only pause if all conditions are met - very strict to avoid unwanted pausing
      if (
        document.hidden &&
        this.game.gameState.started &&
        !this.game.gameState.gameOver &&
        !this.game.gameState.paused &&
        this.game.gameState.assetsLoaded && // Assets must be loaded
        this.game.gameState.startTime > 0 && // Game must have actually started
        Date.now() - this.game.gameState.startTime > 2000 // Only after 2 seconds of actual gameplay
      ) {
        console.log("⏸️ Auto-pausing game due to visibility change");
        this.game.pauseGame();
      } else {
        console.log("🚫 Visibility change ignored - conditions not met for auto-pause");
      }
    });

    // Start and Restart button event listeners - melhorados para mobile
    this.game.elements.startButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.startGame();
    });
    
    this.game.elements.startButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.startGame();
    });
    
    this.game.elements.restartButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.restartGame();
    });
    
    this.game.elements.restartButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.game.restartGame();
    });
  }
}
