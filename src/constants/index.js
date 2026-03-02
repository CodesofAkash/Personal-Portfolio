import { techIcon, projectImage, serviceIcon } from "../lib/cloudinary";

// ─────────────────────────────────────────────
// NAVIGATION — page routes, not hash anchors
// ─────────────────────────────────────────────

export const navLinks = [
  { id: "/about",    title: "About"    },
  { id: "/projects", title: "Projects" },
  { id: "/contact",  title: "Contact"  },
];

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

const services = [
  { title: "Web Developer",        icon: serviceIcon("portfolio/services/web")      },
  { title: "Real-Time System Dev", icon: serviceIcon("portfolio/services/realtime") },
  { title: "API & DB Enthusiast",  icon: serviceIcon("portfolio/services/backend")  },
  { title: "UI Motion Hacker",     icon: serviceIcon("portfolio/services/creator")  },
];

// ─────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────

const technologies = [
  { name: "TypeScript",   icon: techIcon("portfolio/tech/typescript")  },
  { name: "React JS",     icon: techIcon("portfolio/tech/reactjs")     },
  { name: "Next.js",      icon: techIcon("portfolio/tech/nextjs")      },
  { name: "Tailwind CSS", icon: techIcon("portfolio/tech/tailwind")    },
  { name: "GSAP",         icon: techIcon("portfolio/tech/gsap")        },
  { name: "Three.js",     icon: techIcon("portfolio/tech/threejs")     },
  { name: "Node.js",      icon: techIcon("portfolio/tech/nodejs")      },
  { name: "MongoDB",      icon: techIcon("portfolio/tech/mongodb")     },
  { name: "Prisma",       icon: techIcon("portfolio/tech/prisma")      },
  { name: "Socket.IO",    icon: techIcon("portfolio/tech/socketio")    },
  { name: "Git",          icon: techIcon("portfolio/tech/git")         },
  { name: "Figma",        icon: techIcon("https://res.cloudinary.com/ddawd3kp5/image/upload/v1772289494/figma_yryrpw.png")       },
  { name: "WordPress",    icon: techIcon("portfolio/tech/wordpress")   },
  { name: "Postman",      icon: techIcon("portfolio/tech/postman")     },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────

const LOGOS = {
  apnaCollege:   "https://avatars.githubusercontent.com/u/66199241?s=200&v=4",
  codeWithHarry: "https://avatars.githubusercontent.com/u/55523838?s=200&v=4",
  jsMastery:     "https://avatars.githubusercontent.com/u/72614512?s=200&v=4",
  meta:          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png",
};

const experiences = [
  {
    title: "Getting Started with Web Development",
    company_name: "Apna College",
    icon: LOGOS.apnaCollege,
    iconBg: "#E6DEDD",
    date: "December 2023 – January 2024",
    points: [
      "Started my journey with HTML, CSS, and vanilla JavaScript through YouTube.",
      "Built basic web pages, learned responsive layouts, Flexbox, and CSS tricks.",
      "Explored browser DevTools and applied concepts through hands-on mini projects.",
      "Laid the foundation that everything since has been built on.",
    ],
  },
  {
    title: "Frontend Foundations & React",
    company_name: "CodeWithHarry",
    icon: LOGOS.codeWithHarry,
    iconBg: "#383E56",
    date: "January 2024",
    points: [
      "Learned React.js fundamentals — components, props, state, and hooks.",
      "Adopted Bootstrap and Tailwind CSS for fast, responsive UI design.",
      "Started using Git and GitHub for version control and collaboration.",
      "Built small projects including Spotify and Twitter frontend clones.",
    ],
  },
  {
    title: "Backend with Node.js & MongoDB",
    company_name: "CodeWithHarry",
    icon: LOGOS.codeWithHarry,
    iconBg: "#E6DEDD",
    date: "February 2024",
    points: [
      "Dove into backend development with Node.js and Express.js.",
      "Connected MongoDB databases to store and retrieve user data.",
      "Built and tested REST APIs using Postman for CRUD operations.",
      "Created first full-stack apps — a to-do list and password manager.",
    ],
  },
  {
    title: "Next.js & Full-Stack Development",
    company_name: "CodeWithHarry",
    icon: LOGOS.codeWithHarry,
    iconBg: "#383E56",
    date: "March 2024",
    points: [
      "Shifted to production-level projects using Next.js with SSR and dynamic routing.",
      "Integrated Clerk for auth, Prisma for database ORM, and deployed via Vercel.",
      "Built a Patreon-style app to apply full-stack skills end to end.",
      "Learned environment management, API routes, and deployment pipelines.",
    ],
  },
  {
    title: "Three.js, React Three Fiber & GSAP",
    company_name: "JavaScript Mastery",
    icon: LOGOS.jsMastery,
    iconBg: "#E6DEDD",
    date: "February 2025",
    points: [
      "Explored 3D graphics in the browser using Three.js and react-three-fiber.",
      "Built animated, scroll-based 3D websites including an iPhone showcase.",
      "Learned GSAP to craft smooth, performant animations and engaging interactions.",
      "Combined motion and 3D to build creative, portfolio-level experiences.",
    ],
  },
  {
    title: "Low-Code & Design Tools",
    company_name: "JavaScript Mastery",
    icon: LOGOS.jsMastery,
    iconBg: "#383E56",
    date: "February 2025",
    points: [
      "Figma: Designed UI/UX for web apps, building prototypes and design systems.",
      "Locofy: Developed web apps with minimal code, focusing on logic and design.",
      "WordPress & WooCommerce: Built blogs, portfolios, and e-commerce storefronts.",
      "Developed an eye for design systems and component consistency.",
    ],
  },
  {
    title: "WebRTC & Real-Time Systems",
    company_name: "Meta Open Source",
    icon: LOGOS.meta,
    iconBg: "#E6DEDD",
    date: "March 2025 – May 2025",
    points: [
      "Explored real-time communication using WebRTC and Socket.IO.",
      "Built Twitch, Zoom, Threads, and Uber clones with video, chat, and live streaming.",
      "Used LiveKit/Stream for media signaling and ShadCN + Chakra UI for interfaces.",
      "Gained hands-on experience with peer-to-peer connections and event-driven systems.",
    ],
  },
];

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

const testimonials = [
  {
    testimonial: "Akash is an exceptional web developer. His attention to detail and ability to solve complex problems is impressive.",
    name: "Sahil",
    designation: "Student",
    company: "Bachelor of Computer Applications (BCA)",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    testimonial: "Working with Akash was a pleasure. He delivered high-quality work on time and was always open to feedback.",
    name: "Mehul",
    designation: "Student",
    company: "Bachelor of Computer Applications (BCA)",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    testimonial: "Akash's creativity and technical skills are top-notch. He transformed our ideas into a stunning website that exceeded our expectations.",
    name: "Omkar Singh",
    designation: "Student",
    company: "Bachelor of Science (Physics)",
    image: "https://randomuser.me/api/portraits/men/61.jpg",
  },
];

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

const projects = [
  {
    name: "Twitch Clone",
    description: "A full-featured live streaming platform where users can go live using RTMP/WHIP ingestion and interact through real-time chat. Built with LiveKit for media transport and Prisma for data persistence.",
    tags: [
      { name: "livekit",     color: "blue-text-gradient"  },
      { name: "tailwindcss", color: "green-text-gradient" },
      { name: "prisma",      color: "pink-text-gradient"  },
    ],
    image: projectImage("portfolio/projects/twitch-clone"),
    source_code_link: "https://github.com/CodesofAkash/twitch-clone",
    link: "https://open-stream--codesofakash.vercel.app",
  },
  {
    name: "Zoom Clone",
    description: "A real-time video conferencing app with meeting scheduling, screen sharing, and peer-to-peer communication. Uses Stream for media transport and ShadCN for a polished UI.",
    tags: [
      { name: "stream",  color: "blue-text-gradient"  },
      { name: "shadcn",  color: "green-text-gradient" },
      { name: "nextjs",  color: "pink-text-gradient"  },
    ],
    image: projectImage("portfolio/projects/zoom-clone"),
    source_code_link: "https://github.com/CodesofAkash/zoom-clone",
    link: "https://mojito-cocktail--codesofakash.vercel.app/#hero",
  },
  {
    name: "3D iPhone Display Website",
    description: "A product landing page showcasing iPhone 3D models with scroll-driven animations using Three.js and GSAP. Optimized for visual impact and smooth 60fps interactions.",
    tags: [
      { name: "threejs", color: "blue-text-gradient"  },
      { name: "gsap",    color: "green-text-gradient" },
      { name: "react",   color: "pink-text-gradient"  },
    ],
    image: projectImage("portfolio/projects/iphone-3d"),
    source_code_link: "https://github.com/CodesofAkash/3D-iPhone-Website",
    link: "https://apple-phone--codesofakash.vercel.app/signin",
  },
];

export { services, technologies, experiences, testimonials, projects };