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

});

// Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
      //logout confirmation
      console.log("user signed out");
  });
});

const logout1 = document.querySelector('#logout1');
logout1.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});


//Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {

    e.preventDefault();

    //GetUserInfo
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email,password).then((cred) => {
        console.log(cred.user);

        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})


//listen for Auth Status Change

auth.onAuthStateChanged(user => {

    if(user) {

        initialSetup(user);
        console.log("in auth state : ",user);
        getAllExpenses(user);  

    } else {

        initialSetup();

    }

    

})


// Expense Logic


    //get heading element
    const headingEl = document.querySelector("#headingTotal");
    //console.log(headingEl);        

    //get button element
    const element = document.querySelector("#btnCounter");
    //console.log(element);

    //get INPUT element
    const inValEl = document.querySelector("#inVal");        

    //get INPUT DESC element
    const inDescEl = document.querySelector("#inDesc");    

    //get Expense Table element
    const tableExpenseEl = document.querySelector("#tableExpense");            

    
    //get Expense List element
    const expenseListEl = document.querySelector("#expenseList");            
        
    function clickCounter() {

        const expenseItem = {};

        //read value from input
        const textAmount = inValEl.value;
        //  console.log({textAmount});  
        
        const textDesc = inDescEl.value;
        //console.log({textDesc});

        //convert value to INT
        const expense = parseFloat(textAmount,10);
        //  console.log({expense});

        if(!isNaN(expense) && textAmount!='' && textDesc!='' && isNaN(textDesc) ){

            addExpenseFireStore(expense,textDesc);

            inValEl.value="";
            inDescEl.value="";     

        }  else {

            alert("Please Enter Correct Values")
            inValEl.value="";
            inDescEl.value="";  
        }           

        

    }

    element.addEventListener("click",clickCounter,false);
      

  

    function getDateString(moment){
            
        return moment.toDate().toLocaleDateString("en-US",{
            year:'numeric',
            month:'long',
            day:'numeric'
        });
    }

 

    function renderList(allExpensesList) {
       
        let totalExpense = 0;
        console.log("in re",allExpensesList)
        if(!allExpensesList.length){
            console.log("zero")
            expenseListEl.style.display = "none";
        } else {
            expenseListEl.style.display = "block";
        }
        allExpensesList.map((exp) => {

            totalExpense = totalExpense + parseFloat(exp.expense);
        })

        console.log({totalExpense});
        // set totalExpense to H1
        const headingText = `Total : ₹ ${totalExpense.toFixed(2)}`
        headingEl.textContent = headingText;

        const allExpensesHTML = allExpensesList.map(exp => createListItem(exp));

        allExpensesText = allExpensesHTML.join("");
        tableExpenseEl.innerHTML = allExpensesText;

    }

    function createListItem({description , expense , createdAt , expenseId }) {

        return `
        <li class="collection-item grey lighten-5 " style="max-height: 100px">
     
          <div class="row ">
          
              <div class="col s4" style="margin-top: 1em">
                    
                      <span class="title" style="font-size: 1.8rem;">${description}</span>
                      <p class ="text-grey" style="font-size: 0.9rem;">${getDateString(createdAt)}</p>
                    
              </div>

              <div class="col s4" style="margin-top: 1.5em">
                <span class="secondary-content" style="font-size: 1.4rem;">
                    ₹ ${expense}
                </span>
              </div>

          
              <div class="col s4" style="margin-top: 1em">
                  <button type="button" class="secondary-content btn red btn-sm" onclick="deleteExpense('${expenseId}')"><i class="fas fa-trash-alt"></i> </button>
              </div>
          
          </div>

              </li>                  

        `;



    }
        





    function addExpenseFireStore(amount,desc) {

        db.collection('expenses').add({
            expense : amount,
            description: desc, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid:auth.currentUser.email
        }).catch((error) => {
            console.error("Error while adding in expenses collection!!")
        })
    }      
            
            
    function getAllExpenses(user){

        db.collection("expenses")
        .where("uid", "==", user.email!=null ? user.email : "")
        .orderBy("createdAt","desc")
        .onSnapshot((querySnapshot) => {
            const allExpenses =[]
                querySnapshot.forEach((expense) => {

                allExpenses.push({
                    ...expense.data(),
                    expenseId: expense.id      
                    });
            });
            renderList(allExpenses);
            
        });
        
    }

    function deleteExpense(expenseId){
        
        
        db.collection("expenses")
        .doc(expenseId)
        .delete()
        .then(() => {
            console.log("Delete Successfully")
        })
        .catch((error) => {
            console.error("Error in Deleting..",error)
        });

    }


    inDescEl.addEventListener("keyup",function(event){

        if(event.keyCode === 13) {
            event.preventDefault();
            element.click();
        }
    })


      
        

