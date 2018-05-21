const express = require("express");
const router = express.Router();
var multer = require("multer");
var MongoClient = require("mongodb").MongoClient;
var CircularJSON = require("circular-json");
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var XLSX = require("xlsx");
var ObjectId = require("mongodb").ObjectId;
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../config");
var Pusher = require("pusher");

var pusher = new Pusher({
  appId: "528462",
  key: "edc0fafa92d65aa9bace",
  secret: "f5f7bb64d29de2bb3092",
  cluster: "us2",
  encrypted: true
});
var URL =
  "mongodb://dexhonsa:Awesomeo21!@cluster0-shard-00-00-puscy.mongodb.net:27017,cluster0-shard-00-01-puscy.mongodb.net:27017,cluster0-shard-00-02-puscy.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
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
// Get Files
//--------------------------------

router.get("/:userId/:projectId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ project_id: projectId })
      .toArray()
      .then(result => {
        res.status(200).send(result);
      });
  });
});

//--------------------------------
// Get File
//--------------------------------

router.get("/:userId/:projectId/:fileId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) })
      .toArray()
      .then(result => {
        res.status(200).send(result);
      });
  });
});

//--------------------------------
// Upload File
//--------------------------------

router.post("/:projectId/add", (req, res, next) => {
  fake_background_job("file");
  console.log("started");

  upload(req, res, function(err) {
    var projectId = req.params.projectId;
    var userId = req.body.userId;
    var fileName = req.body.fileName;
    mkdirp("./uploads/test", function(err) {
      var dir = "/uploads/" + userId + "/" + projectId;
      var filename = req.file.filename;
      fs.move("./tmp/" + filename, "./" + dir + "/" + filename, function(err) {
        if (err) {
          fs.remove("./tmp/" + filename);
          res.status(401).json({
            errors: {
              form: "File Exists"
            }
          });
        } else {
          var workbook = XLSX.readFile("./" + dir + "/" + filename);
          var sheet = JSON.parse(CircularJSON.stringify(workbook));
          var cb = sheet.Sheets.CommonBrain;
          var sheetNames = [];
          var rows = {};
          var title;
          for (var i = 0; i < Object.keys(cb).length; i++) {
            if (i == Object.keys(cb).length / 2) {
            }
            var key = Object.keys(cb)[i];
            var letter = key.charAt(0);
            var number = key.substr(1);
            if (letter == "A" && number == 1) {
              title = cb[Object.keys(cb)[i]].v;
            }
            if (letter.match(/[a-z]/i)) {
              var row = {};

              if (number > 2) {
                number = parseInt(number);
                if (Object.keys(cb[Object.keys(cb)[i]]).length > 0) {
                  if (rows[number] != null) {
                    if (letter == "A") {
                      rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "B") {
                      rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "C") {
                      rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "D") {
                      rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "E") {
                      rows[number]["value"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "F") {
                      rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == "G") {
                      rows[number]["source"] = cb[Object.keys(cb)[i]].v;
                    }
                  } else {
                    if (letter == "A") {
                      rows[number] = {};
                      rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                    }
                  }
                }
              }
            }
          }

          MongoClient.connect(URL, function(err, db) {
            if (err) throw err;
            var collection = db.collection("files");
            collection
              .insert({
                name: fileName,
                filename: filename,
                file_uploaded: new Date(),
                file_updated: new Date(),
                user_id: userId,
                project_id: projectId,
                rows: rows,
                title: title
              })
              .then(
                result => {
                  res.status(200).json({
                    message: "Upload Successful"
                  });
                },
                err => {
                  res.status(401).send({ error: err });
                }
              );
          });
        }
      });
    });
  });
});

async function fake_background_job(pusher_channel) {
  pusher.trigger(pusher_channel, "upload", {
    message: "Starting provisioning your account #{name}",
    progress: 30
  });
  await sleep(3000);
  pusher.trigger(pusher_channel, "upload", {
    message: "Sorry, It's taking a bit of time...",
    progress: 30
  });
  await sleep(2000);
  pusher.trigger(pusher_channel, "upload", {
    message: "almost there, adding the demo data...",
    progress: 60
  });
  await sleep(4000);
  pusher.trigger(pusher_channel, "upload", {
    message: "Polishing your new account...",
    progress: 90
  });
  await sleep(3000);
  pusher.trigger(pusher_channel, "upload", {
    message:
      "Everything is ready for you #{name}! did it feels like 12 seconds?",
    progress: 100
  });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//--------------------------------
// Upload TEST
//--------------------------------

router.post("/test", (req, res, next) => {
  upload(req, res, function(err) {
    var filename = req.file.filename;
    fs.move("./tmp/" + filename, "./uploads/test/" + filename, function(err) {
      // if (err) {
      //   fs.remove("./tmp/" + filename);
      //   fs.remove("./uploads/test/" + filename);
      //   res.status(401).json({
      //     errors: {
      //       form: "File Exists"
      //     }
      //   });
      // }else{

      var workbook = XLSX.readFile("./uploads/test/" + filename);
      var sheet = JSON.parse(CircularJSON.stringify(workbook));
      var cb = sheet.Sheets.CommonBrain;
      var sheetNames = [];
      var rows = {};
      var title;
      for (var i = 0; i < Object.keys(cb).length; i++) {
        var key = Object.keys(cb)[i];
        var letter = key.charAt(0);
        var number = key.substr(1);
        if (letter == "A" && number == 1) {
          title = cb[Object.keys(cb)[i]].v;
        }
        if (letter.match(/[a-z]/i)) {
          var row = {};

          if (number > 2) {
            number = parseInt(number);
            if (Object.keys(cb[Object.keys(cb)[i]]).length > 0) {
              if (rows[number] != null) {
                if (letter == "A") {
                  rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "B") {
                  rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "C") {
                  rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "D") {
                  rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "E") {
                  rows[number]["value"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "F") {
                  rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
                }
                if (letter == "G") {
                  rows[number]["source"] = cb[Object.keys(cb)[i]].v;
                }
              } else {
                if (letter == "A") {
                  rows[number] = {};
                  rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                }
              }
            }
          }
        }
      }
      //console.log(rows)
      //console.log(title);
      res.status(200).send(sheet);

      // MongoClient.connect(URL, function(err, db) {
      //   if (err) throw err;
      //   var collection = db.collection("files");
      //   collection
      //     .insert({
      //       name: fileName,
      //       filename:filename,
      //       file_uploaded: new Date(),
      //       file_updated:new Date(),
      //       user_id: userId,
      //       project_id: projectId
      //     })
      //     .then(
      //       result => {
      //         res.status(200).json({
      //           message:"Upload Successful"
      //         })
      //       },
      //       err => {
      //         res.status(401).send({ error: err });
      //       }
      //     );
      // });

      // }
    });
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
