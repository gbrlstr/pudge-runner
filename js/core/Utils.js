
export function renderDirtyRects(context) {
  dirtyRects.forEach((rect) => {
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
    context.drawImage(rect.image, rect.x, rect.y, rect.width, rect.height);
  });
}