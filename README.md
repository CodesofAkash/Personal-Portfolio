# Personal Portfolio

A 3D, animation-driven personal portfolio — an interactive Three.js hero model, GSAP scroll
motion, and a project showcase, built with Next.js.

**Live:** [codesofakash.vercel.app](https://codesofakash.vercel.app)

## Overview

A Next.js App Router site with routes for Home, About, Projects, Contact, Privacy, and Terms.
The 3D hero visualization is the centerpiece, backed by an explicit error boundary so a WebGL
failure degrades gracefully instead of taking the page down.

## Features

- Interactive 3D hero model (Three.js + React Three Fiber + Drei)
- GSAP scroll-triggered animations throughout
- A project showcase section with expandable project detail cards, video previews, and
  screenshot carousels
- A contact form (EmailJS)
- Dedicated Privacy and Terms pages
- A dedicated error boundary around every 3D canvas, so a model/WebGL failure fails gracefully
  rather than breaking the page
- Native Next.js metadata (per-page title/description/canonical) and JSON-LD structured data

## Tech Stack

**Frontend**
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion

**3D / Animation**
Three.js, React Three Fiber, Drei, GSAP, `maath`

**Other**
EmailJS (contact form), `react-toastify` (notifications)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout — fonts, metadata, Navbar/Footer, toasts
│   ├── page.tsx           # Home route
│   ├── about/
│   ├── projects/
│   ├── contact/
│   ├── privacy/
│   ├── terms/
│   └── not-found.tsx
├── components/
│   ├── canvas/            # 3D scene components (Computers, Earth, Ball, Stars)
│   ├── Hero.tsx
│   ├── Contact.tsx
│   ├── ModelErrorBoundary.tsx
│   └── Navbar.tsx / Footer.tsx
├── constants/              # Static content (project list, nav links, etc.)
├── hoc/
├── lib/
└── utils/
```

## Getting Started

### Prerequisites

- Node.js 20+

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

Deployed on Vercel via its native Next.js integration.

## Current Status

Migrated from a Vite + React Router SPA to Next.js. Sanity CMS integration is planned as the
next phase, followed by a Core Web Vitals / performance pass.
