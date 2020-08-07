'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    // TODO implement
    let body = JSON.parse(event.body);
    
    const AccessToken = body.AccessToken;
    const Equipment = body.Equipment;
    const Optional = body.Optional;
    const Custom = body.Custom;
    
    
    //const AccountGuid = event.AccountGuid;
    
    var AccountGuid;
    
    /*
    const AccessToken = event.AccessToken;
    const Equipment = event.Equipment;
    const Optional = event.Optional;
    const Custom = event.Custom;
    */
    
    
    let statusCode = 200;
    let responseBody = "Successfully added custom checklist";
    
    
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
        
        const params = {
            TableName: "Scubamate",
            Key: {
                AccountGuid: AccountGuid
            },
            UpdateExpression: "set Equipment = :e, Optional = :o, Custom = :c",
            ExpressionAttributeValues:{
                ":e": Equipment,
                ":o": Optional,
                ":c": Custom
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
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(responseBody),
    };
    return response;
};
