# Pulp Atlas · prototype 01

A map-first cultural discovery prototype starting from **Pulp Fiction (1994)**, connecting cinema, music, people, television, books and comics.

**Repository:** https://github.com/alessiomaida/pulp-atlas

**Planned public URL:** https://alessiomaida.github.io/pulp-atlas/ (only after GitHub Pages is enabled).

## What works

- **Explore**: a focused, progressive graph around one cultural work or person.
- **Overview**: a map of the entire sample graph.
- **Typed relationships**: references/use, credits/collaborations, documented influences.
- **Search** across titles, people and disciplines.
- **Category filters** and a breadcrumb trail for backtracking.
- **Drag any node**: a D3 force simulation moves adjacent nodes elastically, with collision spacing to reduce overlaps.\n- **Click a node** to view contextual notes and adjacent connections.
- **Click an edge** to see *why* two things are connected and open supporting sources.
- **Explore from here** to make another node the focus.
- **Image-rich graph**: Wikipedia article thumbnails (including movie/poster art where supplied) are loaded in batches; Wikimedia Commons search supplies additional images. If no matching image is found, a readable category illustration remains. Thumbnails are external URLs; nothing is uploaded to the repository.\n- **Media panel** with the same images and privacy-enhanced embedded YouTube clips; video players load only after a user click.
- Responsive desktop/mobile layout.

The seed dataset is curated and incomplete; individual connections should be critically reviewed and expanded. The source URL attached to each relationship is a starting point for verification, not a claim that every source is primary.

## Tech stack

Static HTML + CSS + vanilla JavaScript, with Cytoscape.js and D3 Force loaded from jsDelivr. **No backend, API keys, database, package manager, or build stage.**

- `index.html`: application structure
- `styles.css`: responsive cinematic map interface
- `data.js`: typed editorial nodes, links, annotations, sources
- `app.js`: graph rendering, interaction, filters, search and media

For this first version, static JS is more straightforward than introducing React/Vite. If the prototype proves useful, the same model can be migrated into a component-based frontend.

## Publishing on GitHub Pages (one-time)

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then **Save**.
4. Allow GitHub to build the site; open https://alessiomaida.github.io/pulp-atlas/.

All CSS and JS URLs are relative (`./`), so the site works under `/pulp-atlas/`. Subsequent commits to main update the site.

## Local preview

Open `index.html` from a local static HTTP server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000. An Internet connection is required for the Cytoscape CDN, Wikipedia images, Google Fonts, and YouTube embed.

## Content principles

- Differentiate **entities** (films, people, songs, books) from **relationships** (citation, credit, influence).
- A cultural relationship must have its **own description and source**.
- Avoid presenting visual resemblance as proven historical influence.
- Default to local exploration; do not render every node at once.
- Load remote media on demand and do not bundle copyrighted movie clips or audio files.
- Wikipedia thumbnails and external media remain subject to their original licenses and providers' embed policies.

## Browser verification\n\nGitHub Actions runs a JavaScript/data integrity check and a Chromium smoke test. The browser test attempts node dragging, overview rendering, and mobile layout; screenshots are attached as GitHub Actions artifacts. The page can be opened with \`?debug=1\` for read-only graph diagnostics.\n\n**Important:** GitHub Pages is publicly accessible even if you intend to use the atlas only personally. Wikipedia thumbnails can have different rights, including non-free cover art. Confirm usage permissions and attribution before promoting the site to a public audience. The prototype avoids copying media files.\n\n## Next iteration

Improve visual node thumbnails, add clustered and hierarchical layouts, richer media embeds (Vimeo and authorized audio players), sources per individual assertion, media-license review, timeline filters and saved paths. A data-quality pass should precede large-scale AI-assisted enrichment.
