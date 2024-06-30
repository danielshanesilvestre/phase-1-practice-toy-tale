let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  let toy_collection = document.getElementById("toy-collection");

  function renderCard(toy) {
    let {
      id,
      name,
      image,
      likes
    } = toy;

    let card = document.createElement("div");
    card.classList.add("card");
    toy_collection.append(card);

    let h2 = document.createElement("h2");
    h2.textContent = name;
    card.append(h2);

    let img = document.createElement("img");
    img.classList.add("toy-avatar");
    img.src = image;
    card.append(img);

    let p = document.createElement("p");
    p.textContent = likes.toString() + " Likes";
    card.append(p);

    let button = document.createElement("button");
    button.classList.add("like-btn");
    button.id = id;
    button.textContent = "Like ❤️";
    card.append(button);

    button.addEventListener("click", event => {
      let url = `http://localhost:3000/toys/${id}`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
            const configuration = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
              body: JSON.stringify({
                likes: data.likes + 1,
              })
            };

            fetch(url, configuration)
                .then(response => response.json())
                .then(data => {
                  event.target.parentElement.querySelector("p")
                      .textContent = `${data.likes} Likes`;
                });
          });
    })
  }

  fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(data => {
        console.log(data);

        for (let toy of data) {
          renderCard(toy);
        }
      });

  toyFormContainer.getElementsByClassName("add-toy-form")[0]
      .addEventListener("submit", event => {
        event.preventDefault();

        let input_name = event.target.querySelector("input[name=\"name\"]");
        let input_image = event.target.querySelector("input[name=\"image\"]");

        const configuration = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            name: input_name.value,
            image: input_image.value,
            likes: 0
          })
        };

        fetch("http://localhost:3000/toys", configuration)
            .then(response => response.json())
            .then(data => {
              renderCard(data);
            });
  });

});
