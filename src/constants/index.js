// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export const navLinks = [
  { id: "/about",    title: "About"    },
  { id: "/projects", title: "Projects" },
  { id: "/contact",  title: "Contact"  },
];

// ─────────────────────────────────────────────
// CLOUDINARY BASE URLs
// ─────────────────────────────────────────────

const CDN  = "https://res.cloudinary.com/ddawd3kp5/image/upload";
const VCDN = "https://res.cloudinary.com/ddawd3kp5/video/upload";

// ─────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────

export const technologies = [
  // Core Frontend
  { name: "JavaScript",   icon: `${CDN}/js_svckyk.svg`          },
  { name: "TypeScript",   icon: `${CDN}/typescript_dqkj0j.png`  },
  { name: "React.js",     icon: `${CDN}/reactjs_mykfpg.png`     },
  { name: "Next.js",      icon: `${CDN}/nextjs_f6qd7x.png`      },
  { name: "Tailwind CSS", icon: `${CDN}/tailwind_gkafu4.png`    },

  // 3D & Motion
  { name: "Three.js",     icon: `${CDN}/threejs_dlcegx.svg`     },
  { name: "GSAP",         icon: `${CDN}/gsap_boaydq.png`        },

  // Backend & APIs
  { name: "Node.js",      icon: `${CDN}/nodejs_ur2zox.png`      },
  { name: "Express.js",   icon: `${CDN}/express_ml2xwr.svg`     },
  { name: "Socket.IO",    icon: `${CDN}/socketio_vonskh.png`    },

  // Database & ORM
  { name: "MongoDB",      icon: `${CDN}/mongodb_sf0rxe.png`     },
  { name: "Prisma ORM",   icon: `${CDN}/prisma_b3owp4.svg`      },

  // Dev Tools
  { name: "Git",          icon: `${CDN}/git_jplhr2.png`         },
  { name: "Postman",      icon: `${CDN}/postman_g8ikuc.png`     },
  { name: "AWS",          icon: `${CDN}/aws-2_bj0olj.svg`       },

  // Design & CMS
  { name: "Figma",        icon: `${CDN}/figma_y3pmrr.png`       },
  { name: "WordPress",    icon: `${CDN}/wordpress_l38kfs.png`   },

  // DSA Languages
  { name: "C++",          icon: `${CDN}/cpp_k9uf4z.svg`         },
  { name: "Java",         icon: `${CDN}/java_ieeb3s.svg`        },
];

// ─────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────

const LOGOS = {
  apnaCollege:   "https://avatars.githubusercontent.com/u/66199241?s=200&v=4",
  codeWithHarry: "https://avatars.githubusercontent.com/u/55523838?s=200&v=4",
  jsMastery:     "https://avatars.githubusercontent.com/u/72614512?s=200&v=4",
  antonio:       "https://avatars.githubusercontent.com/u/35677084?s=200&v=4",
};

export const experiences = [
  {
    title: "Web Development Foundations",
    company_name: "Independent Learning",
    icon: LOGOS.apnaCollege,
    iconBg: "#E6DEDD",
    date: "December 2023 – Early 2024",
    points: [
      "Began coding the day I purchased my first laptop, starting with HTML, CSS, and JavaScript fundamentals.",
      "Built small logic-based projects — Rock Paper Scissors, Snake Game, Calculator, and a YouTube UI clone — to understand how the web actually works.",
      "Practiced responsive layouts using Flexbox and CSS Grid while strengthening core JavaScript understanding.",
      "Developed early debugging discipline by solving layout and logic issues independently.",
    ],
  },
  {
    title: "Frontend & Full-Stack Exploration",
    company_name: "Project-Based Learning",
    icon: LOGOS.codeWithHarry,
    iconBg: "#383E56",
    date: "Early – Mid 2024",
    points: [
      "Learned React fundamentals including hooks, component architecture, props, and state management.",
      "Built frontend clones — Spotify UI and Twitter homepage — to reverse-engineer complex layout systems.",
      "Moved into backend development with Node.js, Express, and MongoDB to understand full-stack data flow.",
      "Built learning-stage full-stack applications including a creator-support platform (Give Me a Chai) and API-driven projects tested via Postman and HTTPie.",
    ],
  },
  {
    title: "Backend Focus & DSA Beginnings",
    company_name: "Self-Study Phase",
    icon: LOGOS.apnaCollege,
    iconBg: "#E6DEDD",
    date: "Mid 2024",
    points: [
      "Shifted deeper into backend architecture, API design, and database relationships.",
      "Started structured Data Structures & Algorithms practice in Java, progressing through arrays, linked lists, trees, and binary search.",
      "Developed stronger logical thinking through consistent problem-solving practice.",
      "Paused DSA and active development due to personal challenges — stepped away for an extended period.",
    ],
  },
  {
    title: "Interruption & Reset",
    company_name: "Personal Phase",
    icon: LOGOS.codeWithHarry,
    iconBg: "#1a1a2e",
    date: "Late 2024",
    points: [
      "Experienced a significant pause in consistent development due to personal circumstances.",
      "Several earlier projects became inactive or were abandoned during this period.",
      "Used this time to gain perspective on discipline, long-term consistency, and the cost of scattered focus.",
      "Made a quiet decision to restart with more intentionality — fewer projects, deeper ownership.",
    ],
  },
  {
    title: "Rebuilding Through Advanced Projects",
    company_name: "Focused Re-Entry",
    icon: LOGOS.jsMastery,
    iconBg: "#E6DEDD",
    date: "2025",
    points: [
      "Restarted development with project-driven learning in Three.js and GSAP to rebuild momentum and interest.",
      "Built interactive 3D product showcases, GSAP animation-heavy landing pages, and a backend-driven social platform.",
      "Explored real-time systems by building a Twitch-style live streaming platform (LiveKit) and a Zoom-style conferencing app.",
      "Studied microservices architecture concepts through an Uber-style backend experiment.",
    ],
  },
  {
    title: "Refinement, Prioritisation & AI-Assisted Development",
    company_name: "Independent Development",
    icon: LOGOS.antonio,
    iconBg: "#383E56",
    date: "Late 2025 – Early 2026",
    points: [
      "Stopped maintaining scattered experiments and chose to refine a focused set of projects deeply.",
      "Scaled and restructured OpenStream (Twitch clone) independently — improving architecture, stability, and feature depth.",
      "Converted the Apple 3D showcase into a functioning e-commerce system with cart logic, variant selection, and a demo payment flow.",
      "Used AI tools as accelerators for refactoring and iteration while maintaining full architectural ownership and decision-making.",
      "Integrated AWS CloudFront CDN for asset delivery — first hands-on cloud infrastructure work.",
    ],
  },
  {
    title: "Professional Preparation & Future Direction",
    company_name: "Career Focus",
    icon: LOGOS.apnaCollege,
    iconBg: "#E6DEDD",
    date: "2026 – Present",
    points: [
      "Finalising portfolio, resume, and public presence in preparation for first professional role.",
      "Restarted structured DSA practice in C++ to strengthen core problem-solving foundations.",
      "Designing a large-scale college content library platform with role-based access, resource management, mentorship features, and tiered architecture — the most complete system I will have independently designed.",
      "Actively seeking first internship or full-time opportunity to apply accumulated skills within a collaborative engineering environment.",
    ],
  },
];

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

export const testimonials = [
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
    testimonial: "Akash's creativity and technical skills are top-notch. He transformed our ideas into a stunning website.",
    name: "Omkar Singh",
    designation: "Student",
    company: "Bachelor of Science (Physics)",
    image: "https://randomuser.me/api/portraits/men/61.jpg",
  },
];

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

export const projects = [
  {
    name: "OpenStream — Live Streaming Platform",
    description:
      "A real-time live streaming platform enabling creators to broadcast instantly and engage through concurrent chat. Built using LiveKit for WebRTC-based media transport, Prisma for relational data management, and deployed on Vercel. Focused on clean architecture, state management, and scalable real-time event handling.",
    tags: [
      { name: "Next.js",  color: "blue-text-gradient"   },
      { name: "LiveKit",  color: "green-text-gradient"  },
      { name: "Prisma",   color: "pink-text-gradient"   },
      { name: "WebRTC",   color: "orange-text-gradient" },
    ],
    image: `${CDN}/OpenStreamImage-1_sntrdd.jpg`,
    video: `${VCDN}/OpenStreamVideo_e4e8wl.mp4`,
    screenshots: [
      `${CDN}/OpenStreamImage-1_sntrdd.jpg`,
      `${CDN}/OpenStreamImage-2_ugtlxy.jpg`,
      `${CDN}/OpenStreamImage-3_ufmtsi.jpg`,
      `${CDN}/OpenStreamImage-4_nvdwmn.jpg`,
      `${CDN}/OpenStreamImage-5_azolkd.jpg`,
      `${CDN}/OpenStreamImage-6_gfni4g.jpg`,
      `${CDN}/OpenStreamImage-7_fz4nke.jpg`,
      `${CDN}/OpenStreamImage-8_my706u.jpg`,
      `${CDN}/OpenStreamImage-9_rqvnpg.jpg`,
      `${CDN}/OpenStreamImage-10_ktappf.jpg`,
    ],
    source_code_link: "https://github.com/CodesofAkash/open-stream",
    link: "https://open-stream--codesofakash.vercel.app",
    learning:
      "Building OpenStream strengthened my understanding of real-time architecture — managing WebRTC connections, handling concurrent chat events, and maintaining consistent UI state across multiple participants.",
  },
  {
    name: "Mojito Cocktial— Cocktail Brand Experience",
    description:
      "A motion-first single-page website built to explore advanced GSAP and ScrollTrigger animation workflows. Designed with immersive transitions, timeline-based sequencing, and smooth scroll interactions to create a cinematic browsing experience for a cocktail brand.",
    tags: [
      { name: "React",        color: "blue-text-gradient"  },
      { name: "GSAP",         color: "green-text-gradient" },
      { name: "Tailwind CSS", color: "pink-text-gradient"  },
    ],
    image: `${CDN}/mojito-cocktail-6_kudebd.jpg`,
    video: `${VCDN}/mojito-cocktail-video_mehx0v.mp4`,
    screenshots: [
      `${CDN}/mojito-cocktail-6_kudebd.jpg`,
      `${CDN}/mojito-cocktail-7_pjhpxj.jpg`,
      `${CDN}/mojito-cocktail-8_ozxhuj.jpg`,
      `${CDN}/mojito-cocktail-9_ulv2eu.jpg`,
      `${CDN}/mojito-cocktail-10_ghfqpa.jpg`,
      `${CDN}/mojito-cocktail-11_evqssu.jpg`,
      `${CDN}/mojito-cocktail-12_ej9wdg.jpg`,
      `${CDN}/mojito-cocktail-13_ziy69z.jpg`,
      `${CDN}/mojito-cocktail-1_aojheo.jpg`,
      `${CDN}/mojito-cocktail-2_hl1q2a.jpg`,
      `${CDN}/mojito-cocktail-3_lcivhc.jpg`,
      `${CDN}/mojito-cocktail-4_gnpook.jpg`,
      `${CDN}/mojito-cocktail-5_zenlnq.jpg`,
    ],
    source_code_link: "https://github.com/CodesofAkash/mojito-cocktail",
    link: "https://mojito-cocktail--codesofakash.vercel.app",
    learning:
      "This project helped me master animation sequencing, scroll-based triggers, and performance optimisation for motion-heavy interfaces — understanding how to keep frame rates smooth while running complex GSAP timelines.",
  },
  {
    name: "Apple Phone — 3D E-Commerce Experience",
    description:
      "An interactive product experience combining Three.js-powered 3D iPhone models with a complete e-commerce workflow. Features variant selection, cart state management, and a demo payment flow — built independently using AI as an assistant, without tutorial guidance.",
    tags: [
      { name: "Three.js",   color: "blue-text-gradient"   },
      { name: "React.js",   color: "green-text-gradient"  },
      { name: "GSAP",       color: "pink-text-gradient"   },
      { name: "PostgreSQL", color: "orange-text-gradient" },
    ],
    image: `${CDN}/apple-phone-1_f16sbh.jpg`,
    video: `${VCDN}/apple-phone-video_scpgkz.mp4`,
    screenshots: [
      `${CDN}/apple-phone-1_f16sbh.jpg`,
      `${CDN}/apple-phone-2_yfjmrv.jpg`,
      `${CDN}/apple-phone-3_nydowh.jpg`,
      `${CDN}/apple-phone-4_vvbyu8.jpg`,
      `${CDN}/apple-phone-5_lyjlpi.jpg`,
      `${CDN}/apple-phone-6_um5zij.jpg`,
    ],
    source_code_link: "https://github.com/CodesofAkash/apple-phone",
    link: "https://apple-phone--codesofakash.vercel.app",
    learning:
      "Building this without a tutorial forced me to make real architectural decisions — integrating 3D rendering, cart state, and backend persistence into a single coherent system. This was the first project I designed end to end independently.",
  },
];