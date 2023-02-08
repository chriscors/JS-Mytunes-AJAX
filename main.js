//Declare elements
let searchForm = document.getElementById("search-form");
let artist = document.getElementById("artist-input");
let outputDiv = document.getElementById("output");

//add event listener
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log(searchForm.value);
  fetchResponse(artist.value);
});

//declare query function
function fetchResponse(artist, song) {
  console.log(artist);
  let url = `https://proxy-itunes-api.glitch.me/search?term=${artist}&mediatype=music&attribute=artistTerm`;
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
    });
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

    //create card
    let card = document.createElement("div");
    //card.classList.add("col-lg-3", "col-md-6", "mb-4", "gx-6");
    card.classList.add("card");

    //create outer row
    let enclosingRow = document.createElement("div");
    enclosingRow.classList.add("row g-0");

    card.appendChild(enclosingRow);

    //create columns
    let leftCol = document.createElement("div");
    leftCol.classList.add("col-md-4");
    let rightCol = document.createElement("div");
    rightCol.classList.add("col-md-8");

    //Add columns
    enclosingRow.append(leftCol, rightCol);

    //make artworkImage
    let artworkImg = document.createElement("img");
    artworkImg.classList.add("card-img-top");
    artworkImg.src = artworkURL;
    artworkImg.alt = `Album artwork for album ${album}`;

    //make playButton
    let playButton = document.createElement("button");
    playButton.classList.add("btn btn-default");

    //make play icon
    let playIcon = document.createElement("img");
    playIcon.classList.add("justify-content-center", "img-fluid");
    playIcon.src = "https://icons.getbootstrap.com/assets/icons/play.svg";
    playIcon.alt = "Play button";
    //put icon in button
    playButton.appendChild(playIcon);

    //put image in left column
    leftCol.append(artworkImg, playButton);

    //make track header
    let trackH = document.createElement("h5");
    trackH.classList.add("card-title", "track");
    trackH.innerText = `${trackName}`;

    let albumP = document.createElement("p");
    albumP.classList.add("card-text", "album");
    albumP.innerText = `Album: ${album}`;

    let releasedP = document.createElement("p");
    releasedP.classList.add("card-text", "released");
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
    card.append(trackH, albumP, releasedP); //, previewDIV
    //every four cards create new row
    if (counter % 4 === 0 && counter > 0) {
      row[row.length] = document.createElement("div");
      row[row.length - 1].classList.add("row");
    }
    counter++;
    row[row.length - 1].appendChild(card);
  }
  //append all rows
  for (const sect of row) {
    outputDiv.appendChild(sect);
  }
}
