document.addEventListener("DOMContentLoaded", () => {
  initApp();
})
const initApp =  () => {
  const nav = document.querySelector("nav");
  const adder = document.querySelector("#confirm-add"); 
  const allAnimes = document.querySelector(".all-animes");
  const createCard = (nameInput, rating) => { 
    const card = document.createElement("div");
    card.innerHTML = `
    <div>
      <h3></h3>
      <div class="rating"></div>
    </div>
    `
    card.querySelector("h3").textContent = nameInput;
    card.querySelector(".rating").textContent = `Rating: ${rating}`; 
    card.classList.add("anime-card");
    return card;
  }
  adder.addEventListener(
    "click",
    (event) => {
      const nameInput = document.querySelector("#name-input");
      const ratingInput = document.querySelector("#rating-input");
      allAnimes.append(createCard(nameInput.value, ratingInput.value ));
      nameInput.value = "";
      ratingInput.value = "";
      console.log("anime added");
  },
  false
);

}