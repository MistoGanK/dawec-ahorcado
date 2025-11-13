document.addEventListener('DOMContentLoaded',(e) =>{
  // HTML elements 
  const btn_game_start = document.getElementById('btn_game_start');
  const btn_log_in = document.getElementById('btn_log_in');
  
  // Routes 
  const link_game = '/assets/pages/level_select.html';
  const link_log_in = '/assets/pages/forms/login/login.html';

  // Function
    // Redirect
    function redirect_game (){
      window.location = link_game;
      return;
    };
    function redirect_log_in(){
      window.location = link_log_in;
      return;
    };
  
  // Eventos 
  btn_game_start.addEventListener('click',redirect_game);
  btn_log_in.addEventListener('click',redirect_log_in);
});