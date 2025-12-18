# Phase 0: Research Findings

**Feature**: Landing Page (`011-landing-page`)
**Date**: 2025-12-18

## 1. Glassmorphism in Vuetify

**Context**: The spec requires glassmorphism effects (semi-transparent dark background, blur, thin border) for feature cards.

**Findings**:
- **CSS Backdrop Filter**: The core standard is `backdrop-filter: blur(10px)`.
- **Vuetify Integration**: Vuetify cards (`v-card`) support custom classes. We should define a utility class `.glass-card`.
- **Theme Compatibility**: Since the background is deep black (`#0a0a0a`), the card background should be white/grey with very low opacity (e.g., `rgba(255, 255, 255, 0.05)`) to create contrast without washing out.
- **Border**: A 1px solid border with low opacity (`rgba(255, 255, 255, 0.1)`) enhances the effect.

**Decision**: Implement a reusable CSS class `.glass-card` in `frontend/src/finance.css` (or component `<style>`) applying `backdrop-filter`, semi-transparent background, and border. Use this class on `v-card` components.

## 2. 3D Tilt Effect for Hero Image

**Context**: The Hero section needs a "high-quality mock-up... slightly tilted in 3D".

**Findings**:
- **CSS Transforms**: `transform: perspective(1000px) rotateY(-10deg) rotateX(5deg);` is a standard, performant way to achieve this.
- **Performance**: Use `will-change: transform` to promote to a compositor layer.
- **Responsiveness**: On mobile, the tilt effect might look odd or take up too much width. We should reduce or remove the tilt (`transform: none`) on small screens (`xs`, `sm`) via media queries.

**Decision**: Use CSS `transform: perspective(...)` for the effect. Disable/Reset on mobile breakpoints using Vuetify's display helpers or CSS media queries.

## 3. Chart.js "Drawing" Animation

**Context**: The forecast graph in the Hero section needs a "drawing" animation on load.

**Findings**:
- **Chart.js Native**: Chart.js has built-in animation options. Specifically, for line charts, the `animation.y` (drop in) or `animation.x` (draw left-to-right) can be configured.
- **Progressive Line**: Setting `animation: { x: { type: 'number', easing: 'linear', duration: 2000 }, y: { duration: 0 } }` simulates a drawing effect from left to right.
- **Vue-Chartjs**: Passes options directly to Chart.js.

**Decision**: Configure the `options` prop of the `Line` chart component to enable an x-axis expansion animation (`type: 'number', property: 'x'`) to simulate drawing.

## 4. Route Guard Strategy

**Context**: Serve Landing Page at `/` for guests. Redirect authenticated users to `/overview`.

**Findings**:
- **Vue Router Navigation Guards**: `beforeEnter` or global `beforeEach`.
- **Auth State**: The app likely stores auth state (token) in localStorage or a Pinia/Vuex store.
- **Logic**:
    - If path is `/` AND user is authenticated -> `next('/overview')`.
    - If path is `/` AND user is NOT authenticated -> `next()`.
    - If path is `/overview` AND user is NOT authenticated -> `next('/')` (Standard auth guard).

**Decision**: Implement a route guard in `frontend/src/router/index.js`.
- Root path `/` component: `LandingPage.vue`.
- Guard: Check auth token. If present, redirect to `/overview`.

## 5. "Fade-in-Up" Scroll Animations

**Context**: Elements should fade in and move up as the user scrolls.

**Findings**:
- **Intersection Observer API**: Robust and performant.
- **Vuetify**: Does not have built-in scroll animations.
- **CSS**: `.fade-in-up { opacity: 0; transform: translateY(20px); transition: opacity 0.6s, transform 0.6s; }` + `.visible { opacity: 1; transform: translateY(0); }`.
- **Implementation**: Create a simple Vue directive `v-intersect` (Vuetify has one) or use `IntersectionObserver` in `onMounted` to toggle the `.visible` class.

**Decision**: Use Vuetify's `v-intersect` directive (if available/working) or a custom Intersection Observer logic to toggle a CSS class for the animation.

## Summary of Technology Choices

| Area | Choice | Rationale |
|------|--------|-----------|
| **Glassmorphism** | CSS `backdrop-filter` | Native browser support, performance. |
| **3D Effect** | CSS `transform: perspective` | Lightweight, no 3D library needed. |
| **Chart Animation** | Chart.js Config | Built-in, optimized. |
| **Routing** | Vue Router Guard | Standard Vue pattern. |
| **Scroll Anim** | CSS + IntersectionObserver | Performant, granular control. |
