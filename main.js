//Declare elements
let searchForm = document.getElementById("search-form");
let artist = document.getElementById("artist-input");
let outputDiv = document.getElementById("output");
let searchButtons = document.querySelectorAll(".search-type");

let searchState;
let inputRow = document.getElementById("input-row");

//add event listeners
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchResponse(artist.value);
});

for (button of searchButtons) {
  if (button.checked === true) {
    searchState = button.value;
  }
  button.addEventListener("click", (event) => {
    searchState = button.value;
  });
}
//declare query function
function fetchResponse(artist, song) {
  //add spinner
  toggleSpinner("add");

  console.log(artist);
  let url = `https://proxy-itunes-api.glitch.me/search?term=${artist}&mediatype=music&attribute=${searchState}&limit=50`;
  console.log(url);
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (parsedResponse) {
      console.log(parsedResponse);
      outputDiv.replaceChildren();
      generateHTMLElements(parsedResponse.results);
      toggleSpinner("remove");
    });
}

//Toggle spinner
function toggleSpinner(behavior) {
  if (behavior === "add") {
    let spinner = document.createElement("div");
    spinner.classList.add("spinner-border", "text-light", "text-center");
    spinner.role = "status";

    let spinRow = document.createElement("div");
    spinRow.classList.add("row", "justify-content-center");
    spinRow.id = "spin-row";
    spinRow.appendChild(spinner);
    searchForm.appendChild(spinRow);
  } else if (behavior === "remove") {
    let spinRow = document.getElementById("spin-row");
    searchForm.removeChild(spinRow);
  }
}

//Element Creation code
function generateHTMLElements(response) {
  let row = [document.createElement("div")];
  row[0].classList.add("row");
  let counter = 0;
  for (const result of response) {
    //get results
    let artist = result.artistName;
    let artworkURL = result.artworkUrl100;
    let trackName = result.trackName;
    let album = result.artistName;
    let previewURL = result.previewUrl;
    let releaseDate = result.releaseDate;
    let releaseYear = new Date(releaseDate).getFullYear();
    let genre = result.primaryGenreName;

    let cardDiv = document.createElement("div");
    cardDiv.classList.add("col-md-6", "col-lg-3", "mb-4");
    //create card
    let card = document.createElement("div");

    card.classList.add("card", "flex-row", "bg-secondary", "w-100");

    //nest Card
    cardDiv.appendChild(card);

    //create columns
    let leftCol = document.createElement("div");
    leftCol.classList.add(
      "col-md-4",
      "d-flex",
      "flex-column",
      "align-items-center"
    );
    leftCol.style = "width: 100px;";
    let midCol = document.createElement("div");
    midCol.classList.add("col-md-6");
    let rightCol = document.createElement("div");
    rightCol.classList.add("col-md-2");
    //Add columns
    card.append(leftCol, midCol, rightCol);

    //make artworkImage
    let artworkImg = document.createElement("img");
    artworkImg.classList.add("card-img-top", "ratio", "rounded");
    artworkImg.src = artworkURL;
    artworkImg.alt = `Album artwork for album ${album}`;
    artworkImg.style = "max-height: 100px; max-width: 100px";

    //put image in left column
    leftCol.append(artworkImg);

    //make play icon
    let playIcon = document.createElement("img");
    playIcon.classList.add(
      "justify-content-center",
      "align-content-center",
      "img-fluid"
    );
    playIcon.width = "40px";
    playIcon.height = "40px";
    playIcon.src = "https://icons.getbootstrap.com/assets/icons/play.svg";
    playIcon.alt = "Play button";
    //add play icon to right column
    rightCol.append(playIcon);

    //add event listener
    playIcon.addEventListener("click", (event) => {
      playIconClick(event, result);
    });

    //make cardBody
    let cardBody = document.createElement("div");
    cardBody.classList.add(
      "card-body",
      "h-100",
      "d-flex",
      "flex-column",
      "justify-content-center"
    );

    //make track header
    let trackH = document.createElement("h5");
    trackH.classList.add("card-title", "text-white", "mb-0");
    trackH.innerText = `${trackName}`;

    let albumP = document.createElement("p");
    albumP.classList.add("card-text", "text-white", "mb-0");
    albumP.innerText = `Album: ${album}`;

    let releasedP = document.createElement("p");
    releasedP.classList.add("card-text", "text-muted");
    releasedP.innerText = `Year: ${releaseYear}`;

    // let previewDIV = document.createElement("audio");
    // previewDIV.classList.add("audio");
    // previewDIV.controls = true;
    // previewDIV.innerText = "Your browser does not support the audio element.";

    // let previewSource = document.createElement("source");
    // previewSource.classList.add("source");
    // previewSource.src = previewURL;
    // previewSource.type = "audio/mpeg";
    // previewDIV.appendChild(previewSource);

    //create node tree
    cardBody.append(trackH, albumP, releasedP); //, previewDIV
    midCol.appendChild(cardBody);
    //every four cards create new row
    if (counter % 4 === 0 && counter > 0) {
      row[row.length] = document.createElement("div");
      row[row.length - 1].classList.add("row");
    }
    counter++;
    row[row.length - 1].appendChild(cardDiv);
  }
  //append all rows
  for (const sect of row) {
    outputDiv.appendChild(sect);
  }
}

function playIconClick(event, result) {}
