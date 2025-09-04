# 🤝 Contributing Guide

Welcome to Pudge Runner! We're excited that you want to contribute to this open-source DOTA 2-inspired endless runner game.

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Git for version control
- Code editor (VS Code recommended)
- Basic knowledge of HTML5, CSS3, and JavaScript ES6+

### Getting Started

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/pudge-runner.git
   cd pudge-runner
   ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies (optional, for development server)
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Start Contributing!**
   - Make your changes
   - Test thoroughly
   - Commit and push
   - Open a Pull Request

## 📋 Types of Contributions

### 🐛 Bug Reports

Found a bug? Help us fix it!

**Before Reporting:**
- Check existing [issues](https://github.com/gbrlstr/pudge-runner/issues)
- Test in different browsers
- Try on both desktop and mobile

**Bug Report Template:**
```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment:**
- Browser: [e.g. Chrome 91]
- Device: [e.g. iPhone 12, Windows PC]
- Game Version: [e.g. 4.0.0]
```

### ✨ Feature Requests

Have an idea? We'd love to hear it!

**Feature Request Template:**
```markdown
**Feature Description**
A clear description of the feature you'd like to see.

**Problem It Solves**
What problem does this feature address?

**Proposed Solution**
How would you implement this feature?

**Additional Context**
Any other context, mockups, or examples.
```

### 🔧 Code Contributions

#### Areas We Need Help With

1. **Gameplay Features**
   - New enemy types
   - Power-up systems
   - Game modes
   - Boss battles

2. **Visual Improvements**
   - UI/UX enhancements
   - Animation improvements
   - Mobile optimizations
   - Theme systems

3. **Performance Optimization**
   - Rendering optimizations
   - Memory management
   - Mobile performance
   - Audio optimization

4. **Technical Improvements**
   - Code refactoring
   - Documentation
   - Testing infrastructure
   - Accessibility features

## 🏗️ Development Guidelines

### Code Style

#### JavaScript Standards
```javascript
// Use ES6+ features
import { Game } from './core/Game.js';

// Consistent naming
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.spawnRate = 120;
    }
    
    // Clear method names
    spawnEnemy() {
        // Implementation
    }
}

// Use arrow functions for callbacks
enemies.forEach(enemy => enemy.update());

// Consistent indentation (2 spaces)
if (condition) {
  doSomething();
}
```

#### CSS Guidelines
```css
/* Use BEM naming convention */
.game-container {
  /* Container styles */
}

.game-container__panel {
  /* Panel styles */
}

.game-container__panel--hidden {
  /* Hidden state */
}

/* Mobile-first approach */
.ui-panel {
  width: 100%;
}

@media (min-width: 768px) {
  .ui-panel {
    width: 300px;
  }
}
```

#### HTML Structure
```html
<!-- Semantic HTML -->
<main class="game-container">
  <section class="ui-panel score-panel">
    <h2 class="sr-only">Score Information</h2>
    <!-- Panel content -->
  </section>
</main>
```

### File Organization

```
js/
├── core/              # Core game classes
│   ├── Game.js       # Main game logic
│   ├── Player.js     # Player management
│   └── ...
├── utils/            # Utility functions
│   ├── Utils.js      # Helper functions
│   └── Config.js     # Configuration
└── main.js           # Entry point
```

### Performance Considerations

#### Canvas Optimization
```javascript
// Good: Batch operations
ctx.save();
enemies.forEach(enemy => {
    enemy.render(ctx);
});
ctx.restore();

// Avoid: Individual operations
enemies.forEach(enemy => {
    ctx.save();
    enemy.render(ctx);
    ctx.restore();
});
```

#### Mobile Performance
```javascript
// Reduce particle count on mobile
const particleCount = isMobile() ? 3 : 8;

// Simplify animations on mobile
if (isMobile()) {
    // Use simpler animation
} else {
    // Use complex animation
}
```

### Testing Guidelines

#### Manual Testing Checklist
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile devices (iOS Safari, Chrome Mobile)
- [ ] Different screen sizes and orientations
- [ ] Touch controls work properly
- [ ] Audio plays correctly
- [ ] Performance maintains target FPS
- [ ] No console errors

#### Performance Testing
```javascript
// Monitor FPS
let fps = 0;
let lastTime = performance.now();

function gameLoop(currentTime) {
    fps = 1000 / (currentTime - lastTime);
    lastTime = currentTime;
    
    if (fps < 30) {
        console.warn('Low FPS detected:', fps);
    }
}
```

## 📝 Documentation

### Code Documentation

```javascript
/**
 * Manages enemy spawning and behavior
 * @class EnemyManager
 */
class EnemyManager {
    /**
     * Spawns a new enemy at the specified position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} type - Enemy type ('boss', 'meepo', etc.)
     * @returns {Enemy} The spawned enemy instance
     */
    spawnEnemy(x, y, type) {
        // Implementation
    }
}
```

### README Updates

When adding features:
- Update feature list
- Add new screenshots if relevant
- Update installation/usage instructions
- Document any new configuration options

## 🔄 Pull Request Process

### Before Submitting

1. **Test Thoroughly**
   - Test in multiple browsers
   - Test on mobile devices
   - Check for console errors
   - Verify performance impact

2. **Code Quality**
   - Follow style guidelines
   - Add comments for complex logic
   - Remove debug code
   - Optimize for performance

3. **Documentation**
   - Update relevant documentation
   - Add code comments
   - Update CHANGELOG.md if needed

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Code refactoring

## Testing
- [ ] Tested on desktop browsers
- [ ] Tested on mobile devices
- [ ] No console errors
- [ ] Performance impact acceptable

## Screenshots
Add screenshots for visual changes.

## Additional Notes
Any additional information reviewers should know.
```

### Review Process

1. **Automated Checks**
   - Code formatting
   - Basic functionality test
   - Performance benchmarks

2. **Manual Review**
   - Code quality assessment
   - Feature functionality
   - Design consistency
   - Performance impact

3. **Testing**
   - Cross-browser testing
   - Mobile device testing
   - Performance validation

## 🏆 Recognition

### Contributors

We recognize contributors in several ways:
- Credit in CHANGELOG.md
- Mention in README.md
- GitHub contributor statistics
- Special mentions for significant contributions

### Hall of Fame

Outstanding contributors may be featured in:
- Project documentation
- Social media mentions
- Conference talks about the project

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Comments** - Code review discussions

### Development Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Canvas documentation
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - Audio programming
- [Firebase Documentation](https://firebase.google.com/docs) - Backend services

## 🎯 Project Goals

### Short-term Goals
- Improve mobile performance
- Add more enemy types
- Enhance visual effects
- Implement power-up system

### Long-term Goals
- Progressive Web App (PWA) support
- Multiplayer functionality
- Level editor
- Achievement system expansion

## ⚖️ License

By contributing to Pudge Runner, you agree that your contributions will be licensed under the same [MIT License](../LICENSE) that covers the project.

---

Thank you for contributing to Pudge Runner! Together, we can create an amazing DOTA 2-inspired gaming experience for players worldwide. 🎮

For questions about contributing, feel free to open an issue or start a discussion. We're here to help!
