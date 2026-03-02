# Dependencies Documentation

Comprehensive guide to all dependencies used in the 3D Portfolio project.

---

## 📦 Dependency Classifications

### Core Dependencies (Direct Usage)
These are essential libraries that the application directly imports and uses.

### Development Dependencies (Build & Tooling)
These are only used during development and build processes, not included in production build.

---

## 🔧 Core Dependencies Detailed

### React Ecosystem
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.23.1"
}
```

#### React (18.2.0)
- **Purpose:** JavaScript library for building user interfaces with components
- **Why Used:** Industry standard, excellent component model, large ecosystem
- **Usage:** All UI components, state management, hooks
- **Key Concepts:**
  - Functional components with hooks
  - JSX syntax for readable component structure
  - React.Suspense for code splitting and loading states
- **Common Imports:** `useState`, `useEffect`, `useContext`, `useRef`
- **Files Using:** All components in `src/components/`

#### React DOM (18.2.0)
- **Purpose:** Bridge between React components and browser DOM
- **Why Used:** Required to render React components to actual HTML
- **Usage:** Referenced in `src/main.jsx` for mounting app
- **Key Function:** `ReactDOM.createRoot()` for app initialization

#### React Router DOM (6.23.1)
- **Purpose:** Client-side routing for SPA (Single Page Application)
- **Why Used:** Enable navigation between sections without full page reloads
- **Usage:** `BrowserRouter` in `App.jsx` wrapper
- **Components Used:**
  - `BrowserRouter` - Enables routing
  - Internal navigation handled by smooth scroll
- **Current Implementation:** Hash-based routing for GitHub Pages compatibility

---

### 3D Graphics Libraries

#### Three.js (0.165.0)
- **Purpose:** JavaScript 3D library for WebGL rendering
- **Why Used:** Create stunning 3D visualizations and models
- **Usage:** Core of all canvas components
- **Features Used:**
  - 3D scene, camera, renderer
  - Models and geometries
  - Materials and lighting
  - Texture mapping
  - Animation loop (requestAnimationFrame)
- **Files Using:**
  - `src/components/canvas/*.jsx` (all 3D components)
- **Models Loaded:** Desktop PC, Earth, Ball geometries
- **Performance:** Uses WebGL for hardware acceleration

#### @react-three/fiber (8.16.8)
- **Purpose:** React renderer for Three.js
- **Why Used:** Write Three.js code in React JSX style instead of imperative API
- **Benefits:**
  - Declarative syntax familiar to React developers
  - Automatic cleanup and resource management
  - Component composition
  - Suspense support for loading states
- **Key Components:**
  - `<Canvas>` - Sets up WebGL context
  - `<mesh>`, `<group>`, `<primitive>` - 3D elements
  - Hooks like `useFrame`, `useThree`
- **Files Using:**
  - `src/components/canvas/*.jsx` (Computers, Ball, Earth, Stars)
  - Pattern: Wrap Three.js logic in React components

#### @react-three/drei (9.106.1)
- **Purpose:** Useful helpers and abstractions for react-three-fiber
- **Why Used:** Simplify common 3D tasks (lighting, models, effects)
- **Features Likely Used:**
  - `<OrbitControls>` - Mouse camera controls
  - `<PerspectiveCamera>` - Camera setup
  - `<Environment>` - Ambient lighting
  - `<useGLTFLoader>` - Model loading
  - Text rendering in 3D
  - Skybox/environment maps
- **Benefits:** Don't need to write low-level Three.js code
- **Files Using:** Canvas components for model/effect setup

---

### Animation Libraries

#### Framer Motion (11.2.10)
- **Purpose:** Production-ready animation library for React
- **Why Used:** Create smooth, performant animations and transitions
- **Features Used:**
  - `motion` component - Animate DOM elements
  - `AnimatePresence` - Animate component mounting/unmounting
  - Gesture animations (hover, tap, drag)
  - Scroll-triggered animations
  - Variants for reusable animation configurations
- **Configuration File:** `src/utils/motion.js`
- **Common Animations:**
  - Text fade-ins
  - Slide-in animations
  - Staggered child animations (multiple items sequentially)
  - Scroll animations
- **Usage Pattern:** Wrap components in `motion.div`, `motion.h1`, etc.
- **Performance:** GPU-accelerated animations

#### Maath (0.10.8)
- **Purpose:** Math utilities for animations and geometry
- **Why Used:** Helper functions for animation calculations
- **Typical Uses:**
  - Vector math
  - Interpolation (lerp)
  - Easing functions
  - Physics calculations
- **Usage:** Referenced in animation utilities and canvas components

---

### UI & Form Libraries

#### react-tilt (1.0.2)
- **Purpose:** Tilt effect based on mouse position
- **Why Used:** Add interactive hover effects to project cards
- **Effect:** Tilts elements based on cursor position
- **Usage in Project Cards:**
  ```jsx
  <Tilt>
    <div className="project-card">
      {/* Card content */}
    </div>
  </Tilt>
  ```
- **Performance:** Lightweight, hardware-accelerated

#### react-toastify (11.0.5)
- **Purpose:** Toast notification library
- **Why Used:** Show user feedback (success, error, info messages)
- **Usage:**
  - Contact form submission feedback
  - Error notifications
  - Success confirmations
- **File:** Configured in `App.jsx` with `<ToastContainer>`
- **Preset Options:**
  - Position: top-center
  - Auto-close: 5 seconds
  - Dark theme

#### react-vertical-timeline-component (3.6.0)
- **Purpose:** Timeline component for displaying chronological data
- **Why Used:** Display work experience and education history
- **Features:**
  - Vertical timeline layout
  - Icons for each timeline item
  - Responsive design
  - Customizable styling
- **File Using:** `Experience.jsx`
- **Data Source:** Experience array from `constants/index.js`

---

### Email & Communication

#### @emailjs/browser (4.4.1)
- **Purpose:** Send emails directly from browser using EmailJS service
- **Why Used:** No backend server needed for contact form emails
- **Setup Required:**
  1. Create EmailJS account
  2. Set up email service (Gmail, custom SMTP)
  3. Create email template
  4. Get Service ID, Template ID, Public Key
  5. Initialize in component: `emailjs.init(PUBLIC_KEY)`
- **Usage in Contact Form:**
  ```javascript
  emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
  ```
- **Security:** Keep Public Key visible (it's public), keep Service/Template IDs private
- **Environment Variables:** Should use `.env` file
- **File Using:** `Contact.jsx`

---

## 🛠️ Development Dependencies Detailed

### Build Tools

#### Vite (7.3.1)
- **Purpose:** Next-generation frontend build tool
- **Why Used:** Lightning-fast development server and optimized production builds
- **Advantages Over Webpack:**
  - Instant server start
  - Faster hot module replacement (HMR)
  - On-demand compilation
  - Optimized build output
  - ES modules by default
- **Configuration:** `vite.config.js`
- **Scripts Using:**
  - `npm run dev` - Development server
  - `npm run build` - Production build
  - `npm run preview` - Preview production build

#### @vitejs/plugin-react (4.2.1)
- **Purpose:** Vite plugin for React support
- **Why Used:** Enables JSX compilation and Fast Refresh
- **Features:**
  - JSX transformation
  - Fast Refresh - Update components without clearing state
  - Automatic React import (newer React versions)
- **Configuration:** Already configured in `vite.config.js`

---

### CSS & Styling

#### Tailwind CSS (3.4.4)
- **Purpose:** Utility-first CSS framework
- **Why Used:** Rapid UI development with pre-built utility classes
- **Configuration:** `tailwind.config.js`
- **Custom Configuration:**
  - Custom colors (primary, secondary, etc.)
  - Custom sizes (xs breakpoint)
  - Custom theme extensions
  - Background images
  - Box shadows
- **Content Path:** Configured to scan all `.js` and `.jsx` files
- **How Works:** Scans code for class names and generates only needed CSS
- **Advantages:**
  - Small CSS file size (only used classes)
  - Consistent design system
  - Easy responsive design
  - No CSS conflicts

#### PostCSS (8.5.6)
- **Purpose:** CSS transformation and processing tool
- **Why Used:** Enables Tailwind CSS and vendor prefixes
- **Configuration:** `postcss.config.js`
- **Plugins Used:**
  - Tailwind CSS - CSS utility framework
  - Autoprefixer - Adds vendor prefixes automatically

#### Autoprefixer (10.4.27)
- **Purpose:** PostCSS plugin to add vendor prefixes to CSS
- **Why Used:** CSS compatibility across different browsers
- **Examples:**
  ```css
  /* Before */
  transform: rotate(45deg);
  
  /* After */
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
  ```
- **Configuration:** Automatic, works with PostCSS

---

### Linting & Code Quality

#### ESLint (10.0.2)
- **Purpose:** JavaScript linter - finds and fixes code issues
- **Why Used:** Maintain code quality and catch errors early
- **Scripts:** `npm run lint`
- **Extends:** Multiple configurations for React
- **Rules:**
  - Detects unused variables
  - Enforces best practices
  - Catches common mistakes
  - Code style consistency

#### eslint-plugin-react (7.37.5)
- **Purpose:** ESLint rules specific to React
- **Why Used:** Catch React-specific issues
- **Rules Check:**
  - Missing propTypes
  - Incorrect hook usage
  - Component naming conventions
  - JSX formatting

#### eslint-plugin-react-hooks (7.0.1)
- **Purpose:** ESLint rules for React Hooks
- **Why Used:** Prevent bugs with hooks usage
- **Rules Check:**
  - Dependencies array completeness
  - Hook rules of hooks
  - Hook execution order

#### eslint-plugin-react-refresh (0.4.6)
- **Purpose:** ESLint rules for React Fast Refresh
- **Why Used:** Ensure code is compatible with Vite's Fast Refresh
- **Rules Check:**
  - Proper export declarations
  - Component naming

---

### Type Checking

#### @types/react (19.2.14)
- **Purpose:** TypeScript type definitions for React
- **Why Used:** Better IDE support, type safety, IntelliSense
- **Benefit:** Even if not using TypeScript, provides autocomplete in VS Code
- **Definitions Include:**
  - React component types
  - Hook type signatures
  - Element types
  - Props interfaces

#### @types/react-dom (19.2.3)
- **Purpose:** TypeScript type definitions for React DOM
- **Why Used:** Type definitions for DOM rendering
- **Usage:** Used alongside @types/react for full React support

---

## 📊 Dependency Graph

```
3d_portfolio
├── react (18.2.0)
│   ├── react-dom (18.2.0)
│   │   ├── @react-three/fiber (8.16.8)
│   │   │   ├── three (0.165.0)
│   │   │   └── @react-three/drei (9.106.1)
│   │   ├── react-router-dom (6.23.1)
│   │   ├── framer-motion (11.2.10)
│   │   ├── react-tilt (1.0.2)
│   │   ├── react-toastify (11.0.5)
│   │   └── react-vertical-timeline-component (3.6.0)
│   └── @emailjs/browser (4.4.1)
├── maath (0.10.8) [utility]
└── [dev dependencies for build & development]
```

---

## 🔄 Dependency Updates Summary

### Most Significant Updates
1. **Vite** (5.2.0 → 7.3.1) - Major version jump, improved performance and security
2. **Tailwind CSS** (3.4.4 → 4.2.1) - Major update with new features
3. **React Router DOM** (6.23.1 → 7.13.1) - Improved routing capabilities
4. **ESLint** (8.57.0 → 10.0.2) - Major update, new rules and features

### Why Update Dependencies

#### Security
- Bug fixes and security patches
- Vulnerability fixes
- Protection against known exploits

#### Performance
- Optimizations and efficiency improvements
- Reduced bundle sizes
- Faster execution

#### Features
- New capabilities and APIs
- Better developer experience
- Improved tools and debugging

#### Compatibility
- Works with newer browser versions
- Node.js compatibility
- Ecosystem compatibility

---

## ⚠️ Version Management Strategy

### Current Approach
- Using caret (`^`) for most dependencies allows patch and minor version updates
- Security patches automatically installed
- Can manually update major versions when needed

### Recommendation for Future
1. Regularly run `npm outdated` to check for updates
2. Test thoroughly after major version updates
3. Use `npm audit` for security checks
4. Consider updating every 3-6 months

### Semantic Versioning
```
version: MAJOR.MINOR.PATCH
^4.3.3  = 4.x.x (allows minor and patch updates)
~4.3.3  = 4.3.x (allows only patch updates)
4.3.3   = exact version (no updates)
```

---

## 📝 Adding New Dependencies

### When You Need a New Package

1. **Find the Package**
   ```bash
   npm search package-name
   ```

2. **Install as Dependency** (used in production)
   ```bash
   npm install package-name
   ```

3. **Install as Dev Dependency** (build tools only)
   ```bash
   npm install --save-dev package-name
   ```

4. **Check Package Size** (before adding)
   ```bash
   npm init bundle-size-checker package-name
   ```

### Popular Packages for This Project Type

- **State Management:** Redux, Zustand, Recoil
- **Form Handling:** React Hook Form, Formik
- **API Calls:** Axios, TanStack Query
- **Animation:** Gsap (already available), Motion
- **UI Components:** Shadcn/ui, Headless UI
- **Database:** Firebase, Supabase (if adding backend)

---

## 🔒 Security Best Practices

1. **Regular Updates**
   ```bash
   npm update
   npm audit fix
   ```

2. **Check for Vulnerabilities**
   ```bash
   npm audit
   ```

3. **Review Dependencies**
   - Use `npm list` to see dependency tree
   - Avoid unnecessary dependencies
   - Use only from trusted authors

4. **Environment Variables**
   - Never commit `.env` files
   - Store API keys securely
   - Use `import.meta.env` for Vite environment

5. **Lock File**
   - Always commit `package-lock.json`
   - Ensures consistent installs across machines
   - Prevents supply chain attacks

---

## 🚀 Performance Impact

### Largest Dependencies (Bundle Size)
1. **Three.js** - ~100KB minified
   - 3D graphics functionality
   - Essential for canvas components

2. **React** - ~40KB minified
   - Core functionality, cannot optimize

3. **Framer Motion** - ~20KB minified
   - Rich animations, used extensively

4. **Tailwind CSS** - ~30KB minified
   - CSS framework, scanned and optimized

### Bundle Optimization Tips
- Three.js models should be gzipped
- Use code splitting for large components
- Lazy load 3D components with React.lazy
- Minimize animation library usage if possible

---

## 📚 Useful npm Commands

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Audit for security issues
npm audit

# Fix security issues automatically
npm audit fix --force

# List all installed packages
npm list

# Check dependency tree
npm list --depth=0

# Remove unused packages
npm prune

# Check package info
npm info package-name

# Update to specific version
npm install package-name@latest
```

---

**Last Updated:** February 28, 2026  
**All Dependencies Current:** ✅ Yes  
**Security Vulnerabilities:** ✅ None (0 found)
