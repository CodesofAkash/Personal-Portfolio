export const seoConfig = {
  home: {
    title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
    description: "Full-stack developer specializing in React, Three.js, Node.js. 10+ projects shipped. Self-taught developer building real-time systems and 3D web experiences.",
    url: "https://akashsharma.dev",
  },
  about: {
    title: "About Akash Sharma | Full-Stack Developer",
    description: "Learn about my journey from self-taught developer to shipping production-ready apps. Experience with React, Node.js, Three.js, and modern web technologies.",
    url: "https://akashsharma.dev/about",
  },
  projects: {
    title: "Projects | Akash Sharma - Full-Stack Developer",
    description: "Explore my portfolio of production-ready projects including real-time systems, 3D web experiences, and full-stack applications.",
    url: "https://akashsharma.dev/projects",
  },
  contact: {
    title: "Contact Akash Sharma | Get in Touch",
    description: "Interested in collaborating? Get in touch with me via email or social media. Available for freelance work and full-time opportunities.",
    url: "https://akashsharma.dev/contact",
  },
  privacy: {
    title: "Privacy Policy | Akash Sharma",
    description: "Privacy policy for akashsharma.dev",
    url: "https://akashsharma.dev/privacy",
  },
  terms: {
    title: "Terms of Service | Akash Sharma",
    description: "Terms of service for akashsharma.dev",
    url: "https://akashsharma.dev/terms",
  },
};

export const updatePageSEO = (page) => {
  const config = seoConfig[page];
  if (!config) return;

  document.title = config.title;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", config.description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", config.title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", config.description);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute("content", config.title);
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute("content", config.description);
  }

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", config.url);
  }
};

export const addStructuredData = (data) => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Akash Sharma",
  "url": "https://akashsharma.dev",
  "jobTitle": "Full-Stack Developer",
  "sameAs": [
    "https://github.com/CodesofAkash",
    "https://www.linkedin.com/in/codesofakash"
  ],
  "knowsAbout": [
    "JavaScript",
    "React",
    "Node.js",
    "Three.js",
    "Web Development"
  ]
};
