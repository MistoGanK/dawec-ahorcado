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
  // Contenedor del ahorcado
  const stickman = document.querySelector(".stickman");
  // Contenedor de las partes
  const stickman_parts = document.querySelector(".stickman_parts");
  // Contenedor nuevo record
  const pop_up_puntuaje = document.querySelector(".pop_up_puntuaje");
  // P neuvo record
  const p_nuevo_record = document.getElementById("p_nuevo_record");
  // button nuevo record
  const button_new_record = document.getElementById("button_new_record");

  // Links

  const home_href = "/index.html";
  const dbServerLeaderboard = "http://localhost:3000/leaderboard";
  const dbServerUsers = "http://localhost:3000/users";

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
  // Variable con la que dibujaremos nuestro ahorcado
  let errores = 0;
  // Puntuaje
  let puntos;

  // -- Variables de local Storage
  let usuarioActual = null;
  // Obtenemos y parseamos el usuairo de localstorage
  const userJsonString = localStorage.getItem("currentUser");

  if (userJsonString) {
    try {
      const userObject = JSON.parse(userJsonString);
      console.log(userObject);
      // Asignamos solo si el objeto tiene la propiedad 'username'
      if (userObject && userObject.username) {
        usuarioActual = userObject.username;
      } else {
        console.warn(
          "La clave 'currentUser' existe, pero el objeto no contiene 'username'."
        );
      }
    } catch (error) {
      console.error(
        "Error al parsear el JSON del usuario de localStorage:",
        error
      );
    }
  }
  console.log(usuarioActual);

  const dificultadEligida = parseInt(localStorage.getItem("difficulty"));
  const categoriaEligida = localStorage.getItem("category");

  // Async function tratada como sincrona
  async function iniciarJuego(hrefDbJson) {
    try {
      // Obtenemos nuestros datos json de nuestra db
      const response = await fetch(hrefDbJson);
      // Comprovar que se hayan cargado correctamente
      if (!response.ok) {
        console.log("Error al cargar los datos: ", response.status);
        return;
      } else {
        // Convertimos la respuesta en objeto json
        const data = await response.json();
        // console.log(data);

        // Obtención de las key-value de phrase
        const palabraDb = data.phrases;
        // console.log(frasesDb);

        // Mapea e itera por los objetos del array de objetos phrases
        const palabrasMapeadas = palabraDb.map((palabra) => {
          if (
            palabra.difficulty == dificultadEligida &&
            palabra.category == categoriaEligida
          ) {
            frases.push(palabra.phrase);
          }
        });
        // Generar la random palabra una vez tengamos el array de palabras
        generarRandPalabra();
      }
    } catch (error) {
      console.log("Error al cargar las frases: ", error);
      return;
    }
  }

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
  // Stickman ACCI que iremos concatenando según los errores
  function getColgadoASCII(errors) {
    const stages = [
      "",
      " O",
      " O\n |",
      " O\n/|",
      " O\n/|\\",
      " O\n/|\\\n/",
      " O\n/|\\\n/ \\",
    ];

    return stages[errors];
  }
  // Guardar usuario en el ladeboard
  // Guardar el usuario en el ladeboard SI ha superado su anteriot marca
  async function comprovarRecord(puntos) {
    // Si no hay usuario en localStorage, salimos inmediatamente
    if (!usuarioActual) {
      console.error("No hay un usuario activo para comprobar el récord.");
      return;
    }

    // Guardamos el objeto score que el usuario ha generado
    const nuevoScore = {
      category: categoriaEligida,
      difficulty: dificultadEligida,
      score: puntos,
    };

    try {
      const response = await fetch(dbServerUsers);
      if (!response.ok) {
        console.error("Error al obtener los datos de la db", response.status);
        return;
      }

      const data = await response.json();
      const users = data;
      console.log(users[0].id);

      const userActual = users.find((user) => user.username === usuarioActual);

      if (!userActual) {
        console.error(
          `Usuario "${usuarioActual}" no encontrado en la base de datos.`
        );
        return;
      }

      // Buscamos el score anterior del usuario
      const scoreAnterior = userActual.scorees?.find((score) => {
        return (
          score.category === categoriaEligida &&
          score.difficulty == dificultadEligida
        );
      });

      let shouldUpdate = false;

      if (!scoreAnterior) {
        // Caso si score no existe
        console.log("Score no existente. Insertando como nuevo récord.");

        // Inicializamos el array si es nulo y añadimos el nuevo score
        userActual.scorees = userActual.scorees ?? [];
        userActual.scorees.push(nuevoScore);
        shouldUpdate = true;
      } else if (puntos < scoreAnterior.score) {
        pop_up_puntuaje.classList.toggle("show");

        // Encontramos el índice exacto para reemplazar
        const indexToUpdate = userActual.scorees.findIndex((score) => {
          return (
            score.category === categoriaEligida &&
            score.difficulty == dificultadEligida
          );
        });
        console.log("index to update", indexToUpdate);
        if (indexToUpdate !== -1) {
          // Reemplazamos el objeto antiguo por el nuevo
          userActual.scorees[indexToUpdate] = nuevoScore;
          shouldUpdate = true;
        } else {
          console.warn(
            "Récord encontrado, pero índice de actualización falló."
          );
        }
      }

      if (shouldUpdate) {
        await updateDatabase(userActual, dbServerUsers);
      } else {
        console.log(
          "No se superó el récord. No se requiere actualizar la base de datos."
        );
      }
    } catch (error) {
      console.error(
        "Se ha producido un error en el fetch del servidor: ",
        error
      );
    }
  }
  // Función para update el score del usuario
  async function updateDatabase(user, dbUrl) {
    console.log("user", user);
    console.log("dbur1", dbUrl);
    try {
      const putResponse = await fetch(`${dbUrl}/${String(user.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!putResponse.ok) {
        console.error(
          "Error al actualizar la DB con PUT: ",
          putResponse.status
        );
      }
      console.log("Datos de usuario actualizados con éxito.");
    } catch (error) {
      console.error("Error de servidor al enviar PUT:", error);
      throw error;
    }
  }

  async function guardarLeaderboard() {
    try {
      const postResponse = await fetch(dbServerUsers, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        // Insert the the object as a chain
        body: JSON.stringify(newUser),
      });

      if (!postResponse.ok) {
        console.error(
          "Error al intentar obtener los datos de servidor: ",
          postResponse.status
        );
        return;
      }
    } catch (error) {
      console.log("Error de servdiro", error);
      return;
    }
  }

  // Randomizador de palabras
  function randomPalabra(frase) {
    var selecionIndice = Math.floor(Math.random() * frase.length);
    console.log("indice:", selecionIndice);
    return frase[selecionIndice];
  }

  function generarRandPalabra() {
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
      let segundos = Math.floor(
        (tiempoTotalMs % ms_por_minuto) / ms_por_segundo
      );

      // Milisegundos
      let miliSegundos = tiempoTotalMs % ms_por_segundo;

      h2Timer.innerHTML = `${pad(horas)}:${pad(minutos)}:${pad(segundos)}.${pad(
        miliSegundos,
        3
      )}`;
      puntos = tiempoTotalMs;
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
  let intentos = 6;

  async function comprovarLetra(e) {
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
      } else {
      }
      i++;
    }
    // Una vez acabada la iteración comprovamos si no habido un aumento en letras desveladas = error
    if (letrasDesveladadas > contradorLetrasDesv) {
      contradorLetrasDesv = letrasDesveladadas;
      e.target.classList.add("acierto");
      // Debug
      // console.log(contradorLetrasDesv);
    } else {
      intentos -= 1;
      console.log(intentos);
      error_count.innerHTML = intentos;
      e.target.classList.add("error");
      errores += 1;
      const pColgado = getColgadoASCII(errores);
      // const pElement = document.createElement("p");
      // pElement.innerText = pColgado;
      stickman_parts.textContent = pColgado;
      console.log(getColgadoASCII(errores));

      // Debug
      // console.log("itentos",intentos);
    }

    // Condiciones para finalizar el juego

    // Comprovamos si se cumple la condicion de ganar
    if (letrasDesveladadas == fraseSelecionada.length) {
      pararContador();
      var reusltP = document.createElement("p");
      var totalPoints = document.createElement("p");

      reusltP.textContent = "Victoria";
      totalPoints.textContent = puntos;

      reuslt.appendChild(reusltP);
      reuslt.appendChild(totalPoints);

      p_nuevo_record.innerHTML = puntos;

      // Comprovamos si ha superado su record SI hay un usuario
      await comprovarRecord(puntos);

      abc.style.pointerEvents = "none";
      // Debug
      // console.log("MUY BIEN CAMPEON");
    }
    // Comprovamos si se cumple la condición para perder
    if (intentos == 0) {
      pararContador();
      var reusltP = document.createElement("p");
      var totalPoints = document.createElement("p");

      reusltP.textContent = "Derrota";
      totalPoints.textContent = puntos;

      reuslt.appendChild(reusltP);
      reuslt.appendChild(totalPoints);

      p_nuevo_record.innerHTML = puntos;

      abc.style.pointerEvents = "none";
      // Debug
      // console.log("Muerte");
    }
  }

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

  button_new_record.addEventListener("click", (e) => {
    e.preventDefault();
    pop_up_puntuaje.classList.toggle("show");
  });
});
