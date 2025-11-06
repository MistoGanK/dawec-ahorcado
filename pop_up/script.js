const button = document.querySelector('button');
// console.log(button);
const contenedor_pop_up = document.querySelector('.contenedor_pop_up');
// console.log(contenedor_pop_up);
const cierra_pop_up = document.querySelector('.cierra_pop_up');
// console.log(cierra_pop_up);
const body = document.querySelector('body');

const button_pop = document.getElementById('button_pop');

// form container
const formContainer = document.querySelector('.contenidor');
console.log(formContainer);

button.addEventListener('click',(e)=>{
  contenedor_pop_up.style.display = 'block';

});

cierra_pop_up.addEventListener('click',()=>{
  contenedor_pop_up.style.display = 'none';
  formContainer.style.display = 'flex';
  button_pop.style.display = 'none';

});

contenedor_pop_up.addEventListener('click',(e)=>{
    contenedor_pop_up.style.display = 'none';
    contenedor_pop_up.innerHTML = "HOLA";
});
