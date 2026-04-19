let DB = { pages: [], users: [], ads: [] };

async function loadDB() {
  DB.pages = await fetch("data/pages.json").then(r=>r.json());
  DB.users = await fetch("data/users.json").then(r=>r.json());
  DB.ads = await fetch("data/ads.json").then(r=>r.json());
}

loadDB();