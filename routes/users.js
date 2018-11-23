const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var fs = require("fs-extra");

var URL = process.env.MONGO_URL;

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
router.get("/:userId", (req, res, next) => {
  var token = req.headers["authorization"];
  if (!req.params.userId) {
    res.status(404).send({ auth: false, message: "No UserID provided." });
  }
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    var users = collection
      .find({ _id: ObjectId(req.params.userId) })
      .toArray()
      .then(result => {
        if (result.length == 1)
          res.json(result[0]);
        else
          res.status(404).json({ message: 'User Not Found', status: 0 });
      });
  });
});

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
router.put("/:id", (req, res, next) => {
  var token = req.headers["authorization"];
  token = token.split(" ");
  if (!token[1])
    return res.status(401).send({ auth: false, message: "No token provided." });
  const id = req.params.id;
  const param = req.body;
  delete param._id;
  var passwordHash = crypto
    .createHash("md5")
    .update(param.password)
    .digest("hex");

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("users");
    collection
      .update(
        { _id: ObjectId(id) },
        { password: passwordHash, ...param }
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



//--------------------------------
// Upload Profile Image
//--------------------------------

router.post("/:userId/profile-image", (req, res, next) => {
  upload(req, res, function(err) {
    var userId = req.params.userId;
    if(err){
      console.log(err)
    }
    var extension = req.file.filename.substr(-4);
    var fileName = userId;
    fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
      fs.move('./tmp/' + fileName + extension, './uploads/'+userId+'/' + fileName + extension, { overwrite: true }).then(result=>{
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var collection = db.collection("users");
          collection.findOne({ _id: ObjectId(userId) }).then(result => {
            if (result != null) {
              collection
                .update({ _id: ObjectId(userId) },{$set : {"image": true}})
                .then(result => {
                  res.status(200).send({message:'uploaded'})
                });
            } else {
              res.status(401).send({ error: err });
            }
          });
        });
        
      })
    });
  })
})
module.exports = router;
