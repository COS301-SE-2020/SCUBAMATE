'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event) => {
    let body = JSON.parse(event.body);
    var dType = body.DiveType;
    //const dType = event.DiveType;
    var responseBody = "err default btw";
    var statusCode;
    
    
    if (dType === "Cave Dive" || dType === "Deep Dive" || dType === "Ice Dive" || dType === "Night Dive" || dType === "Reef Dive" || dType === "Wreck Dive")
    {
        //do nothing
        dType = "DT-"+dType;
    }
    else
    {
        dType = "DT-Other";
    }
    
    
    
    const params = {
        TableName: "DiveInfo",
        ProjectionExpression: "Equipment, Optional",
        FilterExpression: "#dt = :type",
        ExpressionAttributeNames:{
            "#dt" : "ItemType"
        },
        ExpressionAttributeValues:{
            ":type" : dType
        }
    };
    
    try {
            const data = await documentClient.scan(params).promise();
            responseBody = JSON.stringify(data.Items[0]);
            console.log("resonseBody poggers: " + responseBody);
            statusCode = 200;
        }catch(err){
            responseBody = "Unable to retrieve checklist";
            statusCode = 404;
    }
    
    /*
    var exposureSuit = "Wetsuit";
    var night = false;
    
    if (dType=="Ice Dive" || dType=="Deep Dive")
    {
        exposureSuit = "Drysuit";
    }
    if (dType=="Reef Dive")
    {
        exposureSuit = "Dive skin";
    }
    if (dType == "Other")
    {
        exposureSuit = "Exposure suit";
    }
    
    if (dType == "Night Dive" || dType == "Cave Dive")
    {
        night = true;
    }
    
    
    var responseBody;
    if (night==true)
    {
        responseBody = {
            Equipment : {
                Mask : "Diving mask",
                Suit : exposureSuit,
                Fins : "Swimming fins",
                Gloves : "Scuba gloves",
                Tank : "Scuba tank",
                Regulator : "Regulator",
                DepthGuage: "Depth guage",
                SPG : "Submersible pressure guage (SPG)",
                Compass: "Compass",
                DiveComputer : "Dive computer",
                Light: "Underwater lights",
                Bouyancy: "Buoyancy compensator"
            },
            Optional : {
                Snorkel : "Snorkel",
                Camera : "Underwater camera",
                TB: "Tank bangers",
                Defogger: "Defogger",
                Knife: "Dive knives",
                Slate: "Writing slates",

                FA: "First aid kit"
            }
        };
    }
    else
    {
        responseBody = {
            Equipment : {
                Mask : "Diving mask",
                Suit : exposureSuit,
                Fins : "Swimming fins",
                Gloves : "Scuba gloves",
                Tank : "Scuba tank",
                Regulator : "Regulator",
                DepthGuage: "Depth guage",
                SPG : "Submersible pressure guage (SPG)",
                Compass: "Compass",
                DiveComputer : "Dive computer",
                Bouyancy: "Buoyancy compensator"
            },
            Optional : {
                Snorkel : "Snorkel",
                Camera : "Underwater camera",
                TB: "Tank bangers",
                Defogger: "Defogger",
                Knife: "Dive knives",
                Slate: "Writing slates",
                Light: "Underwater lights",
                FA: "First aid kit"
            }
        };
    }
    */
    
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: responseBody,
        isBase64Encoded: false
    };
    return response;
};
