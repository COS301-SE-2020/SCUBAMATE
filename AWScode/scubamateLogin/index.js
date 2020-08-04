'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const crypto = require('crypto');
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context)=> {
    let body = JSON.parse(event.body);
    const undef = 0;
    const Email = body.Email;
    const Password = body.Password;
    
    /*hashes the password using the email as a salt*/
    var hash = crypto.pbkdf2Sync(Password, Email, 1000, 64, 'sha512').toString('hex');
    console.log("Password after hashing: " + hash);
 
    /*verify that email and password is correct */
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
    let statusCode = undef;
    try{
        const data = await documentClient.scan(params).promise();
        if (data.length==0)
        {
            responseBody = "1. Unable to login";
            statusCode = 403;
        }
        else{
            const AccountGuid = data.Items[0].AccountGuid;
            const AccountType = data.Items[0].AccountType;
            const typeNum = AccountType.localeCompare("Diver")==0 ? "00" : (AccountType.localeCompare("Instructor")==0 ? "01" : (AccountType.localeCompare("Admin")==0 ? "10" : "11"));
            let nownow = ""+Date.now();
            let guid = crypto.createHash('sha256').update(nownow).digest('hex');
            
            guid = "" + AccountGuid + typeNum + guid ;
            
            let today = new Date();
            let nextWeek = new Date(today.getFullYear(), today.getMonth(),today.getDate()+7);
            nextWeek = nextWeek+"";
            
            const params2 = {
                TableName: "Scubamate",
                Key: {
                    AccountGuid: AccountGuid
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
            
            let ponseBody =[];
            ponseBody.push({AccessToken:guid});
            // ponseBody.push({AccountType:typeNum});
            
            let fullBody = ({Data: ponseBody});
            if (statusCode!=403)
            {
                responseBody = fullBody;
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
