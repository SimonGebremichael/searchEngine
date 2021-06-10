var express = require("express");
var path = require("path");
var fetch = require("fetch").fetchUrl;
const request = require("request");
var app = express();

app.use(express.static(__dirname + "/views"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) =>
  RecipeSearch({ text: "canada", max: 5, type: "videos", fav: "" }, res)
);

app.get("/:type/:searchText/:max", (req, res) => {
  var data = {
    text: req.params.searchText,
    max: req.params.max,
    type: req.params.type,
    fav: "../../../",
  };
  if (req.params.type == "videos") videoSearch(data, res);
  else if (req.params.type == "images") ImageSearch(data, res);
  else if (req.params.type == "news") NewsSearch(data, res);
  else RecipeSearch(data, res);
});

function videoSearch(info, res) {
  var url = [
    "https://www.googleapis.com/youtube/v3/search?",
    "key=AIzaSyBAEjjGOG56LhwivEak9bBeTAsDlF7vFtQ",
    "&part=snippet",
    "&regionCode=CA",
    "&maxResults=" + info.max,
    "&type=video",
    "&videoType=any",
    "&safeSearch=none",
    "&order=viewCount",
    "&q=" + info.text,
  ];
  request(url.join(""), (error, response, body) => {
    var data = JSON.parse(body);
    if (data.error == undefined) {
      res.render("home", {
        info: info,
        data: data.items,
      });
    } else res.send(data);
  });
}

function ImageSearch(info, res) {
  var url = [
    "https://api.giphy.com/v1/gifs/search",
    "?api_key=ky8rddjtsxAzQBVa39pGMp5JSJ9HZueX",
    "&q=" + info.text,
    "&limit=" + info.max,
    "&offset=0",
    "&rating=g",
    "&lang=en",
  ];
  console.log(url.join(""));
  request(url.join(""), (error, response, body) => {
    var data = JSON.parse(body);
    console.log(data.data[0].images.original.url);
    res.render("home", {
      info: info,
      data: data.data,
    });
  });
}

function NewsSearch(info, res) {
  var url = [
    "https://newsapi.org/v2/everything",
    "?apiKey=d0b9e8abcc5342ceaf2931d47be78039",
    "&qInTitle=" + info.text,
    "&sortBy=relevancy",
    "&pageSize=" + info.max,
  ];
  console.log(url.join(""));
  request(url.join(""), (error, response, body) => {
    var data = JSON.parse(body);
    console.log(data.articles);
    res.render("home", {
      info: info,
      data: data.articles,
    });
  });
}

function RecipeSearch(info, res) {
  var url = [
    "https://tasty.p.rapidapi.com/recipes/list",
    "?from=0",
    "&size=" + info.max,
    "&tags=under_30_minutes",
    "&q=" + info.text,
  ];
  fetch(
    url.join(""),
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "22720dc3f4msh28d54b2aad7c4bep1a899bjsn27ebe88ef3ec",
        "x-rapidapi-host": "tasty.p.rapidapi.com",
      },
    },
    function (error, meta, body) {
      var data = JSON.parse(body);
      console.log(data.results[0]);
      res.render("home", {
        info: info,
        data: data.results,
      });
    }
  );
}
const port = process.env.PORT || 3001;
app.listen(port, () => console.log("listening to port " + port));
