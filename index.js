


// let pokemonName = "Pikachu"; 
// let pokemonAge = 14;
// let pokemonIsFireType = false; 


// document.getElementById("p1").textContent = pokemonName;
// document.getElementById("p2").textContent = `${pokemonName} is ${pokemonAge} years old`;
// document.getElementById("p3").textContent = `${pokemonName} is of type Fire: ${pokemonIsFireType}`;


let username;

document.getElementById("mySubmit").onclick = function() {
  username = document.getElementById("myText").value; 
  document.getElementById("myH1").textContent = `Hello ${username}`;
}