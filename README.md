# gofinrock.com

Finrock's marketing site: static HTML, published by GitHub Pages from `main`
(the domain is in `CNAME`), behind Cloudflare. No build step: edit the HTML,
push, and the site updates in a minute or two.

## Pages

`index.html` and the `finrock-*.html` pages, with `404.html` for anything
else. Styles and the small amount of script are in `assets/fr.css` and
`assets/fr.js`. `sitemap.xml`, `robots.txt` and `llms.txt` describe the site
to crawlers.

## The contact form

`finrock-contact.html` posts to the app, `https://app.gofinrock.com/api/public/contact`
(`backend/internal/handlers/public_contact.go` in the app's repository). The
app emails the support inbox and sends the visitor back here with
`?contact=<result>`; the script at the foot of the page turns each result
into a sentence beside the button:

| Result | Said to the visitor |
|---|---|
| `sent` | Thank you, a person will reply by email |
| `missing`, `email`, `long`, `links`, `invalid` | What to fix and send again |
| `busy` | Too many messages this hour; try later or email support@ |
| `failed` | It could not be sent; email support@ |

The banking waitlist on `finrock-banking.html` posts to the same address,
naming itself with a hidden `form=banking-waitlist`, and is answered back on
its own page (`#waitlist`). A new form needs its name added to `websiteForms`
in the app first; an unknown name is answered on the contact page.

The hidden `website` field is a trap for scripts: keep it in the form, empty
and off screen (`.cform .hp`). The fields' `maxlength` values match the
limits the app holds. A new field needs the app to read it too, or it is
dropped.

## Email addresses

Every address the site shows is support@gofinrock.com, which Cloudflare Email
Routing forwards to the tawk.to ticket inbox. Only support@ and admin@ are
live: an address with no routing rule falls to the catch-all, which is the
bills worker, and reaches nobody.

## Analytics

Cloudflare Web Analytics: cookieless, so the site needs no consent banner.
Every page carries the snippet just before `</body>`; a new page needs it
too. The numbers are in the owner's own Cloudflare account, under Analytics
› Web analytics › gofinrock.com. The token in the snippet is public.

## Share card

`assets/og-card.jpg`, 1200×630, named by its full address in each page's
`og:image` and `twitter:image`. The app uses the same card. `og-card.png` is
kept only for previews other sites cached before the switch.
