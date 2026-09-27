// One-off script: migrates the site's real, already-published content
// (previously hardcoded in src/constants and each page component) into
// Sanity documents. Idempotent — every document has a fixed _id, so
// re-running replaces rather than duplicates. Never invents content; every
// value here already existed verbatim on the live site.
//
// Usage: node --env-file=.env.local scripts/seed.mjs

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-09-27",
  token,
  useCdn: false,
});

const CDN = "https://res.cloudinary.com/ddawd3kp5/image/upload";
const VCDN = "https://res.cloudinary.com/ddawd3kp5/video/upload";

async function uploadImage(path, filename) {
  const buffer = readFileSync(path);
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function uploadImageFromUrl(url, filename) {
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  skip ${filename}: fetch failed (${res.status})`);
    return undefined;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

let keyCounter = 0;
const key = () => `k${keyCounter++}`;

// Every internal destination on this site is a fixed route — no page-builder
// "pages" collection to reference (AK-SAN-062).
function ctaBtn(text, fixedRoute, variant) {
  return { _type: "ctaBtn", _key: key(), text, linkType: "fixedRoute", fixedRoute, target: "_self", variant };
}
function navLink(label, fixedRoute) {
  return { _type: "link", _key: key(), label, linkType: "fixedRoute", fixedRoute, target: "_self" };
}
function sectionHeader({ eyebrow, heading, paragraph, cta }) {
  return { _type: "sectionHeader", eyebrow, heading, paragraph, ...(cta ? { cta } : {}) };
}
// A single default-style segment, for the common case of a one-line heading.
function heading(text) {
  return [{ _type: "headingSegment", _key: key(), text }];
}
// Explicit segments, e.g. heading.seg("Let's build something\n"),
// heading.seg("remarkable.", "brand") for a two-line, two-tone heading.
heading.seg = (text, style, tag) => ({
  _type: "headingSegment",
  _key: key(),
  text,
  ...(style ? { style } : {}),
  ...(tag ? { tag } : {}),
});

async function main() {
  console.log("Uploading brand assets...");
  const logo = await uploadImage("public/assets/logo.svg", "logo.svg");
  const logoWithAlt = { ...logo, alt: "Akash Sharma logo" };
  let ogImage;
  try {
    ogImage = await uploadImageFromUrl(
      "https://res.cloudinary.com/ddawd3kp5/image/upload/v1/og-image",
      "og-image.jpg",
    );
  } catch (e) {
    console.warn("  skip og-image:", e.message);
  }

  console.log("Seeding settings...");
  await client.createOrReplace({
    _id: "settings",
    _type: "settings",
    name: "Akash Sharma",
    tagline: "Full-stack developer building real-time systems, 3D experiences, and production-ready web apps.",
    logo: logoWithAlt,
    favicon: logo,
    navLinks: [
      navLink("About", "/about"),
      navLink("Projects", "/projects"),
      navLink("Contact", "/contact"),
    ],
    socials: [
      { _type: "social", _key: "github", label: "GitHub", url: "https://github.com/CodesofAkash" },
      { _type: "social", _key: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/codesofakash" },
    ],
    email: "akashcodesharma@gmail.com",
    location: "India · Open to Remote",
    seo: {
      title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
      description:
        "Akash Sharma - Full-stack developer specializing in React, Three.js, Node.js, and real-time systems. Portfolio showcasing production-ready projects.",
      ...(ogImage ? { ogImage } : {}),
    },
    cookieConsent: { enabled: false },
    maintenance: { enabled: false },
    notFound: {
      heading: "Page not found.",
      message: "The page you're looking for doesn't exist or has been moved.",
      linkLabel: "Back to home",
    },
  });

  console.log("Seeding homePage...");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    sections: [
      {
        _type: "heroSection",
        _key: key(),
        eyebrow: "Full-Stack Developer · Available for hire",
        heading: [heading.seg("Hi, I'm "), heading.seg("Akash.", "brand")],
        subheadLine1: "Full-stack developer. Self-taught. Fast learner.",
        subheadLine2:
          "Two years of self-teaching, multiple projects in production, and AI as a daily tool — not to replace my thinking, but to sharpen it and ship faster.",
        primaryCta: ctaBtn("See my work →", "/projects", "primary"),
        secondaryCta: ctaBtn("Get in touch", "/contact", "secondary"),
      },
      {
        _type: "statsSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "Who I am",
          heading: heading("Akash Sharma."),
          paragraph:
            "Full-stack developer who went from zero to shipping production apps in under two years — entirely self-taught. I specialise in real-time systems, 3D web experiences, and end-to-end application development. Every project has a live URL.",
          cta: ctaBtn("More about me →", "/about", "primary"),
        }),
        stats: [
          { _type: "stat", _key: key(), value: "1.5+", label: "Years building" },
          { _type: "stat", _key: key(), value: "10+", label: "Projects shipped" },
          { _type: "stat", _key: key(), value: "7+", label: "Technologies" },
        ],
      },
      {
        _type: "featuredProjectsSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "What I've built",
          heading: heading("Featured Projects."),
          cta: ctaBtn("View all →", "/projects", "secondary"),
        }),
      },
      {
        _type: "testimonialsSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "Kind words", heading: heading("What people say.") }),
      },
    ],
    seo: {
      title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
      description:
        "Full-stack developer specializing in React, Three.js, Node.js. 10+ projects shipped. Self-taught developer building real-time systems and 3D web experiences.",
    },
  });

  console.log("Seeding aboutPage...");
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    sections: [
      {
        _type: "aboutHeroSection",
        _key: key(),
        name: "Akash Sharma",
        tags: ["Builder by Practice", "Curious by Nature", "BCA Student", "Open to Opportunities"],
        bio:
          "Self-taught developer driven by curiosity and consistency. What started as learning HTML two years ago evolved into building complete, production-ready applications independently. I value clarity, ownership, and continuous improvement — and I'm now seeking my first professional opportunity to contribute, learn, and grow within a strong engineering team.",
        primaryCta: ctaBtn("See my work →", "/projects", "primary"),
        secondaryCta: ctaBtn("Get in touch", "/contact", "secondary"),
      },
      {
        _type: "statsSection",
        _key: key(),
        stats: [
          { _type: "stat", _key: key(), value: "2+", label: "Years of Development" },
          { _type: "stat", _key: key(), value: "10+", label: "Projects Shipped" },
          { _type: "stat", _key: key(), value: "10+", label: "Technologies Applied" },
          { _type: "stat", _key: key(), value: "∞", label: "Curiosity & Growth" },
        ],
      },
      {
        _type: "experienceSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "How I got here", heading: heading("My Journey.") }),
      },
      {
        _type: "techSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "Tools of the trade", heading: heading("Tech Stack.") }),
      },
      {
        _type: "ctaSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "What's next",
          heading: [heading.seg("Let's build something\n"), heading.seg("remarkable.", "brand")],
          paragraph:
            "Available immediately for full-time roles, internships, and remote positions. India-based — open to relocation or fully remote worldwide.",
          cta: ctaBtn("Get in touch", "/contact", "primary"),
        }),
        secondaryCta: ctaBtn("See projects", "/projects", "secondary"),
      },
    ],
    seo: {
      title: "About Akash Sharma | Full-Stack Developer",
      description:
        "Learn about my journey from self-taught developer to shipping production-ready apps. Experience with React, Node.js, Three.js, and modern web technologies.",
    },
  });

  console.log("Seeding projectsPage...");
  await client.createOrReplace({
    _id: "projectsPage",
    _type: "projectsPage",
    sections: [
      {
        _type: "projectsHeroSection",
        _key: key(),
        heading: [heading.seg("What I've\n"), heading.seg("Built.", "outline")],
        subheading: "Click any project to expand it. Every project ships to production.",
      },
      {
        _type: "ctaSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "Interested in collaborating?",
          heading: heading("Let's build the next one together."),
          paragraph: "Always looking for interesting problems to solve and great people to work with.",
          cta: ctaBtn("Start a conversation →", "/contact", "primary"),
        }),
      },
    ],
    seo: {
      title: "Projects | Akash Sharma - Full-Stack Developer",
      description:
        "Explore my portfolio of production-ready projects including real-time systems, 3D web experiences, and full-stack applications.",
    },
  });

  console.log("Seeding contactPage...");
  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    sections: [
      {
        _type: "contactHeroSection",
        _key: key(),
        eyebrow: "Get in touch",
        heading: heading("Let's Talk."),
        subheading:
          "I'm currently seeking my first professional role in web development — frontend, backend, or full-stack. If you're hiring, have a project that needs building, or just want to connect, I'd welcome the conversation.",
      },
    ],
    seo: {
      title: "Contact Akash Sharma | Get in Touch",
      description:
        "Interested in collaborating? Get in touch with me via email or social media. Available for freelance work and full-time opportunities.",
    },
  });

  console.log("Seeding legal pages...");
  await client.createOrReplace({
    _id: "legalPage-privacy",
    _type: "legalPage",
    slug: "privacy",
    heading: "Privacy Policy.",
    lastUpdated: "March 2026",
    sections: [
      { _type: "legalSection", _key: "s1", title: "Overview", body: `This portfolio website ("Site") is operated by Akash Sharma ("I", "me", "my"). This Privacy Policy explains what information is collected when you visit the Site and how it is used. I am committed to protecting your privacy and handling any information you share with me responsibly.` },
      { _type: "legalSection", _key: "s2", title: "Information I Collect", body: `I collect only the minimum information necessary to operate the Site. This includes contact form submissions — your name, email address, and message content — and basic anonymous analytics such as page views and browser type if analytics are enabled. I do not collect payment information, create user accounts, or track you across other websites.` },
      { _type: "legalSection", _key: "s3", title: "How I Use Your Information", body: `Your information is used solely to respond to your messages and enquiries submitted via the contact form, and to understand how visitors interact with the Site so I can improve it. I will never sell, rent, or share your personal data with third parties for marketing purposes.` },
      { _type: "legalSection", _key: "s4", title: "Third-Party Services", body: `The Site uses EmailJS to process contact form submissions (see emailjs.com/legal/privacy-policy), Cloudinary to serve optimised images via CDN (see cloudinary.com/privacy), and AWS CloudFront to serve 3D model assets (see aws.amazon.com/privacy). Each of these services has their own privacy policies governing how they handle data.` },
      { _type: "legalSection", _key: "s5", title: "Cookies", body: `This Site does not use tracking cookies or advertising cookies. Session-level browser storage may be used for technical functionality only and is not used to identify you personally.` },
      { _type: "legalSection", _key: "s6", title: "Data Retention", body: `Contact form messages are retained only as long as necessary to respond to your enquiry. You may request deletion of your data at any time by contacting me directly via the Contact page.` },
      { _type: "legalSection", _key: "s7", title: "Your Rights", body: `You have the right to request access to, correction of, or deletion of any personal information I hold about you. To exercise these rights, contact me at the email address provided on the Contact page.` },
      { _type: "legalSection", _key: "s8", title: "Changes to This Policy", body: `I may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of the Site after changes constitutes acceptance of the updated policy.` },
    ],
    seo: { title: "Privacy Policy | Akash Sharma", description: "Privacy policy for this site." },
  });

  await client.createOrReplace({
    _id: "legalPage-terms",
    _type: "legalPage",
    slug: "terms",
    heading: "Terms of Service.",
    lastUpdated: "March 2026",
    sections: [
      { _type: "legalSection", _key: "s1", title: "Acceptance of Terms", body: `By accessing and using this portfolio website ("Site"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.` },
      { _type: "legalSection", _key: "s2", title: "Use of the Site", body: `You agree to use this Site only for lawful purposes. You must not use the Site in any way that violates applicable laws, attempt to gain unauthorised access to any part of the Site or its infrastructure, transmit unsolicited advertising material, or scrape and systematically extract data without permission.` },
      { _type: "legalSection", _key: "s3", title: "Intellectual Property", body: `All content on this Site — including text, code, design, graphics, and 3D assets — is the intellectual property of Akash Sharma unless otherwise stated. You may not reproduce, distribute, or create derivative works from any content on this Site without explicit written permission. Project source code linked from this Site may be subject to open-source licences as specified in their respective repositories.` },
      { _type: "legalSection", _key: "s4", title: "Disclaimer of Warranties", body: `This Site is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. I do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.` },
      { _type: "legalSection", _key: "s5", title: "Limitation of Liability", body: `To the fullest extent permitted by law, Akash Sharma shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Site.` },
      { _type: "legalSection", _key: "s6", title: "External Links", body: `This Site may contain links to third-party websites including GitHub repositories and live project demos. These links are provided for your convenience only. I have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.` },
      { _type: "legalSection", _key: "s7", title: "Changes to Terms", body: `I reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Your continued use of the Site following any changes constitutes acceptance of the new terms.` },
      { _type: "legalSection", _key: "s8", title: "Governing Law", body: `These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of India.` },
    ],
    seo: { title: "Terms of Service | Akash Sharma", description: "Terms of service for this site." },
  });

  console.log("Seeding projects...");
  const projects = [
    {
      key: "open-stream",
      name: "OpenStream — Live Streaming Platform",
      description:
        "A real-time live streaming platform enabling creators to broadcast instantly and engage through concurrent chat. Built using LiveKit for WebRTC-based media transport, Prisma for relational data management, and deployed on Vercel. Focused on clean architecture, state management, and scalable real-time event handling.",
      tags: [
        { name: "Next.js", color: "blue-text-gradient" },
        { name: "LiveKit", color: "green-text-gradient" },
        { name: "Prisma", color: "pink-text-gradient" },
        { name: "WebRTC", color: "orange-text-gradient" },
      ],
      image: `${CDN}/OpenStreamImage-1_sntrdd.jpg`,
      video: `${VCDN}/OpenStreamVideo_e4e8wl.mp4`,
      screenshots: [
        `${CDN}/OpenStreamImage-1_sntrdd.jpg`, `${CDN}/OpenStreamImage-2_ugtlxy.jpg`,
        `${CDN}/OpenStreamImage-3_ufmtsi.jpg`, `${CDN}/OpenStreamImage-4_nvdwmn.jpg`,
        `${CDN}/OpenStreamImage-5_azolkd.jpg`, `${CDN}/OpenStreamImage-6_gfni4g.jpg`,
        `${CDN}/OpenStreamImage-7_fz4nke.jpg`, `${CDN}/OpenStreamImage-8_my706u.jpg`,
        `${CDN}/OpenStreamImage-9_rqvnpg.jpg`, `${CDN}/OpenStreamImage-10_ktappf.jpg`,
      ],
      sourceCodeLink: "https://github.com/CodesofAkash/open-stream",
      link: "https://open-stream.codesofakash.in",
      learning:
        "Building OpenStream strengthened my understanding of real-time architecture — managing WebRTC connections, handling concurrent chat events, and maintaining consistent UI state across multiple participants.",
      order: 0,
    },
    {
      key: "velvet-pour",
      name: "Velvet Pour — Cocktail Brand Experience",
      description:
        "A motion-first single-page website built to explore advanced GSAP and ScrollTrigger animation workflows. Designed with immersive transitions, timeline-based sequencing, and smooth scroll interactions to create a cinematic browsing experience for a cocktail brand.",
      tags: [
        { name: "Next.js", color: "blue-text-gradient" },
        { name: "GSAP", color: "green-text-gradient" },
        { name: "Sanity", color: "pink-text-gradient" },
      ],
      image: `${CDN}/mojito-cocktail-6_kudebd.jpg`,
      video: `${VCDN}/mojito-cocktail-video_mehx0v.mp4`,
      screenshots: [
        `${CDN}/mojito-cocktail-6_kudebd.jpg`, `${CDN}/mojito-cocktail-7_pjhpxj.jpg`,
        `${CDN}/mojito-cocktail-8_ozxhuj.jpg`, `${CDN}/mojito-cocktail-9_ulv2eu.jpg`,
        `${CDN}/mojito-cocktail-10_ghfqpa.jpg`, `${CDN}/mojito-cocktail-11_evqssu.jpg`,
        `${CDN}/mojito-cocktail-12_ej9wdg.jpg`, `${CDN}/mojito-cocktail-13_ziy69z.jpg`,
        `${CDN}/mojito-cocktail-1_aojheo.jpg`, `${CDN}/mojito-cocktail-2_hl1q2a.jpg`,
        `${CDN}/mojito-cocktail-3_lcivhc.jpg`, `${CDN}/mojito-cocktail-4_gnpook.jpg`,
        `${CDN}/mojito-cocktail-5_zenlnq.jpg`,
      ],
      sourceCodeLink: "https://github.com/CodesofAkash/mojito-cocktail",
      link: "https://mojito-cocktail.vercel.app",
      learning:
        "This project helped me master animation sequencing, scroll-based triggers, and performance optimisation for motion-heavy interfaces — understanding how to keep frame rates smooth while running complex GSAP timelines.",
      order: 1,
    },
    {
      key: "apple-phone",
      name: "Apple Phone — 3D E-Commerce Experience",
      description:
        "An interactive product experience combining Three.js-powered 3D iPhone models with a complete e-commerce workflow. Features variant selection, cart state management, and a demo payment flow — built independently using AI as an assistant, without tutorial guidance.",
      tags: [
        { name: "Three.js", color: "blue-text-gradient" },
        { name: "React.js", color: "green-text-gradient" },
        { name: "GSAP", color: "pink-text-gradient" },
        { name: "PostgreSQL", color: "orange-text-gradient" },
      ],
      image: `${CDN}/apple-phone-1_f16sbh.jpg`,
      video: `${VCDN}/apple-phone-video_scpgkz.mp4`,
      screenshots: [
        `${CDN}/apple-phone-1_f16sbh.jpg`, `${CDN}/apple-phone-2_yfjmrv.jpg`,
        `${CDN}/apple-phone-3_nydowh.jpg`, `${CDN}/apple-phone-4_vvbyu8.jpg`,
        `${CDN}/apple-phone-5_lyjlpi.jpg`, `${CDN}/apple-phone-6_um5zij.jpg`,
      ],
      sourceCodeLink: "https://github.com/CodesofAkash/apple-phone",
      link: "https://apple-phone--codesofakash.vercel.app",
      learning:
        "Building this without a tutorial forced me to make real architectural decisions — integrating 3D rendering, cart state, and backend persistence into a single coherent system. This was the first project I designed end to end independently.",
      order: 2,
    },
  ];
  for (const p of projects) {
    await client.createOrReplace({
      _id: `project-${p.key}`,
      _type: "project",
      name: p.name,
      description: p.description,
      tags: p.tags.map((t, i) => ({ _type: "tag", _key: `t${i}`, ...t })),
      image: p.image,
      video: p.video,
      screenshots: p.screenshots,
      sourceCodeLink: p.sourceCodeLink,
      link: p.link,
      learning: p.learning,
      order: p.order,
    });
  }

  console.log("Seeding experiences...");
  const LOGOS = {
    apnaCollege: "https://avatars.githubusercontent.com/u/66199241?s=200&v=4",
    codeWithHarry: "https://avatars.githubusercontent.com/u/55523838?s=200&v=4",
    jsMastery: "https://avatars.githubusercontent.com/u/72614512?s=200&v=4",
    antonio: "https://avatars.githubusercontent.com/u/35677084?s=200&v=4",
  };
  const experiences = [
    { title: "Web Development Foundations", companyName: "Independent Learning", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "December 2023 – Early 2024", points: ["Began coding the day I purchased my first laptop, starting with HTML, CSS, and JavaScript fundamentals.", "Built small logic-based projects — Rock Paper Scissors, Snake Game, Calculator, and a YouTube UI clone — to understand how the web actually works.", "Practiced responsive layouts using Flexbox and CSS Grid while strengthening core JavaScript understanding.", "Developed early debugging discipline by solving layout and logic issues independently."] },
    { title: "Frontend & Full-Stack Exploration", companyName: "Project-Based Learning", icon: LOGOS.codeWithHarry, iconBg: "#383E56", date: "Early – Mid 2024", points: ["Learned React fundamentals including hooks, component architecture, props, and state management.", "Built frontend clones — Spotify UI and Twitter homepage — to reverse-engineer complex layout systems.", "Moved into backend development with Node.js, Express, and MongoDB to understand full-stack data flow.", "Built learning-stage full-stack applications including a creator-support platform (Give Me a Chai) and API-driven projects tested via Postman and HTTPie."] },
    { title: "Backend Focus & DSA Beginnings", companyName: "Self-Study Phase", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "Mid 2024", points: ["Shifted deeper into backend architecture, API design, and database relationships.", "Started structured Data Structures & Algorithms practice in Java, progressing through arrays, linked lists, trees, and binary search.", "Developed stronger logical thinking through consistent problem-solving practice.", "Paused DSA and active development due to personal challenges — stepped away for an extended period."] },
    { title: "Interruption & Reset", companyName: "Personal Phase", icon: LOGOS.codeWithHarry, iconBg: "#1a1a2e", date: "Late 2024", points: ["Experienced a significant pause in consistent development due to personal circumstances.", "Several earlier projects became inactive or were abandoned during this period.", "Used this time to gain perspective on discipline, long-term consistency, and the cost of scattered focus.", "Made a quiet decision to restart with more intentionality — fewer projects, deeper ownership."] },
    { title: "Rebuilding Through Advanced Projects", companyName: "Focused Re-Entry", icon: LOGOS.jsMastery, iconBg: "#E6DEDD", date: "2025", points: ["Restarted development with project-driven learning in Three.js and GSAP to rebuild momentum and interest.", "Built interactive 3D product showcases, GSAP animation-heavy landing pages, and a backend-driven social platform.", "Explored real-time systems by building a Twitch-style live streaming platform (LiveKit) and a Zoom-style conferencing app.", "Studied microservices architecture concepts through an Uber-style backend experiment."] },
    { title: "Refinement, Prioritisation & AI-Assisted Development", companyName: "Independent Development", icon: LOGOS.antonio, iconBg: "#383E56", date: "Late 2025 – Early 2026", points: ["Stopped maintaining scattered experiments and chose to refine a focused set of projects deeply.", "Scaled and restructured OpenStream (Twitch clone) independently — improving architecture, stability, and feature depth.", "Converted the Apple 3D showcase into a functioning e-commerce system with cart logic, variant selection, and a demo payment flow.", "Used AI tools as accelerators for refactoring and iteration while maintaining full architectural ownership and decision-making.", "Integrated AWS CloudFront CDN for asset delivery — first hands-on cloud infrastructure work."] },
    { title: "Professional Preparation & Future Direction", companyName: "Career Focus", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "2026 – Present", points: ["Finalising portfolio, resume, and public presence in preparation for first professional role.", "Restarted structured DSA practice in C++ to strengthen core problem-solving foundations.", "Designing a large-scale college content library platform with role-based access, resource management, mentorship features, and tiered architecture — the most complete system I will have independently designed.", "Actively seeking first internship or full-time opportunity to apply accumulated skills within a collaborative engineering environment."] },
  ];
  for (let i = 0; i < experiences.length; i++) {
    const e = experiences[i];
    await client.createOrReplace({
      _id: `experience-${i}`,
      _type: "experience",
      title: e.title,
      companyName: e.companyName,
      icon: e.icon,
      iconBg: e.iconBg,
      date: e.date,
      points: e.points,
      order: i,
    });
  }

  console.log("Seeding technologies...");
  const technologies = [
    { name: "JavaScript", icon: `${CDN}/js_svckyk.svg` },
    { name: "TypeScript", icon: `${CDN}/typescript_dqkj0j.png` },
    { name: "React.js", icon: `${CDN}/reactjs_mykfpg.png` },
    { name: "Next.js", icon: `${CDN}/nextjs_f6qd7x.png` },
    { name: "Tailwind CSS", icon: `${CDN}/tailwind_gkafu4.png` },
    { name: "Three.js", icon: `${CDN}/threejs_dlcegx.svg` },
    { name: "GSAP", icon: `${CDN}/gsap_boaydq.png` },
    { name: "Node.js", icon: `${CDN}/nodejs_ur2zox.png` },
    { name: "Express.js", icon: `${CDN}/express_ml2xwr.svg` },
    { name: "Socket.IO", icon: `${CDN}/socketio_vonskh.png` },
    { name: "MongoDB", icon: `${CDN}/mongodb_sf0rxe.png` },
    { name: "Prisma ORM", icon: `${CDN}/prisma_b3owp4.svg` },
    { name: "Git", icon: `${CDN}/git_jplhr2.png` },
    { name: "Postman", icon: `${CDN}/postman_g8ikuc.png` },
    { name: "AWS", icon: `${CDN}/aws-2_bj0olj.svg` },
    { name: "Figma", icon: `${CDN}/figma_y3pmrr.png` },
    { name: "WordPress", icon: `${CDN}/wordpress_l38kfs.png` },
    { name: "C++", icon: `${CDN}/cpp_k9uf4z.svg` },
    { name: "Java", icon: `${CDN}/java_ieeb3s.svg` },
  ];
  for (let i = 0; i < technologies.length; i++) {
    const t = technologies[i];
    await client.createOrReplace({
      _id: `technology-${i}`,
      _type: "technology",
      name: t.name,
      icon: t.icon,
      order: i,
    });
  }

  console.log("Seeding testimonials...");
  const testimonials = [
    { testimonial: "Akash is an exceptional web developer. His attention to detail and ability to solve complex problems is impressive.", name: "Sahil", designation: "Student", company: "Bachelor of Computer Applications (BCA)", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { testimonial: "Working with Akash was a pleasure. He delivered high-quality work on time and was always open to feedback.", name: "Mehul", designation: "Student", company: "Bachelor of Computer Applications (BCA)", image: "https://randomuser.me/api/portraits/men/44.jpg" },
    { testimonial: "Akash's creativity and technical skills are top-notch. He transformed our ideas into a stunning website.", name: "Omkar Singh", designation: "Student", company: "Bachelor of Science (Physics)", image: "https://randomuser.me/api/portraits/men/61.jpg" },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await client.createOrReplace({
      _id: `testimonial-${i}`,
      _type: "testimonial",
      testimonial: t.testimonial,
      name: t.name,
      designation: t.designation,
      company: t.company,
      image: t.image,
      order: i,
    });
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
