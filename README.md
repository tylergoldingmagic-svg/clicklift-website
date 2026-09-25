# Click Lift website

The marketing site for **Click Lift**: *Whatever you freaking need.*

A simple one-page static site (plain HTML, CSS and JavaScript, no build step) with a light space theme pulled from the Click Lift brand: deep navy, a glowing planet horizon with city lights, a twinkling starfield and the rocket logo.

## What's in here

```
index.html            The whole site: hero, stats, services, about, contact, footer
404.html              "Lost in space" page for broken links
css/styles.css        All styling. Brand colours live at the top in :root
js/main.js            Menu, starfield, scroll reveals, stat counters, contact form
assets/
  logo.svg            Full logo, white (logo-navy.svg for light backgrounds)
  logo-mark.svg       Rocket mark, white (logo-mark-navy.svg for light backgrounds)
  favicon.svg         Browser tab icon
  apple-touch-icon.png  Home-screen icon for iPhone/iPad
  og-image.png        Preview image when the link is shared (1200x630)
  city-lights.svg, stars-*.svg  Background textures
favicon.ico           Fallback tab icon
```

## Brand colours

| Name | Hex | Used for |
| --- | --- | --- |
| Click Lift navy | `#11335b` | Logo, button text, icon tiles |
| Deep space | `#040b1a` | Page background |
| Atmosphere blue | `#6fa8ff` | Glows, focus rings |
| City-light gold | `#f7b955` | Accent (the word "freaking", highlights) |
| White | `#ffffff` | Headings, primary buttons |

Fonts are [Manrope](https://fonts.google.com/specimen/Manrope) for text and [Space Mono](https://fonts.google.com/specimen/Space+Mono) for small labels, loaded from Google Fonts.

## Editing

- **Text:** everything is in `index.html`, in the order it appears on the page.
- **Stats:** each number has a `data-count` attribute (the animated value) plus the visible text. Change both, and the matching `sr-only` line for screen readers.
- **Colours:** change the variables at the top of `css/styles.css`.

## Contact form

The form sends messages to **hello@clicklift.ca** through [FormSubmit](https://formsubmit.co) (free, no account needed).

1. After the site is live, submit the form once yourself.
2. FormSubmit emails hello@clicklift.ca an **Activate Form** link. Click it.
3. From then on, every submission is emailed to that inbox, with the sender's email as the reply-to address.

If a message can't be sent, visitors are offered a pre-filled email to hello@clicklift.ca instead, so nothing gets lost. To use a different address, change it in the form's `action` in `index.html` (and the `mailto:` links). FormSubmit's activation email also gives you a random alias you can use in the `action` instead of the real address if you'd rather keep it out of the page source.

## Preview locally

Open `index.html` in a browser, or run a tiny local server from this folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing with GitHub Pages

1. On GitHub, open the repo's **Settings > Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute or so the site is live at `https://<your-username>.github.io/clicklift-website/`.

### Pointing clicklift.ca at it (when you're ready to replace the Wix site)

1. In **Settings > Pages > Custom domain**, enter `clicklift.ca` and save (GitHub adds a `CNAME` file for you).
2. At your domain registrar, replace the Wix DNS records with GitHub's: `A` records for `clicklift.ca` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` for `www` pointing to `<your-username>.github.io`. See [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for the current values.
3. Once DNS has updated, tick **Enforce HTTPS**.

The page's canonical URL and share image already point to `https://clicklift.ca/`.
