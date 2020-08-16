'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let body = JSON.parse(event.body);
    const AccountVerified = body.AccountVerified;
    const AccessToken = body.AccessToken;
    const AccountGuidGiven =  body.AccountGuid ;
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
        else if( data.Item.AccountType != "Admin" ){
            responseBody = "Not Allowed to View Page.";
            statusCode = 403;
        }
        else{
            /* Is Admin now to verify/downgrade account*/
            if(AccountVerified){
                const paramsIns = {
                    TableName: "Scubamate",
                    Key: {
                        'AccountGuid' : AccountGuidGiven
                    },
                    UpdateExpression: 'set AccountVerified = :a',
                    ExpressionAttributeValues: {
                        ':a' : AccountVerified
                    },
                    ReturnValues: 'ALL_NEW'
                };
                try{
                    const dataI = await documentClient.update(paramsIns).promise();
                    const instructorToAdd = dataI.Attributes.FirstName+" " +dataI.Attributes.LastName+" ("+dataI.Attributes.Email+") - "+data.Item.DiveCentre;
                    /* add instructor to admin's dive centre */
                    const paramsDC = {
                        TableName: "DiveInfo",
                        Key: {
                            'ItemType' : 'DC-'+data.Item.DiveCentre.toLowerCase(),
                        },
                        ProjectionExpression: "Instructors"
                    };
                    try{
                        const dataDC = await documentClient.get(paramsDC).promise();
                        let tmp = [];
                        if(typeof dataDC.Item.Instructors != "undefined"){
                            tmp = dataDC.Item.Instructors;
                        }
                        tmp.push(instructorToAdd);
                        const paramsUpdateDC = {
                            TableName: "DiveInfo",
                            Key: {
                                'ItemType' : 'DC-'+data.Item.DiveCentre.toLowerCase(),
                            },
                            UpdateExpression: 'set Instructors = :i',
                            ExpressionAttributeValues: {
                                ':i' : tmp
                            }
                        };
                        try{
                            const dataUpdateDC = await documentClient.update(paramsUpdateDC).promise();
                            responseBody = "Successfully verified instructor!";
                            statusCode = 200;
                        }
                        catch(err){
                            responseBody = "Unable to add account."+ err +" ";
                            statusCode = 403;
                        }
                    }
                    catch(err){
                        responseBody = "Unable to add account."+ err +" ";
                        statusCode = 403;
                    }
                }catch(err){
                    responseBody = "Unable to verify instructor."+ err +" ";
                    statusCode = 403;
                } 
            }
            else{
                const paramsDown = {
                    TableName: "Scubamate",
                    Key: {
                        'AccountGuid' : AccountGuidGiven,
                    },
                    UpdateExpression: 'set AccountType = :a remove InstructorNumber, DiveCentre',
                    ExpressionAttributeValues: {
                        ':a' : "Diver",
                    }
  
                };
                try{
                    const dataID = await documentClient.update(paramsDown).promise();
                    responseBody = "Successfully unverified instructor!";
                    statusCode = 200;
                }catch(err){
                    responseBody = "Unable to verify instructor."+ err +" ";
                    statusCode = 403;
                } 
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
