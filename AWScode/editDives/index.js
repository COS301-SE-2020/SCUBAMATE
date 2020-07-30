'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {

    let body = JSON.parse(event.body);
    var DiveID = body.DiveID;
    var AccessToken = body.AccessToken;
    var Buddy = body.Buddy;
    var InstructorLink = body.InstructorLink;
    var Description = body.Description;
    var DivePublicStatus = body.DivePublicStatus;
    const GuidSize = 36;
    const AccountGuid = AccessToken.substring(0,GuidSize);

    /* Verify AccessToken  */
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": AccountGuid
        }
    };
    
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
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(data.Item.Expires){
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            if(compareDates(today,expiryDate))
            {
                responseBody = "Access Token Expired!";
                statusCode = 403;
            }  
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }

    /* Only update dive if access token is verified  */
    if(statusCode==undef){
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
        };
        try{
            const data = await documentClient.update(params).promise();
            responseBody = "Successfully updated dive!";
            statusCode = 200;
        }catch(err){
            responseBody = "Unable to update dive. "+ err;
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
    };
    return response;
    
};



