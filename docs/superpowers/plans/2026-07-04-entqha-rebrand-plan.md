# Implementation Plan: Rebranding to Entqha (انطقها)

**Date:** 2026-07-04  
**Status:** Ready  
**Spec Reference:** `docs/superpowers/specs/2026-07-04-entqha-rebrand-design.md`

This document outlines the step-by-step technical plan for rebranding the application to **Entqha (انطقها)** and integrating the new purple color schema.

---

## 📋 Task List

### Step 1: Global Theme & Color Palette Implementation
*   **File:** `src/app/globals.css`
*   **Action:**
    *   Update the `@theme inline` block to map standard blue/indigo utilities to the new Primary Purple `#6D28D9` scale.
    *   Update root variables `--background` to `#FFFFFF` and `--foreground` to `#0F172A`.
    *   Update the `body` background rule to use a subtle purple-tinted radial gradient.

### Step 2: Core Metadata & PWA Manifest Setup
*   **File:** `src/app/layout.tsx`
*   **Action:**
    *   Change title metadata to `EntQha (انطقها) - English Vocabulary Guide`.
    *   Change description metadata to the new bilingual value.
    *   Update the `appleWebApp` title field to `EntQha`.
    *   Replace standard `/logo.svg` icon and shortcut entries with `/app-icon.png`.
    *   Configure launcher icons in the icons array.
    *   Change `<meta name="apple-mobile-web-app-title" content="EntQha" />`.
    *   Change `<link rel="apple-touch-icon" href="/launchericon-192x192.png" />`.

*   **File:** `public/manifest.json`
*   **Action:**
    *   Update `name` to `"EntQha - English Learning App"`.
    *   Update `short_name` to `"EntQha"`.
    *   Update `description` to the new bilingual value.
    *   Update the PWA launcher icons array with `/launchericon-192x192.png` and `/launchericon-512x512.png`.
    *   Update the shortcuts icon path.

### Step 3: UI Layout & Component Branding Swaps
*   **File:** `src/components/Navbar.tsx`
*   **Action:**
    *   Replace `/logo.svg` with `/nav-logo.png` and set alt text.
    *   Configure `width={140}` and `height={40}` with standard aspect ratio support.
    *   Remove the `<span className="text-2xl font-bold ...">Sema3ny</span>` text branding block entirely.

*   **File:** `src/components/Footer.tsx`
*   **Action:**
    *   Replace text header `Sema3ny` with `EntQha (انطقها)`.
    *   Update copyright line to `© {new Date().getFullYear()} EntQha. All rights reserved.`.

*   **File:** `src/app/page.tsx`
*   **Action:**
    *   Replace the hero `/logo.svg` with `/logo.png`.
    *   Set appropriate responsive size (e.g. `width={160}` and `height={160}`) and update alt text.

*   **File:** `src/app/not-found.tsx`
*   **Action:**
    *   Replace `/logo.svg` with `/logo.png` and update alt text.

### Step 4: Service Worker & Cache Busting Setup
*   **File:** `public/service-worker.js`
*   **Action:**
    *   Update all local cache name constants to use the `EntQha` prefix.
    *   Modify `STATIC_ASSETS` to include the new images (`/app-icon.png`, `/nav-logo.png`, `/logo.png`, `/launchericon-192x192.png`, `/launchericon-512x512.png`) and remove `/icon-192x192.png` and `/icon-512x512.png`.
    *   Update the web push notification titles and notification launcher icon references.

---

## 🧪 Validation & Post-Migration Verification

1.  **Local Execution:** Run `npm run dev` and open `http://localhost:3000`.
2.  **Visual Audit:** Confirm that:
    *   All buttons, focus outlines, and selection highlights are rich purple.
    *   The Navbar contains only the horizontal `nav-logo.png` without extra text.
    *   The Homepage Hero has your new `logo.png`.
3.  **Audit Headers:** Verify that browser tab displays the new bilingual title and favicon.
4.  **Service Worker Registry:** Check browser DevTools Application tab -> Service Workers and Cache Storage. Force update the service worker to verify old caches are deleted and the new `EntQha-v1` caches are populated.
