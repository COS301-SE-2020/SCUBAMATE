'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiVersion:"2012-08-10"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body);
    var DiveID = body.DiveID;
    var AccessToken = body.AccessToken;
    var AirTemp = body.AirTemp;
    var Approved = body.Approved;
    var BottomTemp = body.BottomTemp;
    var Buddy = body.Buddy;
    var DiveDate = body.DiveDate;
    var Depth = body.Depth;
    var Description = body.Description;
    var DiveSite = body.DiveSite;
    var DiveTypeLink = body.DiveTypeLink;
    var InstructorLink = body.InstructorLink;
    var SurfaceTemp = body.SurfaceTemp;
    var TimeIn = body.TimeIn;
    var TimeOut = body.TimeOut;
    var Visibility = body.Visibility;
    var Weather = body.Weather;

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
    // async function verifyAccessToken(){
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
    // }
    
    // Only log the dive if access token is verified
    if(statusCode==0){

        const params = {
            TableName: "Dives",
            Item: {
                DiveID : DiveID,
                AccountGuid : AccountGuid,
                AirTemp : AirTemp,
                Approved: Approved, 
                BottomTemp: BottomTemp,
                Buddy: Buddy, 
                DiveDate: DiveDate, 
                Depth: Depth,
                Description: Description, 
                DiveSite: DiveSite,
                DiveTypeLink: DiveTypeLink,
                InstructorLink: InstructorLink,
                SurfaceTemp: SurfaceTemp,
                TimeIn: TimeIn,
                TimeOut: TimeOut,
                Visibility: Visibility,
                Weather: Weather
            }
        };
        try{
            const data = await documentClient.put(params).promise();
            responseBody = "Dive successfully logged!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable log dive " + err;
            statusCode = 403;
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
        body : JSON.stringify( responseBody),
        isBase64Encoded: false
    };

    return response;

};

// {
//     "AccessToken" : "ghkjsdfAFSED_ijvfs_7uyjbhdcfijoc",
//     "AirTemp": 30,
//     "Approved": false,
//     "BottomTemp": -10,
//     "Buddy": "Paula Williamson",
//     "Depth": "50m",
//     "Description": "I saw a lot of fish",
//     "DiveDate": "01/01/2020",
//     "DiveSiteLink": "Clifton Rock – Cape Town",
//     "DiveTypeLink": "Ice Dive",
//     "InstructorLink": "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2",
//     "ItemType": "Dfeb0bf7d-2dbb-4936-8dbd-a86302a99e3f",
//     "SurfaceTemp": 10,
//     "TimeIn": "10:00",
//     "TimeOut":"12:35",
//     "Visibility":"50m",
//     "Weather":
//         [ "10 mph East",
//         "FullMoon",
//         "Windy",
//         "high: 1.20m"
//       ]
//   }
