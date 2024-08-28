const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readdir(`./files`, function (err, files) {
    res.render("index", { files: files });
  });
});

app.get("/file/:fileName", (req, res) => {
  fs.readFile(
    `./files/${req.params.fileName}`,
    "utf-8",
    function (err, fileData) {
      res.render("show", { fileName: req.params.fileName, fileData: fileData });
    }
  );
});

app.get("/edit/:fileName", (req, res) => {
  res.render("edit", { filename: req.params.fileName });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.details,
    function (err) {
      res.redirect("/");
    }
  );
});

app.post("/edit", (req, res) => {

  const previousFileName = `./files/${req.body.previous}`;
  const newFileName = `./files/${req.body.new}`;

  fs.rename(previousFileName, newFileName, function (err) {
    if (err) {
      console.error("Error renaming file:", err);
      return res.status(500).send("Error renaming file");
    }
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log("server is running at port :", PORT);
});
