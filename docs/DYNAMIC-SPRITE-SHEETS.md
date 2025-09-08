# 🎨 Configuração Dinâmica de Sprite Sheets

## 📊 Configurações Atuais

O sistema agora suporta **todos os sprites** de forma dinâmica. As configurações estão no método `getSpriteSheetConfigs()` em `Game.js`:

```javascript
getSpriteSheetConfigs() {
  return {
    pudge: {
      frameWidth: 66,
      frameHeight: 48,
      totalFrames: 8,
      framesPerRow: 8
    },
    boss: {
      frameWidth: 64,
      frameHeight: 64,
      totalFrames: 9,    // boss_frame_0 até boss_frame_8
      framesPerRow: 9
    },
    ghost: {
      frameWidth: 64,
      frameHeight: 64,
      totalFrames: 8,    // ghost_frame_0 até ghost_frame_7
      framesPerRow: 8
    },
    meepo: {
      frameWidth: 64,
      frameHeight: 64,
      totalFrames: 6,    // meepo_frame_0 até meepo_frame_5
      framesPerRow: 6
    },
    mad: {
      frameWidth: 64,
      frameHeight: 64,
      totalFrames: 4,    // mad_frame_0 até mad_frame_3
      framesPerRow: 4
    },
    spoon: {
      frameWidth: 64,
      frameHeight: 64,
      totalFrames: 45,   // spoon_frame_0 até spoon_frame_44
      framesPerRow: 15   // Grid 15x3
    }
  };
}
```

## 🗂️ Estrutura de Arquivos

### Sprite Sheets (Preferencial):
```
assets/imgs/
├── pudge.png     ← Sprite sheet 8 frames
├── boss.png      ← Sprite sheet 9 frames
├── ghost.png     ← Sprite sheet 8 frames
├── meepo.png     ← Sprite sheet 6 frames
├── mad.png       ← Sprite sheet 4 frames (se existir)
└── spoon.gif     ← Ainda em GIF (45 frames)
```

### Frames Individuais (Fallback):
```
assets/imgs/
├── boss/boss_frame_0.png ... boss_frame_8.png
├── ghost/ghost_frame_0.png ... ghost_frame_7.png
├── meepo/meepo_frame_0.png ... meepo_frame_5.png
├── mad/mad_frame_0.png ... mad_frame_3.png
└── spoon/spoon_frame_0.png ... spoon_frame_44.png
```

## ⚙️ Sistema de Carregamento

### 1. **Prioridade de Carregamento:**
1. **Sprite Sheet** (`sprite.png`) - Mais eficiente
2. **Frames Individuais** (`sprite/sprite_frame_X.png`) - Fallback
3. **Sprite Único** (`sprites.sprite`) - Último recurso

### 2. **Logs do Sistema:**
- `✅ Carregados X frames do [sprite] da sprite sheet` - Sucesso
- `🔄 Carregados X frames do [sprite] via fallback` - Fallback usado
- `⚠️ Usando sprite único para [sprite]` - Último recurso

## 🔧 Como Ajustar Configurações

### Para cada sprite, ajuste:

1. **frameWidth/frameHeight**: Dimensões de cada frame
2. **totalFrames**: Quantos frames existem
3. **framesPerRow**: Layout da sprite sheet

### Exemplo para Mad (se tiver sprite sheet):
```javascript
mad: {
  frameWidth: 48,     // Se cada frame for 48x48
  frameHeight: 48,
  totalFrames: 4,     // mad_frame_0 até mad_frame_3
  framesPerRow: 4     // Todos em linha horizontal
}
```

## 🧪 Ferramenta de Teste

Use `test-sprite-sheet.html` para:
1. **Visualizar** qualquer sprite sheet
2. **Testar configurações** antes de aplicar
3. **Verificar animações** extraídas
4. **Ajustar dimensões** dinamicamente

### Como usar:
1. Modifique o src da imagem no HTML para testar outros sprites
2. Ajuste os inputs de configuração
3. Clique "Extrair Frames"
4. Teste a animação

## 📈 Benefícios do Sistema Dinâmico

✅ **Flexibilidade**: Suporta qualquer sprite  
✅ **Performance**: Sprite sheets são mais eficientes  
✅ **Compatibilidade**: Fallback para frames individuais  
✅ **Manutenibilidade**: Configuração centralizada  
✅ **Debug**: Logs detalhados de carregamento  
✅ **Escalabilidade**: Fácil adicionar novos sprites  

## 🎯 Próximos Passos

1. **Teste** cada sprite individualmente
2. **Ajuste** as configurações conforme necessário
3. **Verifique** os logs no console
4. **Optimize** as dimensões para melhor performance

---

**Sistema**: Carregamento dinâmico implementado  
**Compatibilidade**: Total com sistema anterior  
**Performance**: Otimizada com sprite sheets
