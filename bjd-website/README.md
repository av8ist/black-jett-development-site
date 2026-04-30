# Black Jett Development, LLC — Website

Static marketing site for **Black Jett Development, LLC**. Hand-built HTML, CSS, and a small amount of vanilla JavaScript. **Zero external runtime dependencies** — no CDN, no font service, no analytics, no framework. Everything required to render the site is in this repo.

---

## File structure

```
.
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── _headers                          ← Cloudflare Pages / Netlify
├── _redirects                        ← Cloudflare Pages / Netlify
├── about/index.html
├── spec-homes/index.html
├── small-multifamily/index.html
├── acquisitions/index.html
├── contact/index.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── img/
    │   ├── bjd-logo.png
    │   └── og-image.png              ← 1200×630 social share card
    └── fonts/
        ├── fraunces-{400,500,600,700}-{normal,italic}.woff2
        ├── plex-sans-{300,400,500,600,700}.woff2
        ├── plex-mono-{400,500}.woff2
        └── licenses/                 ← OFL license texts
```

URLs are directory-style: `/about/`, `/spec-homes/`, etc. The `_redirects` file 301s the legacy `/about.html` paths to the new ones, so any old external links continue to resolve.

---

## Internal docs vs public site

This `README.md` and the `_headers` / `_redirects` files are deploy-bundle artifacts, not public pages. The `_redirects` file explicitly 404s `/README.md`, `/_headers`, and `/_redirects` so they cannot be fetched from the live site, even though they live alongside `index.html` in the deploy. Cloudflare Pages and Netlify also treat the underscore-prefixed files as platform configuration and don't serve them by default, but the redirect rules are belt-and-suspenders.

If you add another internal-only file (like `NOTES.md` or `TODO.md`), add a matching 404 line to `_redirects`.

---

## Deployment — recommended: Cloudflare Pages

Cloudflare Pages is the recommended host. It's free, includes DDoS protection and a global CDN, supports the `_headers` and `_redirects` files in this repo natively, automatically issues HTTPS, and — relevant for the future deal-engine work — Cloudflare Workers / Pages Functions live on the same platform, so you don't migrate when the backend gets attached.

**Steps (one-time):**

1. Push this repo to GitHub (or GitLab).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. Deploy. You'll get a `*.pages.dev` URL immediately.
5. **Custom domain:** Pages project → **Custom domains → Set up** → enter `blackjettdev.com`. Cloudflare handles the cert.
6. **Submit sitemap:** Google Search Console → property `blackjettdev.com` → Sitemaps → submit `https://blackjettdev.com/sitemap.xml`.

Subsequent deploys are automatic on every push to `main`.

**Alternatives:** Netlify and Vercel both honor the same `_headers` and `_redirects` formats and will work without changes.

---

## Security posture

The `_headers` file applies, on every response:

| Header                            | What it does                                                |
| --------------------------------- | ----------------------------------------------------------- |
| `Strict-Transport-Security`       | Forces HTTPS for 2 years, `preload` eligible.               |
| `Content-Security-Policy`         | Self-only sources. No inline scripts, no external fetches.  |
| `X-Frame-Options: DENY`           | Cannot be embedded in an iframe — clickjacking defense.     |
| `X-Content-Type-Options: nosniff` | Browser must trust declared MIME types.                     |
| `Referrer-Policy`                 | Same-origin referrers only on cross-origin navigation.      |
| `Permissions-Policy`              | Camera, mic, geolocation, payment, USB, FLoC all disabled.  |
| `Cross-Origin-Opener-Policy`      | Window isolation against side-channel attacks.              |

The Content-Security-Policy is intentionally strict: `default-src 'self'`. Nothing external loads. If you ever add a third-party tag (analytics, embed, map, etc.) you'll need to widen the CSP — do so explicitly and minimally.

**HSTS preload list:** Once the site has been live for a few weeks and is healthy on HTTPS, submit `blackjettdev.com` at <https://hstspreload.org> for inclusion in the browser preload list.

---

## When the deal engine gets added

Two notes carry forward:

1. **CSP and headers will not auto-apply to Functions output.** Cloudflare Pages Functions return their own response object; the `_headers` file applies to static asset responses but not to a function's `Response`. When you add functions, set the same headers inside the function response (or use a `_middleware.ts` to wrap them).
2. **Adjust CSP only if needed.** If the engine talks to an internal API on a subdomain, add it to `connect-src`. If it never makes a fetch from the browser (server-rendered only), no change required.

---

## Local preview

Any static server works:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open <http://localhost:8080>. Note that `_headers` and `_redirects` are Cloudflare/Netlify conventions and are **not** honored by these local servers — security headers and redirect rules only take effect on the deployed host.

---

## Editing the site

The header, navigation, and footer are duplicated in each HTML file. There is no template engine. When you change the nav (add a page, rename a label), update each page. This is the trade-off for having no build step. The duplicated regions are clearly marked between `<!-- ============== -->` comment fences.

**Common edits:**

| Change                           | Where                                                  |
| -------------------------------- | ------------------------------------------------------ |
| Email address                    | All `mailto:` links + JSON-LD on `index.html`          |
| Phone number (if added)          | `contact/index.html` + JSON-LD                         |
| Office address                   | `contact/index.html` + JSON-LD on `index.html`         |
| Brand colors                     | `--ink`, `--blueprint`, `--bone`, etc. in `styles.css` |
| Type system                      | `--font-display`, `--font-body`, `--font-mono`         |
| Add a page                       | New `<slug>/index.html`, update nav in **all** pages, add to `sitemap.xml` |

---

## Fonts

All fonts are self-hosted under `/assets/fonts/`. Three families:

- **Fraunces** — display serif. Weights 400/500/600/700, normal + italic.
- **IBM Plex Sans** — body. Weights 300/400/500/600/700.
- **IBM Plex Mono** — accents (eyebrows, numerics). Weights 400/500.

All three are SIL Open Font License (OFL); license texts are in `assets/fonts/licenses/`. Total payload across all 15 woff2 files is **~313 KB**. The two most-used weights (Plex Sans 400, Fraunces 600) are preloaded via `<link rel="preload">` in every page `<head>`.

---

## Copy / positioning rules (locked)

- **Brand**: Black Jett Development, LLC
- **Tone**: lender-facing, restrained, practical
- **Focus areas**: Spec homes · Small multifamily (5–20 units) · Acquisitions
- **Do not use**: wholesaling language, public investment-solicitation language, customer-builder pitch language, fake forms
- **Contact model**: direct inquiries via mailto links — no form submission backend on the public site

---

## Contact

`info@blackjettdev.com`

14401 Issaquah-Hobart Rd SE, Suite 205E, Issaquah, WA 98027
