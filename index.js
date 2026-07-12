// // Dealing Random Poker Cards

// const myButton = document.querySelector(".deal-btn");
// const label1= document.querySelector("#label1"); 
// const label2= document.querySelector("#label2"); 
// const label3= document.querySelector("#label3"); 

// const  min = 1; 
// const max = 13; 
// let randomNum1; //exists 
// let randomNum2;
// let randomNum3;
// function randomNumFormula(){return Math.floor(Math.random() * (max - min + 1)) + 1;}

// myButton.addEventListener('click', () => {
//   randomNum1 = randomNumFormula();
//   label1.textContent = `Card: ${randomNum1}`; 

//   randomNum2 = randomNumFormula(); 
//   label2.textContent = `Card: ${randomNum2}`; 

//   randomNum3 = randomNumFormula();
//   label3.textContent = `Card: ${randomNum3}`;
// })


// // Code that returns random letter from name 
// const name = "kdlin";
// let randIdx = Math.floor(Math.random() * name.length);
// console.log(name.charAt(randIdx));



// // Conditional: Switch Statements 

// // After cases, Switch statements have default case 
// // syntax
// switch("Pikachu") { 
//   case 1:
//     console.log("chuuuu");
//     break;
//   case 2: 
//     console.log("pika"); 
//     break;
//   case "Pikachu": 
//     console.log("Pikachu"); 
//     break; 
//   default:
//     return 0;
// }

// // Ternary Operator 
// let grade = 90;
// let letterGrade = 
//   grade > 90 
//   ? "A"
//   : grade > 80 
//   ? "B"
//   : grade > 70
//   ? "C" 
//   : grade > 60
//   ? "D" 
//   : "F"; 
// console.log(letterGrade);

// User input 
let userConfirm = confirm("Ok === True\nCancel === False");
console.log(userConfirm);


let name = prompt("Please enter your name: ");
if (name ) { 
  console.log(name.trim().length); 
  console.log(name.trim()); 
} else { 
  console.log("You didn't enter a name...");
}