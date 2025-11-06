document.addEventListener("DOMContentLoaded", () => {
  // FORM ELEMENTS
  const formRegister = document.querySelector("form");
  // console.log(formRegister);
  const userName = document.querySelector("#userName");
  // console.log(userName);
  const userEmail = document.querySelector("#userEmail");
  // console.log(userEmail);
  const userPassword = document.querySelector("#userPassword");
  // console.log(userPassword);
  const userRePassword = document.querySelector("#userRePassword");
  // console.log(userRePassword);
  const submitForm = document.querySelector("#submitForm");
  // console.log(submitForm);

  // Constants
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // FUNCTIONS

     // Show error
    function showError (inputDivSibling,errorMessage){
      const divError = inputDivSibling.nextElementSibling;
      divError.classList.add('error');
      divError.innerHTML = errorMessage;
      divError.style.display = 'flex';
    };

    // Show Correct
    function showCorrect (inputDivSibling){
      const divCorrect = inputDivSibling.nextElementSibling;
      divCorrect.classList.add('correct');
      divCorrect.style.display = 'flex';
    };

    // Username test
    function validUsername (inputUsername){
      const inputlenght = inputUsername.value.trim().length;
      if(inputlenght > 20 || inputlenght < 5){
        const errorText = 'Username lenght must be between 5 and 20';
        showError(inputUsername,errorText);
        return false;
      }else{
        showCorrect(inputUsername);
        return true;
      }
    };

    // Email test
    function validEmail (inputEmail){
      const emailValue = inputEmail.value.trim();
      if(!re.test(emailValue)){
      const errorText = 'Wrong Email type, ex: @mail.com';
      showError(inputEmail,errorText);
      return false;
      }else{
        showCorrect(inputEmail);
        return true;
      }
    };

    // Password test
    function validPassword(inputPassword){
      const passwordValue = inputPassword.value.trim();
      if (passwordValue > 20 || passwordValue < 5){
        const errorText = 'Password lenght must be between 5 and 20';
        showError(inputPassword,errorText);
        return false;
      }else{
        showCorrect(inputPassword);
        return true;
      };
    };

    // Re password test
    function validRePassword (inputPassword,inputRePassword){
      const passwordValue = inputPassword.value.trim();
      const rePasswordValue = inputRePassword.value.trim();
      if(passwordValue !== rePasswordValue || rePasswordValue.length === 0){
        const errorText = 'Passwords must match';
        showError(inputRePassword,errorText);
        return false;
      }else{
        showCorrect(inputRePassword);
        return true;
      }
    };

  // EVENTS
    // FORM PREVEN DEFAULT
    formRegister.addEventListener("submit", (e) => {
      // Preven default behaviour
      e.preventDefault();
      // Checks
      const isUsernameValid = validUsername(userName);
      const isUserEmailValid = validEmail(userEmail);
      const isUserPasswordValid = validPassword(userPassword);
      const isuserRePasswordValid = validRePassword(userPassword,userRePassword);
      if(isUsernameValid && isUserEmailValid && isUserPasswordValid && isuserRePasswordValid){
        formRegister.submit();
      }else{
        
      }
    });
    // EVENTS INPUT LOSE FOCUS
    formRegister.addEventListener('focusout',(e)=>{
      // Check input + test it 
      const inputFocusLosed = e.target;
      // console.log(inputFocusLosed.id);

      switch (inputFocusLosed.id){
          case 'userName':{
            validUsername(inputFocusLosed);
            console.log(inputFocusLosed.id);
            break;
          };
          case 'userEmail':{
              validEmail(inputFocusLosed);
                console.log(inputFocusLosed.id);
              break;
          };
          case 'userPassword':{
              validPassword(inputFocusLosed);
              console.log(inputFocusLosed.id);
              break;
          };
          case 'userRePassword':{
                console.log(inputFocusLosed.id);
                validRePassword(userPassword,inputFocusLosed);
                break;
          };
      };
    });

});
