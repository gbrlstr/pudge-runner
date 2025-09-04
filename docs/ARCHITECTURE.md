# 🏗️ Technical Architecture

## Overview

Pudge Runner is built with a modern modular ES6 architecture, focusing on maintainability, performance, and extensibility. The game follows object-oriented principles with clear separation of concerns.

## Core Architecture

### ES6 Module System

The project uses native ES6 modules for clean imports/exports:

```javascript
import { Game } from './core/Game.js';
import { AssetManager } from './core/AssetManager.js';
import { Player } from './core/Player.js';
```

### Main Entry Point

**File: `js/main.js`**
- Canvas setup and responsive configuration
- Game instance initialization
- Mobile/desktop detection and scaling
- Event listener setup

### Core Classes

#### Game.js - Game Engine
- **Purpose**: Main game loop and state management
- **Responsibilities**:
  - Game state (MENU, PLAYING, PAUSED, GAME_OVER)
  - Update and render loops
  - Input handling coordination
  - Score and level management

#### AssetManager.js - Asset Management
- **Purpose**: Centralized asset loading and management
- **Features**:
  - Asynchronous asset loading
  - Fallback system for failed loads
  - Loading progress tracking
  - Asset caching and optimization

#### Player.js - Player Entity
- **Purpose**: Player character control and physics
- **Features**:
  - Jump mechanics with gravity simulation
  - Animation state management
  - Collision detection
  - Mobile-responsive scaling

#### Enemy.js - Enemy System
- **Purpose**: Obstacle/enemy management
- **Features**:
  - Multiple enemy types (Boss, Meepo, Ghost, etc.)
  - Animated sprite handling
  - Dynamic spawn system
  - Collision boundaries

#### Particle.js - Particle System
- **Purpose**: Visual effects and feedback
- **Features**:
  - Jump trail particles
  - Collision effect particles
  - Performance-optimized rendering
  - Mobile-adaptive particle counts

#### UI.js - User Interface
- **Purpose**: UI state and interaction management
- **Features**:
  - Panel visibility control
  - Score display formatting
  - Mobile panel toggling
  - Responsive layout management

### Configuration System

#### Config.js - Game Configuration
- **Purpose**: Centralized game constants and settings
- **Contains**:
  - Physics constants (gravity, jump force)
  - Difficulty scaling parameters
  - Mobile scaling factors
  - Performance settings

#### Utils.js - Utility Functions
- **Purpose**: Helper functions and utilities
- **Functions**:
  - Mobile detection
  - Scaling calculations
  - Number formatting
  - Canvas utilities

## Data Flow

```
main.js → Game.js → [Player, Enemy, Particle, UI] → AssetManager
                ↓
            Input Handler → Game State Updates → Render Loop
```

## State Management

### Game States
1. **LOADING** - Asset loading phase
2. **MENU** - Main menu display
3. **PLAYING** - Active gameplay
4. **PAUSED** - Game paused
5. **GAME_OVER** - End game state

### State Transitions
- Loading → Menu (when assets loaded)
- Menu → Playing (on start)
- Playing ↔ Paused (on pause toggle)
- Playing → Game Over (on collision)
- Game Over → Menu (on restart)

## Performance Optimizations

### Canvas Rendering
- **Dirty Rectangles**: Only redraw changed areas
- **Object Pooling**: Reuse enemy and particle objects
- **Culling**: Skip rendering off-screen objects
- **Mobile Scaling**: Reduced elements for mobile performance

### Asset Management
- **Lazy Loading**: Load assets as needed
- **Sprite Atlasing**: Combine small images
- **Fallback System**: Handle failed loads gracefully
- **Caching**: Store loaded assets in memory

### Memory Management
- **Cleanup**: Remove unused objects
- **Event Cleanup**: Remove event listeners properly
- **Canvas Optimization**: Minimize canvas operations

## Mobile Architecture

### Responsive Canvas
```javascript
function setResponsiveCanvas() {
    if (isMobile()) {
        const scaleFactor = getMobileScaleFactor();
        // Dynamic sizing based on viewport and orientation
    }
}
```

### Touch Input System
- **Single Touch**: Jump action
- **Multi-Touch**: Pause/unpause
- **Gesture Prevention**: Disable native browser gestures
- **Touch Optimization**: Minimize touch event processing

### Mobile-Specific Optimizations
- **Reduced Particles**: Lower particle count on mobile
- **Simplified Rendering**: Fewer visual effects
- **Battery Optimization**: Lower frame rate when possible
- **Memory Management**: More aggressive cleanup

## Audio Architecture

### Audio System Design
- **Web Audio API**: Modern audio handling
- **State Synchronization**: HTML/JS audio state sync
- **Volume Control**: Master volume management
- **Mobile Compatibility**: Touch-initiated audio

### Audio Components
- **Background Music**: Looped ambient music
- **Sound Effects**: Action-based audio feedback
- **Voice Lines**: Character-specific audio
- **Audio Manager**: Centralized audio control

## Firebase Integration

### Real-time Database
- **Global Ranking**: Cloud-based leaderboard
- **Score Synchronization**: Real-time score updates
- **User Management**: Anonymous user tracking
- **Performance Monitoring**: Usage analytics

### Data Structure
```javascript
{
  "rankings": {
    "userId": {
      "score": 1500,
      "playerName": "Player1",
      "timestamp": "2025-01-01"
    }
  }
}
```

## Error Handling

### Comprehensive Error Management
- **Asset Loading Errors**: Fallback to default assets
- **Runtime Errors**: Graceful degradation
- **Mobile Specific**: Touch/orientation handling
- **Network Errors**: Offline mode support

### Debug System
- **Console Logging**: Structured debug output
- **Performance Monitoring**: FPS and memory tracking
- **Error Reporting**: User-friendly error messages
- **Development Mode**: Enhanced debugging features

## Extensibility

### Plugin Architecture
The modular design allows for easy extension:
- **New Enemy Types**: Extend Enemy class
- **Power-ups**: Add to existing systems
- **New Game Modes**: Extend Game class
- **Visual Effects**: Extend Particle system

### Configuration Driven
- **Difficulty Scaling**: Configurable parameters
- **Visual Settings**: Customizable themes
- **Input Mapping**: Remappable controls
- **Performance Tuning**: Adjustable quality settings

## Build and Deployment

### No Build Process Required
- **Pure HTML5/JS**: No compilation needed
- **Direct Browser Loading**: Works with file:// protocol
- **HTTP Server**: Recommended for full features
- **Static Hosting**: Compatible with any static host

### Deployment Targets
- **GitHub Pages**: Static hosting
- **Vercel/Netlify**: JAMstack platforms
- **CDN Distribution**: Global content delivery
- **PWA Ready**: Progressive Web App capable

## Testing Strategy

### Manual Testing
- **Cross-browser**: Multiple browser testing
- **Mobile Devices**: Physical device testing
- **Performance**: FPS and memory monitoring
- **User Experience**: Gameplay flow testing

### Automated Testing (Future)
- **Unit Tests**: Core function testing
- **Integration Tests**: System interaction testing
- **Performance Tests**: Automated benchmarking
- **Visual Regression**: UI consistency testing

## Security Considerations

### Client-Side Security
- **Input Validation**: Sanitize user inputs
- **Score Validation**: Prevent score manipulation
- **Asset Integrity**: Verify asset authenticity
- **Privacy**: Minimal data collection

### Firebase Security
- **Database Rules**: Restrict unauthorized access
- **Anonymous Authentication**: No personal data required
- **Rate Limiting**: Prevent abuse
- **Data Validation**: Server-side validation

---

This architecture ensures scalability, maintainability, and excellent performance across all target platforms while providing a solid foundation for future enhancements.
