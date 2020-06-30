'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiVersion:"2012-08-10"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let responseBody = "";
    let statusCode =0;

    var AccessToken = event.AccessToken;

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
    try {
        const params = {
            TableName: "Scubamate",
            ProjectionExpression: "Expires,AccountGuid",
            FilterExpression: "#acc = :AccessToken",
            ExpressionAttributeNames:{
                "#acc" : "AccessToken"
            },
            ExpressionAttributeValues:{
                ":AccessToken" : AccessToken
            }
        };
            
        const data = await documentClient.scan(params).promise();
        if(data.Items[0].AccountGuid)
        {
            console.log("Account thing: " + data.Items[0].AccountGuid);
            var AccountGuid = data.Items[0].AccountGuid;
        }
        if( data.Items[0].Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Items[0].Expires);
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
        responseBody = "Invalid Access Token";
    }
    
    //Only proceed if access token is valid
    if(statusCode==0){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "DiveSiteLink, DiveDate, Weather, TimeIn , TimeOut, Buddy",
            FilterExpression: "#acc = :acc",
            ExpressionAttributeNames:{
                "#acc" : "PublicStatus"
            },
            ExpressionAttributeValues:{
                ":acc" : true,
            }
        };
        
        try{
            //search for all the dive logs 
            responseBody = JSON.stringify(await documentClient.scan(diveParams).promise());
            // responseBody = "here is your dive things with " + "D" + AccountGuid;
            statusCode = 201;
        }catch(err){
            responseBody = "No diver logs found " + err;
            statusCode = 404;
        } 
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : responseBody
    };

    return response;

};

