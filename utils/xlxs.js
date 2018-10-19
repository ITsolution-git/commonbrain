
var XLSX = require("xlsx");
var CircularJSON = require("circular-json");
var _ = require('lodash');
module.exports.parseSheet = function(filename) {
  var workbook = XLSX.readFile(filename, {cellStyles: true});
  var sheet = JSON.parse(CircularJSON.stringify(workbook));
  
  var cb = sheet.Sheets.CommonBrain;
  var cbd = sheet.Sheets.CommonBrainDash;

  var sheetNames = [];
  var rows = {};
  var title;
  var imageFileUrl;
  var names = sheet.Workbook.Names;
  
  var namedRanges = {};
  for(var n = 1; n < names.length; n++){
      var name1 = names[n].Ref;
      namedRanges[names[n].Name] = name1;
  }
  for (var i = 0; i < Object.keys(cb).length; i++) {
    if (i == Object.keys(cb).length / 2) {
    }
    var key = Object.keys(cb)[i];
    var letter = key.charAt(0);
    var number = key.substr(1);
    if (namedRanges['CBrainTitle'] && namedRanges['CBrainTitle'].split('$').length > 2) {
      if (letter == namedRanges['CBrainTitle'].split('$')[1] && number == namedRanges['CBrainTitle'].split('$')[2]) {
        title = cb[Object.keys(cb)[i]].v;
      }
    }
    if (namedRanges['CBrainImage'] && namedRanges['CBrainImage'].split('$').length > 2) {
      if (letter == namedRanges['CBrainImage'].split('$')[1] && number == namedRanges['CBrainImage'].split('$')[2]) {
        imageFileUrl = cb[Object.keys(cb)[i]].v;
      }
    }
    if (letter.match(/[a-z]/i) || letter.match(/[A-z]/i)) {
      var row = {};

      if (number > 2) {
        number = parseInt(number);
        if (Object.keys(cb[Object.keys(cb)[i]]).length > 0) {
          if (!rows[number]) {
            rows[number] = {};
          }

          if (namedRanges['CBrainDashItem'] && namedRanges['CBrainDashItem'].split('$').length > 2 &&
            letter == namedRanges['CBrainDashItem'].split('$')[1]) {
            rows[number]["dash_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainSheet'] && namedRanges['CBrainSheet'].split('$').length > 2 &&
            letter == namedRanges['CBrainSheet'].split('$')[1]) {
            rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainTab'] && namedRanges['CBrainTab'].split('$').length > 2 &&
            letter == namedRanges['CBrainTab'].split('$')[1]) {
            rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainMajor'] && namedRanges['CBrainMajor'].split('$').length > 2 &&
            letter == namedRanges['CBrainMajor'].split('$')[1]) {
            rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainSpecific'] && namedRanges['CBrainSpecific'].split('$').length > 2 &&
            letter == namedRanges['CBrainSpecific'].split('$')[1]) {
            rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainValue'] && namedRanges['CBrainValue'].split('$').length > 2 &&
            letter == namedRanges['CBrainValue'].split('$')[1]) {
            rows[number]["value"] = cb[Object.keys(cb)[i]].v;
            rows[number]["type"] = cb[Object.keys(cb)[i]].t;
            rows[number]["formatted"] = cb[Object.keys(cb)[i]].w
          }
          if (namedRanges['CBrainJustification'] && namedRanges['CBrainJustification'].split('$').length > 2 &&
            letter == namedRanges['CBrainJustification'].split('$')[1]) {
            rows[number]["justification"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainHover'] && namedRanges['CBrainHover'].split('$').length > 2 &&
            letter == namedRanges['CBrainHover'].split('$')[1]) {
            rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
          }
          if (namedRanges['CBrainSource'] && namedRanges['CBrainSource'].split('$').length > 2 &&
            letter == namedRanges['CBrainSource'].split('$')[1]) {
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
            if (letter == namedRanges['CBDashItemName'].split('$')[1]) {
              dashes[number].dashName = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemName2'].split('$')[1]) {
              dashes[number].name2 = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemStatus'].split('$')[1]) {
              dashes[number].status = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemGeography'].split('$')[1]) {
              dashes[number].geography = cbd[key].v;
            }
            if (letter == namedRanges['CBDashItemOther'].split('$')[1]) {
              dashes[number].other = cbd[key].v;
            }


          }
        }
      }
    }
  }
  return {
  	rows, sheet, title, dashes, imageFileUrl
  }
}


module.exports.getRenderData = function(file) {

  let dashes = !file.dashes ? [{dashName:undefined}] : file.dashes;
  let rows = [];
  for(let k in file.rows)
    rows.push(file.rows[k]);

  let renderData = dashes.map(dash=>{
    let dashRows = rows.filter(row=>row.dash_name == dash.dashName);
    let sheets = [];
    let sheetRows = _.groupBy(dashRows, 'sheet_name');

    for (let sheetkey in sheetRows) {
      let tabRows = _.groupBy(sheetRows[sheetkey], 'tab_name');
      let tabs = [];
      for (let tabkey in tabRows) {
        let majorCatRows = _.groupBy(tabRows[tabkey], 'major_category');
        let majorCats = [];
        for (let catkey in majorCatRows) {
          majorCats.push({name: catkey, data: majorCatRows[catkey]});
        }
        tabs.push({name: tabkey, data: majorCats});
      }
      sheets.push({name: sheetkey, data: tabs});
    }

    return {
      dash: dash,
      data: sheets
    }
  })
  return renderData;
}