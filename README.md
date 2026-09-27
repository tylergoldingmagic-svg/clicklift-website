# Click Lift website

The marketing site for **Click Lift**: *Whatever you freaking need.*

A one-page static site (plain HTML, CSS and JavaScript, no build step) with a light space theme in the Click Lift purple (Pantone 2685 C): a purple planet horizon with gold city lights, a twinkling starfield and the rocket logo.

Page sections, top to bottom: hero (with a line that types out one service at a time), stats, "Why Click Lift" (Big Agencies vs. Click Lift), services (Launch, Lift, Accelerate, Orbit, and Whatever you freaking need, each with its own little rocket animation), clients ("Brands in our orbit"), about (Tyler's photo as a Click Lift crew badge that tilts toward your mouse), the "Weird request? Perfect." band, FAQ, and the contact form.

## What's in here

```
index.html            The whole site, top to bottom
404.html              "Lost in space" page for broken links
css/styles.css        All styling. Brand colours live at the top in :root
js/main.js            Menu, starfield, typed service line, scroll reveals, stat counters,
                      service animations, the clients rocket, the About badge tilt, contact form
assets/
  tyler-golding-600.jpg / -900.jpg (+ .webp)  Tyler's photo in the About section
  clients/            Client logos (trimmed, transparent WebP)
  logo.svg            Full logo, white (logo-purple.svg for light backgrounds)
  logo-mark.svg       Rocket mark, white (logo-mark-purple.svg for light backgrounds)
  favicon.svg         Browser tab icon
  apple-touch-icon.png  Home-screen icon for iPhone/iPad
  og-image.png        Preview image when the link is shared (1200x630)
  city-lights.svg, stars-*.svg  Background textures
favicon.ico           Fallback tab icon
```

## Brand colours

| Name | Hex | Used for |
| --- | --- | --- |
| Click Lift purple (Pantone 2685 C) | `#330072` | Brand colour: buttons, the "Weird request" band, icons, favicon |
| Purple steps | `#4a0fa0`, `#5b1fb8` | Gradients next to the brand purple |
| Deep space | `#0b0418` | Page background |
| Lilac glow | `#ad7bf4` | Planet atmosphere, glows, focus states |
| City-light gold | `#f7b955` | Small accent (the word "freaking", checkmarks, highlights) |
| White | `#ffffff` | Headings, primary buttons |

Fonts are [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for text and [Space Mono](https://fonts.google.com/specimen/Space+Mono) for small labels, loaded from Google Fonts.

## Editing

- **Text:** everything is in `index.html`, in the order it appears on the page.
- **Typed services (hero):** the list lives in the `data-words` attribute on the hero's typed line, separated by `|`. Update the `sr-only` sentence right next to it as well (that's what screen readers announce instead of the animation).
- **Stats:** each number has a `data-count` attribute (the animated value) plus the visible text. Change both, and the matching `sr-only` line for screen readers.
- **Colours:** change the variables at the top of `css/styles.css`.
- **FAQ:** each question is a `<details>` block in the FAQ section. Opening one closes the others.
- **Service buttons:** "Let's launch", "Get me found", "Send the weird list" and the others jump to the form and tick the matching "What do you need?" option. A button's `data-need` must match that option's `value` exactly.
- **Service animations:** each service card starts with a small scene built from the rocket in the logo (inline SVG in `index.html`, styles under "Service animations" in `css/styles.css`). 01 Launch counts down and lifts off, 02 Lift hauls your listing to #1 in the search results, 03 Accelerate flies at full throttle with likes, clicks and sales streaming off, 04 Orbit circles your business (the animation that used to be in About), and 05 tows a banner with a new request each pass. The banner lines live in the `data-banners` attribute (separated by `|`); the last one is shown on its own for visitors who turn off animations. The scenes pause when they're off screen, and people with "reduce motion" switched on see a still frame.
- **Clients:** each logo is one `<li>` in the "Brands in our orbit" section. To add a client, put a trimmed logo with a transparent background in `assets/clients/` and copy an existing line (update `src`, `alt`, `width` and `height`). A `--s` style (for example `style="--s: 1.1"`) makes one logo a little bigger or smaller so they all feel the same size. The rocket that flies between the cards is in `js/main.js` ("Clients"); hovering a logo sends it there.
- **About photo:** `assets/tyler-golding-900.jpg` (plus the 600px and WebP versions) is a 4:5 crop of ZF0_9578.jpg. To swap it, replace all four files with the same names and sizes.
- **About badge:** the photo sits on a crew-badge card with the Click Lift logo on a purple band and the logo rocket parked off the top corner. When the section scrolls in, the rocket launches from behind the card; after that the card turns to face the mouse (on phones it leans gently as you scroll) and a soft glint slides across it. The tilt is in `js/main.js` ("About"): `MAX_X` and `MAX_Y` set how far it leans. Styles are under "About" in `css/styles.css`. With "reduce motion" switched on, the card holds still.

## Contact form

The form sends messages to **hello@clicklift.ca** through [FormSubmit](https://formsubmit.co) (free, no account needed).

1. After the site is live, submit the form once yourself.
2. FormSubmit emails hello@clicklift.ca an **Activate Form** link. Click it.
3. From then on, every submission is emailed to that inbox, with the sender's email as the reply-to address and the ticked "What do you need?" options listed together.

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
