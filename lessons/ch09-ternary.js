// Ch09 Ternary Operator
// Using >= at each boundary (grade === 90 should be an A, not a B)

let grade = 90;
let letterGrade =
  grade >= 90
    ? "A"
    : grade >= 80
      ? "B"
      : grade >= 70
        ? "C"
        : grade >= 60
          ? "D"
          : "F";
console.log(letterGrade);
