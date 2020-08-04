'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {

    const body = JSON.parse(event.body);
    
    const InstructorNumber = body.InstructorNumber;
    const DiveCentre = body.DiveCentre;
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
    function contains(arr,search){
        let returnBool = false;
        arr.forEach(function(item) {
            if(item==search){
                returnBool=true;
            }
        });
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
        else if(!data.Item.EmailVerified){
            statusCode = 403;
            responseBody = "Account Email Not Verified - Can't Upgrade Until Email Is Verified";
        }
        else if(data.Item.CompletedCourses.length==0){
            statusCode = 403;
            responseBody = "Account Email Not Verified - Can't Upgrade Until Email Is Verified";
        }
        else{
            /* Check Qualification */
            
            const paramsCourse = {
                TableName: "DiveInfo",
                FilterExpression: 'begins_with(#itemT , :itemT) AND  #qualT == :qualT',
                ExpressionAttributeNames: {
                    '#itemT': 'ItemType',
                    '#qualT' : 'QualificationType'
                },
                ExpressionAttributeValues: {
                    ':itemT': "C-",
                    ':qualT': "Instructor",
                }
            };
            try{
                const dataQ = await documentClient.get(paramsCourse).promise();
                let qualified = false;
                data.Item.CompletedCourses.forEach(function(item) {
                    /*For each completed course
                    Check if it is in the courses retrieved
                    */
                    if(contains(dataQ.Items, item.Name)){
                        qualified = true;
                    }
                });
                
                if(qualified){
                    const AccountType = "Instructor";
                    const params = {
                        TableName: "Scubamate",
                        Key: {
                            'AccountGuid' : AccountGuid,
                        },
                        UpdateExpression: 'set AccountType = :a, InstructorNumber = :i, DiveCentre = :d, AccountVerified = :av',
                        ExpressionAttributeValues: {
                            ':a' : AccountType,
                            ':i' : InstructorNumber,
                            ':d': DiveCentre,
                            ':av': false,
                        }
                    };
                    try{
                        const dataU = await documentClient.update(params).promise();
                        responseBody = "Successfully upgraded account!";
                        statusCode = 201;
                    }catch(err){
                        responseBody = "Unable to upgrade account."+ err +" ";
                        statusCode = 403;
                    } 
                }
                else{
                    responseBody = "Incorrect qualification to be an instructor.";
                    statusCode = 404;
                }
    
            }catch(err){
                responseBody = "Unable to check qualification verified "+err;
                statusCode = 403;
            } 
            
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
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


