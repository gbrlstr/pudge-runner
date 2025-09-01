# 🎮 Pudge Runner - Enhanced Edition

Um jogo endless runner inspirado no personagem Pudge do DOTA 2. Desvie dos obstáculos e alcance a maior pontuação possível!

![Pudge Runner](https://img.shields.io/badge/Game-Pudge%20Runner-red)
![Version](https://img.shields.io/badge/Version-1.2-blue)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-green)

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
- **M** - Voltar ao menu

### Controles Mobile
- **Toque simples** - Pular
- **Dois dedos** - Pausar/Menu (durante o jogo)
- **Botão de som** - Ativar/Desativar áudio
- **Rotação automática** - Suporte a portrait e landscape

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
│   ├── style.css            # CSS para desktop
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
└── js/                      # Scripts do jogo
    ├── pudgrunnerv2.js     # Lógica principal do jogo
    ├── firebase-config.js  # Configuração do Firebase
    └── firebase-rank.js    # Sistema de ranking global
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

### Versão 1.2 - Mobile Optimization & Fixes
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

#### 🔧 Correções Específicas Mobile
- ✅ **Parallax Background**: Corrigido carregamento de múltiplas camadas no mobile
- ✅ **Ranking Display**: Sistema de responsividade com containers adaptativos
- ✅ **Canvas Sizing**: Proporções otimizadas (96vw×48vh landscape, 92vw×42vh portrait)
- ✅ **Sound Button**: Posicionamento automático com ResizeObserver e event listeners
- ✅ **Touch Events**: Prevenção de gestos nativos e otimização de performance
- ✅ **Global Game Access**: `window.game` para controle de áudio externo

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
- [ ] **Sistema de Vidas** - Múltiplas chances com regeneração
- [ ] **Sistema de Power-ups** - Invencibilidade, pulo duplo, câmera lenta
- [ ] **Modos de Jogo** - Survival, Time Attack, Challenge Mode
- [ ] **Boss Battles** - Chefes especiais em intervalos específicos
- [ ] **Sistema de multiplayer** - Suporte para multi players

### 🏆 **Sistema de Progressão**

- [x] **Sistema de Ranking** - Leaderboards locais e online
- [x] **Estatísticas Detalhadas** - Analytics de performance do jogador
- [ ] **Achievements/Conquistas** - 20+ conquistas desbloqueáveis
- [ ] **Sistema de Moedas** - Economia interna do jogo

### 🎨 **Melhorias Visuais**

- [x] **Suporte mobile** - Suporte a mobile
- [x] **Mostrar FPS** - Exibir FPS
- [x] **Parallax Multilayer** - Background com múltiplas camadas
- [x] **Sistema de Partículas Avançado** - Efeitos visuais mais complexos
- [x] **Shaders e Filtros** - Efeitos visuais pós-processamento
- [ ] **Melhorar o modo mobile** - Fazer melhorias para o modo mobile

### 🔊 **Sistema de Áudio Completo**

- [x] **Efeito de audio kill e background** - Efeito de musica basica
- [x] **Música Dinâmica** - Trilha sonora adaptativa ao gameplay
- [x] **Efeitos Sonoros** - SFX para todas as ações do jogo
- [ ] **Mixagem de Áudio** - Controle independente de música/efeitos
- [ ] **Audio Ducking** - Redução automática de música durante SFX
- [ ] **Feedback Háptico** - Vibração em dispositivos móveis

### 🛠️ **Arquitetura e Código**

- [ ] **State Machine** - Gerenciamento robusto de estados do jogo
- [ ] **Component System** - Arquitetura baseada em componentes
- [ ] **Event System** - Sistema de eventos desacoplado
- [ ] **Save System** - Salvamento completo do progresso
- [ ] **Config Manager** - Sistema de configurações personalizáveis

### 📱 **Responsividade e Acessibilidade**

- [ ] **Viewport Adaptativo** - Adaptação automática a qualquer resolução
- [ ] **Controles Customizáveis** - Remapeamento de teclas
- [ ] **Acessibilidade** - Suporte a leitores de tela e daltonismo
- [ ] **PWA (Progressive Web App)** - Instalação como app nativo
- [ ] **Offline Mode** - Funcionamento sem conexão

### 🔗 **Recursos Sociais**

- [ ] **Compartilhamento** - Share de scores nas redes sociais
- [ ] **Screenshots** - Captura de momentos épicos
- [ ] **Replay System** - Gravação e reprodução de partidas
- [ ] **Multiplayer Local** - Modo cooperativo/competitivo
- [ ] **Cloud Save** - Sincronização entre dispositivos

### 🎭 **Personalização**

- [ ] **Editor de Níveis** - Criação de fases personalizadas
- [ ] **Mod Support** - Suporte básico a modificações
- [ ] **Theme System** - Temas visuais alternativos
- [ ] **Custom Sprites** - Upload de sprites personalizados
- [ ] **Difficulty Scaling** - Ajuste manual de dificuldade

### 📊 **Analytics e Debug**

- [x] **Performance Monitor** - FPS, memory usage em tempo real
- [ ] **Game Analytics** - Telemetria detalhada de gameplay
- [ ] **Debug Console** - Console de comandos para desenvolvimento
- [ ] **A/B Testing** - Testes de diferentes mecânicas
- [ ] **Crash Reporting** - Sistema de relatório de erros

## 📋 **Roadmap de Desenvolvimento**

### **Versão 1.1 - Audio & Power-ups** (2-3 semanas)

- 🔊 Sistema básico de áudio
- 🎮 3-5 power-ups fundamentais
- 📱 Melhor responsividade mobile
- 🎨 Partículas aprimoradas

### **Versão 1.2 - Progressão & Social** (3-4 semanas)

- 🏆 Sistema de achievements (15+ conquistas)
- ⚙️ Configurações personalizáveis
- 📊 Estatísticas básicas
- 🔗 Compartilhamento social

### **Versão 1.5 - Performance & UX** (4-5 semanas)

- 🚀 Object pooling e otimizações
- 🎭 State machine implementation
- 📱 PWA conversion
- 🛠️ Sistema de configuração avançado

### **Versão 2.0 - Major Update** (6-8 semanas)

- 🎮 Novos modos de jogo
- 👥 Multiplayer local
- 🎨 Sistema de temas
- 🔧 Editor básico de níveis

### **Versão 2.5 - Community Edition** (8-10 semanas)

- 🌐 Features online
- 🏆 Leaderboards globais
- 🎬 Sistema de replay
- 🛠️ Mod support básico

## 🛠️ Tecnologias Utilizadas

- **HTML5 Canvas** - Renderização do jogo com otimizações mobile
- **JavaScript ES6+** - Lógica do jogo com arquitetura OOP
- **CSS3** - Interface responsiva com breakpoints mobile
- **Google Fonts** - Tipografia (Orbitron)
- **LocalStorage** - Persistência de dados local
- **Firebase** - Sistema de ranking global
- **ResizeObserver API** - Detecção de mudanças de layout
- **Touch Events API** - Controles touch otimizados
- **Canvas 2D Context** - Renderização com dirty rectangles

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

---

Desenvolvido com ❤️ para a comunidade DOTA 2
