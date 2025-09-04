
import { Game } from './core/Game.js';
import { isMobile, getMobileScaleFactor } from './core/Utils.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });

// Função para ajustar o canvas responsivamente (pode ser refinada e movida para Utils futuramente)
function setResponsiveCanvas() {
	if (isMobile()) {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const scaleFactor = getMobileScaleFactor();
		const isLandscape = vw > vh;
		if (isLandscape) {
			let maxWidth = Math.min(vw * 0.98, vh * 2.5);
			let maxHeight = Math.min(vh * 0.90, vw / 1.4);
			canvas.width = Math.max(500, Math.min(maxWidth, 1200));
			canvas.height = Math.max(280, Math.min(maxHeight, 600));
		} else {
			const maxWidth = Math.min(vw * 0.98, vh * 1.2);
			const maxHeight = Math.min(vh * 0.65, vw / 0.9);
			canvas.width = Math.max(600, Math.min(maxWidth, 900));
			canvas.height = Math.max(400, Math.min(maxHeight, 600));
		}
		if (canvas.width / canvas.height < 1.3) {
			canvas.height = canvas.width / 1.4;
		}
		if (canvas.width / canvas.height > 2.1) {
			canvas.width = canvas.height * 2.0;
		}
		ctx.imageSmoothingEnabled = false;
		ctx.imageSmoothingQuality = 'low';
	} else {
		canvas.width = 1500;
		canvas.height = 500;
		canvas.style.width = canvas.width + 'px';
		canvas.style.height = canvas.height + 'px';
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
	}
}

setResponsiveCanvas();
window.addEventListener('resize', setResponsiveCanvas);
window.addEventListener('orientationchange', () => setTimeout(setResponsiveCanvas, 100));
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
