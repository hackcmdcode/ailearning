# AI Academy - Complete 20-Page Static Educational Web Application

Welcome to **AI Academy**, a lightweight, high-performance, static educational website built with pure HTML5, CSS3, and Vanilla JavaScript.

## 🚀 Quick Setup & Hosting

Since this website is 100% static (no Node.js backend or build tools required), you can deploy it instantly to any host:
- **Netlify**: Drag and drop the folder directly onto netlify.com
- **Vercel**: Deploy using Vercel CLI (`vercel`) or connect your GitHub repository
- **GitHub Pages**: Upload to a repository and enable GitHub Pages in Repository Settings
- **cPanel / Traditional Host**: Upload all `.html`, `.css`, `.js`, `.xml`, and `robots.txt` files to your `public_html` directory via FTP/File Manager.

---

## 💰 Monetag Publisher Setup Guide

This site features a 6-ad unit architecture designed to maximize Monetag CPM revenue while strictly protecting your site against **Cumulative Layout Shift (CLS)** penalties.

### Step 1: Open `ads.js`
In your text editor, open [ads.js](file:///c:/Users/Akash%20Choudhary/OneDrive/Desktop/p/ads.js).

### Step 2: Replace Zone ID Placeholders
Locate the `MONETAG_CONFIG` object:
```javascript
const MONETAG_CONFIG = {
  ZONE_BANNER_TOP: "1234567",         // Replace with your Monetag Banner Zone ID
  ZONE_INCONTENT_1: "2345678",        // Replace with In-Content Native Zone ID #1
  ZONE_INCONTENT_2: "3456789",        // Replace with In-Content Native Zone ID #2
  ZONE_INCONTENT_3: "4567890",        // Replace with In-Content Native Zone ID #3
  ZONE_SIDEBAR: "5678901",            // Replace with Sidebar Banner Zone ID
  ZONE_VIDEO_INTERSTITIAL: "6789012"  // Replace with High-CPC Interstitial / Popunder Zone ID
};
```

### Step 3: Layout Shift Protection
All ad units reside inside `<div class="ad-slot">` containers with pre-allocated min-heights in `style.css`:
- Top Banner: `90px`
- In-Content Slots: `280px`
- Interstitial Video Unit: `250px`
- Sidebar Unit: `600px` (desktop sticky)

This ensures your Google Core Web Vitals score remains green despite high ad density!

---

## 📁 File Structure (All 20 Pages)

- **Main Navigation & Pages**:
  - `index.html` — Main Homepage & Article Directory
  - `about.html` — About & Editorial Standards
  - `contact.html` — Clean, Ad-Free Contact Form
- **17 In-Depth AI Guide Articles**:
  1. `what-is-artificial-intelligence.html`
  2. `machine-learning-vs-deep-learning.html`
  3. `how-neural-networks-work.html`
  4. `what-is-a-large-language-model.html`
  5. `how-chatgpt-claude-gemini-work.html`
  6. `prompt-engineering-complete-guide.html`
  7. `ai-agents-explained.html`
  8. `computer-vision-basics.html`
  9. `natural-language-processing-explained.html`
  10. `generative-ai-vs-traditional-ai.html`
  11. `ai-ethics-and-bias.html`
  12. `how-to-start-a-career-in-ai.html`
  13. `best-ai-tools-for-beginners.html`
  14. `ai-in-everyday-life.html`
  15. `future-of-ai-trends-to-watch.html`
  16. `glossary-of-ai-terms.html`
  17. `ai-robotics-and-automation.html`
- **Core System Files**:
  - `style.css` — Modern responsive theme + CLS protection
  - `main.js` — Navigation, dark/light theme, share links, progress bar
  - `ads.js` — Monetag lazy loading engine
  - `sitemap.xml` — Complete XML sitemap
  - `robots.txt` — Search engine directive

---

## 🛡️ SEO & Compliance Checklist

- ✅ **Semantic HTML5**: Native `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.
- ✅ **JSON-LD Schema**: `Article`, `BreadcrumbList`, and `Organization` schemas embedded on every page.
- ✅ **Metadata & OpenGraph**: Tailored `<title>`, `<meta description>`, `og:title`, `og:image`, `twitter:card`, and canonical tags.
- ✅ **Internal Linking**: In-text cross-links, 3 related articles per page, and sequential "Continue Reading →" buttons.
