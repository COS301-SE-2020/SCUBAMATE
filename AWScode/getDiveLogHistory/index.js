'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body)
    //var AccessToken = JSON.parse(JSON.stringify(event, null, 2)).body; 
    const AccessToken = body.AccessToken; 
    console.log(AccessToken);
    const guid = AccessToken.substring(0,36);

    function compareDates(t,e)
    {
        console.log(t.getFullYear());
        if(t.getFullYear()<e.getFullYear())
        {   
            return false;
        }else if(t.getFullYear()>e.getFullYear())
        {
            return true;
        }

        if(t.getMonth()<e.getMonth())
        {
            return false;
        }else if(t.getMonth()>e.getMonth())
        {
            return true;
        }

        if(t.getDate()<e.getDate())
        {
            return false;
        }else if(t.getDate()>e.getDate())
        {
            return true;
        }

        if(t.getHours()<e.getHours())
        {
            return false;
        }else if(t.getHours()>e.getHours())
        {
            return true;
        }

        if(t.getMinutes()<e.getMinutes())
        {
            return false;
        }else if(t.getMinutes()>e.getMinutes())
        {
            return true;
        }

        if(t.getSeconds()<e.getSeconds())
        {
            return false;
        }else if(t.getSeconds()>e.getSeconds())
        {
            return true;
        }

        if(t.getMilliseconds()<e.getMilliseconds())
        {
            return false;
        }else if(t.getMilliseconds()>e.getMilliseconds())
        {
            return true;
        }

        return true;
    }

    //Verify AccessToken 
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": guid
        }
    }

    try {     
        const data = await documentClient.get(params).promise();
        
        if( data.Item.Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if(compareDates(today,expiryDate))
            {
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
                
        }
            
        console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token ";
    }
    
    //Only proceed if access token is valid
    if(statusCode==0){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "DiveID, AccountGuid, DiveTypeLink, DiveSite, DiveDate, Weather, TimeIn , TimeOut, Buddy",
            FilterExpression: "#acc = :acc",
            ExpressionAttributeNames:{
                "#acc" : "AccountGuid"
            },
            ExpressionAttributeValues:{
                ":acc" : guid,
            }
        };
        
        try{
            //search for all the dive logs 
            responseBody = await documentClient.scan(diveParams).promise();
            if(responseBody.Items[0].Buddy)
            {
                responseBody = responseBody;
                statusCode = 201;
            }
            else{
                responseBody = "No diver logs found.";
                statusCode = 404;
            }
        }catch(err){
            responseBody = "No diver logs found " + err;
            statusCode = 404;
        } 
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    };
    

    return response;

};

