const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
//var bcrypt = require("bcryptjs");
var config = require("../config");

var URL =
  "mongodb://dexhonsa:Awesomeo21!@cluster0-shard-00-00-puscy.mongodb.net:27017,cluster0-shard-00-01-puscy.mongodb.net:27017,cluster0-shard-00-02-puscy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("projects");
    collection
      .find({ user_id: userId })
      .toArray()
      .then(result => {
        res.send(result);
      });
  });
});

router.post("/:userId/add", (req, res, next) => {
  var userId = req.params.userId;
  const { project_name, project_create_date } = req.body;

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("projects");
    collection
      .insert({
        project_name: project_name,
        project_create_date: project_create_date,
        user_id: userId
      })
      .then(
        result => {
          res.send(result);
        },
        err => {
          res.status(401).send({ error: err });
        }
      );
  });
});
router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  var passwordHash = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection.findOne({ username: username }).then(result => {
      if (result == null) {
        collection
          .insert({
            username: username,
            password: passwordHash,
            email: email
          })
          .then(result => {
            res.send({
              userId: result.ops[0]["_id"],
              message: "Created Succesfully"
            });
          });
      } else {
        res.status(401).send({ error: "Username Exists" });
      }
    });
  });
});
router.get("/me", function(req, res) {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token[1], config.secret, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    res.status(200).send(decoded);
  });
});

module.exports = router;
