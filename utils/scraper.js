const path = require('path');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ 
  show: true,
  paths: {
    userData: '/user/data'
  },
  downloads: __dirname
})

module.exports.scrapeOFAC = (searchObj) => {

  return nightmare
  .goto('https://sanctionssearch.ofac.treas.gov/')
  .type('input[name="ctl00$MainContent$txtLastName"]', searchObj.name)
  .click('input[name="ctl00$MainContent$btnSearch"]')
  .wait('#gvSearchResults')
  .wait(1000 * 5)
  .evaluate(() => {
    let rows = document.querySelectorAll('#gvSearchResults tr');
    let result = [];
    for (let i = 0; i < rows.length; i ++) {
      try {
        let obj = {};
        let tds = rows[i].querySelectorAll('td');
        obj.name = tds[0].querySelector('a').innerHTML;
        obj.address = tds[1].innerHTML;
        obj.type = tds[2].innerHTML;
        obj.program = tds[3].innerHTML;
        obj.list = tds[4].innerHTML;
        obj.score = tds[5].innerHTML;
        result.push(obj);
      } catch(err) {
        console.log(err);
      }
    }
    return result;
  })
  .end()
  .then((res)=>{
    return res;
  })
  .catch(error => {
    console.error('Search failed:', error)
    return [];
  })
}