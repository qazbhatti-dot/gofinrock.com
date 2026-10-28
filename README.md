# Finrock website — gofinrock.com

Static marketing site for Finrock. Published with GitHub Pages from the `main` branch of `gofinrockWEB`; `CNAME` holds the custom domain.

## Pages
All pages are plain HTML sharing `assets/fr.css` and `assets/fr.js`. Icons: Lucide (CDN). Fonts: Inter + Instrument Sans (Google Fonts). App screenshots live in `assets/app/` (mobile-*.webp, light and dark).

## Pricing (monthly, incl. VAT)
My Life £9.99 · Sole trader & Landlord £14.99 · Sole trader & Landlord · MTD £24.99 · Limited company £49.99 per company, qualified accountant sign-off included (+£10 if the director is personally inside MTD, £59.99) · Accountant check +£10 on a personal plan. Every plan: 7 days free, no card. No free tier — after the trial an unpaid account can read its books only.

## Wording rules
- Finrock prepares returns ready to file. It does not file with HMRC and is not "HMRC recognised". The accountant add-on submits through the accountant's own agent account.
- Never name a competitor.

## Contact form and waitlist
`finrock-contact.html` posts to `https://app.gofinrock.com/api/contact`; `finrock-banking.html` posts to `https://app.gofinrock.com/api/waitlist`. Both send a hidden `redirect` back to the page; the app appends `?contact=ok|error|missing|spam` (waitlist also accepts `exists`) and a small inline script shows the result beside the button. Mail goes to support@gofinrock.com. Only support@ and admin@ are routed — never use help@ or hello@.

## Share card
`assets/og-card-v2.png` (1200×630, "Your books, ready to file."). Referenced by og:image and twitter:image on every page. Replace with a <150 KB JPG when one is available and update the tags.

## llms.txt
`/llms.txt` is the AI-crawler summary; keep prices and wording in sync with the site.

## Publishing
Commit to `main` and push. Pages deploys in 1–5 minutes. Check desktop and a real phone after each deploy, and submit the contact form and waitlist once.
