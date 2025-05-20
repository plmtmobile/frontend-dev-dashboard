const API_BASE = "https://mp-dashboard-backend.onrender.com";

function loadGames() {
  const apiKey = document.getElementById("apiKey").value.trim();
  if (!apiKey) return alert("Missing API key");

  fetch(API_BASE + "/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) return alert("❌ " + data.error);
    document.getElementById("dashboard").classList.remove("hidden");
    const list = document.getElementById("gamesList");
    list.innerHTML = "";
    data.games.forEach(g => {
      const item = document.createElement("li");
      item.textContent = `${g.name} (${g.min_players}-${g.max_players} players)`;
      list.appendChild(item);
    });
  });
}

function createGame() {
  const apiKey = document.getElementById("apiKey").value.trim();
  const name = document.getElementById("gameName").value.trim();
  const min = parseInt(document.getElementById("minPlayers").value);
  const max = parseInt(document.getElementById("maxPlayers").value);

  if (!name || !min || !max) return alert("Please fill all fields");

  fetch(API_BASE + "/game/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, name, min_players: min, max_players: max })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) return alert("❌ " + data.error);
    alert("✅ Game created!");
    loadGames();
  });
}
