# 🎮 Pudge Runner - Enhanced Edition

Um jogo endless runner inspirado no personagem Pudge do DOTA 2. Desvie dos obstáculos e alcance a maior pontuação possível!

![Pudge Runner](https://img.shields.io/badge/Game-Pudge%20Runner-red)
![Version](https://img.shields.io/badge/Version-2.0-blue)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

## 🚀 Características

### 🎯 Gameplay
- **Sistema de pulo responsivo** - Controle preciso do personagem
- **Obstáculos dinâmicos** - Ganchos e árvores com diferentes padrões
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

## 🔧 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd pudge-runner
   ```

2. **Execute localmente:**
   - Abra `index.html` diretamente no navegador, ou
   - Use um servidor local simples:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (http-server)
     npx http-server
     
     # PHP
     php -S localhost:8000
     ```

3. **Acesse o jogo:**
   - Navegador: `file:///caminho/para/index.html`
   - Servidor local: `http://localhost:8000`

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

### Versão 2.0 - Enhanced Edition
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

### Versão Original (1.0)
- ✅ Gameplay básico funcional
- ✅ Sprites do DOTA 2
- ✅ Sistema de colisão
- ✅ Controles de teclado

## 🔮 Próximas Melhorias

- [ ] Sistema de som e música
- [ ] Power-ups especiais
- [ ] Múltiplos personagens jogáveis
- [ ] Modo multiplayer local
- [ ] Achievements/conquistas
- [ ] Customização de personagem
- [ ] Cenários variados
- [ ] Exportação para PWA (Progressive Web App)

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

**Desenvolvido com ❤️ para a comunidade DOTA 2**
