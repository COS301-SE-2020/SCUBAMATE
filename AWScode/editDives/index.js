'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
//const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body);
    var DiveID = body.DiveID;
    var AccessToken = body.AccessToken;
    var AirTemp = body.AirTemp;
    //var Approved = body.Approved;
    var SurfaceTemp = body.SurfaceTemp;
    var BottomTemp = body.BottomTemp;
    var Buddy = body.Buddy;
    var DiveDate = body.DiveDate;
    //var DiveSite = body.DiveSite;
    //var DiveTypeLink = body.DiveTypeLink;
    var InstructorLink = body.InstructorLink;
    var TimeIn = body.TimeIn;
    var TimeOut = body.TimeOut;
    var Visibility = body.Visibility;
    //var Weather = body.Weather;
    var Depth = body.Depth;
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

    // Only update account if access token is verified
    if(statusCode==0){
        const params = {
            TableName: "Dives",
            Key: {
                'DiveID' : DiveID,
            },
            UpdateExpression: 'set AirTemp = :a, SurfaceTemp = :s, BottomTemp = :b, Buddy = :bud, DiveDate = :d, InstructorLink = :il, TimeIn = :ti, TimeOut = :to, Visibility = :v, Depth = :d, Description = :des, DivePublicStatus = :dp',
            ExpressionAttributeValues: {
                ':a' : AirTemp,
                ':s' : SurfaceTemp,
                ':b' : BottomTemp,
                ':bud' : Buddy,
                ':d' : DiveDate,
                ':il' : InstructorLink,
                ':ti' : TimeIn,
                ':to' : TimeOut,
                ':v' : Visibility,
                ':d' : Depth,
                ':des' : Description,
                ':dp' : DivePublicStatus
            }
        }
        try{
            const data = await documentClient.update(params).promise();
            responseBody = "Successfully updated dive!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable to update dive."+ err +" ";
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
