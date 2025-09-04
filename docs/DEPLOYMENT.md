# 🚀 Deployment Guide

## Overview

Pudge Runner is a static HTML5 game that can be deployed to various hosting platforms. This guide covers deployment options from simple static hosting to advanced CDN setups.

## Quick Deployment Options

### GitHub Pages (Recommended)

GitHub Pages provides free static hosting with automatic deployment:

1. **Setup Repository**
   ```bash
   git clone https://github.com/gbrlstr/pudge-runner.git
   cd pudge-runner
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Select "/ (root)" folder

3. **Access Your Game**
   - URL: `https://username.github.io/pudge-runner`
   - Automatic HTTPS
   - Global CDN included

### Vercel Deployment

One-click deployment with Vercel:

1. **Connect Repository**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings (none needed)

2. **Deploy**
   ```bash
   # Or use Vercel CLI
   npm i -g vercel
   vercel --prod
   ```

3. **Features**
   - Automatic deployments on push
   - Preview deployments for PRs
   - Global edge network
   - Custom domains

### Netlify Deployment

Deploy with drag-and-drop or Git integration:

1. **Manual Deployment**
   - Zip your project folder
   - Drag to [netlify.com/drop](https://netlify.com/drop)
   - Instant deployment

2. **Git Integration**
   - Connect your GitHub repository
   - Set build command: `echo "No build needed"`
   - Set publish directory: `/`

## Local Development Server

### Using Node.js HTTP Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start

# Server will run on http://localhost:8000
```

### Using Python HTTP Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Using PHP Built-in Server

```bash
php -S localhost:8000
```

## Production Optimizations

### Asset Optimization

#### Image Compression
```bash
# Install optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin assets/imgs/*.png --out-dir=assets/imgs/optimized
imagemin assets/imgs/**/*.png --out-dir=assets/imgs/optimized
```

#### Audio Compression
```bash
# Convert to web-optimized formats
ffmpeg -i assets/sounds/background.mp3 -codec:a libmp3lame -b:a 128k assets/sounds/background_opt.mp3
```

### Caching Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/pudge-runner;
    
    # Cache static assets
    location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(js|css)$ {
        expires 1M;
        add_header Cache-Control "public";
    }
    
    location ~* \.(mp3|mpeg|ogg)$ {
        expires 6M;
        add_header Cache-Control "public";
    }
    
    # HTML files - short cache
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }
}
```

#### Apache .htaccess
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    
    # Images
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    
    # Audio
    ExpiresByType audio/mpeg "access plus 6 months"
    ExpiresByType audio/ogg "access plus 6 months"
    
    # HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

## CDN Integration

### Cloudflare Setup

1. **Add Site to Cloudflare**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers

2. **Optimization Settings**
   ```
   Speed > Optimization
   ✅ Auto Minify (HTML, CSS, JS)
   ✅ Brotli Compression
   ✅ Early Hints
   ✅ Rocket Loader
   ```

3. **Caching Rules**
   ```
   Caching > Configuration
   Browser Cache TTL: 1 year
   Edge Cache TTL: 1 month
   ```

### AWS CloudFront

1. **Create Distribution**
   ```bash
   # Using AWS CLI
   aws cloudfront create-distribution \
     --distribution-config file://cloudfront-config.json
   ```

2. **Configuration Example**
   ```json
   {
     "CallerReference": "pudge-runner-2025",
     "Origins": {
       "Quantity": 1,
       "Items": [
         {
           "Id": "S3-bucket",
           "DomainName": "pudge-runner.s3.amazonaws.com",
           "S3OriginConfig": {
             "OriginAccessIdentity": ""
           }
         }
       ]
     },
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-bucket",
       "ViewerProtocolPolicy": "redirect-to-https",
       "CachePolicyId": "managed-CachingOptimized"
     }
   }
   ```

## Environment Configuration

### Production Environment Variables

Create `.env.production`:
```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Game Configuration
GAME_VERSION=4.0.0
PRODUCTION_MODE=true
```

### Firebase Hosting

Deploy to Firebase Hosting:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Project**
   ```bash
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": ".",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=2592000"
             }
           ]
         },
         {
           "source": "**/*.@(png|jpg|jpeg|gif|svg)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

## Performance Monitoring

### Web Vitals Monitoring

Add performance monitoring:

```javascript
// Add to index.html
function measurePerformance() {
    if ('web-vital' in window) {
        import('https://unpkg.com/web-vitals?module').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
}
```

### Analytics Integration

```javascript
// Google Analytics 4
gtag('config', 'GA-XXXXXXXXX', {
    page_title: 'Pudge Runner',
    page_location: window.location.href,
    custom_map: {
        dimension1: 'game_score',
        dimension2: 'game_level'
    }
});

// Track game events
function trackGameEvent(action, score, level) {
    gtag('event', action, {
        event_category: 'game',
        game_score: score,
        game_level: level
    });
}
```

## Security Configuration

### Content Security Policy

Add to index.html:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data:;
    media-src 'self';
    connect-src 'self' https://firebase.googleapis.com;
">
```

### HTTPS Enforcement

Most modern hosting platforms provide HTTPS by default:
- GitHub Pages: Automatic HTTPS
- Vercel: Automatic HTTPS with custom domains
- Netlify: Free SSL certificates
- Firebase Hosting: Automatic HTTPS

## Troubleshooting

### Common Deployment Issues

#### Audio Not Playing
```javascript
// Ensure audio context is properly initialized
document.addEventListener('click', initAudio, { once: true });
```

#### Canvas Not Responsive
```css
/* Ensure proper viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

#### Firebase Connection Issues
```javascript
// Check Firebase configuration
console.log('Firebase config:', firebaseConfig);
console.log('Firebase app:', firebase.apps.length);
```

### Performance Issues

#### Mobile Performance
- Reduce particle count: `const particles = isMobile() ? 3 : 8;`
- Lower frame rate: `setTimeout(gameLoop, 1000/30);` for mobile
- Simplify rendering: Skip complex effects on mobile

#### Memory Leaks
- Remove event listeners: `element.removeEventListener()`
- Clear intervals: `clearInterval(intervalId)`
- Cleanup objects: `object = null`

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

### Automated Testing

Add to workflow:
```yaml
- name: Test Game
  run: |
    npm install -g http-server
    http-server . -p 8080 &
    sleep 5
    curl -f http://localhost:8080 || exit 1
```

---

This deployment guide ensures your Pudge Runner game is optimally configured for production environments with excellent performance, security, and monitoring capabilities.
