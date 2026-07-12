// Ch13 Functions - declaration, anonymous, arrow (same logic, three syntaxes)

// Function declaration
function getUserEmailFunc(email) {
  return email.slice(0, email.indexOf("@"));
}

// Anonymous function (no name of its own, held in a variable)
const getUserEmailAnonymous = function (email) {
  return email.slice(0, email.indexOf("@"));
};

// Arrow function: (args) => { }
const getUserEmailArrow = (email) => {
  return email.slice(0, email.indexOf("@"));
};

// ProperCase - uppercase first char, lowercase the rest
const toProperCase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

// Domain - slice from "@" onward (inclusive)
const getDomain = (email) => {
  return email.slice(email.indexOf("@"));
};
