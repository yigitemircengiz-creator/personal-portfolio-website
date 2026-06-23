# Personal Portfolio Website

[![Live Demo](https://img.shields.io/badge/▲_LIVE_DEMO-vercel.app-ffffff?style=for-the-badge&labelColor=000000&logo=vercel&logoColor=white)](https://personal-portfolio-website.vercel.app)
A modern, highly interactive personal portfolio website built with Next.js, React, Tailwind CSS, and Three.js. It features a fully responsive design, 3D elements, smooth animations, and multi-language support.

## ✨ Features

### 🎨 Visual & Interactive Experience
- **3D Elements:** Integrates Three.js and React Three Fiber for dynamic 3D character rendering and canvases.
- **Modern UI & Animations:** Built with Tailwind CSS and enhanced with smooth momentum scrolling and custom animations.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing experiences using Tailwind CSS utilities.

### 🌍 Global Reach
- **Internationalization (i18n):** Multi-language support implemented via custom React contexts to serve a global audience.

### ✉️ Communication
- **Contact Form Integration:** Serverless email handling using Next.js Route Handlers and [Resend](https://resend.com/) for reliable message delivery.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Library:** React
- **Styling:** Tailwind CSS with shadcn/ui design patterns
- **3D Graphics:** Three.js, @react-three/fiber, @react-three/drei
- **Email Service:** Resend
- **Deployment:** Vercel

## 🚀 Getting Started

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yigitemircengiz-creator/personal-portfolio-website.git
   cd personal-portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

4. **Start the development server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. 
