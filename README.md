# 🎮 Pudge Runner - Enhanced Edition

[![Version](https://img.shields.io/badge/Version-4.0-blue)](https://github.com/gbrlstr/pudge-runner)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Game](https://img.shields.io/badge/Platform-Web-green)](https://pudge-runner.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red)](https://github.com/gbrlstr/pudge-runner)

An endless runner game inspired by Pudge character from DOTA 2. Dodge obstacles and achieve the highest score possible!

[🎮 **Play Now**](https://pudge-runner.vercel.app/) | [📖 **Documentation**](docs/) | [🐛 **Report Issues**](https://github.com/gbrlstr/pudge-runner/issues) | [🤝 **Contribute**](CONTRIBUTING.md)


![Game Preview](./assets/game-preview.gif)

## ✨ Features

### 🎯 Core Gameplay

- **Responsive Jump System** - Precise character control with smooth physics
- **Dynamic Obstacles** - Multiple enemy types with unique behaviors  
- **Progressive Difficulty** - Gradually increasing challenge levels
- **Persistent High Score** - Local storage with cloud ranking integration
- **Optimized Collision Detection** - Forgiving hitboxes for better gameplay experience

### 🎨 Visual & UI Excellence

- **Modern Design System** - Professional DOTA 2-themed interface
- **Particle Effects** - Jump trails, collision effects, and visual feedback
- **Smooth Animations** - Fluid character and obstacle movements
- **Dynamic Parallax Background** - Multi-layer depth system
- **Desktop UI** - Optimized interface for web browsers
- **Glass-morphism Effects** - Modern translucent design elements

### ️ Technical Architecture

- **Modular ES6 Architecture** - Clean, maintainable object-oriented code
- **Robust Asset Management** - Fallback system for failed sprite loads
- **Keyboard Controls** - Optimized desktop input handling
- **Auto-pause System** - Automatic pause when tab loses focus
- **Error Handling** - Comprehensive error recovery and debugging

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- HTTP server for local development (included in npm scripts)

### Running: Direct File Access

Open `index.html` directly in your browser for quick testing (some features may require HTTP server).

## 🎮 How to Play

### Desktop Controls

- **SPACE** - Jump
- **P** - Pause/Unpause
- **R** - Restart (when game over)

### Objective

- Dodge obstacles by jumping at the right moment
- Survive as long as possible to achieve higher scores
- Each dodged obstacle awards 10 points (multiplied by combo)
- Speed and obstacle frequency increase every 100 points

## 🎯 Difficulty Levels

| Level | Name | Speed | Spawn Rate | Multi-Spawn | Score Required |
|-------|------|--------|------------|-------------|----------------|
| 1 | Iniciante | 5 | 140 frames | 1 | 0 |
| 2 | Fácil | 6 | 130 frames | 1 | 100 |
| 3 | Normal | 7 | 120 frames | 1 | 200 |
| 4 | Difícil | 8 | 110 frames | 1 | 300 |
| 5 | Expert | 9 | 100 frames | 1 | 400 |
| 6 | Insano | 10 | 90 frames | 2 | 500 |
| 7 | Extremo | 11 | 85 frames | 2 | 600 |
| 8 | Lendário | 12 | 80 frames | 2 | 700 |
| 9 | Mítico | 13 | 75 frames | 2 | 800 |
| 10 | Divino | 14 | 70 frames | 3 | 900 |
| 11 | Imortal | 15 | 65 frames | 3 | 1000 |
| 12 | Ancestral | 16 | 60 frames | 3 | 1100 |
| 13 | Transcendente | 17 | 55 frames | 3 | 1200 |
| 14 | Apocalíptico | 18 | 50 frames | 4 | 1300 |
| 15 | Cataclísmico | 19 | 45 frames | 4 | 1400 |
| 16 | Impossível | 20 | 40 frames | 4 | 1500 |
| 17+ | ∞ Infinito | 20+ | 40- frames | 4+ | 1600+ |

### 🔥 New Extreme Difficulty Features

**Multi-Enemy Spawns** - Starting from level 6, multiple enemies spawn simultaneously

**15 Different Enemy Types** - Organized by difficulty tiers:

- **Basic Enemies (Levels 1-5):** Meepo, Ghost, Mad, Spoon
- **Intermediate Enemies (Levels 6-10):** Boss, Ghost02, Glad, Sad  
- **Advanced Enemies (Levels 11-15):** Bat, Bloodthirsty, Necromancer
- **Extreme Enemies (Levels 16+):** Broodmother, Terrorblade

**Advanced Enemy Behaviors** - Each enemy type has unique characteristics:

- **Flying Enemies** (Bat, Ghost variants): Vertical movement and trail effects
- **Magical Enemies** (Necromancer): Death pulse abilities and dark auras
- **Aggressive Enemies** (Bloodthirsty): Enhanced speed when near player
- **Heavy Enemies** (Boss, Sad): Increased size and resistance
- **Spawner Enemies** (Broodmother): Can create minions in extreme levels
- **Demon Enemies** (Terrorblade): Metamorphosis and teleport abilities

**Infinite Scaling** - After level 16, difficulty continues to increase indefinitely:

- Speed increases by 0.5 per level
- Spawn rate decreases (more frequent spawns)
- Up to 6 enemies can spawn at once in extreme levels

**Advanced Enemy Behaviors** - Higher level enemies have special abilities:

- **Vertical Movement** (Nightmare Mode 10+): Ghosts and bosses move up and down
- **Erratic Movement** (Hell Mode 15+): Mad and spoon enemies move unpredictably
- **Increased Size & Speed** (All Advanced Enemies)

**Stricter Collision Detection** - Hitboxes become more precise at higher levels

**Reduced Score Scaling** - Points decrease in extreme levels to prevent infinite scoring

## 🏗️ Project Structure

```text
pudge-runner/
├── index.html                 # Main game file
├── package.json               # NPM configuration
├── README.md                  # This documentation
├── LICENSE                    # MIT License
├── CONTRIBUTING.md            # Contribution guidelines
├── assets/                    # Game assets
│   ├── style.css             # Main CSS stylesheet
│   ├── logo.png              # Game icon
│   ├── imgs/                 # Sprites and images
│   │   ├── pudg.gif         # Player sprite
│   │   ├── ground.png       # Ground texture
│   │   ├── background/      # Parallax layers
│   │   ├── boss/            # Boss animation frames
│   │   ├── meepo/           # Meepo enemy frames
│   │   ├── ghost/           # Ghost enemy frames
│   │   ├── mad/             # Mad enemy frames
│   │   ├── spoon/           # Spoon enemy frames
│   │   └── pudge/           # Pudge enemy frames
│   └── sounds/              # Audio files
│       ├── background.mp3   # Background music
│       ├── kill.ogg        # Kill sound effect
│       └── pudge_*.mpeg    # Character voice lines
├── js/                      # Modular JavaScript
│   ├── main.js             # Entry point
│   ├── core/               # Core game modules
│   │   ├── Game.js         # Main game logic
│   │   ├── AssetManager.js # Asset management
│   │   ├── Player.js       # Player class
│   │   ├── Enemy.js        # Enemy classes
│   │   ├── Particle.js     # Particle system
│   │   ├── UI.js           # User interface
│   │   ├── Config.js       # Game configuration
│   │   └── Utils.js        # Utility functions
│   ├── firebase-config.js  # Firebase configuration
│   └── firebase-rank.js    # Global ranking system
└── docs/                   # Documentation
    ├── ARCHITECTURE.md     # Technical architecture
    ├── DEPLOYMENT.md      # Deployment instructions
    ├── API.md             # API documentation
    └── CHANGELOG.md       # Version history
```

## 🚀 Features by Version

### Version 4.0 - Enhanced Edition ✅

- ✅ **Enhanced UI/UX Design** - Complete interface redesign with premium styling
- ✅ **Advanced CSS System** - Professional design system with custom properties
- ✅ **Modular Architecture** - Complete ES6 modular architecture
- ✅ **Enhanced Audio System** - Robust synchronized audio management
- ✅ **Premium Ranking System** - Global leaderboard with elegant design
- ✅ **Advanced Final Score** - Professional game over screen with detailed stats
- ✅ **Desktop Excellence** - High-quality design optimized for web browsers

### Planned Features 🔮

#### Version 4.1 - Gameplay Enhancement

- 🔄 **Lives System** - Multiple chances with visual regeneration
- 🔄 **Basic Power-ups** - Invincibility, double jump, slow motion
- 🔄 **Expanded Achievements** - 15+ unlockable achievements
- 🔄 **Audio Enhancements** - Independent music/effects mixing

#### Version 4.2 - Social & Performance

- 🔄 **Social Sharing** - Share scores on social media
- 🔄 **Screenshot System** - Capture epic moments
- 🔄 **Performance Analytics** - Detailed gameplay telemetry
- 🔄 **PWA Conversion** - Progressive Web App with native installation

#### Version 5.0 - Major Evolution

- 🔄 **New Game Modes** - Survival, Time Attack, Challenge Mode
- 🔄 **Boss Battles** - Special bosses with unique mechanics
- 🔄 **Component System (ECS)** - Entity-Component-System architecture
- 🔄 **3D Audio & Haptic** - Spatial audio and vibration feedback

**Legend:**

- ✅ **Complete** - Feature implemented and tested
- 🔄 **Planned** - In development roadmap

## 💻 Technologies Used

- **HTML5 Canvas** - Game rendering optimized for desktop browsers
- **JavaScript ES6+ Modules** - Modular architecture with classes and imports/exports
- **CSS3 Enhanced Design** - Professional design system with custom properties
- **Google Fonts** - Orbitron & Montserrat for premium typography
- **LocalStorage** - Local data persistence and user preferences
- **Firebase** - Real-time global ranking system
- **Canvas 2D Context** - Advanced rendering with optimized performance
- **CSS Grid & Flexbox** - Professional desktop layout
- **Web Audio API** - Audio system with volume control
- **Glass-morphism CSS** - Modern transparency and blur effects

## 🌐 Browser Compatibility

### Supported Browsers

- ✅ Chrome/Chromium 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Recommended Minimum Resolution

- 🖥️ Desktop: 1366x768 or higher
- 💻 Laptop: 1280x720 or higher

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Inspiration

Based on the DOTA 2 universe by Valve Corporation. This is an unofficial fan-made project created for educational and entertainment purposes.

## 🌟 Acknowledgments

- Valve Corporation for DOTA 2 universe and characters
- The open-source community for inspiration and tools
- Contributors and players who make this project better

## 📞 Support

- 🐛 [Report Issues](https://github.com/gbrlstr/pudge-runner/issues)
- 💬 [Discussions](https://github.com/gbrlstr/pudge-runner/discussions)
- 📧 Contact: [your-email@example.com](mailto:your-email@example.com)

---

### 🌟 **Pudge Runner - Enhanced Edition v4.0**

A complete evolution of the original concept, now featuring professional modular architecture, premium interface design, advanced audio system, and high-quality user experience.

**v4.0 Highlights:**

- 🎨 Redesigned interface with professional styling
- 🏗️ Complete ES6 modular architecture
- 🔊 Synchronized and robust audio system
- �️ Excellent desktop optimization
- 🏆 Premium ranking system design
- ✨ Advanced animations and visual effects

---

Developed with ❤️ for the DOTA 2 community | **Enhanced Edition 2025**
