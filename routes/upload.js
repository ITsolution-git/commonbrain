const express = require("express");
const router = express.Router();
var multer = require("multer");
var CircularJSON = require("circular-json");
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var XLSX = require("xlsx");
const MongoClient = require("mongodb").MongoClient;
var URL =
  "mongodb://dexhonsa:Awesomeo21!@cluster0-shard-00-00-puscy.mongodb.net:27017,cluster0-shard-00-01-puscy.mongodb.net:27017,cluster0-shard-00-02-puscy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
const dbName = "test";

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./tmp/");
  },
  filename: function(req, file, cb) {
    //var datetimestamp = Date.now();
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage,
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
}).single("file");

//--------------------------------
// Upload File
//--------------------------------

router.post("/", (req, res, next) => {
  

});

//--------------------------------
// Update File
//--------------------------------

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
