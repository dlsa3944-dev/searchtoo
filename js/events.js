function formatTitle(title) {
  return title
    .replace(/_/g, " ")
    .replace(/\(.*?\)/g, "")
    .trim();
}

async function loadEvents() {
  try {
    const today = new Date();

    const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${
      today.getFullYear()
    }/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;

    const res = await fetch(url);
    const data = await res.json();

    const div = document.getElementById("events");
    if (!div) return;

    div.innerHTML = "<h3>🔥 Em alta hoje</h3>";

    let articles = data.mostread.articles.slice(0, 10);

    articles.forEach((a, i) => {
      const title = formatTitle(a.title);
      const desc = a.extract || "Sem descrição";
      const link = a.content_urls.desktop.page;
      const img = a.thumbnail ? a.thumbnail.source : "";

      div.innerHTML += `
        <div class="trend-item">

          <div class="trend-rank">#${i+1}</div>

          ${img ? `<img src="${img}" class="trend-img">` : ""}

          <div class="trend-content">
            <a href="${link}" target="_blank">${title}</a>
            <p>${desc}</p>
          </div>

        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    notify("Erro ao carregar tendências", "error");
  }
}