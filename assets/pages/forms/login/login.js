document.addEventListener("DOMContentLoaded", () => {
  // FORM ELEMENTS
  const formRegister = document.querySelector("form");
  // console.log(formRegister);
  const userName = document.querySelector("#userName");
  // console.log(userName);
  const userPassword = document.querySelector("#userPassword");
  // console.log(userRePassword);
  const submitForm = document.querySelector("#submitForm");
  // console.log(submitForm);
  const btn_return_home = document.getElementById("btn_return_home");
  // console.log(btn_return_home);
  const btn_go_register = document.getElementById("btn_go_register");
  // console.log(btn_go_register);

  // Constants
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const link_home = "/index.html";
  const link_register = "/assets/pages/forms/registro/registro.html";
  const link_level_select = "/assets/pages/level_select.html";
  const hrefDbJson = "/assets/db/db.json";

  const errorUsername = "Username not match";
  const errorPassword = "Password not match";

  const correctUsername = "Username matches";
  const correctPassword = "Password matches";

  // FUNCTIONS
  // Función principal para manejar la autenticación
  async function checkCredentials(
    hrefDbJson,
    userNameInput,
    userPasswordInput
  ) {
    let isUsernameValid = false;
    let isPasswordValid = false;

    try {
      const response = await fetch(hrefDbJson);

      if (!response.ok) {
        console.error(
          "Error al obtener datos de usuario de la DB:",
          response.status
        );
        return;
      }

      const data = await response.json();
      const users = data.users;

      const foundUser = users.find((user) => user.username === userNameInput.value.trim());

      if (foundUser) {
        // User found
        showCorrect(userNameInput, correctUsername);
        isUsernameValid = true;
        // Check for user password
        if (foundUser.password === userPasswordInput.value.trim()) {
          showCorrect(userPasswordInput, correctPassword);
          isPasswordValid = true;
        } else {
          showError(userPasswordInput, errorPassword);
        }
      } else {
        // User not found
        showError(userNameInput, errorUsername);
        showError(userPasswordInput, errorPassword); // Opcional: mostrar error en ambos campos
      }
      // Return boolean true if both are correct either false
      return isUsernameValid && isPasswordValid;
    } catch (error) {
      console.error("Error grave en la autenticación:", error);
      showError(userNameInput, errorUsername);
      showError(userPasswordInput, errorPassword);
      return false;
    }
  }

  function returnHome() {
    window.location = link_home;
    return;
  }
  function goRegister (){
    window.location = link_register;
    return;
  }
  // Show error
  function showError(inputDivSibling, errorMessage) {
    const divError = inputDivSibling.nextElementSibling;
    divError.classList.add("error");
    divError.innerHTML = errorMessage;
    divError.style.display = "flex";
  }

  // Show Correct
  function showCorrect(inputDivSibling) {
    const divCorrect = inputDivSibling.nextElementSibling;
    divCorrect.classList.add("correct");
    divCorrect.style.display = "flex";
  }

  // EVENTS

  // FORM PREVEN DEFAULT
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userNameInputValue = userName;
    const userPasswordInputValue = userPassword;
    // Calls for checkCredencials functions and save the result on the const
    const loginCheck = await checkCredentials(hrefDbJson,userNameInputValue,userPasswordInputValue);

    if (loginCheck){
      console.log("Logged Succesfully");
      // Save it on local storage 
      const userNameValue = userNameInputValue.value.trim();
      localStorage.setItem("username",userNameValue);
      window.location = link_level_select;
    }else{
      console.log("Error loggin credential");
    }
  });
  
  btn_return_home.addEventListener("click", returnHome);
  btn_go_register.addEventListener("click",goRegister);

});
