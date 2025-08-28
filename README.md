# 🎮 Pudge Runner - Enhanced Edition

Um jogo endless runner inspirado no personagem Pudge do DOTA 2. Desvie dos obstáculos e alcance a maior pontuação possível!

![Pudge Runner](https://img.shields.io/badge/Game-Pudge%20Runner-red)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

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
- **Background dinâmico** - Efeitos de paralaxe e gradientes animados
- **UI responsiva** - Adaptável a diferentes tamanhos de tela

### 🛠️ Recursos Técnicos
- **Arquitetura orientada a objetos** - Código modular e maintível
- **Sistema robusto de assets** - Fallbacks para sprites que falharem
- **Controles múltiplos** - Suporte a teclado e touch
- **Auto-pausa** - Pausa automática quando a aba perde foco
- **Persistência de dados** - Salva automaticamente o melhor score

## 🎮 Como Jogar

### Controles
- **ESPAÇO** - Pular
- **P** - Pausar/Despausar
- **R** - Reiniciar (quando game over)
- **M** - Voltar ao menu

### Objetivo
- Desvie dos obstáculos saltando no momento certo
- Sobreviva o máximo de tempo possível
- Alcance scores mais altos para desbloquear níveis mais difíceis
- Cada obstáculo desviado vale 10 pontos
- A velocidade e frequência dos obstáculos aumenta a cada 100 pontos

## 📁 Estrutura do Projeto

```
pudge-runner/
├── index.html          # Arquivo principal do jogo
├── README.md          # Este arquivo
├── .gitignore         # Arquivos ignorados pelo Git
└── assets/            # (Futuro) Pasta para sprites locais
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

## 🔮 Próximas Melhorias

### 🚀 **Performance e Otimização**

- [ ] **Sistema de Pool de Objetos** - Reutilização de obstáculos e partículas para melhor performance
- [ ] **Dirty Rectangles** - Re-renderização apenas de áreas modificadas
- [ ] **Otimização de Canvas** - Técnicas avançadas de renderização
- [ ] **Lazy Loading** - Carregamento sob demanda de assets

### 🎮 **Gameplay Avançado**

- [ ] **Sistema de Power-ups** - Invencibilidade, pulo duplo, câmera lenta
- [ ] **Sistema de Combo/Multiplier** - Pontuação multiplicada por sequências perfeitas
- [ ] **Modos de Jogo** - Survival, Time Attack, Challenge Mode
- [ ] **Boss Battles** - Chefes especiais em intervalos específicos
- [ ] **Sistema de Vidas** - Múltiplas chances com regeneração

### 🏆 **Sistema de Progressão**

- [ ] **Achievements/Conquistas** - 20+ conquistas desbloqueáveis
- [ ] **Sistema de Ranking** - Leaderboards locais e online
- [ ] **Desbloqueáveis** - Novos personagens, skins, efeitos
- [ ] **Sistema de Moedas** - Economia interna do jogo
- [ ] **Estatísticas Detalhadas** - Analytics de performance do jogador

### 🎨 **Melhorias Visuais**

- [ ] **Sistema de Partículas Avançado** - Efeitos visuais mais complexos
- [ ] **Animações de Transição** - Tweening e easing functions
- [ ] **Shaders e Filtros** - Efeitos visuais pós-processamento
- [ ] **Parallax Multilayer** - Background com múltiplas camadas
- [ ] **Weather System** - Chuva, neve, tempestades

### 🔊 **Sistema de Áudio Completo**

- [ ] **Música Dinâmica** - Trilha sonora adaptativa ao gameplay
- [ ] **Efeitos Sonoros** - SFX para todas as ações do jogo
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

- [ ] **Game Analytics** - Telemetria detalhada de gameplay
- [ ] **Performance Monitor** - FPS, memory usage em tempo real
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

- **HTML5 Canvas** - Renderização do jogo
- **JavaScript ES6+** - Lógica do jogo
- **CSS3** - Interface e estilos
- **Google Fonts** - Tipografia (Orbitron)
- **LocalStorage** - Persistência de dados

## 📱 Compatibilidade

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móveis (iOS/Android)

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
