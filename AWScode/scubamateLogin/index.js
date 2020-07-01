'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const crypto = require('crypto');
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context)=> {
    var AccountGuid;
    var AccountType;
    let body = JSON.parse(event.body);
    const Email = body.Email;
    const Password = body.Password;
    
    //hashes the password using the email as a salt
    var hash = crypto.pbkdf2Sync(Password, Email, 1000, 64, 'sha512').toString('hex');
    
    console.log("Password after hashing: " + hash);
 
    const params = {
        TableName: "Scubamate",
        FilterExpression: "#em = :em AND #p = :p",
        ExpressionAttributeNames:{
            '#em' : 'Email',
            '#p' : 'Password',
            
        },
        ExpressionAttributeValues:{
            ':em' : Email,
            ':p' : hash,
        }
    };
    
    let responseBody = "";
    let statusCode = 0;
        
    try{
        const data = await documentClient.scan(params).promise();
        if (data.Items.length==0)
        {
            responseBody = "1. Unable to login";
            statusCode = 403;
        }
        else{
            AccountGuid = data.Items[0].AccountGuid;
            AccountType = data.Items[0].AccountType;
            
            var nownow = ""+Date.now();
            var guid = crypto.createHash('sha256').update(nownow).digest('hex');
            guid = ""+AccountGuid + guid + AccountGuid.length;
            
            var today = new Date();
            var nextWeek = new Date(today.getFullYear(), today.getMonth(),today.getDate()+7);
            nextWeek = nextWeek+"";
            
            //**********************
            const params2 = {
                TableName: "Scubamate",
                Key: {
                    AccountGuid: AccountGuid,
                    AccountType: AccountType
                },
                UpdateExpression: "set AccessToken = :a, Expires = :e",
                ExpressionAttributeValues:{
                    ":a": guid,
                    ":e": nextWeek
                },
                ReturnValues:"UPDATED_NEW"
            };
            try{
                const ryker = await documentClient.update(params2).promise();
            }catch(errR){
                console.log("Error");
            }
            
            var ponseBody = {AccessToken:guid};
            console.log("ponsebody: " +ponseBody);
            if (statusCode!=403)
            {
                responseBody = ponseBody;
            }
            else
            {
                responseBody = "2. Unable to login";
            }
            statusCode = 201;
            
        }
        
    }catch(err){ 
        responseBody = "3. Unable to login "+err+" ";
        statusCode = 403;
        console.log(err);
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }
    return response;
    
}
