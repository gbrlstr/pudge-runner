
import { Game } from './core/Game.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

// Canvas setup - Web-only configuration
function setResponsiveCanvas() {
	canvas.width = 1500;
	canvas.height = 500;
	canvas.style.width = canvas.width + 'px';
	canvas.style.height = canvas.height + 'px';
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';
}

setResponsiveCanvas();
window.addEventListener('resize', setResponsiveCanvas);
window.setResponsiveCanvas = setResponsiveCanvas;


// Inicialização do jogo modular
const game = new Game(canvas.width, canvas.height);
window.game = game;

let lastTime = 0;
let fps = 0;
let frames = 0;
let fpsLastUpdate = 0;

function drawPerformanceMonitor(ctx) {
	ctx.save();
	ctx.font = 'bold 16px Orbitron, Arial';
	ctx.fillStyle = '#ffe082';
	ctx.globalAlpha = 0.85;
	ctx.fillText(`FPS: ${fps}`, 18, 28);
	ctx.restore();
}

function animate(timeStamp) {
	const deltaTime = timeStamp - lastTime;
	lastTime = timeStamp;
	frames++;
	
	// Atualizar FPS a cada 500ms para melhor performance
	if (timeStamp - fpsLastUpdate > 500) {
		fps = Math.round((frames * 1000) / (timeStamp - fpsLastUpdate));
		fpsLastUpdate = timeStamp;
		frames = 0;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game.update(deltaTime);
	game.draw(ctx);
	drawPerformanceMonitor(ctx);
	
	requestAnimationFrame(animate);
}

animate(0);
