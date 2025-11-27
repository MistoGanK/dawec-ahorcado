// db server
const dbServerUsers = "http://localhost:3000/users";
// Home
const linkHome = "../../index.html";
// HTML
const btnMostrar = document.getElementById('btn_show_leaderboard');
const selectCategoria = document.getElementById('select_category');
const selectDificultad = document.getElementById('select_difficulty');
const leaderboardContainer = document.getElementById('leaderboard_container');
const mensajeNoScores = document.getElementById('no_scores_message');
const button_volver_inicio = document.getElementById('button_volver_inicio');

// Obtenemos el array de usuarios
async function obtenerTodosLosUsuarios() {
  try {
    const response = await fetch(dbServerUsers);
    if (!response.ok) {
      console.error(
        "Error al obtener los datos del servidor: ",
        response.status
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener usuarios para el leaderboard:", error);
    return [];
  }
}
// Filtramos los usuarios por dificultad y categoria selecionada
async function generarLeaderboard(categoria, dificultad) {
  const users = await obtenerTodosLosUsuarios();
  // Igual que el map pero suprime el deph de nuestro json file y lo deveulve a un unico nivel
  const todosLosScores = users.flatMap((user) => {
    return (user.scorees || []).map((score) => ({
      username: user.username,
      score: score.score,
      category: score.category,
      difficulty: score.difficulty,
    }));
  });

  // Filtrar solo los scores de la categoría y dificultad elegidas
  const scoresFiltrados = todosLosScores.filter(
    (score) => score.category === categoria && score.difficulty === dificultad
  );

  // Ordenar de mayor a menor
  const leaderboard = scoresFiltrados.sort((a, b) => a.score - b.score);

  return leaderboard;
}
// Maquetamos y mostramos el resultado obtenido
async function mostrarLeaderboard() {
    // Obtenemos los valores de filtro
    const categoria = selectCategoria.value;
    const dificultad = parseInt(selectDificultad.value, 10); 

    // Generar los datos
    const leaderboardData = await generarLeaderboard(categoria, dificultad);

    // Limpiar resultados y mensajes
    leaderboardContainer.innerHTML = '';
    mensajeNoScores.style.display = 'none';

    if (leaderboardData.length === 0) {
        mensajeNoScores.style.display = 'block';
        return;
    }

    // Llenamos el contenedor con los resultados
    leaderboardData.forEach((item, index) => {

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('leaderboard_row');

        // Contenedor de Posición 
        const rankDiv = document.createElement('div');
        rankDiv.classList.add('rank_col');
        rankDiv.textContent = index + 1;

        // Contenedor de Usuario
        const userDiv = document.createElement('div');
        userDiv.classList.add('user_col');
        userDiv.textContent = item.username;

        // Contenedor de Puntuación
        const scoreDiv = document.createElement('div');
        scoreDiv.classList.add('score_col');
        scoreDiv.textContent = item.score;

        // Añadir las columnas a la fila
        rowDiv.appendChild(rankDiv);
        rowDiv.appendChild(userDiv);
        rowDiv.appendChild(scoreDiv);

        // Añadir la fila al contenedor principal
        leaderboardContainer.appendChild(rowDiv);
    });
}

// Event listeners
btnMostrar.addEventListener('click', mostrarLeaderboard);

button_volver_inicio.addEventListener('click', ()=> window.location = linkHome);