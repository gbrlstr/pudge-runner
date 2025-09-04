
// Detecta se é dispositivo mobile
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fator de escala responsivo para mobile
export function getMobileScaleFactor() {
  if (!isMobile()) return 1;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const minDimension = Math.min(screenWidth, screenHeight);
  const aspectRatio = Math.max(screenWidth, screenHeight) / minDimension;
  if (minDimension <= 360) return 0.6;
  if (minDimension <= 375) return 0.65;
  if (minDimension <= 414) return 0.7;
  if (minDimension <= 480) return 0.75;
  if (aspectRatio > 2.0) return 0.7;
  return 0.8;
}

export function renderDirtyRects(context) {
  dirtyRects.forEach((rect) => {
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
    context.drawImage(rect.image, rect.x, rect.y, rect.width, rect.height);
  });
}