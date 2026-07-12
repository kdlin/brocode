// Dealing Random Poker Cards

const myButton = document.querySelector(".deal-btn");
const label1= document.querySelector("#label1"); 
const label2= document.querySelector("#label2"); 
const label3= document.querySelector("#label3"); 

const  min = 1; 
const max = 13; 
let randomNum1; //exists 
let randomNum2;
let randomNum3;
function randomNumFormula(){return Math.floor(Math.random() * (max - min + 1)) + 1;}

myButton.addEventListener('click', () => {
  randomNum1 = randomNumFormula();
  label1.textContent = `Card: ${randomNum1}`; 

  randomNum2 = randomNumFormula(); 
  label2.textContent = `Card: ${randomNum2}`; 

  randomNum3 = randomNumFormula();
  label3.textContent = `Card: ${randomNum3}`;
})