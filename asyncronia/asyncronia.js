// Simular de un servidor con tiempo de espera
function fetchProductSync(){
  const start = Date.now();

  while(Date.now() - start < 10000){
    console.log("cargando");
  }
  return [
    {id:1,name:'Peplota de futbol',price:100},
    {id:2,name:'Peplota de tenis',price:10},
    {id:3,name:'Peplota de tuyas',price:1000},
  ]
};

// Mostar los productos sin asyncronia
function displayProducts (){
  const productos = document.getElementById('products');
  productos.innerHTML = '<p>Cargando Productos...Mamahuevo</p>';

  // Llamada bloqueante
  const productsFunctions = fetchProductSync();
  productos.innerHTML = productsFunctions.map((p)=>{
      `<p>${p.name} - ${p.price}€</p>`
    }).join("");

};

document.getElementById('addProductForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  console.log("ME MATO");
  displayProducts();
});
