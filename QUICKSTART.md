# Quick Start & Development Guide

Get up and running with the 3D Portfolio project in minutes.

---

## ⚡ 5-Minute Quick Start

### 1. Prerequisites Check
Ensure you have:
- Node.js v16+ installed: `node --version`
- npm v7+ installed: `npm --version`

### 2. Setup
```bash
cd "path/to/3d_portfolio"
npm install
npm run dev
```

### 3. Open in Browser
Visit: `http://localhost:5173`

✅ **Done!** You should see the portfolio live with hot reload enabled.

---

## 🛠️ Development Workflow

### Starting Development Server
```bash
npm run dev
```
- Starts Vite dev server
- Hot module replacement (HMR) enabled
- Live reloading on file changes
- No refresh needed - state preserved
- Default port: 5173

### Building for Production
```bash
npm run build
```
- Creates optimized `dist/` folder
- Minifies and bundles code
- Optimizes images and assets
- Ready for deployment
- ~5-10 minute build time

### Preview Production Build
```bash
npm run preview
```
- Shows what production site looks like
- Uses optimized build from `dist/`
- Useful before deploying
- Port: 4173 (or next available)

### Checking Code Quality
```bash
npm run lint
```
- Runs ESLint
- Shows code quality issues
- Flags unused variables
- Checks React best practices
- No auto-fix (use `npm run lint -- --fix` to auto-fix)

---

## 📂 Project Structure Overview

### Key Folders to Edit

#### `src/` - Main Source Code
```
src/
├── components/     👈 Add/edit page sections here
├── assets/         👈 Images, icons, models go here
├── constants/      👈 Edit your info here
├── utils/          👈 Utility functions and configs
└── hoc/            👈 Wrapper components
```

#### `public/` - Static Files
```
public/
├── desktop_pc/     👈 3D computer model for hero
└── planet/         👈 3D planet model
```

### Important Files to Know

| File | Purpose | Edit For |
|------|---------|----------|
| `src/App.jsx` | Main app structure | Adding/removing sections |
| `src/constants/index.js` | Your portfolio data | Personal info, projects, skills |
| `tailwind.config.js` | Color scheme | Changing theme colors |
| `src/components/Contact.jsx` | Contact form | Setup EmailJS |
| `src/index.css` | Global styles | Custom CSS |
| `vite.config.js` | Build configuration | Advanced customization |

---

## 🎨 Customization Walkthrough

### Step 1: Update Your Information
**File:** `src/constants/index.js`

```javascript
export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    // Add or modify navigation links here
];

const services = [
    {
        title: "Your Job Title",
        icon: web,  // Change icon
    },
    // Add your services/roles
];

const technologies = [
    {
        name: "JavaScript",
        icon: javascript,
    },
    // Add your tech skills
];

const experiences = [
    {
        title: "Your Job Title",
        company_name: "Company Name",
        icon: company_icon,
        iconBg: "#383E56",
        date: "July 2023 - Present",
        points: [
            "Achievement 1",
            "Achievement 2",
        ],
    },
    // Add your work experience
];

const projects = [
    {
        name: "Project Name",
        description: "Brief description of the project",
        tags: [
            {
                name: "javascript",
                color: "blue-text-gradient",
            },
        ],
        image: project_image,
        source_code_link: "https://github.com/...",
        live_demo_link: "https://...",
    },
    // Add your projects
];

const testimonials = [
    {
        testimonial: "Feedback from someone",
        name: "Person Name",
        designation: "Their title",
        company: "Their company",
        image: person_image,
    },
    // Add testimonials
];
```

### Step 2: Update Colors
**File:** `tailwind.config.js`

```javascript
theme: {
    extend: {
        colors: {
            primary: "#050816",      // Change main background
            secondary: "#aaa6c3",    // Change accent color
            tertiary: "#151030",     // Change secondary bg
            "black-100": "#100d25",
            "black-200": "#090325",
            "white-100": "#f3f3f3",
        },
        // ...
    },
}
```

**Then restart dev server:** `npm run dev`

### Step 3: Update Assets
**File:** `src/assets/index.js`

Import images and icons:
```javascript
import mobile from "./mobile.png";
import backend from "./backend.png";
import creator from "./creator.png";
import web from "./web.png";

// Tech icons
import javascript from "./tech/javascript.png";
import typescript from "./tech/typescript.png";
// ... add more

// Projects
import twitchclone from "./twitchclone.png";
import zoomclone from "./zoomclone.png";

export {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    // ... export all
}
```

### Step 4: Setup Contact Form
**File:** `src/components/Contact.jsx`

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com)
   - Sign up with email/GitHub

2. **Setup Email Service**
   - Connect your email provider (Gmail recommended)
   - Note the **Service ID**

3. **Create Email Template**
   - Create new template
   - Use template variables: {{name}}, {{email}}, {{message}}
   - Note the **Template ID**

4. **Get Public Key**
   - User account menu → Account
   - Note the **Public Key**

5. **Update Component**
   ```javascript
   // In Contact.jsx
   useEffect(() => {
       emailjs.init("YOUR_PUBLIC_KEY");
   }, []);
   
   const handleSubmit = async (e) => {
       // Template parameters match your template variables
       const templateParams = {
           to_email: "your@email.com",
           from_name: form.name,
           from_email: form.email,
           message: form.message,
       };
       
       const response = await emailjs.send(
           "SERVICE_ID",
           "TEMPLATE_ID",
           templateParams
       );
   };
   ```

### Step 5: Add/Remove Sections
In `src/App.jsx`:

```javascript
const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar/>
          <Hero />  {/* Welcome section */}
        </div>
        <About/>              {/* About you */}
        <Experience/>         {/* Work experience */}
        <Tech/>              {/* Tech skills */}
        <Works/>             {/* Your projects */}
        <Feedbacks/>         {/* Testimonials */}
        <Contact/>           {/* Contact form */}
        <StarsCanvas/>       {/* Background animation */}
        <Footer/>
      </div>
    </BrowserRouter>
  )
}
```

Remove a section by commenting out:
```javascript
{/* <Feedbacks/> */}  {/* Temporarily disabled */}
```

---

## 🐛 Common Development Tasks

### Adding New Tech Skill
1. Add icon to `assets/tech/` folder
2. Import in `src/assets/index.js`
3. Export from `src/assets/index.js`
4. Add to `technologies` array in `src/constants/index.js`

### Adding New Project
1. Add project image to `src/assets/`
2. Import in `src/assets/index.js`
3. Update `projects` array in `src/constants/index.js`:
   ```javascript
   {
       name: "Project Title",
       description: "What this project does...",
       tags: [
           { name: "react", color: "blue-text-gradient" },
           { name: "nodejs", color: "green-text-gradient" },
       ],
       image: projectImage,
       source_code_link: "https://github.com/yourrepo",
       live_demo_link: "https://deployed-site.com",
   }
   ```

### Changing Hero Background
1. Replace image at `src/assets/herobg.png`
2. Or update in `tailwind.config.js`:
   ```javascript
   backgroundImage: {
       "hero-pattern": "url('/path/to/new/image.png')",
   }
   ```
3. Restart dev server

### Updating 3D Model
**For Computer Model in Hero:**
1. Replace files in `public/desktop_pc/`
2. Update `Computers.jsx` if model structure changed
3. Adjust camera position and rotation as needed

**For Other Models:**
1. Replace in corresponding `public/` folder
2. Update corresponding canvas component
3. Test rendering in development

### Adding New Component Section
1. Create `src/components/NewSection.jsx`
2. Write component with animation imports
3. Import in `src/App.jsx`
4. Add to JSX in correct position
5. Update nav links in `src/constants/index.js`

Example component:
```javascript
import { SectionWrapper } from '../hoc'
import { motion } from 'framer-motion'
import { styles } from '../styles'

const NewSection = () => {
  return (
    <motion.div>
      <h2 className={styles.sectionHeadText}>Section Title</h2>
      <p className={styles.sectionSubText}>Subtitle</p>
      {/* Your content */}
    </motion.div>
  )
}

export default SectionWrapper(NewSection, "newSection")
```

---

## 🚀 Performance Debugging

### Check Bundle Size
```bash
npm run build
```
Look at terminal output for file sizes.

### Check What's Slow
Open browser DevTools → Performance tab:
1. Click record
2. Scroll and interact
3. Click stop
4. Analyze the flame graph

### Check Network Issues
1. DevTools → Network tab
2. Reload page
3. Check for:
   - Failed requests (red)
   - Large files
   - Slow loading

### Check Runtime Performance
1. DevTools → Console tab
2. Look for JavaScript errors
3. Check performance warnings
4. Monitor memory usage

---

## 🔄 Git Workflow

### First Time Setup
```bash
git init
git add .
git commit -m "Initial: 3D portfolio setup"
```

### Regular Development
```bash
# See what changed
git status

# Stage changes
git add src/

# Commit changes
git commit -m "Feature: Add new project"

# Push to GitHub
git push origin main
```

### Useful Git Commands
```bash
# See commit history
git log --oneline

# Undo changes to a file
git checkout -- filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See detailed changes
git diff
```

---

## 📝 Testing Checklist

Before deploying, test:

- [ ] All navigation links work
- [ ] Contact form sends emails successfully
- [ ] 3D models load and display
- [ ] Animations run smoothly
- [ ] Responsive on mobile (F12 → toggle device)
- [ ] Images load correctly
- [ ] No console errors (F12 → Console)
- [ ] No linting warnings: `npm run lint`

---

## 🎯 Deployment Checklist

Before going live:

- [ ] Run `npm run build` with no errors
- [ ] Test production build: `npm run preview`
- [ ] Update personal information in constants
- [ ] Verify all links (GitHub, portfolio, socials)
- [ ] Update meta tags in `index.html`
- [ ] Check site on mobile/tablet
- [ ] Run `npm run lint` and fix any issues
- [ ] EmailJS configured and tested
- [ ] Environment variables set on hosting platform
- [ ] Domain configured (if using custom domain)

---

## 📱 Mobile Development

### Test Responsive Design
1. F12 (DevTools)
2. Click mobile icon (top-left)
3. Select device or set custom size
4. Test interactions and layout

### Common Mobile Issues
- Touch events vs hover events
- Small tap targets (should be 44x44px minimum)
- Text readable without zoom
- Images responsive

### Fix Mobile Issues
In component:
```javascript
// Bad - hover only works on desktop
<div className="hover:scale-110">

// Better - works on touch
<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
```

---

## 🆘 Troubleshooting Guide

### Issue: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete lock file
rm package-lock.json

# Reinstall
npm install
```

### Issue: Dev server shows blank page
**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Try hard refresh: Ctrl+Shift+R
4. Check localhost:5173 is correct URL

### Issue: Changes don't appear
**Solution:**
1. Save file (Ctrl+S)
2. Wait 1-2 seconds for HMR
3. If still blank, refresh browser (F5)
4. Restart dev server: `npm run dev`

### Issue: Build succeeds but deployment broken
**Possible Causes:**
- CORS issues with API
- Environment variables not set
- Asset paths incorrect
- Browser compatibility issues

**Solution:**
1. Test with `npm run preview` locally
2. Check browser console on deployed site
3. Verify environment variables are set
4. Check asset paths in build folder

### Issue: 3D models not loading
**Solution:**
1. Check files exist in `public/` folder
2. Check browser console for 404 errors
3. Verify correct file paths in component
4. Check file format (gltf/glb recommended)
5. Try different model file

---

## 📚 Additional Resources

### Learning Path
1. **React Basics** - Components, hooks, state
2. **Tailwind CSS** - Utility classes, responsive design
3. **Framer Motion** - Basic animations, variants
4. **Three.js + React Three Fiber** - 3D concepts
5. **Vite** - Build configuration, optimizations

### Useful Links
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion
- Three.js: https://threejs.org
- Vite Guide: https://vitejs.dev

### YouTube Channels
- Web Dev Simplified
- Fireship
- Three.js Official
- John Codeing

---

## 🎓 Learning by Modification

### Challenge 1: Change Theme Colors
- Modify `tailwind.config.js` colors
- Rebuild with `npm run build`
- See how it affects entire site

### Challenge 2: Add New Animation
- Duplicate a component section
- Modify animation in `src/utils/motion.js`
- Test with dev server

### Challenge 3: Replace 3D Model
- Add new model to `public/`
- Update corresponding canvas component
- Adjust transforms (position, rotation, scale)

### Challenge 4: Add New Page Section
- Create new component
- Add to `App.jsx`
- Update navigation
- Add sample data

---

**Happy coding! 🚀**

Last Updated: February 28, 2026
