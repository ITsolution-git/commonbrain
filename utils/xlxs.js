
var XLSX = require("xlsx");
var CircularJSON = require("circular-json");
var _ = require('lodash');
var Excel = require('exceljs');
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
  var dashItemNameLabel = 'Asset Name';
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

      if (namedRanges['DashItemNameLabel'] && namedRanges['DashItemNameLabel'].split('$').length > 2) {
        if (letter == namedRanges['DashItemNameLabel'].split('$')[1] && number == namedRanges['DashItemNameLabel'].split('$')[2]) {
          dashItemNameLabel = cbd[key].v;
        }
      }

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

    for (var i = 0; i < Object.keys(cbimages).length; i++) {
      var key = Object.keys(cbimages)[i];
      var letter = key.charAt(0);
      var number = key.substr(1);

      if (number == 2) {
        if ((cbimages[key].v+'').toLowerCase().indexOf('type') != -1 && !CBRowNum['CBImageType']) {
          CBRowNum['CBImageType'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('link') != -1 && !CBRowNum['CBImageLink']) {
          CBRowNum['CBImageLink'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('justification') != -1 && !CBRowNum['CBImageJustification']) {
          CBRowNum['CBImageJustification'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('position') != -1 && !CBRowNum['CBImagePosition']) {
          CBRowNum['CBImagePosition'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('dashitem') != -1 && !CBRowNum['CBImageDashItem']) {
          CBRowNum['CBImageDashItem'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('sheetname') != -1 && !CBRowNum['CBImageSheetName']) {
          CBRowNum['CBImageSheetName'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('tabname') != -1 && !CBRowNum['CBImageTabName']) {
          CBRowNum['CBImageTabName'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('major') != -1 && !CBRowNum['CBImageMajorCategory']) {
          CBRowNum['CBImageMajorCategory'] = letter;
        }
        if ((cbimages[key].v+'').toLowerCase().indexOf('description') != -1 && !CBRowNum['CBImageDescription']) {
          CBRowNum['CBImageDescription'] = letter;
        }
      }
    }
    if (!CBRowNum['CBImageType'])
      return {sucess: 0, error: 'Named Range CBImageType is Missing.'}
    if (!CBRowNum['CBImageLink'])
      return {sucess: 0, error: 'Named Range CBImageLink is Missing.'}
    if (!CBRowNum['CBImageDashItem'])
      return {sucess: 0, error: 'Named Range CBImageDashItem is Missing.'}
    if (!CBRowNum['CBImageJustification'])
      return {sucess: 0, error: 'Named Range CBImageJustification is Missing.'}
    if (!CBRowNum['CBImagePosition'])
      return {sucess: 0, error: 'Named Range CBImagePosition is Missing.'}
    if (!CBRowNum['CBImageSheetName'])
      return {sucess: 0, error: 'Named Range CBImageSheetName is Missing.'}
    if (!CBRowNum['CBImageTabName'])
      return {sucess: 0, error: 'Named Range CBImageTabName is Missing.'}
    if (!CBRowNum['CBImageMajorCategory'])
      return {sucess: 0, error: 'Named Range CBImageMajorCategory is Missing.'}
    if (!CBRowNum['CBImageDescription'])
      return {sucess: 0, error: 'Named Range CBImageDescription is Missing.'}
    /* finish */


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

            if (CBRowNum['CBImageType'] && letter == CBRowNum['CBImageType']) {
              images[number].type = cbimages[key].v;
            }
            if (CBRowNum['CBImageLink'] && letter == CBRowNum['CBImageLink']) {
              images[number].link = cbimages[key].v;
            }
            if (CBRowNum['CBImageJustification'] && letter == CBRowNum['CBImageJustification']) {
              images[number].just = cbimages[key].v;
            }
            if (CBRowNum['CBImagePosition'] && letter == CBRowNum['CBImagePosition']) {
              images[number].position = cbimages[key].v;
            }
            if (CBRowNum['CBImageDashItem'] && letter == CBRowNum['CBImageDashItem']) {
              images[number].dashItem = cbimages[key].v;
            }
            if (CBRowNum['CBImageSheetName'] && letter == CBRowNum['CBImageSheetName']) {
              images[number].sheetName = cbimages[key].v;
            }
            if (CBRowNum['CBImageTabName'] && letter == CBRowNum['CBImageTabName']) {
              images[number].tabName = cbimages[key].v;
            }
            if (CBRowNum['CBImageMajorCategory'] && letter == CBRowNum['CBImageMajorCategory']) {
              images[number].majorCategory = cbimages[key].v;
            }
            if (CBRowNum['CBImageDescription'] && letter == CBRowNum['CBImageDescription']) {
              images[number].desc = cbimages[key].v;
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
  	success: 1, rows, sheet, title, dashes, imageFileUrl, logoFileUrl, rootImages, majorImages, dashItemNameLabel
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


module.exports.makeReport = function(renderData, file, user) {


  const makeLink = function(link) {
    link = link + '';
    if (!link.startsWith('https://') || !link.startsWith('http://')) {
      // The following line is based on the assumption that the URL will resolve using https.
      // Ideally, after all checks pass, the URL should be pinged to verify the correct protocol.
      // Better yet, it should need to be provided by the user - there are nice UX techniques to address this.
      link = `http://${link}`
    }
    return link;
  }

  const pad_with_zeroes = function(number, length) {
    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;
  }

  var workbook = new Excel.Workbook();
  var worksheet = workbook.addWorksheet('CommonBrain');

  worksheet.columns = [
    { header: `${file.title}`, key: 'A', width: 10 },
    { header: '', key: 'B', width: 10 },
    { header: '', key: 'C', width: 10 },
    { header: '', key: 'D', width: 10 },
    { header: '', key: 'E', width: 20 },
    { header: '', key: 'F', width: 20 },
    { header: '', key: 'G', width: 5 },
    { header: '', key: 'H', width: 20 },
    { header: '', key: 'I', width: 20 },
    { header: '', key: 'J', width: 10 },
  ];
  worksheet.mergeCells('A1:J1');
  worksheet.getRow(1).height = 40;
  worksheet.getCell('A1').font = {
      size: 40,
      bold: true
  };
  let rowNum = 2;
  let row;
  renderData.map((dash, dashIndex)=>{
    
    row = worksheet.addRow([`${dash.dash.dashName || ''}  ${dash.dash.name2 || ''}`]);
    row.height = 30;
    row.getCell(1).font = {
        size: 25,
        bold: true
    };
    row.getCell(1).name = "Dash" + pad_with_zeroes(dashIndex+1, 2);
    rowNum ++;
    dash.data.map((sheet, sheetIndex)=>{
      row = worksheet.addRow(['', `${sheet.name || ''}`]);
      row.height = 25;
      row.getCell(2).font = {
          size: 20,
          bold: true
      };
      row.getCell(2).name = "Dash" + pad_with_zeroes(dashIndex+1, 2) + "Sheet" + pad_with_zeroes(sheetIndex+1, 2);
      rowNum ++;
      sheet.data.map((tab, tabIndex)=>{
        row = worksheet.addRow(['', '', `${tab.name || ''}`]);
        row.height = 20;
        row.getCell(3).font = {
            size: 18,
            bold: true
        };
        row.getCell(3).name = "Dash" + pad_with_zeroes(dashIndex+1, 2) + "Sheet" + pad_with_zeroes(sheetIndex+1, 2) + "Tab" + pad_with_zeroes(tabIndex+1, 2);
        rowNum ++;

        tab.data.map((majcat, majIndex)=>{
          row = worksheet.addRow(['', '', '', `${majcat.name || ''}`]);
          rowNum ++;

          row.getCell(4).name = "Dash" + pad_with_zeroes(dashIndex+1, 2) + "Sheet" + pad_with_zeroes(sheetIndex+1, 2) + "Tab" + pad_with_zeroes(tabIndex+1, 2) + "Major" + pad_with_zeroes(majIndex+1, 2);
          
          for (let i = 0; i < majcat.data.length; i+=2) {
            if (i+1 < majcat.data.length) {
              row = worksheet.addRow(['', '', '', '', `${majcat.data[i].spec_category || ''}`, `${majcat.data[i].formatted || ''}`, '', `${majcat.data[i+1].spec_category || ''}`, `${majcat.data[i+1].formatted || ''}`]);

              if (majcat.data[i].source && user.showHyperlink) {
                row.getCell(6).font = { color: { argb: 'FF0000FF' } };
                row.getCell(6).value = { text: majcat.data[i].formatted, hyperlink: makeLink(majcat.data[i].source)}; 
              }
              if (majcat.data[i+1].source && user.showHyperlink) {
                row.getCell(9).font = { color: { argb: 'FF0000FF' } };
                row.getCell(9).value = { text: majcat.data[i+1].formatted, hyperlink: makeLink(majcat.data[i+1].source) };
              }

              row.getCell(5).alignment = { wrapText: true };
              row.getCell(6).alignment = { wrapText: true };
              row.getCell(8).alignment = { wrapText: true };
              row.getCell(9).alignment = { wrapText: true };
              rowNum ++;
            } else {
              row = worksheet.addRow(['', '', '', '', `${majcat.data[i].spec_category || ''}`, `${majcat.data[i].formatted || ''}`]);

              if (majcat.data[i].source && user.showHyperlink) {
                row.getCell(6).font = { color: { argb: 'FF0000FF' } };
                row.getCell(6).value = { text: majcat.data[i].formatted, hyperlink: makeLink(majcat.data[i].source) };
              }
              
              row.getCell(5).alignment = { wrapText: true };
              row.getCell(6).alignment = { wrapText: true };
              row.getCell(8).alignment = { wrapText: true };
              row.getCell(9).alignment = { wrapText: true };
              rowNum++;
            }
          }
        })
      })
    })
  })

  let filename = `${new Date().getTime()}.xlsx`;
  return workbook.xlsx.writeFile('./tmp/' + filename).then(()=>{
    return filename;
  });
}