'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body);
    var AccessToken = body.AccessToken;
    var Buddy = body.Buddy;
    var InstructorLink = body.InstructorLink;
    var Description = body.Description;
    var DivePublicStatus = body.DivePublicStatus;
    
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
            //console.log("Account: " + data.Items[0].AccountGuid);
            var AccountGuid = data.Items[0].AccountGuid;
        }
        if( data.Items[0].Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Items[0].Expires);
            const today = new Date();
            //console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if(compareDates(today,expiryDate))
            {
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
            
        }
        
        //console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }

    // Only update dive if access token is verified
    if(statusCode==0){
    var DiveID = body.DiveID;

        const params = {
            TableName: "Dives",
            Key: {
                'DiveID' : DiveID,
                'AccountGuid' : AccountGuid,
            },
            UpdateExpression: 'set Buddy = :bud, InstructorLink = :il, Description = :des, DivePublicStatus = :dp',
            ExpressionAttributeValues: {
                ':bud' : Buddy,
                ':il' : InstructorLink,
                ':des' : Description,
                ':dp' : DivePublicStatus
            }
        }
        try{
            const data = await documentClient.update(params).promise();
            responseBody = "Successfully updated dive!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable to update dive. "+ err+" "+ DiveID;
            statusCode = 403;
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
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }
    return response;
    
}
