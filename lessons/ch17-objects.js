// // Objects

// // With Brackets use quotes
// obj["beverage"]
// obj.beverage

// // methods can live in obj 
// action: function() { return xyz;}
//  key ^      function as val function as val

const pokemon = { 
  fire: "charizard", 
  water: "empoleon", 
  electric: "pikachu", 
  ghost : "gengar"
}; 

// Dot notations
pokemon.fighting = "lucario";

delete pokemon.ghost;
console.log(pokemon.hasOwnProperty("ghost"));

console.log(Object.keys(pokemon)); 
console.log(Object.values(pokemon)); 

for (let type in pokemon) {
  console.log(`${pokemon[type]} is a ${type} type`);
}


// destructuring objects | defining vars { guitar : myVariable } 


