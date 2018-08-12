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
// Download File
//--------------------------------

router.get("/download/:userId/:projectId/:fileId", (req, res, next) => {
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
        res.download('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + result[0].filename)
      });
  });
});

//--------------------------------
// Delete File
//--------------------------------

router.delete("/:userId/:projectId/:fileId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  const fileId = req.params.fileId;
  // console.log('Deleteing')
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) })
      .toArray()
      .then(result => {
        
        fs.unlink('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + result[0].filename)
        fs.unlink('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + result[0]._id + '.jpg')
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var fileCollection = db.collection("files");
          fileCollection.deleteOne({ _id: ObjectId(fileId) });
          res.status(200).send('Deleted Successfully')
        })
      });
  });
});

//--------------------------------
// Upload File Image
//--------------------------------

router.post("/:userId/:projectId/:fileId/image", (req, res, next) => {
  upload(req, res, function(err) {
    var userId = req.params.userId;
    var projectId = req.params.projectId;
    var fileId = req.params.fileId;
    if(err){
      console.log(err)
    }
    var extension = req.file.filename.substr(-4);
    var fileName = req.params.fileId;
    fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
      fs.move('./tmp/' + fileName + extension, './uploads/'+userId+'/'+projectId+'/' + fileName + extension, { overwrite: true }).then(result=>{
        MongoClient.connect(URL, function(err, db) {
          if (err) throw err;
          var collection = db.collection("files");
          collection.findOne({ _id: ObjectId(fileId) }).then(result => {
            if (result != null) {
              collection
                .update({ _id: ObjectId(fileId) },{$set : {"image":true}})
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

//--------------------------------
// Upload File
//--------------------------------

router.post("/:projectId/add", (req, res, next) => {
  fake_background_job("file");

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
          var names = sheet.Workbook.Names;
          
          var namedRanges = {};
          for(var n = 1; n < names.length; n++){
              var name1 = names[n].Ref;
              var arr = name1.split('$');
              namedRanges[names[n].Name] = arr[1]
          }
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
                    if (letter == namedRanges['CBrainSheet']) {
                      rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainTab']) {
                      rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainMajor']) {
                      rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainSpecific']) {
                      rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainValue']) {
                      rows[number]["value"] = cb[Object.keys(cb)[i]].v;
                      rows[number]["type"] = cb[Object.keys(cb)[i]].t;
                      rows[number]["formatted"] = cb[Object.keys(cb)[i]].w
                    }
                    if (letter == namedRanges['CBrainJustification']) {
                      rows[number]["justification"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainHover']) {
                      rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
                    }
                    if (letter == namedRanges['CBrainSource']) {
                      rows[number]["source"] = cb[Object.keys(cb)[i]].v;
                    }
                  } else {
                    if (letter == namedRanges['CBrainSheet']) {
                      rows[number] = {};
                      rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                    }
                  }
                }
              }
            }
          }
          // res.status(200).send(sheet);

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
                sheet:sheet,
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

//--------------------------------
// Replace File
//--------------------------------

router.post("/replace/:userId/:projectId/:fileId", (req, res, next) => {
  var fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) })
      .toArray()
      .then(result => {
        upload(req, res, function(err) {
          var projectId = req.params.projectId;
          var userId = req.body.userId;
          var fileName = result[0].filename;
          mkdirp("./uploads/test", function(err) {
            var dir = "/uploads/" + userId + "/" + projectId;
            var filename = req.file.filename;
            fs.move("./tmp/" + filename, "./" + dir + "/" + result[0].filename, { overwrite: true }, function(err) {
              if (err) {
                console.log(err);
                fs.remove("./tmp/" + filename);
                res.status(401).json({
                  errors: {
                    form: "File Exists"
                  }
                });
              } else {
                var workbook = XLSX.readFile("./" + dir + "/" + result[0].filename);
                var sheet = JSON.parse(CircularJSON.stringify(workbook));
                var cb = sheet.Sheets.CommonBrain;
                var sheetNames = [];
                var rows = {};
                var title;
                var names = sheet.Workbook.Names;
                var namedRanges = {};
                for(var n = 1; n < names.length; n++){
                    var name1 = names[n].Ref;
                    var arr = name1.split('$');
                    namedRanges[names[n].Name] = arr[1]
                }
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
                          if (letter == namedRanges['CBrainSheet']) {
                            rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainTab']) {
                            rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainMajor']) {
                            rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainSpecific']) {
                            rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainValue']) {
                            rows[number]["value"] = cb[Object.keys(cb)[i]].v;
                            rows[number]["type"] = cb[Object.keys(cb)[i]].t;
                            rows[number]["formatted"] = cb[Object.keys(cb)[i]].w
                          }
                          if (letter == namedRanges['CBrainJustification']) {
                            rows[number]["justification"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainHover']) {
                            rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
                          }
                          if (letter == namedRanges['CBrainSource']) {
                            rows[number]["source"] = cb[Object.keys(cb)[i]].v;
                          }
                        } else {
                          if (letter == namedRanges['CBrainSheet']) {
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
                    .replaceOne({ _id: ObjectId(fileId) },{
                      name: filename.substring(0, filename.length - 5),
                      filename: fileName,
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
  });

  
});

//--------------------------------
// Update File 
//--------------------------------
router.put("/update/:userId/:projectId/:fileId", (req, res, next) => {
  var chart = req.body;
  
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .update({ _id: ObjectId(req.params.fileId) }, {$set:{chart}})
      .then(
        result => {
          res.status(200).json({
            message: "Update Successfull"
          });
        },
        err => {
          res.status(401).send({ error: err });
        }
      );
  });

})

//--------------------------------
// Upload File ~~~~~TEST~~~~~
//--------------------------------

router.post("/testupload", (req, res, next) => {
  fake_background_job("file");

  upload(req, res, function(err) {
    var projectId = req.params.projectId;
    var userId = req.body.userId;
    var fileName = req.body.fileName;
   
      
        
          var workbook = XLSX.readFile('./tmp/'+req.file.filename);
          var sheet = JSON.parse(CircularJSON.stringify(workbook));
          res.send(sheet);
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
                      rows[number]["type"] = cb[Object.keys(cb)[i]].t;
                      rows[number]["formatted"] = cb[Object.keys(cb)[i]].w
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
          // res.status(200).send(sheet);

          MongoClient.connect(URL, function(err, db) {
            if (err) throw err;
            var collection = db.collection("testFiles");
            collection
              .insert({
                name: fileName,
                filename: filename,
                file_uploaded: new Date(),
                file_updated: new Date(),
                user_id: userId,
                project_id: projectId,
                rows: rows,
                sheet:sheet,
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


module.exports = router;
