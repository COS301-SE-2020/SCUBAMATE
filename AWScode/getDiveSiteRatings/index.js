'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const DiveSite = body.DiveSite;

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

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token " + err;
    }

    /*Only proceed if access token is valid*/
    if(statusCode==undef){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "Rating",
            FilterExpression: "#site = :site AND #app = :app",
            ExpressionAttributeNames:{
                "#site" : "DiveSite",
                "#app" : "Approved"
            },
            ExpressionAttributeValues:{
                ":site" : DiveSite,
                ":app" : true
            }
        };

        try {
            const dives = await documentClient.scan(diveParams).promise();
            
            if(dives.Items.length==0){
                responseBody = "No ratings found for this dive site";
                statusCode = 404;
            }
            else{
                let ratings = [0,0,0,0,0];
                let total = 0;
                dives.Items.forEach(function(dive) {
                    if(dive.Rating != undefined)
                    {
                        ratings[dive.Rating-1] += 1;
                        total++;
                    }
                })
                responseBody = '{ "Ratings" : [';
                for(var i=1; i<6; i++)
                {
                    responseBody += '{ "Rating" : "' +  i + '",' +
                                    '"Amount" : "' + ratings[i-1] + '"},';
                } 
                responseBody += '{ "Total" : "' + total + '"}]}';
                responseBody = JSON.parse(responseBody);
                statusCode = 200;      
             }
        } 
        catch(err){
            responseBody = "No dives found at this dive site" + err + " " + responseBody;
            statusCode = 404;
        }
        
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

