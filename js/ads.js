function getAllAds() {
  let localAds = JSON.parse(localStorage.getItem("ads") || "[]");
  return DB.ads.concat(localAds);
}

function renderAds(containerId = "ads-container", limit = 3) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let ads = getAllAds();

  if (ads.length === 0) return;

  // embaralhar (simples)
  ads = ads.sort(() => Math.random() - 0.5);

  ads.slice(0, limit).forEach(ad => {
    container.innerHTML += `
      <div class="ad">
        <strong>Anúncio</strong><br>
        ${ad.title}<br>
        <small>${ad.link}</small>
      </div>
    `;
  });
}