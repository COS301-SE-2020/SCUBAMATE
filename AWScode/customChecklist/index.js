'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    // TODO implement
    //let body = JSON.parse(event.body);
    /*
    const AccountGuid = body.AccountGuid;
    const Equipment = body.Equipment;
    const Optional = body.Optional;
    const Custom = body.Custom;
    */
    console.log("reddit moment");
    
    const AccountGuid = event.AccountGuid;
    const Equipment = event.Equipment;
    const Optional = event.Optional;
    const Custom = event.Custom;
    
    console.log("reddit moment");
    
    let statusCode = 0;
    let responseBody = "";
    
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
    }    
    
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
