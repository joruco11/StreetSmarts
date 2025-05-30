let puzzleData;
let guessCount = 0;
const MAX_GUESSES = 5;
let map;

async function loadPuzzle() {
  try {
    const response = await fetch("puzzles.json");
    const puzzles = await response.json();
    puzzleData = puzzles[Math.floor(Math.random() * puzzles.length)];
    initMap();
    updateUI();
  } catch (err) {
    console.error("Failed to load puzzles.json", err);
  }
}

function initMap() {
  map = L.map("map", {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  }).setView([puzzleData.lat, puzzleData.lon], puzzleData.zoom);

  const basemap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
    }
  ).addTo(map);

  window.labelsLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  });
}

function updateUI() {
  document.getElementById("guessCounter").textContent = `Guess: ${guessCount} / ${MAX_GUESSES}`;
}

function checkGuess(userGuess) {
  guessCount++;
  updateUI();
  const resultDiv = document.getElementById("result");
  const hintsDiv = document.getElementById("hints");

  if (userGuess.trim().toLowerCase() === puzzleData.answer.toLowerCase()) {
    resultDiv.innerHTML = `<p>✅ Correct! Today's city is <strong>${puzzleData.answer}</strong>.</p>`;
    document.getElementById("guessForm").style.display = "none";
    hintsDiv.innerHTML = "";
  } else {
    resultDiv.innerHTML = `<p>❌ Try again!</p>`;

    if (guessCount === 2) {
      map.addLayer(window.labelsLayer);
      hintsDiv.innerHTML = `<p>🛈 Hint: Road labels revealed.</p>`;

      map.options.maxZoom = puzzleData.zoom + 2;
      map.options.minZoom = puzzleData.zoom;
      map.setMaxBounds(map.getBounds());
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();

      map.on("move", () => {
        map.setView([puzzleData.lat, puzzleData.lon], map.getZoom(), { animate: false });
      });
    } else if (guessCount === 4) {
      hintsDiv.innerHTML += `<p>📍 Hint: It's in ${puzzleData.region || "the region"}.</p>`;
    } else if (guessCount >= MAX_GUESSES) {
      resultDiv.innerHTML = `<p>❌ No more guesses! The answer was <strong>${puzzleData.answer}</strong>.</p>`;
      document.getElementById("guessForm").style.display = "none";
      hintsDiv.innerHTML = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPuzzle();

  document.getElementById("guessForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (guessCount >= MAX_GUESSES) return;
    const guess = document.getElementById("guessInput").value;
    checkGuess(guess);
    document.getElementById("guessInput").value = "";
  });
});
