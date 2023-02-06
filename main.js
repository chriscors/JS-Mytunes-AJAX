let url = "https://api.artic.edu/api/v1/artworks";

fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // body: JSON.stringify({
  //   username: "",
  //   password: "",
  // }),
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
