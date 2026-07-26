// NOTES 

// Adjust CSS props directly


const view1 = document.querySelector("#view1")

const view2 =  document.getElementById("view2")

const views = document.querySelectorAll(".view")

// nodes > elements. More nodes than elements 


// we have view1 object. Select all divs 
// returns as NodeList(queryS is Node)
const divs = view1.querySelectorAll("div");

const sameDivs = view1.getElementsByTagName("div")
// will return as HTML Collections
// getElementBy -> HTML collections


// get only even divs (pseudo classes div:nth-of-type(<>n)

const oddDivs = view1.querySelectorAll("div:nth-of-type(2n + 1)");

// using for loops to modify stuff

for (let i=0; i < oddDivs.length; i++) {
	oddDivs[i].style.color= "white"; 
	oddDivs[i].style.backgroundColor = "green";
}


const navBar = document.querySelector("nav");
const navText = document.querySelector("nav h1");

navBar.innerHTML = `<h1>Pokemon</h1><p>I love pokemon so much it is my favorite</p>`;

navBar.style.display = "flex";
navBar.style.justifyContent = "space-between";

// document.createElement("div");
// create style of div (size, margin, padding, display) 

while(view1.lastChild) { // while view1 has a lastChild
	view1.lastChild.remove(); // remove that child 
} // all cleared

const createPikas = (parent, iter) => {
	const newPika = document.createElement("div");
	newPika.textContent = `Pika ${iter}`;
	newPika.style.backgroundColor = "yellow";
	newPika.style.color = "black";
	newPika.style.height = "100px";
	newPika.style.width = "100px";
	newPika.style.display = "flex";
	newPika.style.alignItems = "center";
	newPika.style.justifyContent = "center";
	newPika.style.margin = "10px";
	parent.append(newPika);
}


for (let i = 0; i < 12; i++) {
	createPikas(view1, i);
}


