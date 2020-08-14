'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    
    let responseBody = "";
    let statusCode = 0;
    
    const scanParams = {
        TableName: "Scubamate",
        FilterExpression : "#ac = :ac",
        ExpressionAttributeNames:{
            '#ac' : 'AccessToken'
        },
        ExpressionAttributeValues:{
            ':ac' : AccessToken
        }
    };
    
    const data = await documentClient.scan(scanParams).promise();
    if (data.length==0)
    {
        responseBody = "Error! AccessToken does not exist";
        statusCode = 404;
    }
    else
    {
        const AccountGuid = data.Items[0].AccountGuid;
        
        const diveScanParams = {
            TableName : "Dives",
            FilterExpression : "#ag = :ag",
            ExpressionAttributeNames:{
                '#ag' : 'AccountGuid'
            },
            ExpressionAttributeValues:{
                ':ag' : AccountGuid
            }
        };
        
        const divesData = await documentClient.scan(diveScanParams).promise();
        if (divesData.length==0)
        {
            responseBody = "Deletion Success! Note that this account had no dives attached to it";
            statusCode = 200;
        }
        else
        {
            //T
        }
        
        
        
        
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
