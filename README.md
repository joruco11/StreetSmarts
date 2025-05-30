# StreetSmarts

StreetSmarts is a daily geography puzzle game where players guess major cities based on their road networks.

## How to run locally

1. Clone or download the repository.
2. Open `index.html` in your browser (no server needed for basic play).
3. The puzzle data is currently static; future versions may fetch puzzles by date.

## How to deploy on GitHub Pages

1. Push your project to a GitHub repository.
2. Go to the repository Settings > Pages.
3. Choose the `main` branch and `/root` folder.
4. Save and wait a minute; your game will be live at `https://<yourusername>.github.io/<repo>/`.

---

## How it works

- The map shows a daily mystery city using Leaflet with a roads-only tile layer.
- Players type their guess; after 2 wrong guesses, road labels appear as hints.
- After 4 wrong guesses, a region hint appears.
