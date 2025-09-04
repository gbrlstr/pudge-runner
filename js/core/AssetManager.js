// AssetManager utilitário para carregamento de imagens e sons
export class AssetManager {
  constructor() {
    this.audioEnabled = true;
    this.soundVolume = 0.5;
    this.lastSoundTime = 0;
    this.sounds = {};
    this.loadedImages = new Map();
  }

  static loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  static loadAudio(src, loop = false, volume = 1.0) {
    return new Promise((resolve, reject) => {
      const audio = new window.Audio(src);
      audio.loop = loop;
      audio.volume = volume;
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = reject;
    });
  }

  // Método otimizado para tocar sons aleatórios
  playRandomSound(soundPrefix, override = false) {
    try {
      if (!override && Date.now() - this.lastSoundTime < 100) {
        return; // Throttle de 100ms entre sons
      }
      
      if (this.audioEnabled && this.soundVolume > 0) {
        const sounds = Object.keys(this.sounds).filter(key => key.startsWith(soundPrefix));
        if (sounds.length > 0) {
          const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
          const audio = this.sounds[randomSound];
          if (audio && audio.readyState >= 2) { // HAVE_CURRENT_DATA
            audio.currentTime = 0;
            audio.volume = this.soundVolume;
            const playPromise = audio.play();
            if (playPromise) {
              playPromise.catch(() => {}); // Silenciar erros de play
            }
            this.lastSoundTime = Date.now();
          }
        }
      }
    } catch (error) {
    }
  }

  // Método para tocar som específico
  playSound(soundKey, override = false) {
    try {
      if (!override && Date.now() - this.lastSoundTime < 100) {
        return; // Throttle de 100ms entre sons
      }
      
      if (this.audioEnabled && this.soundVolume > 0) {
        const audio = this.sounds[soundKey];
        if (audio && audio.readyState >= 2) { // HAVE_CURRENT_DATA
          audio.currentTime = 0;
          audio.volume = this.soundVolume;
          const playPromise = audio.play();
          if (playPromise) {
            playPromise.catch(() => {}); // Silenciar erros de play
          }
          this.lastSoundTime = Date.now();
        }
      }
    } catch (error) {
    }
  }

  // Cache de imagens para melhor performance
  getCachedImage(src) {
    if (this.loadedImages.has(src)) {
      return this.loadedImages.get(src);
    }
    return null;
  }

  setCachedImage(src, img) {
    this.loadedImages.set(src, img);
  }

  // Método para controlar música de fundo
  updateBackgroundMusic(bgMusic) {
    if (!bgMusic) return;
    
    if (this.audioEnabled && this.soundVolume > 0) {
      bgMusic.volume = this.soundVolume * 0.3; // Música mais baixa
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
      }
    } else {
      bgMusic.pause();
    }
  }
}
