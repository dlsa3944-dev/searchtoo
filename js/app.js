/* ========================= */
/* 🔎 UTIL */
/* ========================= */

function isURL(text) {
  return text.includes(".") && !text.includes(" ");
}

/* ========================= */
/* 🧠 HISTÓRICO */
/* ========================= */

function saveSearch(query) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");

  history.unshift({
    query,
    date: new Date().toLocaleString()
  });

  history = history.slice(0, 20);

  localStorage.setItem("history", JSON.stringify(history));
}

/* ========================= */
/* 🔎 IR PARA BUSCA */
/* ========================= */

function goSearch() {
  let q = document.getElementById("searchBox").value.trim();

  if (!q) return notify("Digite algo", "error");

  if (isURL(q)) {
    if (!q.startsWith("http")) q = "https://" + q;
    window.location.href = q;
    return;
  }

  saveSearch(q);

  window.location.href = "search.html?q=" + encodeURIComponent(q);
}

/* ========================= */
/* 🔎 BUSCA PRINCIPAL */
/* ========================= */

async function runSearch(query) {
  const div = document.getElementById("results");
  div.innerHTML = "Carregando...";

  let pages = DB.pages.concat(
    JSON.parse(localStorage.getItem("pages") || "[]")
  );

  let results = pages.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.content.toLowerCase().includes(query.toLowerCase())
  );

  /* ========================= */
  /* 🌍 FALLBACK WIKIPEDIA */
  /* ========================= */

  if (results.length <= 10) {
    try {
      const res = await fetch(
        "https://en.wikipedia.org/w/rest.php/v1/search/page?q=" +
        encodeURIComponent(query) +
        "&limit=10"
      );

      if (!res.ok) throw new Error("Erro na API Wikipedia");

      const data = await res.json();

      if (data.pages) {
        data.pages.forEach(p => {
          results.push({
            title: p.title.replace(/_/g, " "),
            content:
              p.excerpt?.replace(/<[^>]+>/g, "") ||
              p.description ||
              "Resultado da Wikipédia",
            link: "https://en.wikipedia.org/wiki/" + p.key
          });
        });
      }

    } catch (err) {
      console.warn("Fallback Wikipedia falhou:", err);
    }
  }

  /* ========================= */
  /* 📄 RENDER RESULTADOS */
  /* ========================= */

  div.innerHTML = "";

  if (results.length === 0) {
    notify("Nenhum resultado encontrado", "info");
  }

  results.forEach(r => {
    div.innerHTML += `
      <div class="result">

        ${
          r.link
          ? `<small>${r.link}</small>`
          : `<small>SearchToo</small>`
        }

        <h3>
          ${
            r.link
            ? `<a href="${r.link}" target="_blank">${r.title}</a>`
            : r.title
          }
        </h3>

        <p>${r.content}</p>

      </div>
    `;
  });

  notify(results.length + " resultados", "success");
}

/* ========================= */
/* 🔥 DISCOVER (HOME) */
/* ========================= */

function formatTitle(title) {
  return title
    .replace(/_/g, " ")
    .replace(/\(.*?\)/g, "")
    .trim();
}

async function loadDiscover() {
  const container = document.getElementById("discover");
  if (!container) return;

  container.innerHTML = "Carregando tendências...";

  try {
    const today = new Date();

    const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${
      today.getFullYear()
    }/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;

    const res = await fetch(url);

    if (!res.ok) throw new Error("Erro na API");

    const data = await res.json();

    let articles = data.mostread.articles.slice(0, 6);

    container.innerHTML = "";

    articles.forEach((a, i) => {
      container.innerHTML += `
        <div class="discover-card">

          <div class="discover-rank">#${i+1} em alta</div>

          ${
            a.thumbnail
            ? `<img src="${a.thumbnail.source}" class="discover-img">`
            : ""
          }

          <div class="discover-content">
            <h3>
              <a href="${a.content_urls.desktop.page}" target="_blank">
                ${formatTitle(a.title)}
              </a>
            </h3>

            <p>${a.extract || ""}</p>
          </div>

        </div>
      `;
    });

  } catch (err) {
    console.error("Erro Discover:", err);

    container.innerHTML = `
      <div class="discover-card">
        <div class="discover-content">
          <h3>Erro ao carregar tendências</h3>
        </div>
      </div>
    `;

    notify("Erro ao carregar Discover", "error");
  }
}