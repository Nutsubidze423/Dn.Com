# DN.COM Portfolio - Deployment Guide

## Overview

This document provides information about the deployment of the DN.COM portfolio website.

## Deployment Details

### URL

- **Production URL**: https://nutsubidze423.github.io/Dn.Com/
- **Repository**: https://github.com/Nutsubidze423/Dn.Com

### Build Status

- **Last Deployed**: January 31, 2026
- **Build System**: Vite
- **Deploy Tool**: gh-pages

## Project Structure

```
src/
├── components/              # React components
├── data/                    # Data files
├── styles/                  # CSS styles
└── App.jsx                  # Main application file
```

## Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **gh-pages** - Deployment

## Deployment Process

### 1. Build the Project

```bash
npm run build
```

### 2. Deploy to GitHub Pages

```bash
npm run deploy
```

This will automatically:

1. Build the project
2. Create a `gh-pages` branch
3. Deploy the build to GitHub Pages

## Configuration

### Vite Config

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Dn.Com/", // Must match repository name
});
```

### Package Scripts

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### 404 Errors on First Load

- If you see 404 errors when first loading the site, it might be because GitHub Pages is still propagating the changes.
- Wait a few minutes and refresh the page.

### Deployment Issues

- Ensure you have the `gh-pages` package installed: `npm install gh-pages --save-dev`
- Check your repository name matches the `base` property in vite.config.js
- Make sure you're logged in to GitHub with the correct account

## Performance Optimization

- All images are optimized for web
- Code is minified and compressed
- CSS and JavaScript are bundled efficiently
- Images have appropriate lazy loading

## Maintenance

### Updating the Site

1. Make changes to the source code
2. Build the project: `npm run build`
3. Deploy: `npm run deploy`

### Adding New Content

- Edit the data files in `src/data/`
- Add new images to `src/assets/`
- Create new components in `src/components/`

## License

MIT License - feel free to use this code for your own projects.
