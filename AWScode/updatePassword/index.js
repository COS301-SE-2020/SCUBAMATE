'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event,context) => {
    let statusCode = 0;
    let responseBody = "";
    
    /*Generate OTP*/
    var date = new Date();
    var tim = ""+date.getTime();
    tim = tim.substring(7);
    var otp = ""+tim;
      
    const body = JSON.parse(event.body);
    const Email = body.Email;
    
    var AccountGuid;
    
    /*Verify if email exists*/
    const scanParams = {
        TableName : "Scubamate",
        FilterExpression: "#em = :em",
        ExpressionAttributeNames:{
            '#em' : 'Email',
        },
        ExpressionAttributeValues:{
            ':em': Email,
        }
    };
    
    const data = await documentClient.scan(scanParams).promise();
    if (data.Items.length==0)
    {
        responseBody = "Email not found ";
        statusCode = 404;
    }
    else
    {
        AccountGuid = data.Items[0].AccountGuid;
        var Original = data.Items[0].Password;
        
        const crypto = require('crypto');
        const hash = crypto.pbkdf2Sync(otp, Email, 1000, 64, 'sha512').toString('hex');
        
        if (hash===Original)
        {
            statusCode = 403;
            responseBody = "Error, Password cannot be the same";
        }
        else
        {
            const params = {
            TableName: "Scubamate",
            Key: {
                AccountGuid: AccountGuid
            },
            UpdateExpression: "set Password = :p",
            ExpressionAttributeValues:{
                ":p": hash
            },
            ReturnValues:"UPDATED_NEW"
            };
            
             try{
            const updateStatement = await documentClient.update(params).promise();
            }catch(err){
                statusCode = 404;
                responseBody = "Update failed"
        }    
            statusCode = 200;
            responseBody = {"new" : otp};
        }
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(responseBody)
    };
    return response;
};
