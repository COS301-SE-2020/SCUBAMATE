'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


exports.handler = async (event,context) => {
    // TODO implement
    let statusCode = 0;
    let responseBody = "";
      
    //const body = JSON.parse(event.body);
    //const AccessToken = body.AccessToken;
    //const Email = body.Email;
    //const Password = body.Password;
    
    let AccessToken = event.AccessToken;
    let Email = event.Email;
    let Password = event.Password;
    console.log("Password: " + Password);
    var AccountGuid;
    
    const scanParams = {
        TableName : "Scubamate",
        FilterExpression: "#ac = :ac",
        ExpressionAttributeNames:{
            '#ac' : 'AccessToken',
        },
        ExpressionAttributeValues:{
            ':ac': AccessToken,
        }
    };
    
    const data = await documentClient.scan(scanParams).promise();
    if (data.length==0)
    {
        responseBody = "Access Token not found ";
        statusCode = 404;
    }
    else
    {
        AccountGuid = data.Items[0].AccountGuid;
        var Original = data.Items[0].Password;
        
        const crypto = require('crypto');
        const hash = crypto.pbkdf2Sync(Password, Email, 1000, 64, 'sha512').toString('hex');
        
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
                console.log("damn");
                statusCode = 404;
                responseBody = "Update failed"
        }    
            
            statusCode = 200;
            responseBody = "Password change success!";
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
