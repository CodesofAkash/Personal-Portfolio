import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    reactjs,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    threejs,
    nextjs,
    socketio,
    prisma,
    wordpress,
    postman,
    gsap,
    twitchclone,
    zoomclone,
    iphone,
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Work",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Web Developer",
        icon: web,
    },
    {
        title: "Real-Time System Dev",
        icon: mobile,
    },
    {
        title: "API & DB Enthusiast",
        icon: backend,
    },
    {
        title: "UI Motion Hacker",
        icon: creator,
    },
];

const technologies = [
  {
    name: "TypeScript",
    icon: typescript
  },
  {
    name: "React JS",
    icon: reactjs
  },
  {
    name: "Next.js",
    icon: nextjs
  },
  {
    name: "Tailwind CSS",
    icon: tailwind
  },
  {
    name: "GSAP",
    icon: gsap

  },
  {
    name: "Three.js",
    icon: threejs
  },
  {
    name: "Node.js",
    icon: nodejs
  },
  {
    name: "MongoDB",
    icon: mongodb
  },
  {
    name: "Prisma",
    icon: prisma
  },
  {
    name: "Git",
    icon: git
  },
  {
    name: "Figma",
    icon: figma
  },
  {
    name: "WordPress",
    icon: wordpress
  },
  {
    name: "Postman",
    icon: postman
  },
];



const experiences = [
  {
    title: "Getting Started with Web Development",
    company_name: "Apna College",
    icon: javascript,
    iconBg: "#E6DEDD",
    date: "December 2023 - January 2024",
    points: [
      "Started my journey with HTML, CSS, and vanilla JavaScript through YouTube.",
      "Built basic web pages, learned about responsive layouts and Flexbox.",
      "Explored DevTools, browser behavior, and CSS tricks for design polish.",
      "Experimented with personal projects to apply new concepts hands-on."
    ],
  },
  {
    title: "Frontend Foundations & React",
    company_name: "CodeWith Harry",
    icon: reactjs,
    iconBg: "#383E56",
    date: "January 2024",
    points: [
      "Learned React.js fundamentals — components, props, state, and hooks.",
      "Learned Bootstrap and Tailwind CSS for responsive design.",
      "Started learning Git and GitHub to manage versions and collaborate.",
      "Followed tutorials and built small projects like spotify and twitter frontend clone."
    ],
  },
  {
    title: "Backend with Node.js & MongoDB",
    company_name: "CodeWith Harry",
    icon: nodejs,
    iconBg: "#E6DEDD",
    date: "February 2024",
    points: [
      "Dove into backend development with Node.js and Express.js.",
      "Connected MongoDB databases to store and retrieve user data.",
      "Built APIs and practiced CRUD operations with Postman.",
      "Created my first full-stack apps — to-do list and password manager apps."
    ],
  },
  {
    title: "Next.js & Full-Stack Development",
    company_name: "CodeWith Harry",
    icon: nextjs,
    iconBg: "#383E56",
    date: "March 2024",
    points: [
      "Shifted to building production-level projects using Next.js.",
      "Implemented features like server-side rendering and dynamic routing.",
      "Integrated tools like Clerk for auth, Prisma for DB, and deployed via Vercel.",
      "Worked on projects like a patreon app to apply full-stack skills."
    ],
  },
  {
    title: "Three.js, react-three-fiber & GSAP",
    company_name: "JavaScript Mastery",
    icon: threejs,
    iconBg: "#E6DEDD",
    date: "February 2025",
    points: [
      "Explored 3D graphics in the browser using Three.js and react-three-fiber.",
      "Built animated, scroll-based 3D websites (like the iPhone showcase).",
      "Learned GSAP to craft smooth animations and engaging interactions.",
      "Combined motion and 3D to build creative, portfolio-level experiences."
    ],
  },
  {
    title: "Low-Code & No-Code Tools",
    company_name: "JavaScript Mastery",
    icon: figma,
    iconBg: "#383E56",
    date: "February 2025",
    points: [
        "Figma: Designed UI/UX for web apps, creating prototypes and design systems.",
        "Locofy: Developed web apps with minimal coding, focusing on logic and design.",
        "WordPress: Built blogs and portfolios using themes and plugins.",
        "WooCommerce: Set up e-commerce sites with product management.",
    ],
  },
  {
    title: "WebRTC & WebSockets",
    company_name: "Meta",
    icon: socketio,
    iconBg: "#E6DEDD",
    date: "March 2025 - May 2025",
    points: [
      "Explored real-time communication using WebRTC and Socket.IO.",
      "Built apps like Threads, Uber, Twitch, and Zoom with video streaming, dynamic room creation, real-time chat and notifications.",
      "Used Clerk for auth, Stream for signaling, and ShadCN & Chakra UI for UI.",
      "Gained hands-on experience with peer-to-peer communication and event handling."
    ],
  },
];


const testimonials = [
    {
        testimonial:
            "Akash is an exceptional web developer. His attention to detail and ability to solve complex problems is impressive.",
        name: "Sahil",
        designation: "student",
        company: "Bachelor of Computer Applications (BCA)",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
        testimonial:
            "Working with Akash was a pleasure. He delivered high-quality work on time and was always open to feedback.",
        name: "Mehul",
        designation: "student",
        company: "Bachelor of Computer Applications (BCA)",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        testimonial:
            "Akash's creativity and technical skills are top-notch. He transformed our ideas into a stunning website that exceeded our expectations.",
        name: "Omkar Singh",
        designation: "student",
        company: "Bachelor of Science (Physics)",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
];

const projects = [
  {
    name: "Twitch Clone",
    description:
      "A full-featured live streaming platform where users can create accounts, go live using RTMP/WHIP ingestion, and interact with viewers through real-time chat. Built with scalability and real-time media handling in mind.",
    tags: [
      { name: "livekit", color: "blue-text-gradient" },
      { name: "tailwindcss", color: "green-text-gradient" },
      { name: "prisma", color: "pink-text-gradient" },
    ],
    image: twitchclone,
    source_code_link: "https://github.com/CodesofAkash/twitch-clone",
    link: 'https://twitch-clone--codesofakash.vercel.app'
  },
  {
    name: "Zoom Clone",
    description:
      "A real-time video conferencing web app with meeting scheduling, screen sharing, and peer-to-peer communication. Developed using stream for media transport and shadcn for UI.",
    tags: [
      { name: "stream", color: "blue-text-gradient" },
      { name: "shadcn", color: "green-text-gradient" },
      { name: "nextjs", color: "pink-text-gradient" },
    ],
    image: zoomclone,
    source_code_link: "https://github.com/CodesofAkash/zoom-clone",
    link: 'https://zoom-clone--codesofakash.vercel.app'
  },
  {
    name: "3D iPhone Display Website",
    description:
      "A product landing page showcasing 3D models of an iPhone with smooth animations and interactivity using Three.js and GSAP. Optimized for visual appeal.",
    tags: [
      { name: "threejs", color: "blue-text-gradient" },
      { name: "gsap", color: "green-text-gradient" },
      { name: "react", color: "pink-text-gradient" },
    ],
    image: iphone,
    source_code_link: "https://github.com/CodesofAkash/3D-iPhone-Website",
    link: 'https://3d-iPhone-website--codesofakash.vercel.app'
  }
];


export { services, technologies, experiences, testimonials, projects };