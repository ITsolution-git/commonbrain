const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");

var URL = process.env.MONGO_URL;

router.get("/", (req, res, next) => {
  var token = req.headers["authorization"];
  if (token == null) {
    res.status(500).send({ auth: false, message: "No token provided." });
  }
  // token = token.split(" ");
  // if (!token[1]) {
  //   return res.status(401).send({ auth: false, message: "No token provided." });
  // }
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    var users = collection
      .find({})
      .toArray()
      .then(result => {
        res.json(result);
      });
  });
});
router.post("/", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const { username, password, email } = req.body;
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  //console.log(username, password, email);
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection
      .insert({ username: username, password: passwordHash, email: email })

      .then(result => {
        res.json(result);
      });
  });
});
router.patch("/:id", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const id = req.params.id;
  const { username, password, email } = req.body;
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection
      .update(
        { _id: ObjectId(id) },
        { username: username, password: passwordHash, email: email }
      )

      .then(result => {
        res.json(result);
      });
  });
});
router.delete("/:id", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const id = req.params.id;
  const { username, password, email } = req.body;
  //console.log(username, password, email);
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.remove({ _id: ObjectId(id) }).then(result => {
      res.json(result);
    });
  });
});

module.exports = router;
