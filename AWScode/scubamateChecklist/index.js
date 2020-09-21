'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event) => {
    let body = JSON.parse(event.body);
    var dType = body.DiveType;
    //const dType = event.DiveType;
    var responseBody = "err default btw";
    var statusCode;
    
    
    if (dType === "Cave Dive" || dType === "Deep Dive" || dType === "Ice Dive" || dType === "Night Dive" || dType === "Reef Dive" || dType === "Wreck Dive")
    {
        //do nothing
        dType = "DT-"+dType.toLowerCase();
    }
    else
    {
        dType = "DT-other";
    }
    
    
    
    const params = {
        TableName: "DiveInfo",
        ProjectionExpression: "Equipment, Optional",
        FilterExpression: "#dt = :type",
        ExpressionAttributeNames:{
            "#dt" : "ItemType"
        },
        ExpressionAttributeValues:{
            ":type" : dType
        }
    };
    
    try {
            const data = await documentClient.scan(params).promise();
            responseBody = JSON.stringify(data.Items[0]);
            console.log("resonseBody poggers: " + responseBody);
            statusCode = 200;
        }catch(err){
            responseBody = "Unable to retrieve checklist";
            statusCode = 404;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: responseBody,
        isBase64Encoded: false
    };
    return response;
};
