'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

var sesAccessKey = 'scubamate.team@gmail.com';
var sesSecretKey = 'Scub@123';

var date = new Date();
var tim = ""+date.getTime();
tim = tim.substring(7);

var otp = ""+tim;
console.log("OTP" +otp);
exports.handler = function(event,context,callback) {
    let body = JSON.parse(event.body);
    const Email = body.Email;
    
    //let Email = event.Email;
    
    var nodemailer = require('nodemailer');
  	var smtpTransport = require('nodemailer-smtp-transport');
    
    var transporter = nodemailer.createTransport(smtpTransport({
	    service: 'gmail',
	    auth: {
	        user: sesAccessKey,
	        pass: sesSecretKey
	    }
  	}));
    
    
    var mailOptions = {
	    from: 'scubamate.team@gmail.com',
	    to: Email,
	    subject: 'Scubamate email verification',
	    html: "<h1>Scubamate - password verification</h1><br><h2>Hello! Welcome to Scubamate</h2><br><p>Please use the following One Time Pin to verify your account: </p><br>" + otp
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
          responseBody = {"OTP" : otp};
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
