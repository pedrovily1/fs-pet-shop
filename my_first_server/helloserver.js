const http = require("http");
const path = require("path");
const fs = require("fs");
const port = 8000;

const server = http.createServer(function (req, res) {
  if (req.method === "GET" && req.url === "/pets") {
    const petsPath = path.join(__dirname, "pets.json");
    fs.readFile(petsPath, "utf-8", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        console.error(err.message);
        res.end("Err");
      } else {
        const parsed = JSON.parse(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsed));
      }
    });
  } else if (req.method === "GET" && req.url.startsWith("/pets/")) {
    let petIndex = parseInt(req.url.split("/")[2]);
    if (isNaN(petIndex) || petIndex < 0) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end("Not Found");
    } else {
      const currentPetPath = path.join(__dirname, "pets.json");
      fs.readFile(currentPetPath, "utf-8", function (err, data) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          console.error(err.message);
          res.end("Err");
        } else {
          const parsed = JSON.parse(data);
          if (petIndex >= parsed.length) {
            res.writeHead(404, { "Content-type": "text/plain" });
            res.end("Not Found");
          }
          const pet = parsed[petIndex];
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(pet));
        }
      });
    }
  }
});

server.listen(port, function () {
  console.log("Listening port", port);
});
console.log(process.argv);
