'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let body = JSON.parse(event.body);
    const DiveID = body.DiveID;
    const Approved = body.Approved;
    const AccessToken = body.AccessToken;
    
    const AccountGuid = AccessToken.substring(0,36);

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

    //Verify AccessToken 
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": AccountGuid
        }
    };
    let responseBody;
    const undef =0;
    let statusCode =undef;
    try {     
        const data = await documentClient.get(params).promise();
        if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else if( data.Item.AccountType != "Instructor" ){
            responseBody = "Not Allowed to View Page.";
            statusCode = 403;
        }
        else{
            /* Is Instructor now to verify Course */
            const paramsDive = {
                TableName: "Dives",
                Key: {
                    'DiveID' : DiveID,
                },
                UpdateExpression: 'set Approved = :a, DiveVerified = :dv',
                ExpressionAttributeValues: {
                    ':a' : Approved,
                    ':dv' :true
                }
            };
            try{
                const dataD = await documentClient.update(paramsDive).promise();
                responseBody = "Successfully verified dive!";
                statusCode = 200;
            }catch(err){
                responseBody = "Unable to verify dive."+ err +" ";
                statusCode = 403;
            } 
        }
    } catch (error) {
        statusCode = 403;
        responseBody = "Invalid Access Token. ";
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
