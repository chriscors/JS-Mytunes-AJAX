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

    //create elements
    let container = document.createElement("div");
    container.classList.add("col");

    let artworkImg = document.createElement("img");
    artworkImg.classList.add("album-art");
    artworkImg.src = artworkURL;
    artworkImg.alt = `Album artwork for album ${album}`;

    let trackP = document.createElement("p");
    trackP.classList.add("line", "track");
    trackP.innerText = `Song: ${trackName}`;

    let albumP = document.createElement("p");
    albumP.classList.add("line", "album");
    albumP.innerText = `Album: ${album}`;

    let releasedP = document.createElement("p");
    releasedP.classList.add("line", "released");
    releasedP.innerText = `Year: ${releaseYear}`;

    let previewDIV = document.createElement("audio");
    previewDIV.classList.add("audio");
    previewDIV.controls = true;
    previewDIV.innerText = "Your browser does not support the audio element.";

    let previewSource = document.createElement("source");
    previewSource.classList.add("source");
    previewSource.src = previewURL;
    previewSource.type = "audio/mpeg";
    previewDIV.appendChild(previewSource);

    //create node tree
    container.append(artworkImg, trackP, albumP, releasedP, previewDIV);
    if (counter % 4 === 0 && counter > 0) {
      row[row.length] = document.createElement("div");
      row[row.length - 1].classList.add("row");
    }
    counter++;
    row[row.length].appendChild(container);
  }
  for (const sect of row) {
    outputDiv.appendChild(container);
  }
}
