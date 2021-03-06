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
var xlxsUtil = require('../utils/xlxs');
var Excel = require('exceljs');
var mailer = require('../utils/mailer');
var authMiddleware = require('../middlewares/auth');

var pusher = new Pusher({
  appId: "528462",
  key: "edc0fafa92d65aa9bace",
  secret: "f5f7bb64d29de2bb3092",
  cluster: "us2",
  encrypted: true
});
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

//--------------------------------
// Download File
//--------------------------------

router.get("/download/:fileId", (req, res, next) => {
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {
        res.download('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + (result[0].filepath ? result[0].filepath : result[0].filename))
      });
  });
});


//--------------------------------
// Send Report
//--------------------------------
router.post("/report/sendreport/:fileId", (req, res, next) => {
  

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    var users = db.collection("users");
    var user = null;

    new Promise((resolve, reject) => {
      if (req.user) {
        users
        .find({ _id: ObjectId(req.user._id) }, { sheet: 0 })
        .toArray()
        .then(result => {
          if (result.length > 0)
            resolve(result[0]);
          else
            resolve(null);
        });
      } else {
        resolve(null);
      }
    }).then(userObj => {
      user = userObj;
      return collection
        .find({ _id: ObjectId(fileId) }, { sheet: 0 })
        .toArray();
    }).then(result => {

      let renderData = xlxsUtil.getRenderData(result[0]);
      return xlxsUtil.makeReport(renderData, result[0], user);
    }).then(filename=>{
      console.log(filename);
      console.log(req.body);

      return mailer.sendMailTo(req.body.emailAddress, 'excel-report', {
        
      }, 'Report', [filename]).then(()=>{
        fs.remove('./tmp' + filename);
        res.json({success: 1});
      });
      
      

    }).catch(err => {
      res.status(500).json(err);
    });
  });
});



//--------------------------------
// Download Excel File
//--------------------------------
router.get("/report/excel/:fileId", (req, res, next) => {
  const fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    var users = db.collection("users");
    var user = null;
    new Promise((resolve, reject) => {
      if (req.user) {
        users
        .find({ _id: ObjectId(req.user._id) }, { sheet: 0 })
        .toArray()
        .then(result => {
          if (result.length > 0)
            resolve(result[0]);
          else
            resolve(null);
        });
      } else {
        resolve(null);
      }
    }).then(userObj => {
      user = userObj;
      return collection
        .find({ _id: ObjectId(fileId) }, { sheet: 0 })
        .toArray();
    }).then(result => {

      let renderData = xlxsUtil.getRenderData(result[0]);
      return xlxsUtil.makeReport(renderData, result[0], user);
    }).then(filename=>{
      res.download('./tmp/' + filename);
    }).catch(err => {
      res.status(500).json(err);
    });
  });
});



//--------------------------------
// Delete File
//--------------------------------

router.delete("/:fileId", (req, res, next) => {
  const fileId = req.params.fileId;
  // console.log('Deleteing')
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
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

router.post("/:fileId/image", (req, res, next) => {
  let fileId = req.params.fileId;

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection.findOne({ _id: ObjectId(fileId) }, { sheet: 0 }).then(result => {
        console.log(result);
      if (result != null) {
        upload(req, res, function(err) {
          var fileId = req.params.fileId;
          if(err){
            console.log(err);
            throw err;
          }
          var extension = req.file.filename.substr(-4);
          var fileName = req.params.fileId;
          fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
            fs.move('./tmp/' + fileName + extension, './uploads/'+result.user_id+'/'+result.project_id+'/' + fileName + '_image' + extension, { overwrite: true }).then(result=>{
        
              collection
                .update({ _id: ObjectId(fileId) },{$set : {"image":true}})
                .then(result => {
                  res.status(200).send({message:'uploaded'})
                });
        
            })
          });
        })

      } else {
        res.status(401).send({ error: err });
      }
    });
  });
})

//--------------------------------
// Upload File Logo
//--------------------------------

router.post("/:fileId/logo", (req, res, next) => {
  let fileId = req.params.fileId;

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection.findOne({ _id: ObjectId(fileId) }, { sheet: 0 }).then(result => {
      if (result != null) {
        upload(req, res, function(err) {
          var fileId = req.params.fileId;
          if(err){
            console.log(err)
            throw err;
          }
          var extension = req.file.filename.substr(-4);
          var fileName = req.params.fileId;
          fs.rename('./tmp/' + req.file.filename, './tmp/'+ fileName + extension).then(res1=>{
            fs.move('./tmp/' + fileName + extension, './uploads/' + result.user_id + '/'  + result.project_id + '/' + fileName + '_logo' + extension, { overwrite: true }).then(result=>{
        
              collection
                .update({ _id: ObjectId(fileId) },{$set : {"logo":true}})
                .then(result => {
                  res.status(200).send({message:'uploaded'})
                });
        
            })
          });
        })

      } else {
        res.status(401).send({ error: err });
      }
    });
  });
})
//--------------------------------
// Upload File
//--------------------------------

router.post("/:projectId/add", (req, res, next) => {
  fake_background_job("file");
  upload(req, res, function(err) {
    if (err) {
      res.status(401).send({ error: err });
    }
    var projectId = req.params.projectId;
    var userId = req.body.userId;
    // var fileName = req.body.fileName;
    var dir = "/uploads/" + userId + "/" + projectId;
    if(!req.file) {
      res.status(401).json({
        errors: {
          form: 'File is required.'
        }
      });
      return;
    }
    var filename = req.file.filename;

    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;

      var collection = db.collection("files");
      collection
      .find({ project_id: projectId, user_id: userId, filename: filename }, { sheet: 0 })
      .toArray()
      .then(result => {
        if (result.length > 0) {
          res.status(401).json({
            type: 'filename_exist',
            file: result[0]
          });
        } else {

          let timestamp = new Date().getTime();
          let filepath  = filename + '$$$$' + timestamp;
          fs.move("./tmp/" + filename, "./" + dir + "/" + filepath, function(err) {
            if (err) {
              fs.remove("./tmp/" + filename);
              res.status(401).json({
                errors: {
                  form: "File Exists"
                }
              });
            } else {
              let obj = xlxsUtil.parseSheet("./" + dir + "/" + filepath)

              if (!obj.success) {
                res.status(401).json({
                  errors: {
                    form: obj.error
                  }
                });
                return;
              }
              let fileSave = {
                name: filename.substring(0, filename.length - 5),
                filename: filename,
                filepath: filepath,
                file_uploaded: new Date(),
                file_updated: new Date(),
                user_id: userId,
                project_id: projectId,
                rows: obj.rows,
                // sheet: obj.sheet,
                title: obj.title,
                dashes: obj.dashes,
                imageFrom: 'file',
                imageFileUrl: obj.imageFileUrl,
                logoFrom: 'file',
                logoFileUrl: obj.logoFileUrl,
                rootImages: obj.rootImages,
                majorImages: obj.majorImages,
                dashItemNameLabel:  obj.dashItemNameLabel
              };
              MongoClient.connect(URL, function(err, db) {
                if (err) throw err;
                collection
                  .insert(fileSave)
                  .then(
                    result => {
                      let id = result.insertedIds[0].toString();
                      let newpath = filepath + '$$$' + id + '.xlsx';
                      fs.move("./" + dir + "/" + filepath, "./" + dir + "/" + newpath, function(err) {
                        if (err) {
                        } else {
                          collection
                          .update({ _id: ObjectId(id) },{ $set: {
                            filepath: newpath
                          }}).then(result=>{

                            res.status(200).json({
                              message: "Upload Successful"
                            });
                          })
                        }
                      });
                    },
                    err => {
                      fs.remove("./" + dir + "/" + filepath);
                      res.status(401).send({ error: err });
                    }
                  );
              });
            }
          });
        }
      })
    });
  });
});

//--------------------------------
// Replace File
//--------------------------------

router.post("/replace/:fileId", (req, res, next) => {
  var fileId = req.params.fileId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ _id: ObjectId(fileId) }, { sheet: 0 })
      .toArray()
      .then(result => {
        upload(req, res, function(err) {
          var projectId = result[0].project_id;
          var userId = result[0].user_id;
          var fileName = result[0].filename;
          mkdirp("./uploads/test", function(err) {
            var dir = "/uploads/" + userId + "/" + projectId;
            var filename = req.file.filename;
            let timestamp = new Date().getTime();
            let filepath  = filename + '$$$$' + timestamp + '$$$' + result[0]._id + '.xlsx';
            fs.move("./tmp/" + filename, "./" + dir + "/" + filepath, { overwrite: true }, function(err) {
              try {
                if (err) {
                  console.log(err);
                  fs.remove("./tmp/" + filename);
                  res.status(401).json({
                    errors: {
                      form: "File Exists"
                    }
                  });
                } else {
                  let obj = xlxsUtil.parseSheet("./" + dir + "/" + filepath);
                  if (!obj.success) {
                    res.status(401).json({
                      errors: {
                        form: obj.error
                      }
                    });
                    return;
                  }
                  MongoClient.connect(URL, function(err, db) {
                    if (err) throw err;
                    var collection = db.collection("files");
                    
                    collection
                      .update({ _id: ObjectId(fileId) },{ $set: {
                        name: filename.substring(0, filename.length - 5),
                        filename: filename,
                        filepath: filepath,
                        file_uploaded: new Date(),
                        file_updated: new Date(),
                        user_id: userId,
                        project_id: projectId,
                        rows: obj.rows,
                        // sheet: obj.sheet,
                        title: obj.title,
                        dashes: obj.dashes,
                        imageFrom: 'file',
                        imageFileUrl: obj.imageFileUrl,
                        logoFrom: 'file',
                        logoFileUrl: obj.logoFileUrl,
                        rootImages: obj.rootImages,
                        majorImages: obj.majorImages,
                        dashItemNameLabel: obj.dashItemNameLabel
                      }})
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
              } catch (err) {

                res.status(401).json({
                  errors: {
                    form: "Somethng went wrong."
                  }
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
router.put("/update/:fileId", (req, res, next) => {
  var chart = req.body;
  
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");

    collection
      .update({ _id: ObjectId(req.params.fileId) }, {$set:chart})
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

//--------------------------------
// Get Files
//--------------------------------

router.get("/projects/:projectId", (req, res, next) => {
  const userId = req.params.userId;
  const projectId = req.params.projectId;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    collection
      .find({ project_id: projectId }, { sheet: 0 })
      .toArray()
      .then(result => {
        res.status(200).send(result);
      });
  });
});
//--------------------------------
// Get Shared Files
//--------------------------------

router.post("/shared", (req, res, next) => {
  const email = req.body.email;
  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");

    collection
      .find({ "permissions.emails" : { "$in" : [email] } })
      .toArray()
      .then(result => {
        res.status(200).send(result);
      });
  });
});



//--------------------------------
// Get File
//--------------------------------

router.get("/:fileId", (req, res, next) => {
  const fileId = req.params.fileId;
  let file = null;

  MongoClient.connect(URL, function(err, db) {
    if (err) throw err;
    var collection = db.collection("files");
    var projects = db.collection('projects');
    collection
    .find({ _id: ObjectId(fileId) }, { sheet: 0 })
    .toArray()
    .then(result=>{
      file = result;
      
      projects
      .find({ _id: ObjectId(file.project_id) })
      .toArray()
      .then(result=>{
        res.status(200).send({file: file, project: result[0]});  
      })
      
    });
  });
});


module.exports = router;
