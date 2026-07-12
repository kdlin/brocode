


// let pokemonName = "Pikachu"; 
// let pokemonAge = 14;
// let pokemonIsFireType = false; 


// document.getElementById("p1").textContent = pokemonName;
// document.getElementById("p2").textContent = `${pokemonName} is ${pokemonAge} years old`;
// document.getElementById("p3").textContent = `${pokemonName} is of type Fire: ${pokemonIsFireType}`;


/*  === 2 types of user input window.prompt("input") and create a form 

// let username;

// document.getElementById("mySubmit").onclick = function() {
//   username = document.getElementById("myText").value; 
//   document.getElementById("myH1").textContent = `Hello ${username}`;
// } 



3) type conversions
// Task: Accept User Input For pokemon currHP as a string then convert to Number
and subtract 100 from it; 
*/ 

// document.getElementById("submitButton").onclick = function(){
//   let hp = Number(document.getElementById("pokeHp").value); // string user inputted
//   console.log(`Oh no!! Your pokemon got attacked`);
//   let damagedHp = hp - 150;
//   let message = `Your pokemon went from ${hp} hp to ${damagedHp} hp`;
//   console.log(message);
//   console.log(typeof hp, typeof message);

// } 

/* === let vs const 
let radius; 
const PI = 3.14;
document.getElementById("submitButton").onclick = () => {
  radius = Number(document.getElementById("myText").value);
  let circumference = 2 * PI * radius;   
  document.getElementById("myH3").textContent = `The circumference of Radius: ${radius} is ${circumference}`;
}
*/
let count = 0;
let countDisplay = document.getElementById("countDisplay");
let decreaseBtn = document.getElementById("decreaseBtn");
let resetBtn = document.getElementById("resetBtn"); 
let increaseBtn = document.getElementById("increaseBtn"); 

increaseBtn.onclick = () => {
  count++; 
  countDisplay.textContent = count; 
}

decreaseBtn.onclick = () => { 
  if (count > 0) {
    count--;
  } else {
    window.alert("count is already at 0");
  }
  countDisplay.textContent = count;  
}

resetBtn.onclick = () => { 
  count = 0;
  countDisplay.textContent = count; 
}
