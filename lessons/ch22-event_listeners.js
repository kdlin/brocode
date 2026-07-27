// JS Event Listeners 
// addEventListener(event, function, useCapture)
          			      // Default: false;

// make a function, pass it in


// REMOVING eventListener (has to redefine) 

// Adding an anonymous function 

// event.target -> target being the element
// EX: h2.addEventListener -> h2 is the target

const navBar = document.querySelector("nav");
const h1 = navBar.querySelector("h1");

const changeText = () => { 
	alert("doing something");
}


h1.addEventListener("click", (event) => {
	console.log(event.target) //h1
	event.target.textContent = "pikachu";
});


	
