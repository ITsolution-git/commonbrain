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
var scraper = require('../utils/scraper');
var Excel = require('exceljs');

var nodemailer = require('nodemailer');

var URL = process.env.MONGO_URL;

//--------------------------------
// Download File
//--------------------------------

router.get("/scrap/", async (req, res, next) => {

  // let transporter = nodemailer.createTransport({
  //   service:'gmail',
  //   secure:false,
  //   port:25,
  //   auth:{
  //     user:'itsolution0820@gmail.com',
  //     pass:'!@#calendaR'
  //   },
  //   tls:{
  //     rejectUnauthorized:false
  //   }
  // });


  // let mailOptions = {
  //   from: '"CommonBrain Support" <support@commonbrain.com>', // sender address
  //   to: 'jason@commonbrain.io ' , // list of receivers
  //   subject: "OFAC Result", // Subject line
  //   text: "", // plain text body
  //   html: "", // html body

		// attachments: [
	 //    {
  //       path: targetFileName
	 //    },
	 //  ]
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error);
  //   }
  //   console.log("CB sent: %s", info.messageId);
  // });


  var workbook = new Excel.Workbook();
  let searches = [{name: 'korea'}];
  let allResults = [];
  for (let i = 0; i < searches.length; i ++) {
  	try {
  		if (!searches[i].name)
  			continue;

			let scrapResult = await scraper.scrapeOFAC(searches[i]);
		  let worksheet = workbook.addWorksheet(searches[i]);
			worksheet.columns = [
		    { header: 'Name', key: 'name', width: 10 },
		    { header: 'Address', key: 'address', width: 32 },
		    { header: 'Type', key: 'type', width: 10 },
		    { header: 'Program', key: 'program', width: 10 },
		    { header: 'List', key: 'list', width: 10 },
		    { header: 'Score', key: 'score', width: 10 }
			];


			worksheet.addRows(scrapResult);
			allResults.push(scrapResult);
		} catch(err) {
			console.log(err);
		} 
	}

	let targetFileName = './tmp/OFAC Search - ' + new Date() + '.xlsx';
  let writeFinished = await workbook.xlsx.writeFile(targetFileName);

	res.json(allResults);

  // MongoClient.connect(URL, function(err, db) {
  //   if (err) throw err;
  //   var collection = db.collection("files");
  //   collection
  //     .find({ _id: ObjectId(fileId) }, { sheet: 0 })
  //     .toArray()
  //     .then(result => {
  //       res.download('./uploads/' + result[0].user_id + '/' + result[0].project_id + '/' + (result[0].filepath ? result[0].filepath : result[0].filename))
  //     });
  // });
});



module.exports = router;
