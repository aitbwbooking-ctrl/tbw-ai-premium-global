# TBW AI PREMIUM NAVIGATOR (bundle V2)

This repository contains the front-end bundle for **TBW AI PREMIUM NAVIGATOR**.

- React + Vite
- PWA (service worker + manifest)
- Intro video splash (`public/intro.mp4`)
- Fixed header + ticker + hero + navigation cards
- Multi-language UI (HR / EN / DE fully, others fallback to EN)
- Three modes: Trial / Demo / Premium (UI level)
- Structural `TBW_NavEngine` stub for future full navigation engine

## How to run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (e.g. http://localhost:5173).

## Deploy to Vercel

1. Push this folder to a public or private GitHub repository.
2. On Vercel, create a New Project and select that repository.
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`

## Licensing & IP notice

All TBW-related concepts, naming, and UX flows are owned by:

**Dražen Halar – Founder & IP Owner TBW**  
Contact: **ai.tbw.booking@gmail.com**

This app is an **informational assistant only**.  
It does **not** replace official traffic, weather, maritime or aviation sources.  
Always obey road signs, local laws, police instructions and official emergency services.

Any future implementation of:
- automatic emergency calls,
- safety / child mode,
- violence or accident detection,
- health-related advice,

must be tested, certified where required, and implemented in compliance with all applicable laws and regulations. The current front‑end bundle contains only **visual structure and stubs**, without real automatic emergency actions.
