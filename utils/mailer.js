const config = require('../config');
const mailcomposer = require('mailcomposer');
const fs =  require('fs');
const path =  require('path');
var mailgun = require('mailgun-js')({apiKey: config.MAILGUN_API_KEY, domain: config.MAILGUN_DOMAIN});

// module.exports.sendMailTo = function(mailTo, templateName, context, subject) {	
//     var bodyTemp = path.join(__dirname, '../email_templates/' + templateName + '.html'),
//     	contentHtml = fs.readFileSync(bodyTemp, 'utf8');

//    	for (let key in context) {
//    		contentHtml = contentHtml.split(`$$$${key}$$$`).join(context[key])
//    	}

// 	var mail = mailcomposer({
// 	  from: config.ADMIN_EMAIL,
// 	  to: mailTo,
// 	  subject: subject,
// 	  html: contentHtml
// 	});


// 	return new Promise(function(resolve, reject) {
// 		mail.build(function(error, message){
// 			var m = message.toString('ascii');

// 			var dataToSend = {
// 				to: mailTo,
// 				message: m
// 			};

// 			mailgun.messages().sendMime(dataToSend, function(sendError, body) {
// 				if (sendError) {
// 					reject(sendError);
// 				} else {
// 					resolve(body);
// 				}
// 			});
// 		});		
// 	})

// }

 

function sendMailTo(mailTo, templateName, context, subject, filenames) {

    var bodyTemp = path.join(__dirname, '../email_templates/' + templateName + '.html'),
    	contentHtml = fs.readFileSync(bodyTemp, 'utf8');

   	for (let key in context) {
   		contentHtml = contentHtml.split(`$$$${key}$$$`).join(context[key])
   	}
   	contentHtml = contentHtml.split(`$$$DOMAIN$$$`).join('http://commonbrain.io')	

	var data = {
		from: 'Support <' + config.ADMIN_EMAIL + '>',
		to: mailTo,
		subject: subject ? subject : config['MAIL_SUBJECT'][templateName],
		html: contentHtml
		// text: 'Test'
	};

	if (filenames) {
		var filepath = path.join(__dirname, '../tmp/' + filenames[0]);
		console.log(filepath);
		var file = fs.readFileSync(filepath);
		var attch = new mailgun.Attachment({data: file, filename: filenames[0]});
		data.attachment = attch;
	}
 		

	return new Promise(function(resolve, reject) {

		mailgun.messages().send(data, function (error, body) {
			if (error) {
				reject(error);
				return
			}

		  	resolve(body);
		});	
	})

}
module.exports = {
	sendMailTo: sendMailTo
}