#!/usr/bin/env node

/**
 * Script de build para combinar módulos ES6 em um arquivo único
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Pudge Runner - Build System');
console.log('🚀 Combinando módulos em arquivo único...\n');

const buildDir = './js';
const outputFile = './pudgerunner-built.js';

// Ordem de carregamento dos módulos
const moduleOrder = [
  'utils/EventEmitter.js',
  'core/Config.js',
  'utils/StorageManager.js',
  'systems/SpritePoolSystem.js',
  'systems/AssetLoader.js',
  'entities/Player.js',
  'entities/ObstacleSystem.js',
  'systems/ParticleSystem.js',
  'systems/RenderSystem.js',
  'systems/InputManager.js',
  'core/GameState.js',
  'core/GameManager.js'
];

let combinedCode = `
/**
 * PUDGE RUNNER - BUILT VERSION
 * Generated: ${new Date().toISOString()}
 * 
 * Este arquivo foi gerado automaticamente combinando todos os módulos.
 * Não edite diretamente - edite os arquivos fonte na pasta js/
 */

// ===== MÓDULOS COMBINADOS =====

`;

try {
  // Processar cada módulo na ordem
  moduleOrder.forEach((modulePath) => {
    const fullPath = path.join(buildDir, modulePath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`📦 Processando: ${modulePath}`);
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remover imports/exports e ajustar para script único
      content = content
        .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '') // Remove imports
        .replace(/import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '') // Remove import *
        .replace(/export\s+{[^}]+};?\s*/g, '') // Remove export lists
        .replace(/export\s+(class|const|let|var|function)/g, '$1') // Remove export keywords
        .replace(/export\s+default\s+/g, '') // Remove export default
        .trim();
      
      combinedCode += `
// ===== ${modulePath.toUpperCase()} =====
${content}

`;
    } else {
      console.warn(`⚠️  Arquivo não encontrado: ${fullPath}`);
    }
  });

  // Adicionar inicialização
  combinedCode += `
// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎮 Pudge Runner - Versão Built carregada!');
  
  try {
    // Criar instância do jogo
    const gameManager = new GameManager();
    
    // Expor globalmente para debug
    window.PudgeRunnerGame = gameManager;
    window.PudgeRunnerConfig = Config;
    
    // Inicializar o jogo
    await gameManager.initialize();
    
    console.log('✅ Jogo inicializado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar jogo:', error);
  }
});
`;

  // Escrever arquivo final
  fs.writeFileSync(outputFile, combinedCode);
  
  console.log(`\n✅ Build concluído!`);
  console.log(`📁 Arquivo gerado: ${outputFile}`);
  console.log(`📊 Tamanho: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
  console.log(`\n💡 Para usar: altere o script no HTML para:`);
  console.log(`   <script src="./pudgerunner-built.js"></script>`);

} catch (error) {
  console.error('❌ Erro durante build:', error);
  process.exit(1);
}
