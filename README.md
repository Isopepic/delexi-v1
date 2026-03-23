# Delexi

> *Veni, Vidi, **Delexi** !*

Delexi is a web app that lets you rate and review any Spotify playlist, then export your review as a polished PNG image or PDF.

---

## What it does

1. Paste a Spotify playlist URL on the home page.
2. Delexi fetches the playlist (title, cover, tracks, artists, durations) via a proxy.
3. For each song, assign a grade from 0 to 10 and describe it in one word.
4. The app computes the average grade in real time.
5. Write a general appreciation note for the whole playlist.
6. Export the review as:
   - **PNG image** — a shareable snapshot of your review
   - **PDF** — a formatted document with a cover page and 2 songs per page

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS modules + inline styles |
| Icons | lucide-react |
| Image export | html-to-image |
| PDF export | @react-pdf/renderer |
| Routing | URL query params (`?playlist=<id>`) |
| API proxy | Node.js backend on Render (`delexi-proxy.onrender.com`) |
| Hosting | Vercel |

---

## Project structure

```
src/
  pages/
    Home.jsx          # Landing page with URL input
    AnalysisPage.jsx  # Playlist review page
  components/
    SongCard.jsx      # Individual track card (grade + word)
    PlaylistPDF.jsx   # PDF document layout
  utils.js            # Spotify playlist ID extractor
  style.css
```

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install & run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

---

## How the Spotify integration works

Delexi does **not** call the Spotify API directly from the browser. Instead it calls a proxy server that handles Spotify OAuth (Client Credentials flow) and returns the playlist data. The proxy is hosted at `https://delexi-proxy.onrender.com`.

Endpoint used: `GET /api/playlist/:playlistId`

Response shape:
```json
{
  "name": "Playlist name",
  "owner": "Username",
  "image": "https://...",
  "tracks": [
    {
      "id": "...",
      "name": "Song title",
      "artist": "Artist name",
      "duration_ms": 210000,
      "external_url": "https://open.spotify.com/track/..."
    }
  ]
}
```

---

## Grade color scale

| Grade | Color |
|---|---|
| 0 – 1 | Dark red |
| 2 – 3 | Firebrick |
| 4 | Dark orange |
| 5 – 6 | Gold |
| 7 – 8 | Yellow-green |
| 9 – 10 | Dark green |

---

## Deployment

The app is live at **https://delexi-v1.vercel.com**.

Hosted on Vercel. The `vercel.json` rewrites all routes to `/` so client-side routing works correctly.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
