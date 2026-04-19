// 🔥 tendências internas
function loadLocalTrends() {
  let history = JSON.parse(localStorage.getItem("history") || "[]");

  let count = {};

  history.forEach(h => {
    let q = h.query.toLowerCase();
    count[q] = (count[q] || 0) + 1;
  });

  let sorted = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  let div = document.getElementById("local-trends");
  div.innerHTML = "";

  if (sorted.length === 0) {
    div.innerHTML = "Nenhuma tendência ainda";
    return;
  }

  sorted.forEach(([query, num], i) => {
    div.innerHTML += `
      <div class="result">
        #${i+1} <b>${query}</b> (${num} buscas)
      </div>
    `;
  });
}


// 🌍 tendências globais (Wikipedia)
async function loadGlobalTrends() {
  try {
    const res = await fetch("https://en.wikipedia.org/api/rest_v1/feed/featured/2024/01/01");
    const data = await res.json();

    let div = document.getElementById("global-trends");
    div.innerHTML = "";

    let articles = data.mostread.articles.slice(0, 10);

    articles.forEach((a, i) => {
      div.innerHTML += `
        <div class="result">
          #${i+1} <b>${a.title}</b>
        </div>
      `;
    });

  } catch {
    notify("Erro ao carregar tendências globais", "error");
  }
}