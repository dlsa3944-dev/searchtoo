function register() {
  let user = userInput();
  let pass = passInput();

  let users = JSON.parse(localStorage.getItem("users")||"[]");

  users.push({user,pass,bio:"",avatar:""});

  localStorage.setItem("users",JSON.stringify(users));
  notify("Conta criada","success");
}

function login() {
  let user = userInput();
  let pass = passInput();

  let users = JSON.parse(localStorage.getItem("users")||"[]");

  let found = users.find(u=>u.user===user && u.pass===pass);

  if(!found) return notify("Erro","error");

  localStorage.setItem("loggedUser",JSON.stringify(found));
  notify("Logado","success");

  setTimeout(()=>location="dashboard.html",1000);
}

function logout(){
  localStorage.removeItem("loggedUser");
  location="index.html";
}

function userInput(){return document.getElementById("user").value;}
function passInput(){return document.getElementById("pass").value;}