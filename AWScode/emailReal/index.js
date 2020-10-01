'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

var sesAccessKey = 'scubamate.team@gmail.com';
var sesSecretKey = 'Scub@123';

var date = new Date();
var tim = ""+date.getTime();
tim = tim.substring(7);

//var crypto = window.crypto;
//var typedArray = new Uint32Array(1);
//crypto.getRandomValues(typedArray);
//var otp = typedArray[0];

//const crypto = require('crypto');
//var otp = crypto.randomBytes(16).toString('hex').slice(0,16);

var otp = ""+tim;

//var otp = ""+(Math.floor(Math.random() * 999999-100000+1) + 100000);

console.log("OTP" +otp);
exports.handler = function(event,context,callback) {
  
  
    let body = JSON.parse(event.body);
    const Email = body.Email;
    const Type = "Password";
    
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
    
    
    var emailContent;
    if(Type.localeCompare("Email") == 0)
    {
      emailContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Scubamate Email Verification</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600"><tr><td align="center" bgcolor="#264653" style="padding: 40px 0 30px 0;"><img src="https://s3.af-south-1.amazonaws.com/scuba.thematthew.me/assets/images/full+logo+wit.png" alt="Scubamate Logo" width="80%" height="auto" style="display: block;" /></td>  </tr><tr><td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 24px;"><b>Welcome to Scubamate!</b></td></tr><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Thanks for registering at Scubamate! Please confirm your email by copying the confirmation code below onto the OTP pop-up message on the application.</td></tr><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Here is the confirmation code: <h2 style="color: #2A9D8F; font-family: Arial, sans-serif; font-size: 24px;">'+ otp+'</h2></td></tr></table></td></tr><tr><td bgcolor="#2A9D8F " style="padding: 30px 30px 30px 30px;color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">For any enquiries, please contact us at <a href="mailto:teamav301@gmail.com" style = "color: #264653;">teamav301@gmail.com</a></td></tr></table></body></html>' ;
    }else{
      emailContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Scubamate Password Recovery</title><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body style="margin: 0; padding: 0;"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600"><tr><td align="center" bgcolor="#264653" style="padding: 40px 0 30px 0;"><img src="https://s3.af-south-1.amazonaws.com/scuba.thematthew.me/assets/images/full+logo+wit.png" alt="Scubamate Logo" width="80%" height="auto" style="display: block;" /></td>  </tr><tr><td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 24px;"><b>Password Recovery</b></td></tr><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">It seems like you havve requested to reset your password. We have generated a new password for you below that can be used to login to your account. If you wish to customize your password, you can do so on your profile page after you have logged in.</td></tr><tr><td style="padding: 25px 0 0 0; color: #264653 ; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">Here is your new password: <h2 style="color: #2A9D8F; font-family: Arial, sans-serif; font-size: 24px;">'+ otp+'</h2></td></tr></table></td></tr><tr><td bgcolor="#2A9D8F " style="padding: 30px 30px 30px 30px;color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">For any enquiries, please contact us at <a href="mailto:teamav301@gmail.com" style = "color: #264653;">teamav301@gmail.com</a></td></tr></table></body></html>' ;
    }
    
    var mailOptions = {
	    from: 'scubamate.team@gmail.com',
	    to: Email,
	    subject: 'Scubamate email verification',
	    html: emailContent
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
