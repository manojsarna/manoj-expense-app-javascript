// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const initialSetup = (user) => {

  if(user){

    const html = `
      <div> Logged In As : <b>${user.email}</b></div>
    `;

    accountDetails.innerHTML = html;

    //loggedin links only
    loggedInLinks.forEach( item => item.style.display = 'block')
    loggedOutLinks.forEach( item => item.style.display = 'none' )
  } else {

    loggedInLinks.forEach( item => item.style.display = 'none')
    loggedOutLinks.forEach( item => item.style.display = 'block' )

  }

}

function setGuestLoginDetails(){

  const loginEmail = document.querySelector("#login-email");
  loginEmail.focus();
  loginEmail.value = "test@test.com"
  const loginPass = document.querySelector("#login-password");
  loginPass.focus();
  loginPass.value = "Test@123"
}

function setGuestLogin2Details(){

  const loginEmail = document.querySelector("#login-email");
  loginEmail.focus();
  loginEmail.value = "test1@test.com"
  const loginPass = document.querySelector("#login-password");
  loginPass.focus();
  loginPass.value = "Test@123"
}