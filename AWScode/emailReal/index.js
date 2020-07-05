'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

var sesAccessKey = 'scubamate.team@gmail.com';
var sesSecretKey = 'Scub@123';

exports.handler = function(event,context,callback) {
    let body = JSON.parse(event.body);
    const Email = body.Email;
    
    var nodemailer = require('nodemailer');
  	var smtpTransport = require('nodemailer-smtp-transport');
    
    var transporter = nodemailer.createTransport(smtpTransport({
	    service: 'gmail',
	    auth: {
	        user: sesAccessKey,
	        pass: sesSecretKey
	    }
  	}));
    
    var text = 'Bruh moment no.69 they never end baby';
    
    var mailOptions = {
	    from: 'scubamate.team@gmail.com',
	    to: Email,
	    subject: 'Scubamate email verification',
	    html: "<h1>Scubamate - password verification</h1><br><h2>Hello! Welcome to Scubamate</h2><br><p>Please click on the button below to verify your email address:</p><form action = 'https://youtu.be/dQw4w9WgXcQ'><input type = 'submit' value = 'Verify email address'/></form>"
  	};
    
    var responseBody;
    var statusCode;
    
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        const response = {
          statusCode: 404,
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
          body: JSON.stringify({
            error: error.message,
          }),
        };
        callback(null, response);
      }
      else
      {
      
        statusCode = 200,
          responseBody = "Email processed succesfully!";
      }
       var  response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(responseBody),
      };
      callback(null, response);
    });
}
