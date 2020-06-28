'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    //properly formatted response
    let statusCode =0;

    const{ItemType} =JSON.parse(event.body); //Would be either DiveSites, DiveTypes or DiveCenters

    let responseBody = "";
    
    const params = {
        TableName: "Scubamate",
        Key: {
            "ItemType": ItemType
        }
    }
    

    try{
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item); 
        statusCode = 200;

    }catch(err){
        responseBody = "Unable to get dive data";
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : responseBody,
        isBase64Encoded: false
    }

    return response;
}
