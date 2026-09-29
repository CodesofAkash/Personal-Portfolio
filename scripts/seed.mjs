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
// Seeded as-is so the field is populated from day one — swap for a Cloudinary
// URL in Studio once the models are moved there; the frontend already just
// takes whatever URL this field holds.
const MODEL_CDN = "https://d1una6qv9iebr4.cloudfront.net";

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
function linkItem(label, fixedRoute) {
  return { _type: "link", _key: key(), label, linkType: "fixedRoute", fixedRoute, target: "_self" };
}
function navItem(label, fixedRoute, children) {
  return {
    _type: "navigationItem", _key: key(), label, linkType: "fixedRoute", fixedRoute, target: "_self",
    ...(children ? { children } : {}),
  };
}
function socialLink(label, url, variant) {
  return { _type: "socialLink", _key: key(), label, variant, linkType: "external", url, target: "_blank" };
}
function linkList(title, links) {
  return { _type: "linkList", _key: key(), title, links };
}
function contactItem(label, value, variant, linkOpts) {
  return { _type: "contactItem", _key: key(), label, value, variant, ...(linkOpts ?? {}) };
}
function formField(name, label, placeholder, type) {
  return { _type: "formField", _key: key(), name, label, placeholder, type };
}
function sectionHeader({ eyebrow, heading, paragraph, ctas }) {
  return { _type: "sectionHeader", eyebrow, heading, paragraph, ...(ctas ? { ctas } : {}) };
}
// A single default-style segment at the given heading level.
function heading(text, tag) {
  return [{ _type: "headingSegment", _key: key(), text, style: "default", tag }];
}
// Multiple segments sharing one semantic level, e.g.
// heading.multi("h1", ["Hi, I'm "], ["Akash.", "brand"]).
heading.multi = (tag, ...segs) =>
  segs.map(([text, style]) => ({
    _type: "headingSegment",
    _key: key(),
    text,
    style: style ?? "default",
    tag,
  }));

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
    logo: logoWithAlt,
    favicon: logo,
    header: {
      navigationItems: [
        navItem("About", "/about"),
        navItem("Projects", "/projects"),
        navItem("Contact", "/contact"),
      ],
    },
    footer: {
      description:
        "Full-stack developer building production web applications with React, Next.js, TypeScript, CMS and commerce platforms.",
      socials: [
        socialLink("GitHub", "https://github.com/CodesofAkash", "violet"),
        socialLink("LinkedIn", "https://www.linkedin.com/in/codesofakash", "teal"),
        socialLink("X", "https://x.com/CodesOfAkash", "amber"),
        socialLink("Instagram", "https://www.instagram.com/codesofakash/", "rose"),
      ],
      linkLists: [
        linkList("Pages", [
          linkItem("About", "/about"),
          linkItem("Projects", "/projects"),
          linkItem("Contact", "/contact"),
        ]),
        linkList("Legal", [
          linkItem("Privacy Policy", "/privacy"),
          linkItem("Terms of Service", "/terms"),
        ]),
      ],
      copyrightText: `© ${new Date().getFullYear()} Akash Sharma — Built with Next.js, TypeScript & modern web technologies`,
      creditText: "Designed & developed by Akash Sharma",
    },
    email: "akashcodesharma@gmail.com",
    location: "India · Open to Remote",
    seo: {
      title: "Akash Sharma | Full-Stack Developer",
      description:
        "Akash Sharma is a Full-Stack Developer specializing in React, Next.js, TypeScript, Node.js, headless CMS and commerce platforms, building production web applications and interactive experiences.",
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
        eyebrow: "Full-Stack Developer · Open to Opportunities",
        name: "Akash Sharma.",
        heading: heading.multi("h1", ["Hi, I'm "], ["Akash.", "gradient"]),
        subheadLine1: "I build production web applications with React, Next.js, TypeScript, and Node.js.",
        subheadLine2:
          "From e-commerce and CMS-driven platforms to real-time applications and interactive experiences, I enjoy building products that work beyond the demo.",
        ctas: [ctaBtn("See my work →", "/projects", "primary"), ctaBtn("Get in touch", "/contact", "secondary")],
        // TODO once the Chevrolet model is uploaded to S3/CloudFront and optimized:
        // replace with its real URL (or just paste it straight into Sanity Studio —
        // this field is CMS-editable, no redeploy needed either way).
        model: `${MODEL_CDN}/desktop_pc/scene.gltf`,
        stats: [
          { _type: "stat", _key: key(), value: "2+", label: "Years Building", variant: "violet" },
          { _type: "stat", _key: key(), value: "6 Months", label: "Professional Experience", variant: "teal" },
          { _type: "stat", _key: key(), value: "Production", label: "Applications", variant: "amber" },
        ],
      },
      {
        _type: "statsSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "Who I am",
          heading: heading("Akash Sharma.", "h2"),
          paragraph:
            "Full-stack developer with professional experience building and maintaining production web applications across e-commerce, event platforms, CMS-driven websites, and commerce backends. I work across frontend, backend, APIs, CMS architecture, databases, debugging, performance, accessibility, and security.",
          ctas: [ctaBtn("More about me →", "/about", "primary")],
        }),
        stats: [
          { _type: "stat", _key: key(), value: "2+", label: "Years Building", variant: "violet" },
          { _type: "stat", _key: key(), value: "6 Months", label: "Professional Experience", variant: "teal" },
          { _type: "stat", _key: key(), value: "Production", label: "Applications", variant: "amber" },
        ],
      },
      {
        _type: "featuredProjectsSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "What I've built",
          heading: heading("Featured Projects.", "h2"),
          ctas: [ctaBtn("View all →", "/projects", "secondary")],
        }),
        mode: "all",
      },
      {
        _type: "testimonialsSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "Kind words", heading: heading("What people say.", "h2") }),
      },
    ],
    seo: {
      title: "Akash Sharma | Full-Stack Developer",
      description:
        "Full-stack developer building production web applications with React, Next.js, TypeScript, Node.js, CMS and commerce platforms.",
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
        eyebrow: "Full-Stack Developer",
        name: "Akash Sharma",
        tags: [
          { _type: "tag", _key: key(), text: "Production Builder", variant: "violet" },
          { _type: "tag", _key: key(), text: "Curious by Nature", variant: "teal" },
          { _type: "tag", _key: key(), text: "BCA Graduate", variant: "amber" },
          { _type: "tag", _key: key(), text: "Open to Opportunities", variant: "rose" },
        ],
        bio:
          "Full-stack developer who started coding in December 2023 and grew from self-directed learning and personal projects into professional development work. I've worked on production e-commerce, event, CMS, and commerce applications using React, Next.js, TypeScript, Node.js, Sanity, Payload CMS, Medusa, PostgreSQL and more. I value ownership, clear problem solving, understanding root causes, and continuously improving how software is built.",
        ctas: [ctaBtn("See my work →", "/projects", "primary"), ctaBtn("Get in touch →", "/contact", "secondary")],
      },
      {
        _type: "statsSection",
        _key: key(),
        stats: [
          { _type: "stat", _key: key(), value: "2+", label: "Years Building", variant: "violet" },
          { _type: "stat", _key: key(), value: "6 Months", label: "Professional Experience", variant: "teal" },
          { _type: "stat", _key: key(), value: "Production", label: "Applications", variant: "amber" },
        ],
      },
      {
        _type: "experienceSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "How I got here", heading: heading("My Journey.", "h2") }),
        mode: "all",
      },
      {
        _type: "techSection",
        _key: key(),
        sectionHeader: sectionHeader({ eyebrow: "Tools of the trade", heading: heading("Tech Stack.", "h2") }),
        mode: "all",
      },
      {
        _type: "ctaSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "What's next",
          heading: heading.multi("h2", ["Let's build something\n"], ["remarkable.", "brand"]),
          paragraph:
            "I'm currently open to full-time software engineering opportunities where I can continue building real products, take ownership, and grow as a full-stack developer. India-based and open to remote opportunities.",
          ctas: [ctaBtn("Get in touch →", "/contact", "primary"), ctaBtn("See projects →", "/projects", "secondary")],
        }),
      },
    ],
    seo: {
      title: "About Akash Sharma | Full-Stack Developer",
      description:
        "Akash Sharma's journey from self-directed learning and personal projects to professional full-stack development, with experience across React, Next.js, TypeScript, CMS, commerce, and real-time applications.",
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
        sectionHeader: sectionHeader({
          heading: heading.multi("h1", ["What I've\n"], ["Built.", "outline"]),
          paragraph: "A selection of projects I've built across full-stack applications, CMS-driven experiences, e-commerce, real-time systems, and interactive web.",
        }),
      },
      { _type: "projectsGridSection", _key: key(), mode: "all" },
      {
        _type: "ctaSection",
        _key: key(),
        sectionHeader: sectionHeader({
          eyebrow: "Interested in collaborating?",
          heading: heading("Let's build the next one together.", "h2"),
          paragraph: "I'm interested in building useful products, solving difficult problems, and working with people who care about good software.",
          ctas: [ctaBtn("Start a conversation →", "/contact", "primary")],
        }),
      },
    ],
    seo: {
      title: "Projects | Akash Sharma — Full-Stack Developer",
      description:
        "Explore Akash Sharma's projects across full-stack web development, real-time applications, e-commerce, CMS-driven experiences, and interactive web.",
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
        sectionHeader: sectionHeader({
          eyebrow: "Get in touch",
          heading: heading("Let's Talk.", "h1"),
          paragraph:
            "I'm currently open to full-time software engineering opportunities, project conversations, and professional connections. If you're hiring, have a project that needs building, or want to connect, I'd be happy to hear from you.",
        }),
        items: [
          contactItem("Email", "akashcodesharma@gmail.com", "violet", {
            linkType: "email", email: "akashcodesharma@gmail.com", target: "_self",
          }),
          contactItem("GitHub", "github.com/CodesofAkash", "teal", {
            linkType: "external", url: "https://github.com/CodesofAkash", target: "_blank",
          }),
          contactItem("Location", "India · Open to Remote", "amber"),
        ],
        model: `${MODEL_CDN}/planet/scene.gltf`,
      },
      {
        _type: "contactFormSection",
        _key: key(),
        fields: [
          formField("name", "Your Name", "What's your name?", "text"),
          formField("email", "Your Email", "What's your email?", "email"),
          formField("message", "Your Message", "What do you want to say?", "textarea"),
        ],
        submitButtonText: "Send",
      },
    ],
    seo: {
      title: "Contact Akash Sharma | Get in Touch",
      description:
        "Get in touch with Akash Sharma about full-time opportunities, projects, collaboration, or professional connections.",
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
        "A full-stack live streaming platform for real-time video and audience interaction. Creators can stream from the browser using LiveKit through a custom studio supporting camera, microphone, screen sharing, multiple sources, and audio controls. It also includes real-time chat, creator/community interactions, authentication, and persistent application data.",
      tags: [
        { name: "Next.js", color: "blue-text-gradient" },
        { name: "LiveKit", color: "green-text-gradient" },
        { name: "React", color: "blue-text-gradient" },
        { name: "Prisma", color: "pink-text-gradient" },
        { name: "PostgreSQL", color: "orange-text-gradient" },
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
        "Real-time architecture, WebRTC media flows, LiveKit, complex client state, authentication, database design, and building reliable real-time UX.",
      order: 0,
    },
    {
      key: "velvet-pour",
      name: "Velvet Pour — CMS-Driven Web Experience",
      description:
        "A cinematic CMS-driven web experience built with Next.js, Sanity and GSAP. Content and page structure are managed through Sanity, while motion design, scroll storytelling and interactive visuals create an immersive frontend. The project also became an exercise in internationalized content, performance optimisation, and building a polished production-style marketing site.",
      tags: [
        { name: "Next.js", color: "blue-text-gradient" },
        { name: "Sanity", color: "pink-text-gradient" },
        { name: "GSAP", color: "green-text-gradient" },
        { name: "TypeScript", color: "orange-text-gradient" },
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
        "Sanity CMS, schema-driven content, editor-managed websites, internationalized content, GSAP sequencing and scroll interactions, and performance optimisation for motion-heavy interfaces.",
      order: 1,
    },
    {
      key: "apple-phone",
      name: "Apple Phone — 3D E-Commerce Experience",
      description:
        "An interactive 3D e-commerce experience combining React, Three.js/React Three Fiber and GSAP with product variants, cart state, authentication, order handling, and Stripe Payment Intents checkout. Developed independently with AI as an implementation assistant while retaining architectural ownership and decision-making.",
      tags: [
        { name: "React", color: "blue-text-gradient" },
        { name: "Three.js", color: "green-text-gradient" },
        { name: "React Three Fiber", color: "green-text-gradient" },
        { name: "GSAP", color: "pink-text-gradient" },
        { name: "Node.js", color: "orange-text-gradient" },
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
      // No public demo right now — backend infrastructure is offline. Left
      // unset rather than a URL to nowhere; the frontend already hides the
      // "Live Demo" button when link is empty.
      link: undefined,
      learning:
        "Architectural decision-making across frontend, 3D rendering, application state, authentication, backend persistence, and payment flows.",
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
    { title: "Web Development Foundations", companyName: "Independent Learning", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "December 2023 – Early 2024", points: ["Started coding in December 2023 with HTML, CSS, and JavaScript fundamentals.", "Built small projects including Rock Paper Scissors, Snake Game, Calculator, and a YouTube UI clone.", "Practiced responsive layouts with Flexbox and CSS Grid.", "Developed early debugging and problem-solving habits."] },
    { title: "Frontend & Full-Stack Exploration", companyName: "Project-Based Learning", icon: LOGOS.codeWithHarry, iconBg: "#383E56", date: "Early – Mid 2024", points: ["Learned React fundamentals including hooks, component architecture, props, and state.", "Built Spotify and Twitter UI clones to understand complex layouts and components.", "Moved into Node.js, Express, and MongoDB to understand full-stack data flow.", "Built learning-stage full-stack and API-driven applications using tools such as Postman."] },
    { title: "Backend Focus & DSA Beginnings", companyName: "Self-Study", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "Mid 2024", points: ["Went deeper into backend architecture, API design, and database relationships.", "Started structured DSA practice in Java, progressing through arrays, linked lists, trees, and binary search.", "Strengthened logical thinking through problem solving.", "Later paused structured DSA and active development before restarting with a more focused approach."] },
    { title: "Rebuilding Through Advanced Projects", companyName: "Focused Development", icon: LOGOS.jsMastery, iconBg: "#E6DEDD", date: "2025", points: ["Restarted development through project-driven learning in Three.js and GSAP.", "Built interactive 3D product experiences, animation-heavy interfaces, and full-stack applications.", "Explored real-time systems through a Twitch-style streaming platform using LiveKit.", "Moved from tutorial-based learning toward independent implementation."] },
    { title: "Refinement & Independent Product Development", companyName: "Late 2025 – Early 2026", icon: LOGOS.antonio, iconBg: "#383E56", date: "Late 2025 – Early 2026", points: ["Focused on fewer projects with deeper ownership.", "Expanded OpenStream into a more complete live streaming platform.", "Developed the Apple 3D experience into a broader e-commerce system with variants, cart, authentication, orders, and payment integration.", "Used AI tools as development accelerators while retaining ownership of architecture and decisions."] },
    { title: "Production-Oriented Development", companyName: "Early 2026", icon: LOGOS.jsMastery, iconBg: "#1a1a2e", date: "Early 2026", points: ["Built and refined CMS-driven and commerce-oriented projects using Sanity, Payload CMS, Medusa, Next.js, PostgreSQL, and related tools.", "Strengthened understanding of content modelling, commerce flows, API integration, performance, accessibility, and production-oriented application structure.", "Shifted from simply making projects work toward making them maintainable, reliable, and presentable as real products."] },
    { title: "Full-Stack Developer Intern", companyName: "WeframeTech", iconBg: "#7c3aed", date: "2026", points: ["Worked on production web applications across e-commerce, event registration and ticketing, CMS-driven content platforms, and commerce backends.", "Built and maintained frontend functionality using Next.js, React, TypeScript, and Tailwind CSS, including product discovery, cart, checkout, order tracking, customer accounts, reviews, and saved items.", "Worked extensively with Sanity and Payload CMS, including schemas, page-builder systems, dynamic content, custom endpoints, lifecycle hooks, and editor-managed websites.", "Contributed to a Medusa v2 commerce backend with reviews, saved items, advertising, revenue reporting, and server-side abuse protections.", "Worked on event registration and ticketing features including PDF tickets, QR-code tickets, and browser-based camera scanning.", "Investigated and fixed production issues involving caching, Server Actions, authentication, pagination, accessibility, performance, and application security.", "Worked with Git/GitHub and collaborative pull-request workflows across multiple production repositories."] },
    { title: "Current Direction", companyName: "Career & Independent Development", icon: LOGOS.apnaCollege, iconBg: "#E6DEDD", date: "September 2026 – Present", points: ["Completing a six-month professional internship and transitioning into the next full-time software engineering opportunity.", "Continuing structured DSA practice in C++ alongside development.", "Continuing OpenStream, Apple 3D E-Commerce, and portfolio work while keeping the project set focused.", "Updating public work across GitHub, LinkedIn, X, Instagram, and the portfolio.", "Looking for full-time opportunities where I can continue growing as a full-stack developer and take ownership of real products."] },
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
  // Reduced to technologies with a real icon asset — ChatGPT/Akash's call:
  // prefer a shorter, visually consistent marquee over 30+ pills where most
  // fall back to a first-letter placeholder. Add an entry back once it has
  // a real icon, rather than inventing one.
  const technologies = [
    { name: "JavaScript", icon: `${CDN}/js_svckyk.svg` },
    { name: "TypeScript", icon: `${CDN}/typescript_dqkj0j.png` },
    { name: "React.js", icon: `${CDN}/reactjs_mykfpg.png` },
    { name: "Next.js", icon: `${CDN}/nextjs_f6qd7x.png` },
    { name: "Tailwind CSS", icon: `${CDN}/tailwind_gkafu4.png` },
    { name: "Node.js", icon: `${CDN}/nodejs_ur2zox.png` },
    { name: "Express.js", icon: `${CDN}/express_ml2xwr.svg` },
    { name: "Prisma", icon: `${CDN}/prisma_b3owp4.svg` },
    { name: "MongoDB", icon: `${CDN}/mongodb_sf0rxe.png` },
    { name: "Three.js", icon: `${CDN}/threejs_dlcegx.svg` },
    { name: "GSAP", icon: `${CDN}/gsap_boaydq.png` },
    { name: "Git", icon: `${CDN}/git_jplhr2.png` },
    { name: "Postman", icon: `${CDN}/postman_g8ikuc.png` },
    { name: "Figma", icon: `${CDN}/figma_y3pmrr.png` },
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
  // createOrReplace never deletes — clean up any technology-N left over from
  // a previous, longer seed run (the list has shrunk more than once).
  const staleTechIds = Array.from({ length: 40 }, (_, i) => `technology-${i}`)
    .slice(technologies.length);
  if (staleTechIds.length > 0) {
    const tx = client.transaction();
    for (const id of staleTechIds) tx.delete(id);
    await tx.commit({ visibility: "async" });
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
