# Pulp Atlas — Interactive Cultural Graph

Map-first prototype for navigating the cultural connections around **Pulp Fiction (1994)**.

**Live:** https://alessiomaida.github.io/pulp-atlas/  
**Source:** https://github.com/alessiomaida/pulp-atlas

## What it does

- **One persistent, complete graph:** no Explore/Overview split. All eligible nodes and edges stay in memory.
- **Focus on click:** select any node to center it in the canvas, zoom into its neighbourhood and highlight immediate relationships. Unrelated nodes remain in the wider map.
- **Drag and discover:** elastic D3 force simulation, collision avoidance and interactive panning/zooming.
- **Zoom-aware labels:** distant nodes prioritize thumbnails over unreadable text. Hover or zoom in for labels.
- **Filters:** credits, references, influences and cultural disciplines.
- **Detailed connection cards:** click an edge to see an explanation and its cited source.
- **Media:** Wikipedia/Commons thumbnails, clickable external sources and embedded YouTube content.
- **Backtracking:** breadcrumb navigation along the user's exploration path.

The current **seed corpus contains 110 nodes and 133 typed relationships** spanning films, actors, crew, songs, artists, literature, comics, television, and cultural references. It is an illustrative editorial corpus, not an exhaustive list of all references in the film.

### Important distinction

- A **credit** is a factual production/cast relationship.
- A **reference** can be a visible/audible use, an explicit mention, or a *critical parallel clearly described as such*.
- An **influence** should be documented by credible source material.

The text and source URL attached to an edge should explain which of those claims is being made. Sources cited by the current sample vary in authority and should be audited before treating the corpus as a research-grade knowledge base.

## Codebase

No backend, sign-in, database or API key.

- `index.html` — document and application shell
- `styles.css` — responsive map layout
- `data.js` — initial editorial dataset
- `extended-data.js` — expanded sourced credits, music and cultural relationships
- `app.js` — Cytoscape.js and D3 interactions, filters, image loading, panels
- `tests/smoke.mjs` — browser checks for initial centering, complete graph, click-to-center, dragging and mobile viewport

JavaScript libraries are loaded from public CDNs. Wikipedia/Commons images and YouTube players are fetched externally; media are not copied into the repository. Some articles have no appropriate thumbnail, so category illustrations may be shown.

## Run / deploy

Use a local web server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/. GitHub Pages deploys automatically from `main` to the live URL above.

Both JavaScript integrity validation and browser smoke tests run in GitHub Actions. Browser screenshots are available in the test run artifacts.

## Next steps

Improve visual clustering and label density for larger networks, add stronger provenance with per-assertion evidence and image attribution, and extend beyond the initial film. Prefer validated editorial expansion over generating unsupported reference claims.

**Copyright:** GitHub Pages is publicly accessible even if used primarily for personal experimentation. An image available on Wikipedia is not necessarily Creative Commons; verify individual image licences before promoting or redistributing the site.
