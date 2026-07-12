// Ch08 Switch Statements
// Strict === comparison, no type coercion (case 1 will NOT match "1")
// default has no `return` here - not inside a function, and break prevents fall-through

switch ("Pikachu") {
  case 1:
    console.log("chuuuu");
    break;
  case 2:
    console.log("pika");
    break;
  case "Pikachu":
    console.log("Pikachu");
    break;
  default:
    console.log("no match");
}
