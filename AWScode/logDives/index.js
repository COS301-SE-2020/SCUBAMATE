'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
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
    var DivePublicStatus = body.DivePublicStatus;
    
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
    
    // Only log the dive if access token is verified
    if(statusCode==0){
        var timestamp = new Date();
        var yy = timestamp.getFullYear();
        if(yy < 10)
        {
            yy = "0" + yy;
        }
        var mm = timestamp.getMonth() + 1;
        if(mm < 10)
        {
            mm = "0" + mm;
        }
        var dd = timestamp.getDate();
        if(dd < 10)
        {
            dd = "0" + dd;
        }
        var hh = timestamp.getUTCHours() + 2;
        if(hh < 10)
        {
            hh = "0" + hh;
        }
        var mins = timestamp.getMinutes();
        if(mins < 10)
        {
            mins = "0" + mins;
        }
        var ss = timestamp.getSeconds();
        if(ss < 10)
        {
            ss = "0" + ss;
        }
        var ms = timestamp.getMilliseconds();
        var now = yy + "/" + mm + "/" + dd + " " + hh + ":" + mins + ":" + ss + ":" + ms;
        const params = {
            TableName: "Dives",
            Item: {
                DiveID : DiveID,
                AccountGuid : guid,
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
                TimeStamp : now,
                Visibility: Visibility,
                Weather: Weather,
                DivePublicStatus: DivePublicStatus
            }
        };
        try{
            const data = await documentClient.put(params).promise();
            responseBody = "Dive successfully logged! ";
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
//     "AccessToken" : "4c72f2f6-f763-36f6-3741-3eca8a8c86ba8b23658322b7d66c9f889fc58bad955bd5f3d2158ad5acd6375fa835c4290c8a36",
//     "AirTemp": 30,
//     "Approved": false,
//     "BottomTemp": -10,
//     "Buddy": "sdfsd",
//     "Depth": "50m",
//     "Description": "I saw a lot of fish",
//     "DiveSite": "Clifton Rock – Cape Town",
//     "DiveTypeLink": "Ice Dive",
//     "InstructorLink": "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2",
//     "DiveID": "Dfeb0bf7d-2dbb-4936-8dbd-a86302a99e3f",
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
