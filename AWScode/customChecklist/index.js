'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    // TODO implement
    let body = JSON.parse(event.body);
    
    const AccessToken = body.AccessToken;
    const Equipment = body.Equipment;
    const Optional = body.Optional;
    const Custom = body.Custom;

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
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    try {     
         /* Verify AccessToken  */
        const params = {
            TableName: "Scubamate",
            Key: {
                "AccountGuid": AccountGuid
            }
        };
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else{
            //Account Valid
            const params = {
                TableName: "Scubamate",
                Key: {
                    AccountGuid: AccountGuid
                },
                UpdateExpression: "set Equipment = :e, Optional = :o, Custom = :c",
                ExpressionAttributeValues:{
                    ":e": Equipment,
                    ":o": Optional,
                    ":c": Custom
                },
                ReturnValues:"UPDATED_NEW"
            };
            
            try{
                const updateStatement = await documentClient.update(params).promise();
                statusCode = 200;
                responseBody = "Successfully added custom checklist";
            }catch(err){
                statusCode = 404;
                responseBody = "Update failed";
            }    
        }

    } catch (err) {
        responseBody = "Invalid Access Token "+err;
        statusCode = 403;
    }
        

    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(responseBody),
    };
    return response;
};
