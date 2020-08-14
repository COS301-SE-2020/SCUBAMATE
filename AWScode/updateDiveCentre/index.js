'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const Email = body.Email;
    const Name = body.Name;

    const GuidSize = 36;
    const guid = AccessToken.substring(0,GuidSize);
    
    /* Verify AccessToken  */
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
        const params = {
            TableName: "Scubamate",
            Key: {
                "AccountGuid": guid
            }
        };
        const data = await documentClient.get(params).promise();
        if(typeof data.Item === 'undefined')
        {
            statusCode = 403;
            responseBody = "Invalid Access Token." ;
        }
        else if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else if(data.Item.AccountType != "SuperAdmin"){
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges";
        }
        else{
            /*First check to see if account exists */
            let AccountGuid = undef;
            const eParams = {
                TableName: "Scubamate",
                FilterExpression: "#em = :em",
                ProjectionExpression: "AccountGuid",
                ExpressionAttributeNames:{
                    '#em' : 'Email'
                },
                ExpressionAttributeValues:{
                    ':em' : Email
                }
            };     
            try{
                const accdata = await documentClient.scan(eParams).promise();
                if(typeof accdata.Items === 'undefined'){
                    statusCode = 403;
                    responseBody = "Account doesn't exist. " + Email;
                }
                else
                {
                    AccountGuid = accdata.Items[0].AccountGuid;
                    
                    /*Now check to see if centre exists */  
                    const ItemType = "DC-"+Name.toLowerCase();         
                    const cparams = {
                        TableName: "DiveInfo",
                        Key: {
                            "ItemType": ItemType                    
                            
                        }
                    };
                    const cendata = await documentClient.get(cparams).promise();
                    if(typeof cendata.Item === 'undefined'){
                        statusCode = 403;
                        responseBody = "Dive Centre doesn't exist ";
                    }
                    else{
                        /*Upgrade dive centre account to admin*/
                        
                        /*Update AccessToken Here */
                        const typeParams = {
                            TableName: "Scubamate",
                            Key:{
                                "AccountGuid": AccountGuid
                            },
                            UpdateExpression: "set AccountType = :type, DiveCentre = :dc AND AccountVerified = :av",
                            // ConditionExpression: "AccountType != 'SuperAdmin' ",
                            ExpressionAttributeValues:{
                                ":type": "Admin",
                                ":dc" : Name,
                                ":av" : true
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        
                        try{
                            const d = await documentClient.update(typeParams).promise();
                            /*Update the dive centre*/
                            const centreParams = {
                                TableName: "DiveInfo",
                                Key:{
                                    "ItemType": ItemType
                                },
                                UpdateExpression: "set AccountGuid = :guid ",
                                // ConditionExpression: "AccountType != 'SuperAdmin' ",
                                ExpressionAttributeValues:{
                                    ":guid": AccountGuid
                                },
                                ReturnValues:"UPDATED_NEW"
                            };
                        
                            try{
                                const data = await documentClient.update(centreParams).promise();
                                responseBody = "Dive Centre successfully updated!";
                                statusCode = 200;
                            }catch(err){
                                responseBody = "Dive Centre doesn't exist " + err;
                                statusCode = 403;
                            }
                            
                            
                        }catch(err){
                            responseBody =  "Account doesn't exist " + err ;
                            statusCode = 403;
                        }
                    }
                }
            }catch(err){ 
                statusCode = 403;
                responseBody = "Account doesn't exist. " + err;
            }  
        }           
    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token:(" + err  + " number: " + err.line;
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

/*
{
    "AccessToken" : "d1d7391d-c035-28ab-0193-68a7d263d4be112edcec2f52db363e338c1969a2c4dad5f933433c4284638a18e8c1612a4e9b3d",
    "Email" : "isobel.bosman@gmail.com",
    "Name" : "test dive centre"
}
 */

