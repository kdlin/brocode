  const nav = document.querySelector("nav");
  const adder = document.querySelector("#confirm-add"); 
  const allAnimes = document.querySelector(".all-animes");

  // Create a card to be appended into the all_animes gallery
  const createCard = (nameInput, rating) => { 
    const card = document.createElement("div");
    card.innerHTML = `
      <h3></h3>
      <div class="rating"></div>
      <button type="button" class="delete-btn">Delete</button>
    `
    card.querySelector("h3").textContent = nameInput;
    card.querySelector(".rating").textContent = `Rating: ${rating}`; 
    card.classList.add("anime-card");
    card.addEventListener(
      "mouseenter", 
      (event) => {
        card.classList.add("status-plan");
      }
    );
    card.addEventListener(
      "mouseleave",
      (event) => {
        card.classList.remove("status-plan");
      }
    )
    return card;
  }

  // event listener on Confirm Click
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


allAnimes.addEventListener(
  "click",
  (event) => { 
    if (!event.target.matches(".delete-btn")) { return;}
    const card = event.target.closest(".anime-card"); 
    if (card) { card.remove();}
  }
);
