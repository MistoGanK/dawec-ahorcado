window.addEventListener("DOMContentLoaded", () => {
  /* Juego del Ahorcado condiciones:
    - Generar Palabras aleatorioas
    - Insertar los caracteres de la palabra aleatorioa al HTML de manera oculta
    - El juego finaliza si bien:
        -> El jugador a alcertado los caracteres de la palabra y no a superado el limite de errores
        -> El jugador a Superado el limite de errores antes de completar los caracteres de la palabra
    - Necesita saber que clicka o teclea el usuiaro para posteriormente hacer la comprovación
    
*/

  // --- HTML ELEMENTS

  // Contenedor padre de los caracteres secretos
  const secretWord = document.querySelector(".secret-word");
  // Contenedor ABC
  const abc = document.querySelector(".abc");
  // Contenedor error-count
  const error_count = document.querySelector("#error-count");
  // Contenedor timer
  const h2Timer = document.querySelector(".time");
  // Contenedor reuslt
  const reuslt = document.querySelector(".reuslt");

  // Links

  const home_href = "/index.html";

  // Endpoints

  // db.json
  const hrefDbJson = "/assets/db/db.json";

  // -- Variables

  // Sistema de guardado en ARRAY, el sistema para añadir mas frases sera a travez de .push()
  const frases = [];
  // Guardamos la frase del indice selecionado
  var fraseSelecionada;
  // Guardamos la cantidad de caracteres de la frase selecionada
  var cantidadCaracteres;

  // Async function tratada como sincrona
  async function iniciarJuego (hrefDbJson){
    try{
      // Ingresamos nuestros datos json de nuestra db
      const response = await fetch(hrefDbJson);
      // Comprovar que se hayan cargado correctamente
      if (!response.ok){
        console.log("Error al cargar los datos: ",response.status);
        return;
      }else{
        // Convertimos la respuesta en objeto json
        const data = await response.json();
        // console.log(data);

        // Filtrado por dificultad y categoria
        const dificultadEligida = parseInt(localStorage.getItem('difficulty'));
        const categoriaEligida = localStorage.getItem('category');

        // Obtención de las key-value de phrase
        const palabraDb = data.phrases;
        // console.log(frasesDb);

        // Mapea e itera por los objetos del array de objetos phrases
        const palabrasMapeadas = palabraDb.map((palabra)=>{
          if(palabra.difficulty == dificultadEligida && palabra.category == categoriaEligida){
            frases.push(palabra.phrase);
          }
        });
        // Generar la random palabra una vez tengamos el array de palabras
        generarRandPalabra();
      };
    }catch(error){
      console.log("Error al cargar las frases: ",error);
      return;
    };
  };

  // Constantes de conversión para el timer
  let tiempoTotalMs = 0;
  const ms_por_segundo = 1000;
  const ms_por_minuto = 60 * ms_por_segundo;
  const ms_por_hora = 60 * ms_por_minuto;
  let cronometro;
  let cronometroIniciado = false; // Falso por default
  let cronometroParado = false; // Falso por default

  // Obtenemos el indice(frase) de nuestra array

  // -- Functions

  // Redirigir si el usuario no ha selecionado nivel (Bypass por ruta)
  if (
    !localStorage.getItem("difficulty") &&
    !localStorage.getItem("category")
  ) {
    window.location = home_href;
  }

  // Randomizador de palabras
  function randomPalabra(frase) {
    var selecionIndice = Math.floor(Math.random() * frase.length);
    console.log("indice:", selecionIndice);
    return frase[selecionIndice];
  }
  function generarRandPalabra (){
    // Ahora generamos una palabra random
      fraseSelecionada = randomPalabra(frases);
      console.log("frase selecionada:", fraseSelecionada);
      cantidadCaracteres = fraseSelecionada.length;
      // Una vez obtenido la random palabra generamos las palabra secreta en pantalla
      while (i < cantidadCaracteres) {
        // Creamos elemento p que se guarda en memoria
        var newP = document.createElement("p");

        // Le añadimos su contenido
        newP.innerHTML = "-";

        // Le añadimos su clase style
        newP.classList.add("secret-letter");

        // Añadimos el nuevo elemnto p en memoria a nuestro HTML, en su contenedor padre
        secretWord.appendChild(newP);

        i++;
      }
  }
  // Cronometro
  const pad = (num, length = 2) => {
    return String(num).padStart(length, "0");
  };

  function contador() {
    // Solo
    if (cronometroParado == false) {
      // Corre cada 10ms
      tiempoTotalMs += 10;
      // Calculo de unidades
          
    // Horas
    let horas = Math.floor(tiempoTotalMs / ms_por_hora);
    
    // Minutos
    let minutos = Math.floor((tiempoTotalMs % ms_por_hora) / ms_por_minuto);

    // Segundos
    let segundos = Math.floor((tiempoTotalMs % ms_por_minuto) / ms_por_segundo);
    
    // Milisegundos
    let miliSegundos = tiempoTotalMs % ms_por_segundo;

      h2Timer.innerHTML = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}.${pad(
        miliSegundos,
        3
      )}`;
    }
  }
  function iniciarContador() {
    if (cronometroIniciado == false) {
      // console.log("Iniciar detectado");
      cronometro = setInterval(contador, 10);
      cronometroIniciado = true;
    }
  }
  // Stop cronometro
  function pararContador() {
    // Cambiamos el estado a false
    cronometroParado = true;
    clearInterval(cronometro);
  }
  // La etiqueta p contendra dentro el caracter

  var i = 0;
  // Nota el while NO es para guardar los caracteres, sino para imprimir en pantalla los -
  // Para hacer la comprobación uno a uno lo sacaremos del NodeList de los elementos padres de su contenedor

  // Capturamos los elementos <p></p> creados
  const htmlP = document.getElementsByClassName("secret-letter");

  // Creamos la logica de evento
  // Variable que guardaremos cuantas letras se han desvelado

  let letrasDesveladadas = 0;
  let contradorLetrasDesv = 0;
  let errores = 0;

  function comprovarLetra(e) {
    // Iteramos sobre nuestra array
    var i = 0;

    // Debug
    // console.log(e.target); 

    // Iteramos indice por indice sobre la palabra
    while (i < cantidadCaracteres) {
      // Comprovamos el caso de que SI ha acertado la letra
      if (e.target.textContent == fraseSelecionada[i]) {
        console.log(fraseSelecionada[i]);
        htmlP[i].innerHTML = fraseSelecionada[i];
        letrasDesveladadas++;
        console.log(letrasDesveladadas);
        e.target.poin;
      } else {
      }
      i++;
    }
    // Una vez acabada la iteración comprovamos si no habido un aumento en letras desveladas = error
    if (letrasDesveladadas > contradorLetrasDesv) {
      contradorLetrasDesv = letrasDesveladadas;

      // Debug
      // console.log(contradorLetrasDesv);
    } else {
      errores += 1;
      console.log(errores);
      error_count.innerHTML = errores;

      // Debug
      // console.log("errores",errores);
    }

    // Condiciones para finalizar el juego

    // Comprovamos si se cumple la condicion de ganar
    if (letrasDesveladadas == fraseSelecionada.length) {
      pararContador();
      var reusltP = document.createElement("p");
      reusltP.textContent = "Victoria";
      reuslt.appendChild(reusltP);
      abc.style.pointerEvents = "none";
      // Debug
      // console.log("MUY BIEN CAMPEON");
    }
    // Comprovamos si se cumple la condición para perder
    if (errores == 6) {
      pararContador();
      var reusltP = document.createElement("p");
      reusltP.textContent = "Derrota";
      reuslt.appendChild(reusltP);
      abc.style.pointerEvents = "none";
      // Debug
      // console.log("Muerte");
    }
  }; 

  // Inició juego
  iniciarJuego(hrefDbJson);

  abc.addEventListener("click", (e) => {
    // Logica de captura de las lettras, solo escucha si ha clickado el div de las letras
    if (e.target.classList.contains("letter")) {
      iniciarContador();
      // Comprovamos si ha acertado la ultima letra/s necesaria para completar la palabra oculta
      comprovarLetra(e);
      // Deshabilitar
      e.target.style.pointerEvents = "none";
      e.target.classList.add("letterUser");
    }
  });
});


