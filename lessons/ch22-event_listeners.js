// JS Event Listeners 
// addEventListener(event, function, useCapture)
          			      // Default: false;

// make a function, pass it in


// REMOVING eventListener (has to redefine) 

// Adding an anonymous function 

// event.target -> target being the element
// EX: h2.addEventListener -> h2 is the target

const navBar = document.querySelector("nav");
const h2 = nav.querySelector("h2");

const changeText = () => { 
	alert("doing something");
}


h2.addEventListener("onclick", (event) => {
	console.log(event.target) //h2
	event.target.textContent = "pikachu";
});


	
