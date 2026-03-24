# Codama Free Tool Template

Boilerplate for creating free online tools under `codama.dev` subdomains. Each tool gets Codama branding, SEO, i18n, social sharing, and analytics out of the box.

## What's Included

- **React 19 + Vite 7 + Tailwind CSS 4** - Modern, fast stack
- **shadcn/ui** - Polished UI components (Radix primitives)
- **i18n** - 4 languages (English, German, Spanish, Hebrew with RTL)
- **Dark/Light mode** - System-aware theme toggle
- **Codama branding** - Logo in footer, "Get a Quote" CTA, About page with services
- **Share modal** - WhatsApp, Facebook, X, LinkedIn, Email, copy link
- **Cross-tool footer** - "More Free Tools by Codama" linking between all tools
- **SEO** - JSON-LD, Open Graph, Twitter Cards, canonical URL, robots.txt, sitemap
- **Google Analytics** - Ready to plug in measurement ID
- **Cloudflare Pages** - `_headers`, `_redirects` for optimal caching and SPA routing
- **Biome** - Linting and formatting
- **Husky** - Git hooks

## Quick Start

```bash
# 1. Clone this template
gh repo clone codama-dev/free-tool-template /tmp/my-new-tool
cd /tmp/my-new-tool && rm -rf .git

# 2. Update configuration
# - src/lib/tool-config.ts (name, tagline, URL)
# - index.html (replace TOOL_* placeholders)
# - public/robots.txt (update subdomain)
# - package.json (change name)
# - src/locales/*.json (tool-specific translations)

# 3. Build your tool UI
# Replace src/pages/ToolPage.tsx with your tool's components

# 4. Test
pnpm install && pnpm dev

# 5. Deploy (see full playbook below)
```

## Full Deployment Playbook

See the complete step-by-step process including GA4 setup, Cloudflare Pages deployment, Search Console, and cross-tool linking in the [Free Tool Playbook](https://github.com/codama-dev/codama-ceo/blob/main/operations/processes/free-tool-playbook.md) (private).

## Live Tools Built from This Template

| Tool | URL |
|---|---|
| QR Code Generator | [free-qr-code.codama.dev](https://free-qr-code.codama.dev/) |
| JSON Formatter | [free-json-formatter.codama.dev](https://free-json-formatter.codama.dev/) |

## Built by Codama

[Codama](https://codama.dev) is a software agency that builds web apps, mobile apps, automation, AI integrations, and data solutions.

## License

MIT
