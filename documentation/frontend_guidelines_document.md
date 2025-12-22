# Frontend Guideline Document for Check-V1 “Liviaa🌷” WhatsApp Bot

This document describes how to build and maintain a simple frontend interface for the Check-V1 WhatsApp bot. It covers architecture, design principles, styling, component structure, state management, routing, performance, and testing. Even if you’re not deeply technical, these guidelines will help you understand and extend the frontend setup.

---

## 1. Frontend Architecture

### 1.1 Overview
We use a lightweight single-page application (SPA) built with React (via Vite). This gives us:
- **Fast startup** and hot-reload during development.  
- **Modular code** structure through ES modules.  
- **Easy integration** with our bot’s HTTP pairing endpoint and future APIs.

### 1.2 Key Libraries
- **React**: Core UI library.  
- **React Router**: Client-side routing.  
- **Axios**: HTTP client for pairing and dashboard calls.  
- **Context API**: Lightweight global state.  
- **Tailwind CSS**: Utility-first styling.  

### 1.3 Scalability & Maintainability
- **Component-based design** keeps UI pieces small and reusable.  
- **Code splitting** via dynamic `import()` and `React.lazy` minimizes bundle size.  
- **Folder conventions** (see Section 4) let teams quickly find and add features.


## 2. Design Principles

### 2.1 Usability
- **Clear actions**: Buttons and links look and behave consistently.  
- **Feedback**: Show spinners or status messages during pairing or API calls.

### 2.2 Accessibility
- **Semantic HTML**: Always use `<button>`, `<nav>`, `<main>` etc.  
- **ARIA labels**: Provide `aria-label` for icon-only buttons.  
- **Keyboard support**: All interactive elements should be reachable via Tab.

### 2.3 Responsiveness
- **Mobile-first** approach: Base styles target phones, then scale up.  
- **Fluid layouts**: Use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`).  


## 3. Styling and Theming

### 3.1 CSS Methodology
- We use **Tailwind CSS** for utility classes and occasional **BEM** naming in custom modules when needed.
- No global CSS overrides—styles live with components.

### 3.2 Theming Approach
- A single **theme file** (`src/styles/theme.js`) defines colors, border radii, shadows, and font sizes.
- Use Tailwind’s config (`tailwind.config.js`) to extend with our color palette.

### 3.3 Visual Style
- **Glassmorphism**: Semi-transparent cards with blurred background.  
- **Flat icons**: Minimal, line-based.  
- **Modern UI**: Rounded corners, soft shadows.

### 3.4 Color Palette
- Primary: `#5C61F4` (purple)  
- Secondary: `#34D399` (emerald)  
- Accent: `#FBBF24` (amber)  
- Neutral background: `#F9FAFB` (light gray)  
- Card background (glass): `rgba(255, 255, 255, 0.6)`; `backdrop-filter: blur(10px)`

### 3.5 Typography
- **Font family**: `Inter, sans-serif`  
- **Headings**: 600 weight, scale from 1.25rem (h3) up to 2rem (h1)  
- **Body**: 400 weight, 1rem base size


## 4. Component Structure

We organize code under `src/`:

- `components/`: Reusable bits (Button, Card, Loader, QRCodeDisplay).  
- `pages/`: Route-level pages (PairingPage, DashboardPage, SettingsPage).  
- `contexts/`: React Context providers (AuthContext, PairingContext).  
- `hooks/`: Custom hooks (`usePairing`, `useAuth`).  
- `services/`: API wrappers using Axios.  
- `styles/`: Theme files, global utility classes.  

### 4.1 Reuse & Maintainability
- Components accept **props** and avoid internal side effects.  
- Keep one component per file, named after its default export.  
- Export a **barrel file** (`index.js`) in each folder for simpler imports.


## 5. State Management

### 5.1 Context API
- **AuthContext**: Stores user credentials or API tokens.  
- **PairingContext**: Tracks pairing status, QR code data, and errors.

### 5.2 Local State
- Use `useState` for component-local toggles or form inputs.
- Use `useEffect` to kick off pairing requests and subscribe to status events.


## 6. Routing and Navigation

### 6.1 React Router Setup
- `/pair`: Public page to initiate pairing (shows QR code scanner or code).  
- `/dashboard`: Protected page showing bot status, logs, and group stats.  
- `/settings`: Protected page for owner-only options (toggle modes, restart).

### 6.2 Navigation Bar
- A simple `<nav>` lists links.  
- On mobile, a hamburger menu toggles a slide-out drawer.

### 6.3 Route Protection
- A `PrivateRoute` component checks `AuthContext`; redirects to `/pair` if not authorized.


## 7. Performance Optimization

- **Code Splitting**: Use `React.lazy` + `Suspense` for pages.  
- **Image Optimization**: Inline small SVGs; lazy-load large images.  
- **Minimized Bundles**: Rely on Vite’s ES module support and tree-shaking.  
- **Caching**: Configure service worker (optional) or HTTP cache headers for static assets.


## 8. Testing and Quality Assurance

### 8.1 Unit Tests
- **Jest** + **React Testing Library** for components and hooks.  
- Test button clicks, form submissions, and context values.

### 8.2 Integration Tests
- Combine multiple components (e.g., pairing flow) in a JSDOM environment.  

### 8.3 End-to-End Tests
- **Cypress** for real-browser tests: visiting `/pair`, scanning/displaying QR code, navigating dashboard.

### 8.4 Linting & Formatting
- **ESLint** with `eslint:recommended` + React plugin.  
- **Prettier** for consistent code style.  
- Run linters in CI before merge.


## 9. Pairing Page Specifics

This is the one page users see first:  
- Show a centered card with glassmorphic background.  
- Display a headline: “Pair Your WhatsApp Bot.”  
- If supported, embed a QR code scanner preview from the camera.  
- Fallback to showing a textual pairing code and copy button.  
- Show clear status messages: “Waiting for scan…”, “Paired successfully!”, or error details.
- A “Help” link at the bottom directs to documentation.


## 10. Conclusion and Summary

This guideline lays out how you can create and maintain a clean, scalable frontend for the Check-V1 WhatsApp bot. By following:

- A modular React architecture  
- Strong design principles (usability, accessibility, responsiveness)  
- Consistent styling with Tailwind and glassmorphism theme  
- Well-organized components and context-based state  
- Clear routing, performance optimizations, and thorough testing

you ensure that both end users and bot owners enjoy a smooth, reliable experience. This setup also leaves room for future features—such as analytics pages or more advanced bot controls—without bloating your codebase.

Happy coding! 
