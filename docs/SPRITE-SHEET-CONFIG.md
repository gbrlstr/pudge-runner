# 🎨 Configuração da Sprite Sheet do Pudge

## 📏 Dimensões Configuráveis

Para ajustar o carregamento dos frames do Pudge, modifique as seguintes configurações no arquivo `Game.js`, método `loadPlayerFrames()`:

```javascript
const frameConfig = {
  frameWidth: 64,    // Largura de cada frame em pixels
  frameHeight: 64,   // Altura de cada frame em pixels
  totalFrames: 8,    // Total de frames na sprite sheet
  framesPerRow: 8    // Quantos frames por linha horizontal
};
```

## 🖼️ Layout da Sprite Sheet

### Assumindo Layout Horizontal (atual):
```
[Frame0] [Frame1] [Frame2] [Frame3] [Frame4] [Frame5] [Frame6] [Frame7]
```

### Se for Layout em Grid (modificar `framesPerRow`):
```
[Frame0] [Frame1] [Frame2] [Frame3]
[Frame4] [Frame5] [Frame6] [Frame7]
```
Para grid 4x2, configure: `framesPerRow: 4`

## 🔧 Como Ajustar

### 1. **Verificar dimensões da imagem**
- Abra `pudge.png` em um editor de imagem
- Anote largura total e altura total

### 2. **Calcular dimensões do frame**
```javascript
frameWidth = larguraTotal / framesPerRow
frameHeight = alturaTotal / numeroDeLinhas
```

### 3. **Exemplos comuns**

#### Sprite Sheet 512x64 (8 frames horizontais):
```javascript
frameWidth: 64,     // 512 ÷ 8 = 64
frameHeight: 64,    // altura da imagem
totalFrames: 8,
framesPerRow: 8
```

#### Sprite Sheet 256x128 (4x2 grid):
```javascript
frameWidth: 64,     // 256 ÷ 4 = 64
frameHeight: 64,    // 128 ÷ 2 = 64
totalFrames: 8,
framesPerRow: 4
```

## 🐛 Troubleshooting

### Problema: Frames cortados
- **Solução**: Ajustar `frameWidth` e `frameHeight`

### Problema: Frames vazios
- **Solução**: Verificar `totalFrames` e `framesPerRow`

### Problema: Animação estranha
- **Solução**: Verificar ordem dos frames na sprite sheet

## 📝 Logs para Debug

O sistema irá mostrar no console:
- `✅ Carregados X frames do player da sprite sheet` (sucesso)
- `Erro ao carregar sprite sheet do pudge` (erro)
- `🔄 Usando sprite fallback do pudge` (fallback ativado)

---

**Arquivo**: `../assets/imgs/pudge.png`
**Sistema**: Extração automática de frames
**Fallback**: Frames individuais + sprite padrão
