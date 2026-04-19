function notify(msg, type="info") {
  const el = document.createElement("div");
  el.className = "notify " + type;
  el.innerText = msg;

  document.getElementById("notify-container").appendChild(el);

  setTimeout(() => el.remove(), 5000);
}