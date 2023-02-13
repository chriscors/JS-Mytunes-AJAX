//Declare elements
let searchForm = document.getElementById("search-form");
let artist = document.getElementById("artist-input");
let outputDiv = document.getElementById("output");
let searchButtons = document.querySelectorAll(".search-type");
let playingSong = document.getElementById("playing-song");

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
function fetchResponse(artist) {
  //add spinner
  toggleSpinner("add");

  console.log(artist);
  //create url
  let url = `https://proxy-itunes-api.glitch.me/search?term=${artist}&mediatype=music&attribute=${searchState}&limit=50`;
  console.log(url);
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      //parse response
      return response.json();
    })
    .then(function (parsedResponse) {
      console.log(parsedResponse);
      //clear div
      outputDiv.replaceChildren();
      //populate results
      generateHTMLElements(parsedResponse.results);
      //kill spinner
      toggleSpinner("remove");
    });
}

//Toggle spinner
function toggleSpinner(behavior) {
  if (behavior === "add") {
    //create el, set status
    let spinner = document.createElement("div");
    spinner.classList.add("spinner-border", "text-light", "text-center");
    spinner.role = "status";

    //center under row
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
  //declare first row
  let row = [document.createElement("div")];
  row[0].classList.add("row");
  let counter = 0;
  for (const result of response) {
    //get results, assign to variables
    let artist = result.artistName;
    let artworkURL = result.artworkUrl100;
    let trackName = result.trackName;
    let album = result.collectionName;
    let previewURL = result.previewUrl;
    let releaseDate = result.releaseDate;
    let releaseYear = new Date(releaseDate).getFullYear();

    //div to hold card
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("col-md-6", "col-lg-3", "mb-4");
    //create card
    let card = document.createElement("div");
    card.style = "height: 9rem"; //custom css to standardize height, move to styles.css
    card.classList.add("card", "flex-row", "bg-secondary");

    //nest Card
    cardDiv.appendChild(card);

    //create columns
    let leftCol = document.createElement("div");
    leftCol.classList.add(
      "col-md-3",
      "d-flex",
      "flex-column",
      "align-items-center",
      "justify-content-center"
    );
    let midCol = document.createElement("div");
    midCol.classList.add("col-md-7");
    let rightCol = document.createElement("div");
    rightCol.classList.add(
      "col-md-2",
      "d-flex",
      "justify-content-center",
      "align-items-center"
    );

    //Add columns
    card.append(leftCol, midCol, rightCol);

    //make artworkImage
    let artworkImg = document.createElement("img");
    artworkImg.classList.add("card-img-top", "ratio", "rounded");
    artworkImg.src = artworkURL;
    artworkImg.alt = `Album artwork for album ${album}`;
    artworkImg.style = "max-height: 100px; max-width: 100px";
    // //put image in left column
    leftCol.append(artworkImg);

    //make play icon
    let playIcon = document.createElement("img");
    playIcon.classList.add("img-fluid", "hover-overlay", "ripple", "play-icon");
    playIcon.width = "40";
    playIcon.height = "40";
    playIcon.src =
      "https://img.icons8.com/fluency-systems-regular/48/ffffff/play--v2.png";
    playIcon.alt = "Play button";
    playIcon.style.cursor = "pointer";
    playIcon.value = "paused";

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
    if (trackName.length > 31) {
      trackName = `${trackName.substring(0, 29)}...`;
    }
    trackH.innerText = `${trackName}`;
    //artist name
    let artistP = document.createElement("p");
    artistP.classList.add("card-text", "text-white", "mb-0");
    artistP.innerText = `Artist: ${artist}`;
    //album name
    let albumP = document.createElement("p");
    if (album.length > 20) {
      album = `${album.substring(0, 16)}...`;
    }
    albumP.classList.add("card-text", "text-white", "mb-0");
    albumP.innerText = `Album: ${album}`;
    //year
    let releasedP = document.createElement("p");
    releasedP.classList.add("card-text", "text-muted");
    releasedP.innerText = `Year: ${releaseYear}`;

    //create node tree
    cardBody.append(trackH, artistP, albumP, releasedP); //, previewDIV
    midCol.appendChild(cardBody);
    //every four cards create new row
    if (counter % 4 === 0 && counter > 0) {
      row[row.length] = document.createElement("div");
      row[row.length - 1].classList.add("row");
    }
    counter++;
    row[row.length - 1].appendChild(cardDiv);
  }
  //append all rows to the div
  for (const sect of row) {
    outputDiv.appendChild(sect);
  }
}

function playIconClick(event, result) {
  if (event.target.value === "paused") {
    event.target.src =
      "https://img.icons8.com/fluency-systems-regular/48/ffffff/pause--v2.png";
    event.target.value = "playing";
    event.target.classList.add("playing-icon");
  } else {
    event.target.src =
      "https://img.icons8.com/fluency-systems-regular/48/ffffff/play--v2.png";
    event.target.value = "paused";
    event.target.classList.remove("playing-icon");
  }
  //assign track title
  playingSong.innerText = result.trackName;
  //pass track url
  click(result.previewUrl);
}
