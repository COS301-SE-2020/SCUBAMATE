'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


exports.handler = async (event) => {
    
    var responseBody;
    var statusCode;
    
    let body = JSON.parse(event.body);
    var Email = body.Email;
    //var Email = event.Email;
    console.log("Email" + Email);
    
    const params = {
        TableName: "Scubamate",
        FilterExpression: "#em = :em",
        ExpressionAttributeNames:{
            '#em' : 'Email',
        },
        ExpressionAttributeValues:{
            ':em' : Email,
        }
    };
    try{
    const data = await documentClient.scan(params).promise();
    if (data.Items.length==0) //bad news bears
    {
        responseBody = "Unable to verify email, it does not exist";
        statusCode = 404;
    }
    else
    {
        var AccountGuid = data.Items[0].AccountGuid;

        var params2 = {
            TableName: "Scubamate",
            Key : {
                AccountGuid: AccountGuid
            },
            UpdateExpression: "set EmailVerified = :v",
            ExpressionAttributeValues :{
                ":v": true
            },
            ReturnValues: "UPDATED_NEW"
        };
        
        try{
        var data2 = await documentClient.update(params2).promise();
        responseBody = "Verification success!";
        statusCode = 201;
        }catch(error)
        {
            console.log(error);
        }
    }
    }catch(err)
    {
        responseBody = "Unable to verify email: " + err;
        statusCode = 404;
    }
    
    const response = {
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        statusCode: statusCode,
        body: JSON.stringify(responseBody)
    };
    return response;
};
