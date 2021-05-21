//Sign Up

const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {

    e.preventDefault();

    //Get User Info

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //Sign Up the User

    auth.createUserWithEmailAndPassword(email,password).then(cred => {
        console.log(cred);

        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })

})

// Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
      console.log("user signed out");
  });
});

const loginForm = document.querySelector('#login-form');