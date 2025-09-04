# 🎮 Pudge Runner - Enhanced Edition

Um jogo endless runner inspirado no personagem Pudge do DOTA 2. Desvie dos obstáculos e alcance a maior pontuação possível!

![Pudge Runner](https://img.shields.io/badge/Game-Pudge%20Runner-red)
![Version](https://img.shields.io/badge/Version-4.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-green)
![Enhanced](https://img.shields.io/badge/Design-Profissional-gold)


## 🚀 Características

### 🎯 Gameplay
- **Sistema de pulo responsivo** - Controle preciso do personagem
- **Obstáculos dinâmicos** - Diversos objetos como obistaculos
- **Sistema de níveis progressivos** - Dificuldade aumenta gradualmente
- **Sistema de pontuação** - High score persistente com localStorage
- **Detecção de colisão otimizada** - Hitboxes mais perdoáveis para melhor jogabilidade

### 🎨 Visual e UI
- **Design moderno** - Interface estilizada com tema DOTA 2
- **Efeitos de partículas** - Partículas de pulo e colisão
- **Animações fluidas** - Movimento suave do personagem e obstáculos
- **Background dinâmico** - Sistema de parallax multicamadas com profundidade
- **UI responsiva** - Adaptável a diferentes tamanhos de tela e orientações
- **Ranking global responsivo** - Interface de leaderboard com emojis e breakpoints
- **Feedback visual** - Animações de hover, click e transições suaves

### 📱 Mobile & Responsive
- **CSS Mobile dedicado** - Arquivo CSS específico para dispositivos móveis
- **Canvas responsivo** - Dimensões dinâmicas sem rotação forçada
- **Escalamento inteligente** - Player e enemies redimensionados automaticamente
- **Controles touch otimizados** - Single touch (pulo) e gestos multi-touch
- **Botão de som responsivo** - Controle de áudio totalmente funcional no mobile
- **Orientação flexível** - Suporte completo a portrait e landscape
- **Performance otimizada** - Redução de elementos e partículas para melhor FPS

### 🛠️ Recursos Técnicos
- **Arquitetura orientada a objetos** - Código modular e maintível
- **Sistema robusto de assets** - Fallbacks para sprites que falharem
- **Controles múltiplos** - Suporte a teclado e touch
- **Auto-pausa** - Pausa automática quando a aba perde foco
- **Persistência de dados** - Salva automaticamente o melhor score

## 🎮 Como Jogar

### Controles Desktop

- **ESPAÇO** - Pular
- **P** - Pausar/Despausar
- **R** - Reiniciar (quando game over)
- **M** - Alternar painéis (mobile toggle)

### Controles Mobile

- **Toque simples** - Pular
- **Dois dedos** - Pausar/Despausar
- **Botão 📱** - Mostrar/ocultar painéis de interface
- **Botão 🔊** - Ativar/desativar som

### 📱 **Como Usar o Sistema de Painéis Móveis**

1. **No Mobile**: Painéis ficam ocultos automaticamente para maximizar gameplay
2. **Para mostrar painéis**: Toque no botão 📱 (canto superior esquerdo) ou pressione 'M'
3. **Para ocultar painéis**: Toque novamente no botão 📱 ou pressione 'M'
4. **Preferência salva**: O estado escolhido é lembrado para próximas sessões

### Objetivo
- Desvie dos obstáculos saltando no momento certo
- Sobreviva o máximo de tempo possível
- Alcance scores mais altos para desbloquear níveis mais difíceis
- Cada obstáculo desviado vale 10 pontos (multiplicado por combo)
- A velocidade e frequência dos obstáculos aumenta a cada 100 pontos

## 📁 Estrutura do Projeto

```text
pudge-runner/
├── index.html                  # Arquivo principal do jogo
├── style.mobile.css           # CSS responsivo para dispositivos móveis
├── README.md                  # Documentação principal
├── MOBILE_IMPROVEMENTS.md     # Documentação das melhorias mobile
├── MOBILE_FIXES.md           # Documentação das correções mobile
├── SOUND_BUTTON_FIXES.md     # Documentação das correções do botão de som
├── .gitignore                # Arquivos ignorados pelo Git
├── assets/                   # Assets do jogo
│   ├── style.css            # CSS profissional para desktop
│   ├── logo.png             # Ícone do jogo
│   ├── imgs/                # Sprites e imagens
│   │   ├── pudg.gif        # Sprite do player
│   │   ├── ground.png      # Textura do chão
│   │   ├── background/     # Imagens de parallax
│   │   ├── boss/           # Frames de animação do boss
│   │   ├── meepo/          # Frames de animação do meepo
│   │   ├── ghost/          # Frames de animação do ghost
│   │   ├── mad/            # Frames de animação do mad
│   │   ├── spoon/          # Frames de animação do spoon
│   │   └── pudge/          # Frames de animação do pudge
│   └── sounds/              # Arquivos de áudio
│       ├── background.mp3   # Música de fundo
│       ├── kill.ogg        # Efeito de kill
│       ├── pudge_jump_*.mpeg
│       ├── pudge_levelup_*.mpeg
│       ├── pudge_lose_*.mpeg
│       └── pudge_respawn_*.mpeg
└── js/                      # Scripts modulares do jogo
    ├── main.js             # Entry point principal
    ├── core/               # Módulos principais
    │   ├── Game.js         # Lógica principal do jogo
    │   ├── AssetManager.js # Gerenciamento de assets
    │   ├── Player.js       # Classe do jogador
    │   ├── Enemy.js        # Classe dos inimigos
    │   ├── Particle.js     # Sistema de partículas
    │   └── Background.js   # Sistema de background
    ├── utils/              # Utilitários
    │   ├── utils.js        # Funções utilitárias
    │   └── constants.js    # Constantes do jogo
    ├── firebase-config.js  # Configuração do Firebase
    ├── firebase-rank.js    # Sistema de ranking global
    ├── pudgrunnerv2.js     # Versão legada (backup)
    └── pudgerunner.js      # Versão original (backup)
```

## 🎯 Níveis de Dificuldade

| Nível | Nome | Velocidade | Spawn Rate | Score Necessário |
|-------|------|------------|------------|------------------|
| 1 | Iniciante | 5 | 120 frames | 0 |
| 2 | Fácil | 6 | 110 frames | 100 |
| 3 | Normal | 7 | 100 frames | 200 |
| 4 | Difícil | 8 | 90 frames | 300 |
| 5 | Expert | 9 | 80 frames | 400 |
| 6 | Insano | 10 | 70 frames | 500+ |

## 🚀 Melhorias Implementadas

### Versão 1.0 - Enhanced Edition
- ✅ Arquitetura completamente reescrita em OOP
- ✅ Interface moderna com tema DOTA 2
- ✅ Sistema de partículas e efeitos visuais
- ✅ Múltiplas telas (menu, loading, game over, pausa)
- ✅ Sistema de níveis progressivos
- ✅ Persistência de high score
- ✅ Responsividade para dispositivos móveis
- ✅ Animações e transições suaves
- ✅ Sistema robusto de carregamento de assets
- ✅ Controles touch para mobile

### Versão 1.1 - Performance & Assets
- ✅ Dirty Rectangles - Re-renderização apenas de áreas modificadas
- ✅ Otimização de Canvas - Técnicas avançadas de renderização
- ✅ Lazy Loading - Carregamento sob demanda de assets
- ✅ Performance Monitor - FPS em tempo real
- ✅ Sistema de Combo/Multiplier - Pontuação multiplicada por combos
- ✅ Estatísticas Detalhadas - Jumps, dodges, collisions, play time

### Versão 2.0 - Mobile Optimization & Fixes
- ✅ **Responsividade Mobile Completa** - Layout totalmente otimizado para dispositivos móveis
- ✅ **CSS Mobile Dedicado** - Arquivo CSS específico para mobile (`style.mobile.css`)
- ✅ **Canvas Responsivo** - Dimensões dinâmicas para landscape/portrait sem rotação
- ✅ **Escalamento Inteligente** - Player e enemies redimensionados automaticamente (0.65x-0.8x)
- ✅ **Parallax Otimizado** - Sistema de background com múltiplas camadas funcionando no mobile
- ✅ **Ranking Global Responsivo** - Interface de ranking adaptativa com emojis e breakpoints
- ✅ **Controles Touch Aprimorados** - Single touch (pulo) e two-finger touch (pause)
- ✅ **Performance Mobile** - Redução de partículas, elementos e otimizações específicas
- ✅ **Ícone de Som Responsivo** - Botão de som totalmente funcional e posicionado no mobile
- ✅ **Sistema de Mute Robusto** - Controle de áudio com retry system e feedback visual
- ✅ **Suporte Multi-Orientação** - Funciona em portrait e landscape com ajustes automáticos

### Versão 3.0 - Modular Architecture & Audio Enhancement
- ✅ **Arquitetura Modular Completa** - Sistema de módulos ES6 com separação clara de responsabilidades
- ✅ **AssetManager Avançado** - Gerenciamento centralizado de assets com fallbacks e retry
- ✅ **Sistema de Áudio Profissional** - Controle de volume, mute, e música de fundo integrados
- ✅ **Game State Management** - Gerenciamento robusto de estados do jogo
- ✅ **Performance Optimization** - Object pooling e otimizações de renderização
- ✅ **Error Handling Robusto** - Sistema de tratamento de erros com fallbacks
- ✅ **Code Organization** - Estrutura de pastas organizada por funcionalidade
- ✅ **Debug System** - Console de debug e monitoramento de performance
- ✅ **Audio State Synchronization** - Sincronização perfeita entre HTML e JavaScript
- ✅ **Modular Loading System** - Carregamento assíncrono de módulos
- ✅ **Enhanced Game Loop** - Loop de jogo otimizado com delta time

### Versão 4.0 - Enhanced UI/UX & Visual Excellence
- ✅ **Enhanced UI Design** - Interface completamente redesenhada com design profissional
- ✅ **Advanced CSS System** - Sistema de CSS com custom properties e gradientes sofisticados
- ✅ **Glass-morphism Effects** - Efeitos modernos de glass-morphism e backdrop blur
- ✅ **Enhanced Score Panel** - Painel de pontuação compacto e elegante
- ✅ **Enhanced Final Score Display** - Tela de game over redesenhada com informações detalhadas
- ✅ **Enhanced Ranking System** - Sistema de ranking global com design premium
- ✅ **Advanced Animations** - Animações fluidas e efeitos visuais sofisticados
- ✅ **Responsive Scrollbar Design** - Scrollbars customizadas sem fundos brancos
- ✅ **Achievement System** - Sistema de conquistas com detecção de novos recordes
- ✅ **Premium Visual Effects** - Efeitos de shimmer, glow e transições avançadas
- ✅ **Micro-interactions** - Feedback visual em todos os elementos interativos
- ✅ **Enhanced Typography** - Sistema tipográfico hierárquico com Google Fonts

#### 🔧 Correções Específicas Mobile
- ✅ **Parallax Background**: Corrigido carregamento de múltiplas camadas no mobile
- ✅ **Ranking Display**: Sistema de responsividade com containers adaptativos
- ✅ **Canvas Sizing**: Proporções otimizadas (96vw×48vh landscape, 92vw×42vh portrait)
- ✅ **Sound Button**: Posicionamento automático com ResizeObserver e event listeners
- ✅ **Touch Events**: Prevenção de gestos nativos e otimização de performance
- ✅ **Global Game Access**: `window.game` para controle de áudio externo

#### 🎨 Melhorias Visuais Profissionais (v4.0)
- ✅ **Design System Completo**: Paleta de cores profissional com variáveis CSS
- ✅ **UI Panels Premium**: Painéis com glass-morphism e bordas elegantes
- ✅ **Score Display Avançado**: Pontuação com formatação numérica e hierarquia visual
- ✅ **Final Score Redesign**: Container profissional com detalhes de performance
- ✅ **Ranking Interface Premium**: Design de ranking com medalhas e animações
- ✅ **Scrollbar Customização**: Scrollbars temáticas sem interferências visuais
- ✅ **Responsive Excellence**: Design responsivo profissional para todos os dispositivos

#### 📱 Compatibilidade Mobile
- ✅ **iPhone SE** (375px): Escala 0.65x otimizada
- ✅ **iPhone 6/7/8 Plus** (414px): Escala 0.7x balanceada  
- ✅ **Android Small** (até 480px): Escala 0.75x adaptativa
- ✅ **Tablets**: Otimizações específicas para landscape (85vw × 55vh)
- ✅ **Chrome Mobile, Safari iOS, Firefox Mobile, Samsung Internet**

## 🔮 Próximas Melhorias

### 🚀 **Performance e Otimização**

- [x] **Sistema de Pool de Objetos** - Reutilização de obstáculos e partículas para melhor performance
- [x] **Dirty Rectangles** - Re-renderização apenas de áreas modificadas
- [x] **Otimização de Canvas** - Técnicas avançadas de renderização
- [x] **Lazy Loading** - Carregamento sob demanda de assets
- [x] **Performance Monitor** - FPS, memory usage em tempo real

### 🎮 **Gameplay Avançado**

- [x] **Animação player e mobs** - Adicionar animação dos player e mobs
- [x] **Sistema de Combo/Multiplier** - Pontuação multiplicada por sequências perfeitas
- [x] **Estatísticas Detalhadas** - Analytics de performance do jogador
- [ ] **Sistema de Vidas** - Múltiplas chances com regeneração
- [ ] **Sistema de Power-ups** - Invencibilidade, pulo duplo, câmera lenta
- [ ] **Modos de Jogo** - Survival, Time Attack, Challenge Mode
- [ ] **Boss Battles** - Chefes especiais em intervalos específicos
- [ ] **Sistema de multiplayer** - Suporte para multi players

### 🏆 **Sistema de Progressão**

- [x] **Sistema de Ranking** - Leaderboards locais e online
- [x] **Estatísticas Detalhadas** - Analytics de performance do jogador
- [x] **Achievement System Básico** - Detecção de novos recordes
- [ ] **Achievements Expandidos** - 20+ conquistas desbloqueáveis
- [ ] **Sistema de Moedas** - Economia interna do jogo
- [ ] **Profile System** - Perfis de jogador com histórico

### 🎨 **Melhorias Visuais**

- [x] **Suporte mobile** - Suporte a mobile
- [x] **Mostrar FPS** - Exibir FPS
- [x] **Parallax Multilayer** - Background com múltiplas camadas
- [x] **Sistema de Partículas Avançado** - Efeitos visuais complexos
- [x] **Enhanced UI Design** - Interface moderna com glass-morphism
- [x] **Advanced Animations** - Animações premium e micro-interactions
- [ ] **Shaders e Filtros** - Efeitos visuais pós-processamento
- [ ] **Dynamic Lighting** - Sistema de iluminação dinâmica
- [ ] **Weather Effects** - Efeitos climáticos

### 🔊 **Sistema de Áudio Completo**

- [x] **Sistema de Áudio Profissional** - Controle de volume e mute integrados
- [x] **Música Dinâmica** - Trilha sonora adaptativa ao gameplay
- [x] **Efeitos Sonoros** - SFX para todas as ações do jogo
- [x] **Audio State Management** - Sincronização perfeita entre componentes
- [ ] **Mixagem de Áudio** - Controle independente de música/efeitos
- [ ] **Audio Ducking** - Redução automática de música durante SFX
- [ ] **Feedback Háptico** - Vibração em dispositivos móveis
- [ ] **3D Audio** - Audio espacial para maior imersão

### 🛠️ **Arquitetura e Código**

- [x] **Modular Architecture** - Sistema de módulos ES6 com separação de responsabilidades
- [x] **AssetManager Advanced** - Gerenciamento centralizado com fallbacks
- [x] **State Machine** - Gerenciamento robusto de estados do jogo
- [x] **Error Handling** - Sistema de tratamento de erros robusto
- [ ] **Component System** - Arquitetura baseada em componentes ECS
- [ ] **Event System** - Sistema de eventos desacoplado
- [ ] **Save System** - Salvamento completo do progresso
- [ ] **Config Manager** - Sistema de configurações personalizáveis

### 📱 **Responsividade e Acessibilidade**

- [x] **Responsive Design Enhanced** - Design responsivo de alta qualidade
- [x] **Mobile Optimization Complete** - Otimização completa para mobile
- [x] **Touch Controls Advanced** - Controles touch profissionais
- [ ] **Viewport Adaptativo** - Adaptação automática a qualquer resolução
- [ ] **Controles Customizáveis** - Remapeamento de teclas
- [ ] **Acessibilidade** - Suporte a leitores de tela e daltonismo
- [ ] **PWA (Progressive Web App)** - Instalação como app nativo
- [ ] **Offline Mode** - Funcionamento sem conexão

### 🔗 **Recursos Sociais**

- [x] **Ranking Global Enhanced** - Sistema de ranking com design premium
- [ ] **Compartilhamento** - Share de scores nas redes sociais
- [ ] **Screenshots** - Captura de momentos épicos
- [ ] **Replay System** - Gravação e reprodução de partidas
- [ ] **Multiplayer Local** - Modo cooperativo/competitivo
- [ ] **Cloud Save** - Sincronização entre dispositivos

### 🎭 **Personalização**

- [x] **Enhanced Theme System** - Sistema de cores e design profissional
- [ ] **Editor de Níveis** - Criação de fases personalizadas
- [ ] **Mod Support** - Suporte básico a modificações
- [ ] **Theme System Expandido** - Temas visuais alternativos
- [ ] **Custom Sprites** - Upload de sprites personalizados
- [ ] **Difficulty Scaling** - Ajuste manual de dificuldade

### 📊 **Analytics e Debug**

- [x] **Performance Monitor** - FPS, memory usage em tempo real
- [x] **Debug System** - Console de debug e monitoramento
- [ ] **Game Analytics** - Telemetria detalhada de gameplay
- [ ] **Debug Console** - Console de comandos para desenvolvimento
- [ ] **A/B Testing** - Testes de diferentes mecânicas
- [ ] **Crash Reporting** - Sistema de relatório de erros

## 📋 **Roadmap de Desenvolvimento**

### **Versão 4.0 - Enhanced Edition** ✅ **COMPLETA**

- ✅ **Enhanced UI/UX Design** - Interface redesenhada com design premium
- ✅ **Advanced CSS System** - Sistema profissional com custom properties
- ✅ **Modular Architecture** - Arquitetura ES6 modular completa
- ✅ **Enhanced Audio System** - Sistema de áudio robusto e sincronizado
- ✅ **Enhanced Ranking** - Sistema de ranking com design premium
- ✅ **Advanced Final Score** - Tela de game over profissional com detalhes
- ✅ **Responsive Excellence** - Design responsivo de alta qualidade

### **Versão 4.1 - Gameplay Enhancement** (2-3 semanas)

- 🔄 **Sistema de Vidas** - Múltiplas chances com regeneração visual
- 🔄 **Power-ups Básicos** - 3-5 power-ups fundamentais (invencibilidade, pulo duplo)
- 🔄 **Achievement System Expandido** - 15+ conquistas com notificações
- 🔄 **Audio Enhancements** - Mixagem independente música/efeitos

### **Versão 4.2 - Social & Performance** (3-4 semanas)

- � **Compartilhamento Social** - Share de scores nas redes sociais
- 🔄 **Screenshot System** - Captura de momentos épicos
- 🔄 **Performance Analytics** - Telemetria detalhada de gameplay
- � **PWA Conversion** - Progressive Web App com instalação nativa

### **Versão 4.5 - Advanced Features** (4-5 semanas)

- 🔄 **Multiplayer Local** - Modo cooperativo/competitivo
- � **Editor de Níveis Básico** - Criação de fases personalizadas
- � **Sistema de Moedas** - Economia interna do jogo
- 🔄 **Theme System Expandido** - Múltiplos temas visuais

### **Versão 5.0 - Major Evolution** (6-8 semanas)

- 🔄 **Novos Modos de Jogo** - Survival, Time Attack, Challenge Mode
- 🔄 **Boss Battles** - Chefes especiais com mecânicas únicas
- 🔄 **Component System (ECS)** - Arquitetura Entity-Component-System
- � **3D Audio & Haptic Feedback** - Audio espacial e vibração

### **Versão 5.5 - Community Edition** (8-10 semanas)

- 🔄 **Cloud Save System** - Sincronização entre dispositivos
- 🔄 **Replay System** - Gravação e reprodução de partidas
- 🔄 **Mod Support Básico** - Suporte a modificações da comunidade
- 🔄 **Global Tournaments** - Eventos competitivos globais

### **Legenda:**
- ✅ **Completa** - Funcionalidade implementada e testada
- 🔄 **Planejada** - No roadmap de desenvolvimento
- � **Em Progresso** - Atualmente sendo desenvolvida

## 🛠️ Tecnologias Utilizadas

- **HTML5 Canvas** - Renderização do jogo com otimizações mobile e desktop
- **JavaScript ES6+ Modules** - Arquitetura modular com classes e imports/exports
- **CSS3 Enhanced Design** - Sistema de design profissional com custom properties
- **Google Fonts (Orbitron & Montserrat)** - Tipografia hierárquica premium
- **LocalStorage** - Persistência de dados local e preferências do usuário
- **Firebase** - Sistema de ranking global em tempo real
- **ResizeObserver API** - Detecção inteligente de mudanças de layout
- **Touch Events API** - Controles touch otimizados para mobile
- **Canvas 2D Context** - Renderização avançada com dirty rectangles
- **CSS Grid & Flexbox** - Layout responsivo profissional
- **Web Audio API** - Sistema de áudio com controle de volume
- **CSS Custom Properties** - Sistema de variáveis para design consistente
- **Intersection Observer** - Otimizações de performance visual
- **Glass-morphism CSS** - Efeitos modernos de transparência e blur

## 📱 Compatibilidade

### Desktop
- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Mobile
- ✅ Chrome Mobile (Android)
- ✅ Safari iOS (iPhone/iPad)
- ✅ Firefox Mobile
- ✅ Samsung Internet
- ✅ Opera Mobile

### Dispositivos Testados
- ✅ iPhone SE, 6, 7, 8, Plus series
- ✅ Android devices (375px - 480px+)
- ✅ Tablets (portrait e landscape)
- ✅ Desktop (1920x1080+)

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎮 Inspiração

Baseado no universo de DOTA 2 da Valve Corporation. Este é um projeto fan-made não oficial criado para fins educacionais e de entretenimento.

---

### 🌟 **Pudge Runner - Enhanced Edition v4.0**

Uma evolução completa do conceito original, agora com arquitetura modular profissional, design de interface premium, sistema de áudio avançado e experiência de usuário de alta qualidade. 

**Destaques da v4.0:**
- 🎨 Interface redesenhada com design profissional
- 🏗️ Arquitetura modular ES6 completa
- 🔊 Sistema de áudio sincronizado e robusto
- 📱 Responsividade mobile de excelência
- 🏆 Sistema de ranking com design premium
- ✨ Animações e efeitos visuais avançados

---

Desenvolvido com ❤️ para a comunidade DOTA 2 | **Enhanced Edition 2025**
