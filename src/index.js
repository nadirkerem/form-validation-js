const registerForm = document.getElementById('registration');
const registerUsername = registerForm.elements['username'];
const registerEmail = registerForm.elements['email'];
const registerPassword = registerForm.elements['password'];
const registerPasswordCheck = registerForm.elements['passwordCheck'];
const registerTerms = registerForm.elements['terms'];

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isFormValidated = validateRegisterForm(event);

  if (!isFormValidated) {
    console.log('Not validated - Form is not validated');
    return false;
  }

  const isUserUnique = localStorageChecker();
  if (!isUserUnique) {
    alert('Error. User already exists.');
    return false;
  }

  const isUserRegistered = localStorageSetter();
  if (!isUserRegistered) {
    alert('Error. User not registered.');
    return false;
  }

  alert(`User ${registerUsername.value} registered successfully!`);
  event.target.reset();
});

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

function localStorageChecker() {
  const usernameValue = registerUsername.value;
  const emailValue = registerEmail.value;

  let existingUsersArray = JSON.parse(localStorage.getItem('users'));

  if (existingUsersArray) {
    existingUsersArray.forEach((existingUser) => {
      if (
        existingUser.username === usernameValue.toLowerCase() ||
        existingUser.email === emailValue.toLowerCase()
      ) {
        console.log('User already registered.');
        return false;
      }
    });
  }

  return true;
}

function localStorageSetter() {
  const usernameValue = registerUsername.value;
  const emailValue = registerEmail.value;
  const passwordValue = registerPassword.value;

  const user = {
    username: usernameValue.toLowerCase(),
    email: emailValue.toLowerCase(),
    // basic encoding for password
    password: window.btoa(passwordValue),
  };

  let existingUsersArray = JSON.parse(localStorage.getItem('users'));

  existingUsersArray = existingUsersArray
    ? [...existingUsersArray, user]
    : [user];

  localStorage.setItem('users', JSON.stringify(existingUsersArray));

  return true;
}
