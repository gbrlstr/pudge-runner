# Projeto: Pudge Runner - Enhanced Edition

## Descrição
Pudge Runner é um endless runner inspirado no personagem Pudge do DOTA 2, desenvolvido em HTML5 Canvas e JavaScript ES6+, com foco em responsividade mobile, performance e experiência de usuário. O objetivo é desviar de obstáculos, alcançar a maior pontuação possível e competir em rankings locais e globais.

## Estrutura do Projeto
- `index.html`: Página principal do jogo.
- `style.mobile.css`: CSS dedicado para dispositivos móveis.
- `assets/`: Imagens, sprites, sons e estilos para desktop.
- `js/`: Scripts do jogo, incluindo lógica principal (`pudgrunnerv2.js`), integração com Firebase e ranking global.

## Funcionalidades Principais
- Sistema de pulo responsivo e controles touch/teclado.
- Obstáculos dinâmicos e níveis progressivos de dificuldade.
- Sistema de pontuação com combo/multiplier e persistência via localStorage.
- Detecção de colisão otimizada.
- Interface moderna, responsiva e com animações fluidas.
- Background dinâmico com parallax multicamadas.
- Ranking global integrado ao Firebase.
- Suporte completo a mobile: canvas responsivo, controles touch, botão de som, orientação flexível.
- Performance otimizada: dirty rectangles, lazy loading, object pooling, monitor de FPS.

## Como Jogar
- **Desktop:**
  - Espaço: Pular
  - P: Pausar/despausar
  - R: Reiniciar
  - M: Alternar painéis mobile
- **Mobile:**
  - Toque: Pular
  - Dois dedos: Pausar/despausar
  - Botão 📱: Mostrar/ocultar painéis
  - Botão 🔊: Ativar/desativar som

## Instruções para Desenvolvimento
1. **Instalação:**
	- Não há dependências obrigatórias além de um navegador moderno.
	- Para ranking global, configure o Firebase em `js/firebase-config.js`.
2. **Execução:**
	- Abra `index.html` em um navegador.
	- Para testar responsividade, utilize as ferramentas de desenvolvedor do navegador.
3. **Customização:**
	- Adicione sprites em `assets/imgs/` e sons em `assets/sounds/`.
	- Ajuste estilos em `assets/style.css` (desktop) e `style.mobile.css` (mobile).
	- Modifique a lógica do jogo em `js/pudgrunnerv2.js`.
4. **Ranking Global:**
	- Configure as credenciais do Firebase em `js/firebase-config.js`.
	- O ranking é exibido automaticamente se o Firebase estiver configurado.
5. **Mobile:**
	- O layout e controles se adaptam automaticamente a dispositivos móveis.
	- O botão 📱 alterna a exibição dos painéis de interface.

## Boas Práticas
- Utilize arquitetura OOP para novas features.
- Prefira assets otimizados para melhor performance.
- Teste em diferentes dispositivos e orientações.
- Documente melhorias e correções em arquivos dedicados (`MOBILE_IMPROVEMENTS.md`, etc).

## Contribuição
- Fork, crie uma branch, faça commits e abra um Pull Request.
- Siga o padrão de código e mantenha a responsividade e performance.

## Licença
MIT. Veja o arquivo LICENSE.

---
Desenvolvido com ❤️ para a comunidade DOTA 2.
---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.