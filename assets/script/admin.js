// db
const DB_PHRASES = "http://localhost:3000/phrases";
// Home
const link_index ='../../index.html';

// Elementos HTML
const phrase_form = document.getElementById('phrase_form');
const phrase_id_input = document.getElementById('phrase_id');
const phrase_text_input = document.getElementById('phrase_text');
const phrase_category_input = document.getElementById('phrase_category');
const phrase_difficulty_input = document.getElementById('phrase_difficulty');
const phrases_list = document.getElementById('phrases_list');
const submit_button = document.getElementById('submit_button');
const cancel_edit_button = document.getElementById('cancel_edit_button');
const button_volver_inicio = document.getElementById('button_volver_inicio');

// Crear una frase

async function add_phrase(new_phrase) {
    try {
        const response = await fetch(DB_PHRASES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(new_phrase),
        });
        if (!response.ok){
          console.error("Error al crear la frase: ",response.status)
        };
        return await response.json();
    } catch (error) {
        console.error('Error al añadir la frase:', error);
    }
}

//  Leer una frase
async function get_phrases() {
    try {
        const response = await fetch(DB_PHRASES);
        if (!response.ok){
          console.error("Error al actualizar la frase: ",response.status)
        };
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la lista de frases:', error);
        return [];
    }
}

// Mofificar una frase
async function update_phrase(id, updated_phrase) {
    try {
        const response = await fetch(`${DB_PHRASES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updated_phrase),
        });
        if (!response.ok){
          console.error("Error al modificar una frase: ",response.status)
        };
        return await response.json();
    } catch (error) {
        console.error('Error al actualizar la frase:', error);
    }
}

// Eliminar una frase
async function delete_phrase(id) {
    try {
        const response = await fetch(`${DB_PHRASES}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok){
          console.error("Error al eliminar la frase: ",response.status);
        };
        console.log(`Frase con ID ${id} eliminada.`);
        await render_phrases_list();
    } catch (error) {
        console.error('Error al eliminar la frase:', error);
    }
}

// Cargar y maquetar la lista 
async function render_phrases_list() {
    const phrases = await get_phrases();
    phrases_list.innerHTML = '';

    if (phrases.length === 0) {
        phrases_list.innerHTML = '<li>No hay frases registradas.</li>';
        return;
    }

    phrases.forEach(phrase => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${phrase.phrase}</strong> (Cat: ${phrase.category}, Dificultad: ${phrase.difficulty})
            <div>
                <button class="edit_btn" data-id="${phrase.id}" data-phrase='${JSON.stringify(phrase)}'>Modificar</button>
                <button class="delete_btn" data-id="${phrase.id}">Eliminar</button>
            </div>
        `;
        phrases_list.appendChild(li);
    });

    // Agregar listeners a los nuevos botones (Selector actualizado)
    document.querySelectorAll('.edit_btn').forEach(button => {
        button.addEventListener('click', handle_edit_click);
    });
    document.querySelectorAll('.delete_btn').forEach(button => {
        button.addEventListener('click', handle_delete_click);
    });
}

// Rellenar el formulario para editar
function handle_edit_click(event) {
    const phrase_data = JSON.parse(event.currentTarget.dataset.phrase);
    
    // Rellenar formulario
    phrase_id_input.value = phrase_data.id;
    phrase_text_input.value = phrase_data.phrase;
    phrase_category_input.value = phrase_data.category;
    phrase_difficulty_input.value = phrase_data.difficulty;
    
    submit_button.textContent = 'Guardar Cambios';
    cancel_edit_button.style.display = 'inline-block';
    document.querySelector('#phrase_form_container h3').textContent = 'Modificar Frase (ID: ' + phrase_data.id + ')';
}

// Manejo de la eliminación de la frase
function handle_delete_click(event) {
    const id = event.currentTarget.dataset.id;
    if (confirm(`¿Estás seguro de que quieres eliminar la frase con ID ${id}?`)) {
        delete_phrase(id);
    }
}

// Resetear el formulario
function reset_form() {
    phrase_form.reset();
    phrase_id_input.value = '';
    submit_button.textContent = 'Añadir Frase';
    cancel_edit_button.style.display = 'none';
    document.querySelector('#phrase_form_container h3').textContent = 'Añadir Nueva Frase';
}
// Manejo del envio de formulario
phrase_form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = phrase_id_input.value;
    const phrase_data = {
        phrase: phrase_text_input.value.toUpperCase().trim(),
        category: phrase_category_input.value,
        difficulty: parseInt(phrase_difficulty_input.value, 10),
    };

    const new_or_updated_phrase = id ? { id, ...phrase_data } : phrase_data;

    if (id) {
        await update_phrase(id, new_or_updated_phrase);
    } else {
        await add_phrase(new_or_updated_phrase);
    }

    reset_form();
    await render_phrases_list();
});

cancel_edit_button.addEventListener('click', reset_form);

button_volver_inicio.addEventListener('click',() => window.location = link_index);

// Inicialización: Cargar la lista al inicio
document.addEventListener('DOMContentLoaded', render_phrases_list);
