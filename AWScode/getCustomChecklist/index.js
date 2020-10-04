'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});



exports.handler = async (event, context) => {
    
    let body = JSON.parse(event.body);
    
    const AccessToken = body.AccessToken;
    //let AccessToken = event.AccessToken;
    let responseBody = "";
    let statusCode = 0;
    
    const params = {
        TableName: "Scubamate",
        FilterExpression: "#ac = :ac",
        ExpressionAttributeNames:{
            '#ac' : 'AccessToken',
        },
        ExpressionAttributeValues:{
            ':ac' : AccessToken,
        }
    };
    
    const data = await documentClient.scan(params).promise();
    if (data.length==0)
        {
            responseBody = "Bad";
            statusCode = 403;
            console.log("bad*************");
        }
        else
        {
            const Equipment = data.Items[0].Equipment;
            const Optional = data.Items[0].Optional;
            const Custom = data.Items[0].Custom;
            
            let fullBody = {
                Equipment: Equipment,
                Optional: Optional,
                Custom: Custom
            };
            
            responseBody = fullBody;
            statusCode = 201;
        }
    
    
    // TODO implement
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
