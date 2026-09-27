# Personal Portfolio

A 3D, animation-driven personal portfolio — an interactive Three.js hero model, GSAP scroll
motion, and a project showcase, built with React and Vite.

**Live:** [codesofakash.vercel.app](https://codesofakash.vercel.app)

## Overview

A single-page-app-style portfolio with dedicated routes for Home, About, Projects, and Contact.
The 3D hero visualization is the centerpiece, backed by an explicit error boundary so a WebGL
failure degrades gracefully instead of taking the page down.

## Features

- Interactive 3D hero model (Three.js + React Three Fiber + Drei)
- GSAP scroll-triggered animations throughout
- A project showcase section
- A contact form (EmailJS)
- Dedicated Privacy and Terms pages
- A dedicated error boundary around the 3D canvas, so a model/WebGL failure fails gracefully
  rather than breaking the page

## Tech Stack

**Frontend**
React 18, React Router v6, Vite 7, Tailwind CSS 3, Framer Motion

**3D / Animation**
Three.js, React Three Fiber, Drei, GSAP + `@gsap/react`, `maath`

**Other**
EmailJS (contact form), `react-toastify` (notifications), `react-vertical-timeline-component`

## Project Structure

```
src/
├── components/
│   ├── canvas/          # 3D scene components
│   ├── Hero.jsx
│   ├── Contact.jsx
│   ├── ModelErrorBoundary.jsx
│   └── Navbar.jsx / Footer.jsx
├── pages/                # Home, About, Projects, Contact, Privacy, Terms
├── constants/             # Static content (project list, nav links, etc.)
├── hooks/
├── hoc/
└── assets/
```

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```

No environment variables are required to run this project locally — the contact form's EmailJS
service and template identifiers are the library's own public-facing configuration values, not
secrets.

## Deployment

Deployed on Vercel as a static Vite build.

## Current Status

Deployed and live. This portfolio is scheduled for a full rebuild — the current version is stable
but not the final design or content.
