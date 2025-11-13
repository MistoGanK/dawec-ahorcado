window.addEventListener('DOMContentLoaded',(e)=>{
// HTML elements
const form_select_level = document.getElementById('form_select_level');
const category = document.getElementById('category');
const dififulty_level = document.getElementById('dififulty_level');
const level_p = document.getElementById('level_p');

// Links
const game_href = '/game.html';
// Constants
const diffuculty_levels = ['Facil','Medio','Dificil'];
// FUNCTIONS
function p_level_change (){
  let i = dififulty_level.value;
  level_p.innerHTML = diffuculty_levels[i];
};
// EVENTS
  // Event change difficulty
dififulty_level.addEventListener('mousemove',p_level_change);
  // Prevent submit and retrieve inputs values
form_select_level.addEventListener('submit',(e)=>{
  e.preventDefault();
  // Save category & category to local > start game 
  // Chosing will always set again the diffulty and category
  localStorage.setItem('difficulty',dififulty_level.value);
  localStorage.setItem('category',category.value);
  console.log(localStorage.getItem("difficulty"));
  console.log(localStorage.getItem("category"));
  // Redirect
  window.location = game_href;
});

// Initialize p_difficulty
p_level_change();

});