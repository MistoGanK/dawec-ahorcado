// Promise, async / await

// Simular servidor con asyncronia
function fetchProductsAsync(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve([
      {id:1,name:'Peplota de futbol',price:100},
      {id:2,name:'Peplota de tenis',price:10},
      {id:3,name:'Peplota de tuyas',price:1000}
      ])
    },3000);
  });
};

// Mostrar productos con asyncronia
async function displayProducts(){
  const productos = document.getElementById('products');
  productos.innerHTML = 'Cargando Productos...Mamahuevo';

  // Llamada No bloqueante
  const productsFunctions = await fetchProductsAsync();
   productos.innerHTML = productsFunctions.map((p)=>{
     return `<p>${p.name} - ${p.price}€</p>`
    }).join("");
};

document.getElementById('addProductForm').addEventListener('submit',async(e)=>{
  e.preventDefault();
  console.log("ME MATO");
  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;

  // Simular guardado en servidor
  await new Promise((resolve)=>{
    setTimeout(resolve,1000);
    alert(`Producto añadido: ${name} - ${price}`);
    document.getElementById('addProductForm').reset();

    displayProducts();
  })
    displayProducts();
});