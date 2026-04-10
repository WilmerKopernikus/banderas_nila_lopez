# Banderas Nila López — Business Website

A client-facing website for **Banderas Nila López**, a flag manufacturer based in Bogotá, Colombia, specializing in institutional, corporate, and custom flags with nationwide shipping. Built as a freelance project to replace an underperforming digital presence with a conversion-optimized, component-driven frontend.

---

## Project Overview

The site serves as the primary digital storefront and lead-generation channel for a B2B/B2G flag manufacturer. The target audience is procurement officers, event coordinators, educational institutions, and businesses across Colombia.

**Live domain:** [banderasnilalopez.com](https://www.banderasnilalopez.com)

---

## Technical Stack

| Layer | Technology |
|---|---|
| UI Framework | Vue.js 3 (CDN, no bundler) |
| Rendering | Client-side, component-based |
| Styling | Vanilla CSS, scoped per component via class conventions |
| Visual effects | p5.js (hero background) |
| Layout | CSS Grid + Flexbox |
| Package management | None — zero build step, zero dependencies to install |
| SEO | JSON-LD structured data, Open Graph, Twitter Cards, sitemap.xml, robots.txt |

The architecture deliberately avoids a build pipeline. The site is deployed as static files, which keeps hosting costs at zero and allows the client to own and maintain the files without tooling knowledge.

---

## Architecture

The project uses a **script-based Vue 3 component pattern** — each component is a plain `.js` file that exports a Vue options object and is loaded via `<script>` tags. This provides the organizational benefits of a component model without requiring Node.js, Webpack, or Vite.

```
index.html              # Homepage (main entry point)
nuestro_catalogo.html   # Product gallery page
cotizacion.html         # Quote request page
contacto.html           # Contact page

main.js                 # Vue app bootstrap for homepage
main-gallery.js         # Vue app for catalog page
cotizacion-main.js      # Vue app for quote page
contacto-main.js        # Vue app for contact page

components/
  headerComponent.js          # Navigation with mobile hamburger menu, multi-page routing
  heroComponent.js            # Above-the-fold section with dual CTA
  coursesComponent.js         # Product category cards
  locationsComponent.js       # Service area and location info
  aboutComponent.js           # Company background section
  testimonialsComponent.js    # Image carousel of completed work
  urgencyBannerComponent.js   # Mid-page conversion banner
  footerComponent.js          # Site footer with legal/contact links
  galleryComponent.js         # Infinite-scroll masonry gallery (IntersectionObserver + Masonry.js)
  cotizacionComponent.js      # Multi-step guided quote form
  stickyWhatsAppCTAComponent.js  # Floating WhatsApp button with pre-filled context messages

global.css / header.css / gallery.css / contacto.css
```

---

## Key Features

### Multi-step Quote Form
`cotizacionComponent.js` implements a guided intake form that replaces a generic contact form. It includes:
- Step-based progression with a visual progress indicator
- Dynamic conditional fields driven by `v-if` (flag type, country, department, municipality)
- Real-time field validation with inline error messages
- Form state persistence via `localStorage` so users do not lose progress on page reload
- Multi-item support — users can add multiple flag line items in a single request

### Sticky WhatsApp CTA
`stickyWhatsAppCTAComponent.js` provides a persistent low-friction conversion channel:
- Floating button visible on all viewport sizes
- Pre-fills the WhatsApp message with the product the user last viewed (read from `localStorage`)
- Dispatches a `CustomEvent` and pushes to `window.dataLayer` and `gtag` on click, making it compatible with Google Tag Manager and Google Analytics 4 integrations

### Deferred Component Loading
`main.js` staggers component visibility using `setTimeout` after mount. Non-critical sections (testimonials, footer, locations) are rendered after an artificial delay, keeping the initial paint fast without a full lazy-loading implementation.

### Masonry Gallery with Infinite Scroll
`galleryComponent.js` loads product images in batches of 20 using an `IntersectionObserver` sentinel element at the bottom of the grid. A Masonry layout is re-initialized after each batch resolves all image `load` events, preventing layout collapse during progressive loading.

### SEO Foundation
- JSON-LD structured data for `WebSite` and `LocalBusiness` on every page
- Open Graph and Twitter Card meta tags for social sharing previews
- `sitemap.xml` and `robots.txt` present at the root
- Canonical URLs set per page
- `max-image-preview:large` robots directive for Google image indexing

---

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Homepage: hero, product categories, about, testimonials, location, footer |
| `nuestro_catalogo.html` | Full product gallery with masonry layout and infinite scroll |
| `cotizacion.html` | Multi-step quote configurator |
| `contacto.html` | Direct contact form with map reference |

---

## Running Locally

Because there is no build step, the site can be served with any static file server:

```bash
# Using Python (available on most systems)
python -m http.server 8080

# Using Node.js (npx, no install required)
npx serve .
```

Then open `http://localhost:8080` in a browser.

---

## Implementation Roadmap

The following roadmap is based on a consulting assessment of the current site's conversion gaps and business priorities. Items are ordered by expected business impact.

### Phase 1 — Conversion and Lead Quality (Highest Priority)

- **Quote Configurator refinement:** Add a logo/artwork upload field to the existing multi-step form to handle custom flag requests without back-and-forth emails. Integrate with a serverless form backend (e.g., Formspree, EmailJS, or a custom endpoint) to replace the current alert-based submission.
- **Form analytics:** Instrument each step of the quote form with `gtag` events to identify drop-off points and improve completion rates.
- **WhatsApp CTA product context:** Extend `localStorage` product tracking so the pre-filled WhatsApp message includes the specific flag type and quantity the user configured, not just the product name.

### Phase 2 — Trust and Credibility (High Priority)

- **Trust bar component:** Add a horizontal bar beneath the hero with concise credibility signals: years in operation, flags delivered, national shipping coverage, and electronic invoicing availability.
- **Business stats section:** Quantified social proof (e.g., "+500 proyectos entregados," "Clientes en 32 departamentos") displayed as a stat card block.
- **Testimonials upgrade:** Extend `testimonialsComponent.js` to display client name or organization role, project type, and a short quote alongside the work image, replacing the current image-only carousel.
- **Process timeline component:** A four-step visual (Request, Design Approval, Production, Delivery) to set buyer expectations and reduce pre-sale hesitation.

### Phase 3 — Product Discovery (Medium Priority)

- **Catalog filter panel:** Add client-side filtering to `nuestro_catalogo.html` by use case (interior, exterior, desktop), buyer type (corporate, government, education, events), and delivery urgency. Move hardcoded product data into a central data module consumed by computed properties.
- **Product card enhancements:** Surface material specs, recommended use-case tags, and a primary "Solicitar cotización" CTA directly on each card.
- **Flag comparison table:** A static "which flag type is right for me?" decision table to reduce indecisive leads and support procurement officers who need to justify purchases internally.

### Phase 4 — Local SEO and Discoverability (Medium Priority)

- **Google Maps embed:** Add an interactive map to `contacto.html` with address, office hours, and a "Como llegar" link.
- **FAQ accordion component:** Cover top procurement questions: minimum order quantity, production timelines, material durability (outdoor vs. indoor), accepted logo file formats, and payment and shipping terms.
- **Per-page meta optimization:** Ensure each page has a unique, keyword-targeted `<title>` and `<meta description>`. Add local business structured data to secondary pages, not only the homepage.
- **Open Graph image per page:** Replace the single shared OG image with page-specific images for catalog and quote pages to improve WhatsApp and social link previews.

### Phase 5 — Design System and Visual Polish (Lower Priority)

- **UI primitive components:** Extract reusable `BaseButton`, `BaseCard`, `BaseInput`, `SectionHeader`, and `Badge` components to enforce consistent spacing, radius, shadow, and hover state conventions across all pages.
- **Hero content hierarchy:** Strengthen the above-the-fold value proposition with a B2B/B2G-specific headline and a clearer visual hierarchy between the primary ("Cotizar ahora") and secondary ("Ver catálogo") CTAs.
- **Information architecture alignment:** Reorder homepage sections to match the recommended flow: Hero, Trust Bar, Product Categories, Process Timeline, Testimonials, FAQ, Quote Form, Location, Footer.

---

## Status

The core site is live and functional. Phases 1 and 2 of the roadmap are the active development focus. The codebase is structured to accommodate new components without breaking existing pages.
