# EVO Fitness – Landing Page

Static site (HTML/CSS/JS), no build step. Production: https://evofitness.lk

## Deploy on Cloudflare Pages
- Connect this GitHub repo in Cloudflare Pages
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `/`
- Add the custom domain `evofitness.lk` under the Pages project's Custom domains

`_headers` (security + cache headers), `robots.txt` and `sitemap.xml` are picked up automatically.

## Local preview
```bash
npx serve .
```
