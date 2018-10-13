
var XLSX = require("xlsx");
var CircularJSON = require("circular-json");

module.exports.parseSheet = function(filename) {
  var workbook = XLSX.readFile(filename, {cellStyles: true});
  var sheet = JSON.parse(CircularJSON.stringify(workbook));
  
  var cb = sheet.Sheets.CommonBrain;
  var cbd = sheet.Sheets.CommonBrainDash;

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
    if (letter.match(/[a-z]/i) || letter.match(/[A-z]/i)) {
      var row = {};

      if (number > 2) {
        number = parseInt(number);
        if (Object.keys(cb[Object.keys(cb)[i]]).length > 0) {
          if (!rows[number]) {
            rows[number] = {};
          }

          if (letter == namedRanges['CBrainDashItem']) {
            rows[number]["dash_name"] = cb[Object.keys(cb)[i]].v;
          }
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
        }
      }
    }
  }

  var dashes = null;

  if (cbd) {
    dashes = {};
    for (let key in cbd) {
      var letter = key.charAt(0);
      var number = key.substr(1);
      if (letter.match(/[a-z]/i) || letter.match(/[A-z]/i)) {
        
        if (number > 1) {
          number = parseInt(number);
          if (cbd[key] && Object.keys(cbd[key]).length > 0) {
            if (!dashes[number]) {
              dashes[number] = {};
            }

            // CBDashItem
            if (letter == namedRanges['CBDashItemName']) {
              dashes[number].dashName = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemName2']) {
              dashes[number].name2 = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemStatus']) {
              dashes[number].status = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemGeography']) {
              dashes[number].geography = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemOther']) {
              dashes[number].other = cbd[key].v;
            }


          }
        }
      }
    }
  }
  return {
  	rows, sheet, title, dashes
  }
}