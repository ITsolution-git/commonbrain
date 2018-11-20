
var XLSX = require("xlsx");
var CircularJSON = require("circular-json");
var _ = require('lodash');
module.exports.parseSheet = function(filename) {
  var workbook = XLSX.readFile(filename, {cellStyles: true});
  var sheet = JSON.parse(CircularJSON.stringify(workbook));
  
  var cb = sheet.Sheets.CommonBrain;
  var cbd = sheet.Sheets.CommonBrainDash;
  var cbimages = sheet.Sheets.CommonBrainImages;

  var sheetNames = [];
  var rows = {};
  var title;
  var imageFileUrl;
  var logoFileUrl;
  var names = sheet.Workbook.Names;
  
  var namedRanges = {};
  for(var n = 1; n < names.length; n++){
      var name1 = names[n].Ref;
      namedRanges[names[n].Name] = name1;
  }
  

  /* check named ranges and search key if match then go, if no, then return error */
  let CBRowNum = {};
  for (let k in namedRanges) {
    if (namedRanges[k].split('$').length > 2) {
      CBRowNum[k] = namedRanges[k].split('$')[1];
    }
  }

  for (var i = 0; i < Object.keys(cb).length; i++) {
    var key = Object.keys(cb)[i];
    var letter = key.charAt(0);
    var number = key.substr(1);
    if (number == 2) {
      if ((cb[key].v+'').indexOf('Dash') != -1 && !CBRowNum['CBrainDashItem']) {
        CBRowNum['CBrainDashItem'] = letter;
      }
      if ((cb[key].v+'').indexOf('Sheet') != -1 && !CBRowNum['CBrainSheet']) {
        CBRowNum['CBrainSheet'] = letter;
      }
      if ((cb[key].v+'').indexOf('Tab') != -1 && !CBRowNum['CBrainTab']) {
        CBRowNum['CBrainTab'] = letter;
      }
      if ((cb[key].v+'').indexOf('Major') != -1 && !CBRowNum['CBrainMajor']) {
        CBRowNum['CBrainMajor'] = letter;
      }
      if ((cb[key].v+'').indexOf('Value') != -1 && !CBRowNum['CBrainValue']) {
        CBRowNum['CBrainValue'] = letter;
      }
      if ((cb[key].v+'').indexOf('Justification') != -1 && !CBRowNum['CBrainJustification']) {
        CBRowNum['CBrainJustification'] = letter;
      }
      if ((cb[key].v+'').indexOf('Hover') != -1 && !CBRowNum['CBrainHover']) {
        CBRowNum['CBrainHover'] = letter;
      }
      if ((cb[key].v+'').indexOf('Source') != -1 && !CBRowNum['CBrainSource']) {
        CBRowNum['CBrainSource'] = letter;
      }
    }
  }
  if (!CBRowNum['CBrainSheet'])
    return {sucess: 0, error: 'Named Range CBrainSheet is Missing.'}
  if (!CBRowNum['CBrainTab'])
    return {sucess: 0, error: 'Named Range CBrainTab is Missing.'}
  if (!CBRowNum['CBrainMajor'])
    return {sucess: 0, error: 'Named Range CBrainMajor is Missing.'}
  /* finish */


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
    if (namedRanges['CBrainLogo'] && namedRanges['CBrainLogo'].split('$').length > 2) {
      if (letter == namedRanges['CBrainLogo'].split('$')[1] && number == namedRanges['CBrainLogo'].split('$')[2]) {
        logoFileUrl = cb[Object.keys(cb)[i]].v;
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

          if (CBRowNum['CBrainDashItem'] && letter == CBRowNum['CBrainDashItem']) {
            rows[number]["dash_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainSheet'] && letter == CBRowNum['CBrainSheet']) {
            rows[number]["sheet_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainTab'] && letter == CBRowNum['CBrainTab']) {
            rows[number]["tab_name"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainMajor'] && letter == CBRowNum['CBrainMajor']) {
            rows[number]["major_category"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainSpecific'] && letter == CBRowNum['CBrainSpecific']) {
            rows[number]["spec_category"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainValue'] && letter == CBRowNum['CBrainValue']) {
            rows[number]["value"] = cb[Object.keys(cb)[i]].v;
            rows[number]["type"] = cb[Object.keys(cb)[i]].t;
            rows[number]["formatted"] = cb[Object.keys(cb)[i]].w
          }
          if (CBRowNum['CBrainJustification'] && letter == CBRowNum['CBrainJustification']) {
            rows[number]["justification"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainHover'] && letter == CBRowNum['CBrainHover']) {
            rows[number]["hover"] = cb[Object.keys(cb)[i]].v;
          }
          if (CBRowNum['CBrainSource'] && letter == CBRowNum['CBrainSource']) {
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
        
        if (number > 2) {
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

  var rootImages = null;
  var majorImages = null;
  var images = null;
  if (cbimages) {
    images = {};
    for (let key in cbimages) {
      var letter = key.charAt(0);
      var number = key.substr(1);
      if (letter.match(/[a-z]/i) || letter.match(/[A-z]/i)) {
        
        if (number > 2) {
          number = parseInt(number);
          if (cbimages[key] && Object.keys(cbimages[key]).length > 0) {
            if (!images[number]) {
              images[number] = {};
            }

            // CBDashItem
            if (letter == namedRanges['CBImageType'].split('$')[1]) {
              images[number].type = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageLink'].split('$')[1]) {
              images[number].link = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageJustification'].split('$')[1]) {
              images[number].just = cbimages[key].v;
            }
            if (letter == namedRanges['CBImagePosition'].split('$')[1]) {
              images[number].position = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageDashItem'].split('$')[1]) {
              images[number].dashItem = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageSheetName'].split('$')[1]) {
              images[number].sheetName = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageTabName'].split('$')[1]) {
              images[number].tabName = cbimages[key].v;
            }
            if (letter == namedRanges['CBImageMajorCategory'].split('$')[1]) {
              images[number].majorCategory = cbimages[key].v;
            }
          }
        }
      }
    }
  }

  rootImages = [];
  majorImages = [];
  for (let key in images) {
    if (images[key].type == 'default')
      rootImages.push(images[key]);
    if (images[key].type == 'embed')
      majorImages.push(images[key]);
  }
  imageFileUrl = ''; //ignore this one for now

  return {
  	sucess: 1, rows, sheet, title, dashes, imageFileUrl, logoFileUrl, rootImages, majorImages
  }
}


module.exports.getRenderData = function(file) {
  let dashesTemp = !file.dashes ? [{dashName:undefined}] : file.dashes;
  let dashes = [];
  for (let key in dashesTemp) {
    dashes.push(dashesTemp[key]);
  }
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