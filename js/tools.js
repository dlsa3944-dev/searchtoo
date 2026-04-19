function createPage(){
  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;
  let tags = document.getElementById("tags").value.split(",");

  if (!title || !content) {
    notify("Preencha tudo", "error");
    return;
  }

  let pages = JSON.parse(localStorage.getItem("pages")||"[]");

  pages.push({title,content,tags});

  localStorage.setItem("pages",JSON.stringify(pages));

  notify("Página criada","success");
}

function createAd(){
  let title = document.getElementById("adTitle").value;
  let link = document.getElementById("adLink").value;

  if (!title || !link) {
    notify("Preencha tudo", "error");
    return;
  }

  let ads = JSON.parse(localStorage.getItem("ads")||"[]");

  ads.push({title,link});

  localStorage.setItem("ads",JSON.stringify(ads));

  notify("Anúncio criado","success");
}