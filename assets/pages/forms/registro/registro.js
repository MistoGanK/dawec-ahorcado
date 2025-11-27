document.addEventListener("DOMContentLoaded", () => {
  // FORM ELEMENTS
  const formRegister = document.querySelector("form");
  // console.log(formRegister);
  const userName = document.querySelector("#userName");
  // const userEmail = document.querySelector("#userEmail");
  // console.log(userEmail);
  const userPassword = document.querySelector("#userPassword");
  // console.log(userPassword);
  const userRePassword = document.querySelector("#userRePassword");
  // console.log(userRePassword);
  const submitForm = document.querySelector("#submitForm");
  // console.log(submitForm);
  const btn_return_home = document.getElementById("btn_return_home");
  // console.log(btn_return_home);
  const btn_go_login = document.getElementById("btn_go_login");
  // console.log(btn_go_login);

  // Constants
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const link_home = "../../../../index.html";
  const link_login = "../login/login.html";
  const link_level_select = "../../level_select.html";
  const hrefDbJson = "../../../db/db.json";

  // Test data
  const user = "megaman";
  const genericPass = "12345";
  // saveUserData(hrefDbJson, user, genericPass);

  // Chekc if user is logged 
  checkUserLogged();
  
  // FUNCTIONS
  async function saveUserData(hrefDbJson, user, genericPass) {
    // Usado en el metodo post
    const dbServerUsers = 'http://localhost:3000/users'
    let newUser;
    let lastUserId = 0;
    // User data ONLY created If verifications wall succesfull
    // Retrieve user data
    try {
      // Get db data firts (Checks ID user)
      const response = await fetch(hrefDbJson);
      if (!response.ok) {
        console.error(
          "Error al intentar obtener los datos de servidor: ",
          response.status
        );
        return;
      }
      const data = await response.json();
      data.users.map((user) => {
        // Filtar por el ID mas alto
        if (parseInt(user.id) > lastUserId) {
          // Capturar el ID >
          lastUserId = parseInt(user.id);
        }
      });
      lastUserId +=1;
      // Creamos el objeto usuario nuevo
      newUser = {
        id: lastUserId,
        username: user,
        password: genericPass,
        scorees: []
      };
      console.log(newUser);
    } catch (error) {
      console.log("Error de servdiro", error);
      return;
    }
    // Save new user to json db
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
  };

  function checkUserLogged() {
    if (localStorage.getItem("currentUser")) {
      // Redirigir
      window.location = link_home;
    }
  }
  function returnHome() {
    window.location = link_home;
    return;
  }
  function goLogin() {
    window.location = link_login;
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

  // Username test
  function validUsername(inputUsername) {
    const inputlenght = inputUsername.value.trim().length;
    if (inputlenght > 20 || inputlenght < 5) {
      const errorText = "Username lenght must be between 5 and 20";
      showError(inputUsername, errorText);
      return false;
    } else {
      showCorrect(inputUsername);
      return true;
    }
  }

  // Email test
  // function validEmail (inputEmail){
  //   const emailValue = inputEmail.value.trim();
  //   if(!re.test(emailValue)){
  //   const errorText = 'Wrong Email type, ex: @mail.com';
  //   showError(inputEmail,errorText);
  //   return false;
  //   }else{
  //     showCorrect(inputEmail);
  //     return true;
  //   }
  // };

  // Password test
  function validPassword(inputPassword) {
    const passwordValue = inputPassword.value.trim();
    if (passwordValue > 20 || passwordValue < 5) {
      const errorText = "Password lenght must be between 5 and 20";
      showError(inputPassword, errorText);
      return false;
    } else {
      showCorrect(inputPassword);
      return true;
    }
  }

  // Re password test
  function validRePassword(inputPassword, inputRePassword) {
    const passwordValue = inputPassword.value.trim();
    const rePasswordValue = inputRePassword.value.trim();
    if (passwordValue !== rePasswordValue || rePasswordValue.length === 0) {
      const errorText = "Passwords must match";
      showError(inputRePassword, errorText);
      return false;
    } else {
      showCorrect(inputRePassword);
      return true;
    }
  }
  // Called afther the all comprovations are correct
  async function registerUser(hrefDbJson) {
    try {
      const response = await fetch(hrefDbJson);
      if (!response.ok) {
        console.log("Error on retievieng data from db", response.status);
        return;
      } else {
        const data = await response.json();
      }
    } catch (error) {
      console.log("Error on getting users data db", error);
      return;
    }
  }

  // EVENTS
  // FORM PREVEN DEFAULT
  formRegister.addEventListener("submit", (e) => {
    // Preven default behaviour
    e.preventDefault();
    // Checks
    const isUsernameValid = validUsername(userName);
    // const isUserEmailValid = validEmail(userEmail);
    const isUserPasswordValid = validPassword(userPassword);
    const isuserRePasswordValid = validRePassword(userPassword, userRePassword);
    if (
      isUsernameValid /*Email*/ &&
      isUserPasswordValid &&
      isuserRePasswordValid
    ) {
      const userData = {
        username: userName.value,
      };
      const userDataJson = JSON.stringify(userData);
      saveUserData(hrefDbJson, userName.value, userRePassword.value);
      // Una vez registrado exitosamente guardamos los datos y mostramos pantalla de juego
      localStorage.setItem("currentUser", userDataJson);
      window.location = link_level_select;
    } else {
    }
  });
  // EVENTS INPUT LOSE FOCUS
  formRegister.addEventListener("focusout", (e) => {
    // Check input + test it
    const inputFocusLosed = e.target;
    // console.log(inputFocusLosed.id);

    switch (inputFocusLosed.id) {
      case "userName": {
        validUsername(inputFocusLosed);
        console.log(inputFocusLosed.id);
        break;
      }
      // case 'userEmail':{
      //     validEmail(inputFocusLosed);
      //       console.log(inputFocusLosed.id);
      //     break;
      // };
      case "userPassword": {
        validPassword(inputFocusLosed);
        console.log(inputFocusLosed.id);
        break;
      }
      case "userRePassword": {
        console.log(inputFocusLosed.id);
        validRePassword(userPassword, inputFocusLosed);
        break;
      }
    }
  });
  btn_return_home.addEventListener("click", returnHome);
  btn_go_login.addEventListener("click", goLogin);
});
