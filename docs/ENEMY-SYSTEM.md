# 🐲 Enemy System Documentation

## Overview

The Enhanced Enemy System introduces 15 different enemy types organized in difficulty tiers, each with unique behaviors, visual effects, and special abilities. This system provides progressive challenge scaling and diverse gameplay experiences.

## 🎯 Enemy Classification

### Basic Enemies (Levels 1-5)
**Purpose:** Introduction and skill building

#### Meepo
- **Size:** 0.9x standard
- **Speed:** 1.0x standard  
- **Behavior:** Normal movement
- **Special:** None
- **Visual:** Standard brown/orange sprite

#### Ghost
- **Size:** 1.0x standard
- **Speed:** 1.1x standard
- **Behavior:** Floating (subtle vertical movement)
- **Special:** Semi-transparent rendering (0.8 alpha)
- **Visual:** Purple ethereal appearance

#### Mad
- **Size:** 0.8x standard
- **Speed:** 1.2x standard
- **Behavior:** Erratic movement
- **Special:** Occasional small jumps
- **Visual:** Fast animation (18fps)

#### Spoon
- **Size:** 0.9x standard
- **Speed:** 1.0x standard
- **Behavior:** Normal movement
- **Special:** None
- **Visual:** Metallic appearance

### Intermediate Enemies (Levels 6-10)
**Purpose:** Increased challenge with new mechanics

#### Boss
- **Size:** 1.3x standard
- **Speed:** 0.9x standard
- **Behavior:** Heavy movement
- **Special:** 2 health points, imposing presence
- **Visual:** Large, intimidating red sprite

#### Ghost02
- **Size:** 1.1x standard
- **Speed:** 1.2x standard
- **Behavior:** Floating with enhanced movement
- **Special:** Semi-transparent, faster than basic ghost
- **Visual:** Improved ghost design

#### Glad
- **Size:** 1.0x standard
- **Speed:** 1.1x standard
- **Behavior:** Charging (accelerates near player)
- **Special:** Speed boost when within 200px of player
- **Visual:** Golden warrior appearance

#### Sad
- **Size:** 1.0x standard
- **Speed:** 0.8x standard
- **Behavior:** Defensive
- **Special:** 2 health points, armor resistance
- **Visual:** Blue/melancholic design

### Advanced Enemies (Levels 11-15)
**Purpose:** Complex behaviors and special abilities

#### Bat
- **Size:** 0.7x standard
- **Speed:** 1.8x standard
- **Behavior:** Flying (seeks player Y position)
- **Special:** Fastest enemy, creates trail particles
- **Visual:** Motion blur effect, dark appearance

#### Bloodthirsty
- **Size:** 1.2x standard
- **Speed:** 1.4x standard
- **Behavior:** Aggressive (speeds up near player)
- **Special:** Red aura, 2 health points
- **Visual:** Crimson red with blood effects

#### Necromancer
- **Size:** 1.1x standard
- **Speed:** 1.0x standard
- **Behavior:** Magical
- **Special:** Death Pulse ability, 3 health points
- **Visual:** Dark purple aura, magical effects

### Extreme Enemies (Levels 16+)
**Purpose:** Ultimate challenge with boss-like abilities

#### Broodmother
- **Size:** 1.5x standard
- **Speed:** 1.3x standard
- **Behavior:** Spawner
- **Special:** Can spawn minions, 3 health points
- **Visual:** Green venom aura, largest spider

#### Terrorblade (TB)
- **Size:** 1.4x standard
- **Speed:** 1.6x standard
- **Behavior:** Demon
- **Special:** Metamorphosis ability, 4 health points
- **Visual:** Fiery orange/red with demon effects

## 🎮 Behavior System

### Normal
- Basic linear movement
- No special mechanics
- Consistent speed

### Floating
- Subtle vertical oscillation
- Zero gravity effect
- Ethereal appearance

### Flying
- Actively seeks player Y position
- Can move freely in vertical space
- Creates particle trails

### Erratic
- Random direction changes every 150ms
- Unpredictable speed variations
- Occasional jumps for some types

### Charging
- Accelerates when near player
- 1.5x speed boost within range
- More aggressive pursuit

### Heavy
- Slower but more resistant
- Increased gravity effect
- Larger hitbox

### Defensive
- Reduced speed
- Armor system
- Multiple health points

### Aggressive
- Speed boost near player
- Enhanced attack patterns
- Red visual effects

### Magical
- Spell casting abilities
- Mana system
- Unique visual auras

### Spawner
- Creates minion enemies
- Cooldown-based spawning
- Area control

### Demon
- Metamorphosis transformations
- Teleportation abilities
- Ultimate boss mechanics

## 🌟 Special Abilities

### Death Pulse (Necromancer)
- **Trigger:** 0.2% chance per frame
- **Effect:** Creates necromancy particle burst
- **Mana Cost:** 1 point (3 total)
- **Visual:** Dark purple energy wave

### Minion Spawning (Broodmother)
- **Trigger:** Every 2 seconds in Hell Mode
- **Effect:** Spawns small spider minions
- **Limit:** Maximum 2 minions active
- **Condition:** Less than 8 total enemies on screen

### Metamorphosis (Terrorblade)
- **Trigger:** Every 5 seconds
- **Effect:** 30% size increase, 40% speed boost
- **Duration:** 3 seconds
- **Visual:** Enhanced demon aura

### Trail Generation (Bat)
- **Trigger:** 30% chance per frame
- **Effect:** Creates bat_trail particles
- **Visual:** Dark smoke trail
- **Performance:** Optimized for mobile

## 🎨 Visual Effects System

### Aura Effects
```javascript
ghost/ghost02: Semi-transparent (0.8 alpha)
necromancer: Dark purple shadow (15px blur)
bloodthirsty: Crimson red shadow (10px blur)
tb: Fiery orange shadow (20px blur)
broodmother: Venom green shadow (12px blur)
bat: Motion blur filter when flying
```

### Level-Based Enhancements
```javascript
Hell Mode (Level 15+): Hue rotation and saturation effects
Nightmare Mode (Level 20+): Color cycling based on game frame
Extreme Mode (Level 25+): Maximum visual intensity
```

### Particle Integration
- **Death Effects:** Unique particles per enemy type
- **Trail Effects:** Flying enemies leave particle trails
- **Spell Effects:** Magical abilities create themed particles
- **Collision Effects:** Enhanced explosion particles

## 📊 Difficulty Scaling

### Level Distribution
```javascript
Levels 1-5:   100% Basic enemies
Levels 6-10:  60% Basic, 40% Intermediate
Levels 11-15: 80% Intermediate, 20% Advanced
Levels 16-20: 75% Advanced, 25% Extreme
Levels 21+:   30% Advanced, 70% Extreme
```

### Nightmare Mode Enhancements (Level 10+)
- All enemies 30% faster
- Flying enemies gain vertical movement
- Enhanced animation frame rates
- Improved visual effects

### Hell Mode Enhancements (Level 15+)
- All enemies 50% faster
- 10% size increase across all types
- Erratic movement for applicable types
- Special abilities activated

### Performance Optimizations

#### Object Pooling
- Separate pools for each enemy type
- Larger pools for advanced enemies
- Efficient sprite reuse

#### Rendering Optimizations
- Pre-rendered sprites for common sizes
- Fallback rendering system
- Mobile-specific optimizations

#### Memory Management
- Proper cleanup of off-screen enemies
- Particle system integration
- Canvas pool management

## 🎯 Strategic Gameplay Impact

### Player Adaptation Required
- **Basic Levels:** Learn movement patterns
- **Intermediate Levels:** Handle multiple enemy types
- **Advanced Levels:** Deal with special abilities
- **Extreme Levels:** Master complex encounters

### Skill Progression
1. **Pattern Recognition** - Basic enemy movements
2. **Multi-tasking** - Multiple enemy types
3. **Ability Awareness** - Special attack patterns
4. **Advanced Tactics** - Extreme enemy combinations

### Competitive Balance
- Each tier provides distinct challenges
- No single strategy works for all levels
- Continuous skill development required
- Prevents gameplay stagnation

## 🔧 Technical Implementation

### Enemy Selection Algorithm
```javascript
// Level-based weighted selection
if (level <= 5) return selectFrom(BASIC_ENEMIES);
else if (level <= 10) return weightedSelect(BASIC + INTERMEDIATE);
else if (level <= 15) return weightedSelect(INTERMEDIATE + ADVANCED);
else if (level <= 20) return weightedSelect(ADVANCED + EXTREME);
else return weightedSelect(ADVANCED + EXTREME, favorExtreme=true);
```

### Behavior State Machine
```javascript
setupEnemyBehavior() {
  applyBaseConfig();
  setupSpecificBehavior();
  applyDifficultyModifiers();
  enableSpecialAbilities();
}
```

### Visual Effect Pipeline
```javascript
draw() {
  applyVisualEffects();
  applyBehaviorAnimation();
  renderSprite();
  drawHealthBar();
  createParticleEffects();
}
```

This enhanced enemy system creates a rich, diverse, and progressively challenging gameplay experience that scales infinitely while maintaining balanced and engaging combat encounters.
