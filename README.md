# 3D Portfolio - Comprehensive Documentation

A modern, interactive 3D portfolio website built with React, Three.js, and Tailwind CSS. This portfolio showcases your web development skills with stunning visual effects, smooth animations, and 3D graphics.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Dependencies & Recent Updates](#dependencies--recent-updates)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Available Scripts](#available-scripts)
7. [Component Documentation](#component-documentation)
8. [Configuration](#configuration)
9. [Customization Guide](#customization-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a portfolio website designed to:
- Showcase your skills, experience, and projects in an engaging 3D environment
- Present information through interactive components with smooth animations
- Provide contact information and links to your work
- Demonstrate modern web development practices

**Current Status:** Personal portfolio for Akash Sharma (Third-year BCA student)

### Key Features
- ✨ Interactive 3D graphics powered by Three.js
- 🎨 Smooth animations using Framer Motion
- 📱 Fully responsive design with Tailwind CSS
- 🎯 Sections for About, Experience, Projects, Feedback, and Contact
- 📧 EmailJS integration for contact form
- 🌟 Custom 3D canvas elements (Computers, Earth, Stars, Ball)
- ⚡ Fast builds and development with Vite
- 🎭 Tilt effects on components with react-tilt

---

## 💻 Technology Stack

### Frontend Framework
- **React** (18.2.0) - UI library for building components
- **React DOM** (18.2.0) - DOM rendering for React

### 3D Graphics & Animation
- **Three.js** (0.165.0) - 3D graphics library
- **@react-three/fiber** (8.16.8) - React renderer for Three.js
- **@react-three/drei** (9.106.1) - Useful helpers for react-three-fiber
- **Framer Motion** (11.2.10) - Smooth animation library

### Styling & UI
- **Tailwind CSS** (3.4.4) - Utility-first CSS framework
- **PostCSS** (8.4.38) - CSS transformation tool
- **Autoprefixer** (10.4.19) - PostCSS plugin to parse CSS and add vendor prefixes
- **react-tilt** (1.0.2) - Tilt effect on mouse movement

### Routing & Navigation
- **React Router DOM** (6.23.1) - Client-side routing

### Additional Libraries
- **@emailjs/browser** (4.3.3) - Email service for contact forms
- **react-toastify** (11.0.5) - Toast notifications
- **react-vertical-timeline-component** (3.6.0) - Timeline component for experience
- **maath** (0.10.7) - Math utilities for animations

### Build Tools
- **Vite** (7.3.1) - Lightning-fast build tool and dev server
- **@vitejs/plugin-react** (4.2.1) - Vite plugin for React

### Development Tools
- **ESLint** (8.57.0) - Code linting tool
- **eslint-plugin-react** (7.34.1) - React-specific ESLint rules
- **eslint-plugin-react-hooks** (4.6.0) - ESLint rules for React Hooks
- **eslint-plugin-react-refresh** (0.4.6) - Fast Refresh support for ESLint
- **@types/react** (18.2.66) - TypeScript types for React
- **@types/react-dom** (18.2.22) - TypeScript types for React DOM

---



## 📁 Project Structure

```
3d_portfolio/
├── index.html                 # Main HTML entry point
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Locked dependency versions
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
│
├── public/                    # Static public assets
│   ├── desktop_pc/            # 3D model for computer display
│   │   └── textures/          # Model textures
│   └── planet/                # 3D planet model
│       └── textures/          # Planet textures
│
└── src/                       # Source code
    ├── main.jsx               # React app entry point
    ├── App.jsx                # Root app component with routing
    ├── index.css              # Global styles
    ├── styles.js              # Styled component configurations
    │
    ├── assets/                # Images and icons
    │   ├── index.js           # Asset exports
    │   └── tech/              # Technology icons
    │
    ├── components/            # React components
    │   ├── index.js           # Component exports
    │   ├── Navbar.jsx         # Navigation bar component
    │   ├── Hero.jsx           # Landing/hero section
    │   ├── About.jsx          # About me section
    │   ├── Experience.jsx     # Work experience timeline
    │   ├── Tech.jsx           # Tech skills showcase
    │   ├── Works.jsx          # Projects showcase
    │   ├── Stackfolio.jsx     # Skills/stack section
    │   ├── Feedbacks.jsx      # Testimonials/feedback section
    │   ├── Contact.jsx        # Contact form
    │   ├── Footer.jsx         # Footer component
    │   ├── Loader.jsx         # Loading spinner
    │   │
    │   └── canvas/            # 3D canvas components
    │       ├── index.js       # Canvas exports
    │       ├── Computers.jsx  # 3D computer model
    │       ├── Ball.jsx       # Animated 3D ball
    │       ├── Earth.jsx      # 3D earth visualization
    │       └── Stars.jsx      # Animated starfield background
    │
    ├── constants/             # Constants and configuration
    │   └── index.js           # Navigation links, services, skills, projects data
    │
    ├── hoc/                   # Higher-order components
    │   ├── index.js           # HOC exports
    │   └── SectionWrapper.jsx # Wrapper for adding consistent styling to sections
    │
    └── utils/                 # Utility functions
        └── motion.js          # Animation configuration for Framer Motion

```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Git

### Installation Steps

1. **Clone or extract the project**
   ```bash
   cd "3d_portfolio"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all packages listed in `package.json`

3. **Verify installation**
   ```bash
   npm run lint
   ```
   This checks for any linting errors

4. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

### First-Time Setup Notes
- The node_modules folder will be created automatically
- All dependencies are already specified in package.json
- No additional configuration is needed for Tailwind CSS or PostCSS

---

## 📜 Available Scripts

### `npm run dev`
- **Purpose:** Start the Vite development server with hot module replacement (HMR)
- **Usage:** For local development with live reloading
- **Output:** Runs on `http://localhost:5173` by default

### `npm run build`
- **Purpose:** Create an optimized production build
- **Usage:** Should be run before deploying to production
- **Output:** Creates a `dist/` folder with minified and optimized files

### `npm run lint`
- **Purpose:** Check code for linting errors using ESLint
- **Usage:** Validates code quality and style consistency
- **Exit Code:** Non-zero if errors found with max warnings set to 0

### `npm run preview`
- **Purpose:** Preview the production build locally
- **Usage:** Test the production build before deployment
- **Note:** Run `npm run build` first

---

## 🧩 Component Documentation

### Page Components

#### `Navbar.jsx`
- **Purpose:** Main navigation bar with smooth scrolling and animations
- **Features:**
  - Responsive mobile menu
  - Logo and navigation links
  - Smooth scroll to sections
  - Active link highlighting
- **Key Props:** Uses constants from `constants/index.js` for nav links
- **Animation:** Framer Motion for menu transitions

#### `Hero.jsx`
- **Purpose:** Landing section with 3D computer model
- **Displays:**
  - Personal introduction and title
  - Tagline about developer skills
  - 3D computer visualization via ComputersCanvas
  - Scroll-down indicator animation
- **Styling:** Uses custom styles from `styles.js`
- **Animation:** Bouncing scroll indicator

#### `About.jsx`
- **Purpose:** Personal about section with overview
- **Content:** 
  - Personal bio
  - Skills overview
  - Call-to-action
- **Animation:** Fade-in effects on scroll using Framer Motion
- **HOC:** Wrapped with SectionWrapper for consistent styling

#### `Experience.jsx`
- **Purpose:** Work experience and education timeline
- **Features:**
  - Vertical timeline visualization
  - Company/institution details
  - Skills used in each role
  - Icons for each experience
- **Component Used:** `react-vertical-timeline-component`
- **Data Source:** Imported from `constants/index.js`

#### `Tech.jsx`
- **Purpose:** Showcase technical skills and technologies
- **Display Method:**
  - Grid of animated 3D balls
  - Each ball displays a tech icon
  - Hover animations
  - Technology names
- **3D Animation:** Uses Ball.jsx canvas component

#### `Works.jsx`
- **Purpose:** Portfolio projects showcase
- **Features:**
  - Project cards with descriptions
  - Live demo and code repository links
  - Project images/thumbnails
  - Technology tags
- **Animation:** Tilt effect using react-tilt

#### `Stackfolio.jsx`
- **Purpose:** Skills/tech stack organization
- **Display:** Categorized skills display
- **Categories:** Languages, frameworks, tools, platforms

#### `Feedbacks.jsx`
- **Purpose:** Testimonials and feedback section
- **Features:**
  - User testimonials
  - Ratings/reviews
  - User information cards
- **Animation:** Smooth card transitions

#### `Contact.jsx`
- **Purpose:** Contact form for visitor inquiries
- **Features:**
  - Name, email, message input fields
  - Form validation
  - EmailJS integration for sending emails
  - Toast notifications for feedback
- **Email Service:** @emailjs/browser
- **Validation:** Basic client-side validation

#### `Footer.jsx`
- **Purpose:** Page footer with additional links and info
- **Content:** Copyright, social links, additional navigation

#### `Loader.jsx`
- **Purpose:** Loading spinner shown during 3D asset loading
- **Display:** Can-Tro3D branding or custom spinner
- **Trigger:** Shown while 3D models are loading

### Canvas Components (3D Graphics)

#### `Computers.jsx`
- **Purpose:** 3D computer model visualization for hero section
- **Technology:** react-three-fiber and Three.js
- **Asset:** Desktop PC 3D model from `public/desktop_pc/`
- **Features:**
  - Responsive scaling based on screen size
  - Automatic rotation
  - Click/hover interactions
- **Performance:** Uses Suspense with Loader fallback

#### `Ball.jsx`
- **Purpose:** Animated 3D ball used in Tech skills showcase
- **Features:**
  - Rotating 3D sphere
  - Custom textures/materials
  - Icon display on surface
  - Mouse interaction
- **Usage:** Rendered in a grid in Tech.jsx

#### `Earth.jsx`
- **Purpose:** 3D Earth visualization
- **Features:**
  - Rotating planet
  - Custom textures
  - Could be used for location/global reach
- **Status:** Available in canvas folder

#### `Stars.jsx`
- **Purpose:** Animated starfield background
- **Features:**
  - Infinite scrolling stars
  - Performance optimized
  - Creates depth effect
- **Usage:** Used in Contact section background

### HOC & Utilities

#### `SectionWrapper.jsx`
- **Purpose:** Higher-order component for consistent section styling
- **Features:**
  - Adds section padding and container width
  - Applies ID for navigation
  - Consistent spacing across sections
- **Usage:** All major sections wrapped with this HOC

#### `motion.js`
- **Purpose:** Central configuration for Framer Motion animations
- **Contains:**
  - `textVariant` - Text fade-in animations
  - `fadeIn` - General fade-in effect
  - `slideIn` - Slide animations from different directions
  - `staggerContainer` - Stagger animations for child elements
  - Transition configurations
- **Usage:** Imported in components for consistent animation

---

## ⚙️ Configuration

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```
- Uses React plugin for JSX and Fast Refresh
- Default settings work for most use cases

### Tailwind CSS Configuration (`tailwind.config.js`)
**Customized Colors:**
- Primary: `#050816` (dark background)
- Secondary: `#aaa6c3` (accent color)
- Tertiary: `#151030` (alternative dark)
- Black-100: `#100d25`
- Black-200: `#090325`
- White-100: `#f3f3f3`

**Custom Sizes:**
- Extra small breakpoint: `450px` (xs)

**Custom Background:**
- Hero pattern: `/src/assets/herobg.png`

**Box Shadow:**
- Card shadow: `0px 35px 120px -15px #211e35`

### PostCSS Configuration (`postcss.config.js`)
- Includes Tailwind CSS
- Includes Autoprefixer for vendor prefixes

---

## 🎨 Customization Guide

### Changing Personal Information
Edit `src/constants/index.js` to update:
- Navigation links
- Service/skill titles and icons
- Experience entries
- Projects/works
- Technology skills

### Updating Colors
1. Open `tailwind.config.js`
2. Modify the color values under `theme.extend.colors`
3. Update corresponding references in component class names

### Adding New Sections
1. Create a new component in `src/components/`
2. Import the component in `App.jsx`
3. Add it to the JSX in the correct order
4. Wrap with `SectionWrapper` HOC if needed
5. Update navigation links in `constants/index.js`

### Modifying 3D Models
1. Replace 3D model files in `public/desktop_pc/` or `public/planet/`
2. Update the corresponding Canvas component to load the new model
3. Adjust camera, lighting, and rotation if needed

### Changing Animations
1. Update `src/utils/motion.js` for global animations
2. Or use Framer Motion directly in components
3. Reference animation configuration in component variants prop

### Customizing Contact Form
Edit `Contact.jsx`:
1. Update EmailJS service ID, template ID, and public key
2. Modify form fields and validation
3. Update toast messages

### Styling Components
- Use Tailwind CSS classes in JSX
- Custom styles in `src/styles.js`
- Global styles in `src/index.css`

---

## 🚀 Deployment

### Building for Production
```bash
npm run build
```
This creates a `dist/` folder with optimized, minified files.

### Deployment Platforms

#### Vercel (Recommended for Vite projects)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Vercel automatically detects Vite configuration
4. Deploy automatically on push

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Netlify automatically deploys

#### Traditional Hosting (Apache, Nginx)
1. Run `npm run build`
2. Upload `dist/` folder contents to web server
3. Configure server to serve `index.html` as fallback (for client-side routing)

### Environment Variables
Create a `.env` file for sensitive data:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Access in components:
```javascript
import.meta.env.VITE_EMAILJS_SERVICE_ID
```

### Performance Optimization
- Vite automatically handles code splitting
- 3D assets are lazy-loaded with Suspense
- Consider image optimization for project thumbnails
- Enable GZIP compression on server

---

## 🐛 Troubleshooting

### Issue: Dev server won't start
**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Run `npm run dev`

### Issue: 3D models not loading
**Possible Causes:**
- Missing model files in `public/` folder
- Incorrect model path in Canvas component
- Model format not supported

**Solution:**
1. Verify files exist in `public/desktop_pc/` and `public/planet/`
2. Check component file paths
3. Ensure model format is supported (glTF/gLTF.js recommended)

### Issue: Styles not applying correctly
**Solution:**
1. Check Tailwind class names are correct
2. Verify `tailwind.config.js` content path includes all component files
3. Restart dev server: `npm run dev`
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: EmailJS not sending emails
**Solution:**
1. Verify EmailJS account and API keys
2. Check template ID and service ID are correct
3. Test with console.log to verify form data
4. Check email spam folder
5. Verify sender email in EmailJS dashboard

### Issue: Build fails
**Solution:**
1. Run `npm run lint` to check for linting errors
2. Fix any errors shown
3. Try `npm run build` again
4. Check for console warnings during build

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 3000
```
Or kill the process using port 5173:
- Windows: `netstat -ano | findstr :5173` then `taskkill /PID <PID> /F`

### Issue: Browser shows blank page
**Possible Causes:**
- JavaScript errors in console
- 3D rendering issues

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check if WebGL is supported by browser

---

## 📚 Additional Resources

### Official Documentation
- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### Learning Resources
- Three.js tutorials on YouTube
- Framer Motion animation guides
- React hooks best practices
- Tailwind CSS utility-first approach

### Community
- React Three Fiber Discord
- Three.js Forum
- Tailwind CSS Discord

---

## 🔒 Security Notes

- All dependencies are up-to-date with security patches
- No hardcoded sensitive information (use environment variables)
- EmailJS keys should be protected as environment variables
- Consider implementing rate limiting on contact form
- Always validate user input on the backend

---

## 📝 Git Best Practices

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: 3D portfolio setup"
```

### Regular Commits
```bash
git add .
git commit -m "Add new feature or fix"
git push origin main
```

### Ignore File (.gitignore)
Already standard Node.js ignores:
- node_modules/
- dist/
- .env
- .DS_Store

---

## 👨‍💻 About the Developer

**Portfolio Owner:** Akash Sharma  
**Status:** Third-year BCA Student  
**Focus:** Full-Stack Web Development, Real-Time Systems, Data Structures & Algorithms

---

## 📄 License

This project is a personal portfolio. Please respect the intellectual property of all 3D models and assets used.

---

## ✅ Checklist for New Developers

- [ ] Read this entire documentation
- [ ] Install Node.js and npm
- [ ] Run `npm install` to set up dependencies
- [ ] Run `npm run dev` to start development
- [ ] Explore the project structure
- [ ] Modify `constants/index.js` with your information
- [ ] Customize colors in `tailwind.config.js`
- [ ] Update components with your content
- [ ] Test the contact form with EmailJS
- [ ] Build and deploy to production

---

**Last Updated:** February 28, 2026  
**Documentation Version:** 1.0  
**Project Status:** Active Development
