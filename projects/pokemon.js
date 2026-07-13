class Pokemon {
  #hp; 
  constructor(name, type, hp) {
    this.name = name;
    this.type = type; 
  } 
  takeDamage(amount) {
    this.#hp -= amount;
  }
  getHp(){ 
    return this.#hp; 
  }
  status() {
    return this.#hp <=0 ? "fainted" : "healthy"; 
  } 

  static createDefault(name, type) { 
    return new Pokemon(name, type, 1000); 
  }
}

const roster1 = []
roster1.push(new Pokemon("Greninja", "water", 800));
roster1.push(new Pokemon("Gengar", "ghost", 900)); 
roster1.push(Pokemon.createDefault("Gardevoir", "psychic"));

function battle(roster, damageAm){
  let fainted = 0;
  for (const pokemon of roster) {
    pokemon.status() === "healthy" 
    if (pokemon.status() === "healthy") {
      pokemon.takeDamage(Math.floor(Math.random() * 100));
    } else {
      alert(`Pokemon ${pokemon.name} is already fainted`);
      fainted++;
      continue; 
    }

    // After takeDamage. If faints 
    if (pokemon.status() === "fainted") {
      alert(`Pokemon ${pokemon.name} pokemon.status()`); 
      fainted++;
      if (fainted >= 3) { break;}
    } 
  }
 } 

 // Main
let play = true; 
while(play) {
  let startBattle = confirm("Ready to battle?");
  if (startBattle) { // not null or empty
    let rawInput = prompt("Which pokemon would you like to target?");
  if (rawInput) {
    let target = rawInput.trim().toLowerCase();
    if (roster1.includes(target)) { 
      roster1[roster1.indexOf(target)]
        .takeDamage(Math.floor(Math.random()*100+50));
  } else {
    alert("That pokemon does not exist in the roster!")
    break;
  }

  } else { 
  if (rawInput === null) {
    alert("You cancelled your input")
    break;
  } else {
    alert("Empty Input. Try again!");
    continue
  }
  } 
  play = confirm("Would you like to go again?")
  } 
}