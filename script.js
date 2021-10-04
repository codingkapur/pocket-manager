"use strict";
/* ----------------------------- */
/* ACCOUNTS DATA */
/* ----------------------------- */

const account1 = {
  owner: "Raghav Kapur",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Karan Pratap",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Dildevinder Singh",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Kanav Devgan",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/* ----------------------------- */
/* VARIABLES */
/* ----------------------------- */

// For the Sign-in/Sign-up Modal Display
const btnOpenSignInModal = document.querySelector(".sign-in");
const btnOpenSignUpModal = document.querySelector(".sign-up");
const signInModal = document.querySelector(".sign-in-modal");
const signUpModal = document.querySelector(".sign-up-modal");
const closeModalX = document.querySelectorAll(".close-modal-x");
const overlay = document.querySelector(".overlay");
const sendToSignIn = document.querySelector(".send-to-sign-in");
const sendToSignUp = document.querySelector(".send-to-sign-up");

//Adding the Sign Up functionality:

const signUpFirstName = document.querySelector(".form__sign-up--firstname");
const signUpLastName = document.querySelector('.form__sign-up--lastname')
const signUpPin = document.querySelector('.modal__form--pin');
const signUpButton = document.querySelector('.btn-sign-up');


//For the Sign-In Validation
const usernameInput = document.querySelector(".modal-form-input-username");
const passwordInput = document.querySelector(".modal-form-input-password");
const btnSignInSubmit = document.querySelector(".btn-sign-in");
const errorMessage = document.querySelector(".error-message");
//For Displaying Main App:
const displayApp = document.querySelector(".grid-container");

//For displaying welcome message in place of sign-in sign up buttons:
const welcomeMessagePlace = document.querySelector(".nav__login--elements");
const welcomeMessageDisplay = document.querySelector(".nav__welcome--display");

//To Update  Date, Current Balance, Movements, Summary Values;
//Date
const currentDate = document.querySelector(".date");
//Current Balance
const currentBalance = document.querySelector(".balance__amount");
//Movements
const movementsContainer = document.querySelector(".movements__container");
const movement = document.querySelector(".movements__row");
//Summary Values:
const summaryIncoming = document.querySelector(".summary__incoming--value");
const summaryOutgoing = document.querySelector(".summary__outgoing--value");
const summaryInterest = document.querySelector(".summary__interest--value");

//OPERATIONS:
//Transfer Money:
const transferTo = document.querySelector(".form__input--to");
const transferAmount = document.querySelector(".form__input--amount");
const transferButton = document.querySelector(".form__button--transfer");

//Request MOney
const requestAmount = document.querySelector(".form__input--request");
const requestButton = document.querySelector(".form__button--request");
//close account
const closeUsername = document.querySelector(".form__input--username");
const closePin = document.querySelector(".form__input--pin");

const closeButton = document.querySelector(".form__button--close");

//Sorting Movements:
const sortButton = document.querySelector(".btn--sort");

//Sign Out
const signout = document.querySelector(".sign-out");

/* ----------------------------- */
/* FUNCTIONS */
/* ----------------------------- */

// For the Sign-in/Sign-up Modal
const openModalSignIn = function () {
  overlay.classList.remove("hidden");
  signInModal.classList.remove("hidden");
};
const openModalSignUp = function () {
  overlay.classList.remove("hidden");
  signUpModal.classList.remove("hidden");
};
const closeModal = function () {
  overlay.classList.add("hidden");
  signInModal.classList.add("hidden");
  signUpModal.classList.add("hidden");
  resetSignInForm();
};
const resetSignInForm = function () {
  errorMessage.style.opacity = "0";
  usernameInput.value = "";
  passwordInput.value = "";
};

const displayWelcomeMessage = function () {
  welcomeMessagePlace.classList.add("hidden");
  welcomeMessageDisplay.innerHTML = `Welcome back, ${currentUser.owner}`;
  welcomeMessageDisplay.classList.remove("hidden");
};

//For generating username for Accounts
const genUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word[0];
      })
      .join("");
  });
};
genUsername(accounts);

//For Sign-In Validation
let currentUser;
const validateUser = function () {
  currentUser = accounts.find((acc) => acc.username === usernameInput.value);
  if (currentUser?.pin === Number(passwordInput.value)) {
    //Close the Sign In Modal.
    closeModal();
    //Reset form values.
    resetSignInForm();
    displayWelcomeMessage();
    displayApp.style.opacity = 1;

    updateUI(currentUser);
  } else if (currentUser?.pin !== Number(passwordInput.value)) {
    //Show error message.
    errorMessage.style.opacity = "100%";
    //Reset input fields.
    usernameInput.value = "";
    passwordInput.value = "";
  }
};

const updateUI = function (acc) {
  displayMovements(acc);
  displayCurrentBalance(acc);
  displaySummary(acc);
};

//Display Movements
let movsForSort;
const displayMovements = function (acc, sort = false) {
  movsForSort = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : (movsForSort = acc.movements);

  movementsContainer.innerHTML = "";
  movsForSort.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov.toFixed(1)}</div>
          </div>`;
    movementsContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//Calculate and display current Balance:
const displayCurrentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);

  currentBalance.textContent = acc.balance.toFixed(1);
};

//To Update Current Balance, Movements, Summary Values;
const displaySummary = function (acc) {
  const rateOfInterest = 2.75;

  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  summaryIncoming.textContent = incomes.toFixed(1);

  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryOutgoing.textContent = `${Math.abs(withdrawals).toFixed(1)}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => Math.ceil(mov * rateOfInterest) / 100)
    .reduce((sum, int) => (sum += int),0);
  summaryInterest.textContent = interest.toFixed(1);
};

const resetUI = function () {
  welcomeMessagePlace.classList.remove("hidden");
  welcomeMessageDisplay.classList.add("hidden");
  displayApp.style.opacity = 0;
};
/* OPERATIONS*/

/* ----------------------------- */
/* EVENT LISTENERS*/
/* ----------------------------- */

// For the Sign-in/Sign-up Modal:
btnOpenSignInModal.addEventListener("click", openModalSignIn);
btnOpenSignUpModal.addEventListener("click", openModalSignUp);
closeModalX.forEach((x) => x.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) =>
  e.key === "Escape" ? closeModal() : null
);
sendToSignIn.addEventListener("click", function () {
  closeModal();
  openModalSignIn();
});
sendToSignUp.addEventListener("click", function () {
  closeModal();
  openModalSignUp();
});

//For Sign-In Validation
btnSignInSubmit.addEventListener("click", validateUser);

//For Executing Operations!
//Transfer
transferButton.addEventListener("click", function () {
  const amountToTransfer = Number(transferAmount.value);
  const receiverAc = accounts.find((acc) => acc.username === transferTo.value);
  transferTo.value = "";
  transferAmount.value = "";
  if (
    receiverAc.username !== currentUser.username &&
    amountToTransfer > 0 &&
    receiverAc &&
    currentUser.balance >= amountToTransfer
  ) {
    currentUser.movements.push(-amountToTransfer);
    receiverAc.movements.push(amountToTransfer);
    updateUI(currentUser);
  }
});

//Request Loan

requestButton.addEventListener("click", function (e) {
  e.preventDefault();
  //Money can be loaned only if there is at least one deposit of minimum 10% of the requested amount.
  if (
    requestAmount.value > 0 &&
    currentUser.movements.some((mov) => mov >= (1 / 10) * requestAmount.value)
  ) {
    currentUser.movements.push(Number(requestAmount.value));
    updateUI(currentUser);
    requestAmount.value = "";
    // console.log(currentUser.movements);
  } else {
    console.log(
      "Please get in touch with our representative for an appointment."
    );
  }
});

//Close Account
closeButton.addEventListener("click", function (e) {
  e.preventDefault();

  if (accounts.find((acc) => acc.username === closeUsername.value)) {
    const acIndex = accounts.findIndex(
      (acc) => acc.username === closeUsername.value
    );
    if (accounts[acIndex].pin === Number(closePin.value)) {
      accounts.splice(acIndex, 1);
      resetUI();
    } else console.log("Incorrect Pin");
  } else {
    console.log("Incorrect Username or Password");
  }
  closeUsername.value = closePin.value = "";
});

//Sort Movements:
let sortState = false;
sortButton.addEventListener("click", function (e) {
  displayMovements(currentUser, !sortState);
  sortState = !sortState;
});

//Sign-out
signout.addEventListener("click", resetUI);


//Adding the Sign Up functionality:


signUpButton.addEventListener('click', function(e){
  e.preventDefault();

  accounts.push({owner: signUpFirstName.value +" "+ signUpLastName.value, movements:[], interestRate: Number(1.5), pin: Number(signUpPin.value)});
  genUsername(accounts);
  signUpFirstName.value="";
  signUpLastName.value="";
  signUpPin.value="";
  closeModal();
  openModalSignIn();
  console.log(accounts);

  // console.log(signUpFirstName.value)
  // console.log(signUpLastName.value)
  // console.log(signUpPin.value);
})





//Some array methods exercises:

//1. calculate the sum of the total deposits made in all the accounts.

//attempt 1:
// const totalDeposits = function(accs){
//   let totalMoney=0;
//   let depo=0;
//   accounts.forEach(acc=>{
//     depo = acc.movements.filter(mov=>mov>0).reduce((total, dep)=>total+=dep);
//     totalMoney+=depo;
//   })
//   console.log(totalMoney);
// }

//attempt 2:
// const totalDeposits = function(accs){
//   const totalTo = accounts.map(acc=>acc.movements).flat()
//   .filter(mov=>mov>0)
//   .reduce((total,dep)=>total+=dep,0);
// console.log(totalTo)
// }
// totalDeposits(accounts);

//2. Calculate total number of deposits of atleast 1000:
//attempt 1:
// const countOfOneKDeposits = function(accs){
//   let count= accs.flatMap(acc=>acc.movements).filter(dep=>dep>=1000).length;
//   console.log(count);
// }
// countOfOneKDeposits(accounts);

//3. calculate total deposits and withdrawals:
// const sums = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (total, cur) => {
//       cur > 0 ? (total.deposits += cur) : (total.withdrawals += cur);
//       return total;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(sums);

//4. convert string to title case
//eg: this is a nice string->This Is a Nice String.

// const converter = function (string) {
//   const capitalize= str=> str.replace(str[0], str[0].toUpperCase());
//   const exceptions = ['a','an','the','with','or','but','in','on','and']
//   const newStr = string
//     .toLowerCase()
//     .split(" ")
//     .map((word) =>
//       exceptions.includes(word) ? word: capitalize(word)
//       )
//     .join(" ");
//   return capitalize(newStr);
// };

// console.log(converter("this is a nice title"));
// console.log(converter("and that is how the cookie crumbles"));



