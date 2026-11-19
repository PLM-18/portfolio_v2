# Philemon Muleya · 3D Portfolio

An Xbox-inspired developer portfolio built with React, JavaScript, and Vite. The site runs as a static frontend. Portfolio content lives in the repository, and the browser handles the 3D scenes, game, and audio.

## Explore the portfolio

1. Wait for the setup to load, then drag the Xbox Elite controller to rotate it.
2. Click the highlighted **A** button on the model, press **A** on your keyboard, or select **Press A** below the controller.
3. Select **Start Game** on the TV to open the room. The TV menu leads to About, Projects, and Contact.

The desk props open a reaction-time game, a map link for Pretoria, a media gallery, and a synth radio. The lamp and Xbox console switch the room between day and night. Gallery uploads stay in the browser for the current gallery session. The dashboard tiles can be rearranged, and their order is saved in the browser.

## Run locally

Use Node.js 20.19 or later within the 20.x line, or Node.js 22.12 or later. No environment variables or backend are required for the portfolio.

```bash
cd frontend
npm ci
npm run dev
```

Open the local URL printed by Vite.

```bash
npm run lint
npm run build
npm run preview
```

Run these commands from `frontend/`. The build writes static files to `frontend/dist/`, and the preview command serves that build locally.

## Edit the portfolio

| File or directory | What to edit |
| --- | --- |
| [`frontend/src/data/portfolioData.js`](frontend/src/data/portfolioData.js) | Profile, projects, skills, education, and credentials |
| [`frontend/src/GameRoom.jsx`](frontend/src/GameRoom.jsx) and [`room.css`](frontend/src/room.css) | Controller intro, TV menu, desk props, and room lighting |
| [`frontend/src/App.jsx`](frontend/src/App.jsx) | Portfolio panels, dashboard tiles, and media gallery |
| [`frontend/src/hooks/useSound.js`](frontend/src/hooks/useSound.js) | Browser-generated synth loops and interaction sounds |
| [`frontend/public/`](frontend/public/) | Résumé, static assets, and Xbox GLB models |

The controller's A target is positioned in the model's 3D coordinate space. If you replace the controller GLB, update `aButtonPosition` in `GameRoom.jsx` to match the new model. The page loads Google's `<model-viewer>` from a CDN. If the controller fails to load, the **Press A** control still opens the TV.

## Deployment

The [GitHub Pages workflow](.github/workflows/deploy.yml) builds the frontend on pushes to `main` and publishes `frontend/dist/` to the `gh-pages` branch. The custom domain is set in [`frontend/public/CNAME`](frontend/public/CNAME). A [separate workflow](.github/workflows/lint.yml) runs ESLint on pushes to `main` and pull requests targeting it.

## Model credits

- Xbox Elite controller by [ENKI 360°](https://sketchfab.com/ENKI_360). [Model source](https://sketchfab.com/3d-models/xbox-elite-d93405595eea48a483eb57ae10eceb20) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Xbox Series X console by [jordanger88](https://sketchfab.com/jordanger88). [Model source](https://sketchfab.com/3d-models/xbox-series-x-console-e983b0e9ef984aa6934176e310b7f0f2) · [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
