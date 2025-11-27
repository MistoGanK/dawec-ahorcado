document.addEventListener('DOMContentLoaded',(e) =>{
  // HTML elements 
  const btn_game_start = document.getElementById('btn_game_start');
  const btn_log_in = document.getElementById('btn_log_in');
  const btn_leaderboard = document.getElementById('btn_leaderboard');
  const btn_admin = document.getElementById('btn_admin');

// home.js (Ejecutado por index.html que está en la RAÍZ)

// home.js - PRUEBA CON TODOS DENTRO DE PAGES (ASUMIENDO QUE SOLO game.html está en la raíz)

const link_game = './assets/pages/level_select.html'; 
const link_leaderboard = './assets/pages/leaderboard.html'; // Si está en pages/
const link_admin = './assets/pages/admin.html';             // Si está en pages/
const link_log_in = './assets/pages/forms/login/login.html';


  checkUserLogged();
  // Function
  function checkUserLogged() {
    if (localStorage.getItem("currentUser")) {
      // Cambiamos el boton si hay usuario loggeado
      btn_log_in.innerHTML = 'Cerrar Sesión'
      localStorage.clear('currentUser');
    };
  };
    // Redirect
    function redirect_game (){
      window.location = link_game;
      return;
    };
    function redirect_log_in(){
      window.location = link_log_in;
      return;
    };
    function redirect_leaderboard(){
      window.location = link_leaderboard;
      return;
    };
    function redirect_admin(){
      window.location = link_admin;
    }
  
  // Eventos 
  btn_game_start.addEventListener('click',redirect_game);
  btn_log_in.addEventListener('click',redirect_log_in);
  btn_leaderboard.addEventListener('click',redirect_leaderboard);
  btn_admin.addEventListener('click',redirect_admin);

});