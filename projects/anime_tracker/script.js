document.addEventListener("DOMContentLoaded", () => {
  initApp();
})
const initApp =  () => {
  const nav = document.querySelector("nav");
  const adder = document.querySelector("#confirm-add"); 
  const all_animes = document.querySelector(".all-animes");
  const create_card = (name_input, rating) => { 
    const card = document.createElement("div");
    card.innerHTML = `
    <div>
      <h3></h3>
      <div id="rating"></div>
    </div>
    `
    card.querySelector("h3").textContent = name_input;
    card.querySelector(".rating").textContent = `Rating: ${rating}`; 
    return card;
  }
  adder.addEventListener(
    "click",
    (event) => {
      const name_input = document.querySelector("#name-input");
      const rating_input = document.querySelector(".rating-input");
      all_animes.append(create_card(name_input.value, rating_input.value ))
      console.log("anime added");
  },
  false
);

}