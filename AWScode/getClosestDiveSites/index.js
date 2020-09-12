'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const Location = body.Location;

    const GuidSize = 36;
    const AccountGuid = AccessToken.substring(0,GuidSize);

    function compareDates(t,e){
        let returnBool;
        if(t.getFullYear()!=e.getFullYear()){
            (t.getFullYear()>e.getFullYear())?returnBool=true:returnBool=false;
        }   
        else if(t.getMonth()!=e.getMonth()){
            (t.getMonth()>e.getMonth())?returnBool=true:returnBool=false;
        }
        else if(t.getDate()!=e.getDate()){
            (t.getDate()>e.getDate())?returnBool=true:returnBool=false;
        }
        else if(t.getHours()!=e.getHours()){
            (t.getHours()>e.getHours())?returnBool=true:returnBool=false;
        }
        else if(t.getMinutes()!=e.getMinutes()){
            (t.getMinutes()>e.getMinutes())?returnBool=true:returnBool=false;
        }
        else if(t.getSeconds()!=e.getSeconds()){
            (t.getSeconds()>e.getSeconds())?returnBool=true:returnBool=false;
        }
        else if(t.getMilliseconds()!=e.getMilliseconds()){
            (t.getMilliseconds()>e.getMilliseconds())?returnBool=true:returnBool=false;
        }
        else{
            returnBool = true;
        }
        return returnBool;
    }

    /* Verify AccessToken  */
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": AccountGuid
        },
        ProjectionExpression : "AccessToken, Expires"
    };
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(compareDates( new Date(),new Date(data.Item.Expires))){
            responseBody = "Access Token Expired!";
            statusCode = 403;
    
        }
        /*Only proceed if access token is valid*/
        else if (statusCode == undef){
            /*Retrieve all the Dive Sites */
            var siteParams = {
                TableName: "DiveInfo",
                ProjectionExpression: "#Name,Coords",
                FilterExpression: "begins_with(#ItemType, :sitePrefix)",
                ExpressionAttributeNames:{
                    "#ItemType" : "ItemType",
                    "#Name" : "Name"
                },
                ExpressionAttributeValues:{
                    ":sitePrefix" : "DS"
                }
            };

            try{
                const sites = await documentClient.scan(siteParams).promise();
                if(sites.Items.length==0){
                    responseBody = "No dive sites found";
                    statusCode = 404;
                }
                else{
                    let result;
                    var distance = require('google-distance');
                    distance.get(
                    {
                        origin: Location,
                        destination: sites.Items[0].Coords
                    },
                    function(err, data) {
                    if (err) return console.log(err);
                        result = data;
                    });

                    sites.Distance = result;
                    responseBody = sites;
                    statusCode = 200;
                }
            }
            catch(err){
                responseBody = "Unexpected scan error " + err;
                statusCode = 403;
            }
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token " + err;
    }


    /*Final response to be sent back*/
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

/*
{
    "AccessToken":"d1d7391d-c035-28ab-0193-68a7d263d4be11a059eef3ab46c125b821c21aaf1922341cd373344282760998feb744ea8368d9",
    "Locaton": "-25.921800, 28.161300"
}
*/
