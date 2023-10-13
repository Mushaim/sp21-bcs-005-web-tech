const { response } = require("express");
var expressLayouts = require("express-ejs-layouts");
let express = require("express");

let server = express();
server.use(express.static("public"));
server.set("view engine", "ejs");

server.use(expressLayouts);


server.get("/landingPage", function (req, res) {
  res.render("landingPage");
});

server.get("/", function (req, res) {
  res.send("<h1>Hello</h1>");
});

server.listen(5000, function () {
  console.log("Server Started at localhost:5000");
});
