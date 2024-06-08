const registerForm = document.getElementById('registration');
const registerUsername = registerForm.elements['username'];
const registerEmail = registerForm.elements['email'];
const registerPassword = registerForm.elements['password'];
const registerPasswordCheck = registerForm.elements['passwordCheck'];
const registerTerms = registerForm.elements['terms'];

const loginForm = document.getElementById('login');
const loginUsername = loginForm.elements['username'];
const loginPassword = loginForm.elements['password'];
const loginRemember = loginForm.elements['persist'];

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isFormValidated = validateRegisterForm();

  if (!isFormValidated) {
    console.log('Not validated - Form is not validated');
    return false;
  }

  const isUserExists = localStorageChecker('register');
  if (isUserExists) {
    alert('Error. Username or email already exists in the database.');
    return false;
  }

  const isUserRegistered = localStorageSetter('register');
  if (!isUserRegistered) {
    alert('Error. User not registered.');
    return false;
  }

  alert(`User ${registerUsername.value} registered successfully!`);
  event.target.reset();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isFormValidated = validateLoginForm();

  if (!isFormValidated) {
    console.log('Not validated - Form is not validated');
    return false;
  }

  const isCredentialsValid = localStorageChecker('login');
  if (isCredentialsValid) {
    return true;
  }
  if (!isCredentialsValid) {
    alert('Error. Username or password is incorrect.');
    return false;
  }
});

// REGISTER FORM

function validateRegisterForm() {
  const isUsernameValidated = validateRegisterUsername();
  if (!isUsernameValidated) {
    return false;
  }

  const isEmailValidated = validateRegisterEmail();
  if (!isEmailValidated) {
    return false;
  }

  const isPasswordValidated = validateRegisterPassword();
  if (!isPasswordValidated) {
    return false;
  }

  const isTermsValidated = validateTerms();
  if (!isTermsValidated) {
    return false;
  }

  return true;
}

function validateRegisterUsername() {
  const usernameValue = registerUsername.value;

  if (usernameValue.length === 0) {
    alert('The username cannot be blank.');
    registerUsername.focus();
    return false;
  }
  if (usernameValue.length < 4) {
    alert('The username must be at least four characters long.');
    registerUsername.focus();
    return false;
  }
  if (new Set(usernameValue).size < 2) {
    alert('The username must contain at least two unique characters.');
    registerUsername.focus();
    return false;
  }
  if (!/^[a-zA-Z0-9]*$/.test(usernameValue)) {
    alert('The username cannot contain any special characters or whitespace.');
    registerUsername.focus();
    return false;
  }

  return true;
}

function validateRegisterEmail() {
  const emailValue = registerEmail.value;
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!regex.test(emailValue)) {
    alert('The email address is not valid.');
    registerEmail.focus();
    return false;
  }

  const domain = emailValue.split('@')[1];
  if (domain === 'example.com') {
    alert('The email address domain is not allowed.');
    registerEmail.focus();
    return false;
  }

  return true;
}

function validateRegisterPassword() {
  const passwordValue = registerPassword.value;
  const passwordCheckValue = registerPasswordCheck.value;
  const usernameValue = registerUsername.value;

  if (passwordValue !== passwordCheckValue) {
    alert('The passwords do not match.');
    registerPasswordCheck.focus();
    return false;
  }

  const regex =
    /^(?!.*[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!regex.test(passwordValue)) {
    alert(
      'The password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    );
    registerPassword.focus();
    return false;
  }
  if (usernameValue.toLowerCase().includes(passwordValue.toLowerCase())) {
    alert('The password cannot contain the username.');
    registerPassword.focus();
    return false;
  }

  return true;
}

function validateTerms() {
  if (!registerTerms.checked) {
    alert('You must agree to the terms and conditions.');
    return false;
  }

  return true;
}

// LOGIN FORM

function validateLoginForm() {
  const isUsernameValidated = validateLoginUsername();
  if (!isUsernameValidated) {
    console.log("username isn't validated");
    return false;
  }

  const isPasswordValidated = validateLoginPassword();
  if (!isPasswordValidated) {
    console.log("password isn't validated");
    return false;
  }

  return true;
}

function validateLoginUsername() {
  const usernameValue = loginUsername.value;
  if (usernameValue.length === 0) {
    alert('The username cannot be blank.');
    loginUsername.focus();
    return false;
  }
  return true;
}

function validateLoginPassword() {
  const passwordValue = loginPassword.value;
  if (passwordValue.length === 0) {
    alert('The password cannot be blank.');
    loginPassword.focus();
    return false;
  }
  return true;
}

// LOCAL STORAGE

function localStorageChecker(action) {
  let existingUsersArray = JSON.parse(localStorage.getItem('users'));

  if (action === 'register') {
    const usernameValue = registerUsername.value;
    const emailValue = registerEmail.value;
    if (existingUsersArray) {
      for (let i = 0; i < existingUsersArray.length; i++) {
        if (
          existingUsersArray[i].username === usernameValue.toLowerCase() ||
          existingUsersArray[i].email === emailValue.toLowerCase()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  if (action === 'login') {
    const usernameValue = loginUsername.value;
    const passwordValue = loginPassword.value;
    const RememberValue = loginRemember.checked;

    if (existingUsersArray) {
      for (let i = 0; i < existingUsersArray.length; i++) {
        if (
          existingUsersArray[i].username === usernameValue.toLowerCase() &&
          atob(existingUsersArray[i].password) === passwordValue
        ) {
          if (RememberValue) {
            existingUsersArray[i].remember = true;

            localStorage.setItem('users', JSON.stringify(existingUsersArray));

            alert(`User ${usernameValue} logged in and will be remembered.`);
          } else {
            existingUsersArray[i].remember = false;

            localStorage.setItem('users', JSON.stringify(existingUsersArray));

            alert(`User ${usernameValue} logged in.`);
          }
          return true;
        }
      }
    }
    return false;
  }
}

function localStorageSetter(action) {
  if (action === 'register') {
    const usernameValue = registerUsername.value;
    const emailValue = registerEmail.value;
    const passwordValue = registerPassword.value;

    const user = {
      username: usernameValue.toLowerCase(),
      email: emailValue.toLowerCase(),
      // basic encoding for password
      password: btoa(passwordValue),
    };

    let existingUsersArray = JSON.parse(localStorage.getItem('users'));

    existingUsersArray = existingUsersArray
      ? [...existingUsersArray, user]
      : [user];

    localStorage.setItem('users', JSON.stringify(existingUsersArray));

    return true;
  }
}
