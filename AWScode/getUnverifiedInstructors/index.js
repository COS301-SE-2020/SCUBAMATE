'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken; 
    
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
        else if( data.Item.AccountType != "Admin" ){
            responseBody = "Not Allowed to View Page.";
            statusCode = 403;
        }
        else{
            /* Is correct Dive Centre now to find it's Unverified Instructors */
            const paramsI = {
                TableName: "Scubamate",
                ProjectionExpression: "AccountVerified, AccountGuid, FirstName, LastName, InstructorNumber, Email",
                FilterExpression: '#at = :at AND #dc = :dc',
                ExpressionAttributeNames: {
                    '#at': 'AccountType',
                    '#dc': 'DiveCentre',
                },
                ExpressionAttributeValues: {
                    ':at': "Instructor",
                    ':dc': data.Item.DiveCentre,
                },
            };
            try{
                const dataI = await documentClient.scan(paramsI).promise();
                if(dataI.length == 0 || dataI.Items.length ==0){
                    responseBody = "No Instructors Need to be Verified";
                    statusCode = 404;
                }
                else if(typeof dataI.Items == "undefined"){
                    responseBody = "No instructors can be found currently...Try Again Later";
                    statusCode = 500;
                }
                else {
                    let returnList = [];
                    returnList.push({UnverifiedInstructors: dataI.Items});
                    responseBody = returnList[0];
                    statusCode =200;
                }
            }
            catch(err){
                statusCode = 403;
                responseBody = "Could not find instructors. "+err;
            }
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token"+err;
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
