( <--- Activación de JSON server ---> )
json-server --watch assets/db/db.json --port 3000

( <--- Modo de juefo ---> )
Acontinuación explico el flujo normal del usuario en la plataforma

Inició de partida desde el menu inicial, donde puedes ejecutar una de las siguientes 3 acciones:
-  Emepzar partida (Sin necesidad de inició de seción) > selección de categoria y nivel > juego > volver a jugar / seleción de niveles / home
-  Cerrar seción/Iniciar seción > Iniciar seción/registro > home > seleción de nivel > juego...
-  Admin panel (No requiere ni registro ni inició de seción, desde el servidor json se ofrece el admin user) > Crear/editar/eliminar palabra
-  Leaderboard 

( <--- Carpetas adicionales ---> )
Las demas carpetas contienen el codigo que posteriormente se aplicara al juego principal para añadirle funcionalidades

( <--- Funcionalidades ---> )
- Login && Register Functional con JSON server
- Selección de Niveles Funcional con JSON server
- Juego principal funcional
- Contador de intentos
- Cronometro
- Control de teclas (feedback errores, aciertos y bloqueo de teclas para evitar repetición)
- Guardar record (Si esta estas logeado)
- Leaderboard (Filtrando por categoria y dificultad)
- Admin panel (Selecionar,Modificar,Añadir y Eliminar frases)

(<--- Comentarios --->)
- En la consola del navegador puede ver la frase generada
- Carpetas y ficheros del juego principal -> assets/
- Al registrar un NUEVO usario, aunque se incerte en db.json correctamente por alguna razon posteriormente en la función comprovarRecord() dentro de game.js No es capaz de detectar al nuevo usuario hasta que no reiniciemos el servidor JSON nuevamente. En el fichero se ve la incerción pero al intentar acceder al navegador a http://localhost:3000/users/3 (para comprovar que el POST funciona) no encuentra nada (hasta que no reiniciemos el servidor JSON)
