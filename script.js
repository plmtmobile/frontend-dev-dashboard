const API_BASE = "https://mp-dashboard-backend.onrender.com";
let currentApiKey = "";

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(API_BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.apiKey) {
      currentApiKey = data.apiKey;
      document.getElementById("login-section").classList.add("hidden");
      document.getElementById("dashboard-section").classList.remove("hidden");
      loadGames();
    } else {
      alert("❌ " + (data.error || "Login failed"));
    }
  });
}

function loadGames() {
  fetch(API_BASE + "/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey })
  })
  .then(r => r.json())
  .then(data => {
    const list = document.getElementById("gamesList");
    list.innerHTML = "";
    data.games.forEach(g => {
      const item = document.createElement("li");
      item.classList.add("flex", "gap-2", "items-center");
      item.innerHTML = `
        <input value="${g.name}" id="name-${g.id}" class="p-1 border rounded w-1/3" />
        <input type="number" value="${g.min_players}" id="min-${g.id}" class="p-1 border rounded w-1/5" />
        <input type="number" value="${g.max_players}" id="max-${g.id}" class="p-1 border rounded w-1/5" />
        <button onclick="updateGame('${g.id}')" class="text-xs px-2 py-1 bg-yellow-400 rounded">💾</button>
        <button onclick="deleteGame('${g.id}')" class="text-xs px-2 py-1 bg-red-500 text-white rounded">🗑️</button>
      `;
      list.appendChild(item);
    });
  });
}

function createGame() {
  const name = document.getElementById("gameName").value.trim();
  const min = parseInt(document.getElementById("minPlayers").value);
  const max = parseInt(document.getElementById("maxPlayers").value);
  if (!name || !min || !max) return alert("Please fill all fields");

  fetch(API_BASE + "/game/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey, name, min_players: min, max_players: max })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) return alert("❌ " + data.error);
    alert("✅ Game created");
    loadGames();
  });
}

function updateGame(id) {
  const name = document.getElementById(`name-${id}`).value;
  const min = parseInt(document.getElementById(`min-${id}`).value);
  const max = parseInt(document.getElementById(`max-${id}`).value);

  fetch(API_BASE + "/game/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey, game_id: id, name, min_players: min, max_players: max })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) return alert("❌ " + data.error);
    alert("✅ Game updated");
    loadGames();
  });
}

function deleteGame(id) {
  if (!confirm("Delete this game?")) return;
  fetch(API_BASE + "/game/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: currentApiKey, game_id: id })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) return alert("❌ " + data.error);
    alert("🗑️ Game deleted");
    loadGames();
  });
}
