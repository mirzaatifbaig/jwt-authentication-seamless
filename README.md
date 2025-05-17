<p align="center"><img align="center" width="280" src="https://skillicons.dev/icons?i=react"/></p>

<div align="center">React JS full-stack app.</div>
</br>

<div align="center">React JS full-stack app with advanced auth & 2FA features.</div>
<br />

<div align="center">
  <img src="https://skillicons.dev/icons?i=tailwind,ts,vite,express,nodejs,sqlite,vercel,webstorm,pnpm,html,css" />
</div>

---

## 🗂️ Project Structure

```

.
├── src/
│   ├── components/        # UI Components (Navbar, ProtectedRoute, etc.)
│   ├── pages/             # Route components (Login, Signup, Dashboard, etc.)
│   ├── api/               # Azios routing logic
│   ├── store/             # Zustand global state
│   ├── pages/             # Helpers & services (API calls, auth helpers)
└── README.md

````

---

## ⚙️ Tech Stack

### 🖼 Frontend:
- **React** + **Vite**
- **TypeScript** (implied by the tech list)
- **Tailwind CSS** + **tailwind-merge**
- **Radix UI** components (Label, Slot)
- **Lucide React** (icons)
- **React Router DOM** (routing)
- **React Hook Form** + **@hookform/resolvers** + **Zod** (form validation)
- **zustand** (state management)
- **Axios** (API requests)
- **Sonner** (toasts/notifications)
- **class-variance-authority** + **clsx** (conditional styling)
- **input-otp** (OTP input component)
- **tw-animate-css** (animations with Tailwind)

### 🧹 Code Quality & Tooling:
- **ESLint** + **eslint-plugin-react-hooks** + **eslint-plugin-react-refresh**
- **@eslint/js**
- **@types/node**, **@types/react**, **@types/react-dom**
- **@vitejs/plugin-react**

---

## 📦 Getting Started

### 🛠 Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io) **(preferred)** – or npm/yarn

---

## ▶️ Running Locally

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm run dev
````

> The app will run at **[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Features Overview

### User Authentication & Authorization

* ✅ Signup page for new users (`/signup`)
* ✅ Standard login (`/login`)
* ✅ Two-Factor Authentication (2FA) login flow (`/twofalogin`)
* 🔒 Protected routes (e.g., `/dashboard`) accessible only to authenticated users via `ProtectedRoute` wrapper

### Password Management

* 🔑 Forgot password page (`/forgot-password`)
* 🔑 Reset password via token URL param (`/reset-password/:token`)

### User Interface & Navigation

* 🧭 Persistent Navbar on all pages
* 🔔 Toaster notifications powered by **Sonner**, with auto-dismiss after 1s, positioned top-left

### Main Pages

* 🏠 Home landing page (`/`)
* 📊 Dashboard with personalized user data (`/dashboard`)
* 🚫 404 Not Found fallback page (`*`)

### Security & QR Code Features

* 📱 QR Code page (`/qrcode`) — for 2FA setup or other security-related features

---

## ✨ Highlights

* Solid form validation with **React Hook Form** + **Zod**
* Clean, accessible UI using **Radix UI** primitives and **Lucide** icons
* State management with **zustand**
* Responsive styling with **Tailwind CSS** and utility libraries
* Smooth animations via **tw-animate-css**
* Robust code linting with ESLint plugins for React hooks and refresh

---

<div align="center">
  <sub>Built with 💙, open-source tools, and modern best practices.</sub>
</div>
