# Akash Sharma — 3D Portfolio Website

<div align="center">

<b>A cutting-edge, full-stack 3D portfolio built with React, Three.js, and modern web technologies.</b>

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-0.165.0-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![GSAP](https://img.shields.io/badge/GSAP-3.14.2-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com)
[![Vercel Deploy](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[Live Demo](#live-demo) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Performance](#performance-optimizations)
- [Browser Support](#browser-support)
- [License](#license)


---

## Live Demo

🌐 **Visit the live site:** https://codesofakash.vercel.app/

> Interactive 3D hero model · Smooth scroll animations · Real-time project showcase · Desktop and mobile optimized

[**Take a look →**](https://codesofakash.vercel.app/)

---

## Features

✨ **Interactive 3D Hero Model**
- WebGL-based 3D desktop computer visualization
- Responsive scaling for mobile devices
- Smooth rotation and interaction

🎬 **GSAP Scroll Animations**
- ScrollTrigger integration for viewport-based animations
- Staggered element reveals on scroll
- Smooth transitions and easing

📹 **Real-Time Project Showcase**
- Dynamic project carousel with auto-play
- Embedded video previews with hover states
- Live demo links and GitHub repos

🖼️ **Screenshot Carousel**
- Multi-image slideshow with dot navigation
- Preloading and lazy loading optimization
- Smooth transitions between slides

📱 **Fully Responsive Design**
- Mobile-first approach with Tailwind CSS
- Touch-friendly navigation and controls
- Optimized viewport experience across all devices

🔍 **SEO Optimized**
- Dynamic meta tags for all routes
- Open Graph and Twitter card support
- XML sitemap and robots.txt
- Structured data (JSON-LD) ready

⚡ **Service Worker Caching**
- Offline support with intelligent cache strategies
- Cache-first for assets, network-first for APIs
- Automatic cache cleanup and versioning

🚀 **CDN-Accelerated Assets**
- Cloudinary for image delivery (ddawd3kp5)
- AWS CloudFront for 3D model files
- Global edge caching for sub-100ms response times

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend Framework** | React 18 | Component-based UI |
| **Build Tool** | Vite 7 | Lightning-fast dev server & builds |
| **Styling** | Tailwind CSS 3 | Utility-first CSS framework |
| **3D Graphics** | Three.js 0.165 | WebGL 3D rendering engine |
| **3D in React** | React Three Fiber 8 | WebGL renderer for React |
| **3D Utils** | @react-three/drei 9 | Helper components for R3F |
| **Math Library** | Maath 0.10 | Math utilities for 3D |
| **Animations** | GSAP 3.14 | Professional animation library |
| **Scroll Tracking** | GSAP ScrollTrigger | Viewport-based animations |
| **Motion Library** | Framer Motion 11 | React animation primitives |
| **Routing** | React Router v6 | Client-side navigation |
| **Notifications** | React Toastify 11 | Toast notifications |
| **Tilt Effect** | React Tilt 1 | 3D tilt parallax effect |
| **Timeline UI** | React Vertical Timeline | Experience timeline component |
| **Email Service** | emailjs/browser 4 | Client-side email sending |
| **Image CDN** | Cloudinary | Image optimization & delivery |
| **Video CDN** | AWS CloudFront | 3D model & video delivery |
| **Deployment** | Vercel | Global edge-optimized hosting |
| **Package Manager** | npm | Dependency management |

---

## Project Structure

```
3d_portfolio/
├── public/
│   ├── sw.js                 # Service worker for caching
│   ├── robots.txt            # SEO crawling directives
│   ├── sitemap.xml           # Sitemap for search engines
│   └── logo.svg
│
├── src/
│   ├── main.jsx              # App entry point with SW registration
│   ├── App.jsx               # Root router and layout
│   ├── index.css             # Global styles
│   │
│   ├── pages/
│   │   ├── Home.jsx          # Landing page with hero & featured projects
│   │   ├── About.jsx         # About, skills, experience, testimonials
│   │   ├── Projects.jsx      # Full project showcase with carousel
│   │   ├── Contact.jsx       # Contact form with EmailJS integration
│   │   ├── Privacy.jsx       # Privacy policy
│   │   └── Terms.jsx         # Terms of service
│   │
│   ├── components/
│   │   ├── Navbar.jsx        # Fixed navigation with mobile menu
│   │   ├── Hero.jsx          # Hero section with 3D model
│   │   ├── Contact.jsx       # Reusable contact form
│   │   ├── Footer.jsx        # Footer with links & social
│   │   ├── Loader.jsx        # Canvas loading skeleton
│   │   ├── ModelErrorBoundary.jsx  # Error handling for 3D
│   │   ├── CloudImage.jsx    # Cloudinary image wrapper
│   │   └── canvas/
│   │       ├── Computers.jsx # 3D desktop model
│   │       ├── Earth.jsx     # 3D rotating earth
│   │       ├── Ball.jsx      # 3D tech stack balls
│   │       ├── Stars.jsx     # Animated starfield
│   │       └── index.js      # Canvas exports (lazy loaded)
│   │
│   ├── constants/
│   │   └── index.js          # Nav links, tech stack, projects, etc.
│   │
│   ├── hooks/
│   │   └── useSEO.js         # Dynamic SEO meta tag updates
│   │
│   ├── utils/
│   │   ├── seo.js            # SEO configuration & utilities
│   │   ├── motion.js         # Reusable animation configs
│   │   └── cdn.js            # CDN URL helpers
│   │
│   ├── assets/
│   │   └── index.js          # Asset imports (images, icons)
│   │
│   ├── hoc/
│   │   ├── SectionWrapper.jsx # HOC for section animations
│   │   └── index.js
│   │
│   └── styles/
│       └── index.js          # Tailwind style classes & defaults
│
├── index.html                # HTML entry with SEO meta tags
├── vite.config.js            # Vite config with code splitting & optimization
├── tailwind.config.js        # Tailwind customization (colors & fonts)
├── postcss.config.js         # PostCSS with Tailwind & Autoprefixer
├── package.json              # Dependencies & scripts
└── README.md                 # This file

```

---

## Getting Started

### Prerequisites

- **Node.js** 16+ ([download](https://nodejs.org))
- **npm** 8+ (comes with Node)
- A Cloudinary account for image CDN (optional, for custom images)

### Clone the Repository

```bash
git clone https://github.com/CodesOfAkash/3d_portfolio.git
cd 3d_portfolio
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=ddawd3kp5
VITE_CLOUDFRONT_CDN=https://d1una6qv9iebr4.cloudfront.net
VITE_SITE_URL=https://akashsharma.dev
```

> **Note:** Update variables if deploying to a different domain or using different CDN endpoints.

### Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Optimized production bundle will be in `dist/`

### Preview Production Build

```bash
npm run preview
```

### Run Linter

```bash
npm run lint
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud ID for image CDN | `ddawd3kp5` |
| `VITE_CLOUDFRONT_CDN` | CloudFront distribution URL for 3D models | `https://d1una6qv9iebr4.cloudfront.net` |
| `VITE_SITE_URL` | Canonical site URL for SEO | `https://akashsharma.dev` |

---

## Deployment

### Vercel (Recommended)

This site is optimized for **Vercel's Edge Network** with automatic optimizations.

1. **Connect Repository** - Push code to GitHub
2. **Import on Vercel** - https://vercel.com/import
3. **Add Environment Variables** - Set vars in project settings
4. **Deploy** - Vercel auto-deploys on push
5. **CloudFront Integration** - Configure CDN origin in Vercel dashboard

**Vercel Features Used:**
- Edge Function support for API routes
- Automatic image optimization
- Global serverless functions
- Built-in analytics and monitoring

### Manual Deployment

```bash
# Build production bundle
npm run build

# Deploy dist/ folder to your hosting provider
# (Netlify Drop, AWS S3 + CloudFront, GitHub Pages, etc.)
```

### CDN Configuration

**Cloudinary Setup:**
```
Cloud Name: ddawd3kp5
Base URL: https://res.cloudinary.com/ddawd3kp5/image/upload
```

**AWS CloudFront Setup:**
```
Distribution: d1una6qv9iebr4.cloudfront.net
Origin: S3 bucket with 3D model files (.glb, .gltf)
Cache TTL: 365 days for versioned files
```

---

## Performance Optimizations

### Code Splitting
- **React Vendor** (~45KB) - Cached for months, rarely changes
- **Three.js Vendor** (~200KB) - Loaded on-demand when 3D components mount
- **Animation Vendor** (~20KB) - Separate chunk for animation libraries
- **Router Vendor** (~8KB) - Stable, cached long-term
- **UI Vendor** (~30KB) - Toastify, Tilt, Timeline, EmailJS
- **App Code** (~35KB) - Core application logic, changes frequently

**Result:** Initial bundle reduced by ~150-200KB with lazy loading.

### Caching Strategies
- **Service Worker** - Cache-first for CSS/JS, network-first for APIs & data
- **Browser Cache** - Vendor chunks cached for 1 year
- **CDN Cache** - CloudFront caches images and 3D models for 365 days
- **Cloudinary Cache** - Smart image format selection & compression

### Image & Asset Optimization
- **Cloudinary** - Automatic WebP conversion, responsive images, AVIF support
- **CloudFront** - Edge caching with instant global delivery
- **Lazy Loading** - 3D components load on mount with Suspense boundaries
- **Preconnect** - DNS prefetch for Cloudinary, metrics, and external services

### Runtime Performance
- **GSAP Animations** - GPU-accelerated transforms (transforms, opacity only)
- **React Suspense** - 3D models load asynchronously with fallback UI
- **ScrollTrigger** - Only animates elements in viewport
- **Responsive Images** - Cloudinary device-aware breakpoints

**Metrics:**
- ⚡ Lighthouse: ~95+ Performance score
- 🚀 First Contentful Paint: <1.5s
- ⏱️ Time to Interactive: <2.5s
- 📊 Cumulative Layout Shift: <0.1

---

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ Fully supported |
| Firefox | Latest | ✅ Fully supported |
| Safari | 13+ | ✅ Fully supported |
| Edge | Latest | ✅ Fully supported |
| Mobile Safari (iOS) | 13+ | ✅ Fully supported |
| Chrome Mobile | Latest | ✅ Fully supported |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on src/ |

---

## Contributing

This is a personal portfolio, but feel free to fork and adapt it for your own use!

---

## Author

**Akash Sharma**
- Portfolio: https://akashsharma.dev
- GitHub: [@CodesOfAkash](https://github.com/CodesOfAkash)
- LinkedIn: [@codesofakash](https://www.linkedin.com/in/codesofakash)

---

## License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this code for personal and commercial projects.

---

<div align="center">

**Built with ❤️ by Akash Sharma**

[⬆ Back to top](#akash-sharma--3d-portfolio-website)

</div>