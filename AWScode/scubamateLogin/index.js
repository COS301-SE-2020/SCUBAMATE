'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const crypto = require('crypto');
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
//const uuid = require('uuid');


exports.handler = async (event, context)=> {
    var iType;
    let body = JSON.parse(event.body);
    const Email = body.Email;
    const Password = body.Password;
    console.log("In Password: " + Password);
    const hash = crypto.createHash('sha256').update(Password).digest('hex');
    console.log("Password after hashing: " + hash);
 
    const params = {
        TableName: "Scubamate",
        ProjectionExpression: "ItemType",
        FilterExpression: "#em = :email AND #pass = :password",
        ExpressionAttributeNames:{
            "#em" : "Email",
            "#pass" : "Password"
        },
        ExpressionAttributeValues:{
            ":email" : Email,
            ":password" : hash
        }
    };
    
        let responseBody = "";
        let statusCode = 0;
        
    try{
        const data = await documentClient.scan(params).promise();
        //***
        iType = data.Items[0].ItemType;
        if (!iType)
        {
            responseBody = "Unable to log in";
            statusCode = 403;
        }
        
        var nownow = ""+Date.now();
        var guid = crypto.createHash('sha256').update(nownow).digest('hex');
        guid = ""+guid;
        
        var today = new Date();
        var nextWeek = new Date(today.getFullYear(), today.getMonth(),today.getDate()+7);
        nextWeek = nextWeek+"";
        
        //**********************
        const params2 = {
            TableName: "Scubamate",
            Key: {
                ItemType: iType
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
        
       // var ponseBody = JSON.stringify({AccessToken:guid});
        //var ponseBody = JSON.stringify({AccessToken:guid});
        
        var ponseBody = {AccessToken:guid};
        console.log("ponsebody: " +ponseBody);
        if (statusCode!=403)
        {
            responseBody = ponseBody;
        }
        else
        {
            responseBody = "Unable to log in";
        }
        statusCode = 201;
        console.log(data);
    }catch(err){ 
        responseBody = "Unable to log in";
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
