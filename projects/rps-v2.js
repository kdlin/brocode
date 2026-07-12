// Rock Paper Scissors - combines ch07 If, ch08 Switch/ch09 Ternary logic,
// ch10 User Input, ch11 game build

let playGame = confirm("Would you like to play Rock Paper Scissors?");

while (playGame) {
  let rawInput = prompt(`Please select Rock, Paper, or Scissors`);

  if (rawInput) {
    let playerInput = rawInput.trim().toLowerCase();
    if (
      playerInput === "rock" ||
      playerInput === "paper" ||
      playerInput === "scissors"
    ) {
      let compValue = Math.floor(Math.random() * 3);
      const choices = ["rock", "paper", "scissors"]; 
      let compChoice = choices[compValue];

      let result =
        playerInput === "rock"
          ? compChoice === "rock"
            ? "tie"
            : compChoice === "paper"
              ? "Computer Wins"
              : "Player Wins"
          : playerInput === "paper"
            ? compChoice === "rock"
              ? "Player Wins"
              : compChoice === "paper"
                ? "tie"
                : "Computer Wins"
            : compChoice === "rock"
              ? "Computer Wins"
              : compChoice === "paper"
                ? "Player Wins"
                : "tie";

      alert(
        `Player Selected: ${playerInput}\nComputer Selected: ${compChoice}\nResult: ${result}`,
      );
    } else {
      alert("Please enter rock, paper, or scissors.");
      continue; // don't run rest of code
    }
  } else { 
    if (rawInput === null ) {
      alert("Canceled selection");
      break; // 
    } else {
      alert("You didn't enter anything - maybe next time.");
      continue; // retry 
    }
  }
  let playAgain = confirm("Would you like to play again?"); 
  if (playAgain) {
    continue;
  } else {
      break;
  }
} 

if (!playGame) { 
  alert("See you next time then"); 
}
