'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let body = JSON.parse(event.body);
    const AccountVerified = body.AccountVerified;
    const AccessToken = body.AccessToken;
    const AccountGuidGiven =  body.AccountGuid ;
    let GuidSize = 36;
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
            /* Is Admin now to get account to either verify/downgrade*/
            const paramsAcc = {
                TableName: "Scubamate",
                Key: {
                    'AccountGuid' : AccountGuidGiven,
                },

            };
            try{
                const dataAccount = await documentClient.get(paramsAcc).promise();
                /*Change account's access token, account verified number and maybe downgrade to diver */
                const oldToken = dataAccount.Item.AccessToken;
                let newToken = oldToken.substring(0,GuidSize);
                let updateExp, expVals;
                if(AccountVerified && !dataAccount.Item.AccountVerified){
                    /*Account wasn't verified but now it should be */
                    /*i.e. its being added to the dive centre first time*/
                    newToken += "01" + oldToken.substring(GuidSize+2,oldToken.length);
                    updateExp = "set AccountVerified = :a,AccessToken = :at";
                    expVals = {
                        ':a' : AccountVerified,
                        ':at' : newToken
                    };
                }
                else if(!AccountVerified && dataAccount.Item.AccountVerified){
                    /*Account was verified but now it shouldn't be */
                    /*i.e. its being removed from the dive centre */
                    newToken += "00" + oldToken.substring(GuidSize+2,oldToken.length);
                    updateExp = "set AccountVerified = :a,AccessToken = :at, AccountType = :acct remove InstructorNumber, DiveCentre";
                    expVals = {
                        ':a' : AccountVerified,
                        ':at' : newToken,
                        ':acct': "Diver"
                    };
                }
                else if(!AccountVerified && !dataAccount.Item.AccountVerified){
                    /*Account is being rejected first time*/
                    newToken = oldToken;
                    updateExp = "set AccountVerified = :a, AccountType = :acct remove InstructorNumber, DiveCentre";
                    expVals = {
                        ':a' : AccountVerified,
                        ':acct': "Diver"
                    }
                }
                else{
                    /* account used to be verified and still is */
                    responseBody = "Instructor's details did not change";
                    statusCode = 200;
                }
                if(statusCode == undef){
                    /*Update instructor account now*/
                    const paramsUpdateIns = {
                        TableName: "Scubamate",
                        Key: {
                            'AccountGuid' : AccountGuidGiven
                        },
                        UpdateExpression: updateExp,
                        ExpressionAttributeValues: expVals,
                        ReturnValues: 'ALL_NEW'
                    };
                    try{
                        const dataI = await documentClient.update(paramsUpdateIns).promise();
                        if(!AccountVerified && !dataAccount.Item.AccountVerified){
                            responseBody = "Successfully rejected diver.";
                            statusCode = 200;
                        }
                        else{
                            /*Either being added/removed as an instructor */
                            const paramsDC = {
                                TableName: "DiveInfo",
                                Key: {
                                    'ItemType' : 'DC-'+data.Item.DiveCentre.toLowerCase(),
                                },
                                ProjectionExpression: "Instructors"
                            };
                            try{
                                const dataDC = await documentClient.get(paramsDC).promise();
                                let instructorDetails = dataI.Attributes.FirstName+" " +dataI.Attributes.LastName;
                                let tmp = [];
                                //add
                                if(typeof dataDC.Item.Instructors != "undefined" && AccountVerified && !dataAccount.Item.AccountVerified){
                                    /* If there are instructors already and you want to add another */
                                    tmp = dataDC.Item.Instructors;
                                    tmp.push(instructorDetails);
                                }
                                else if (typeof dataDC.Item.Instructors != "undefined" && !AccountVerified && dataAccount.Item.AccountVerified){
                                    /* If there are instructors already and you want to remove one */
                                    if( contains(dataDC.Item.Instructors, instructorDetails )){
                                        dataDC.Item.Instructors.forEach(function (item){
                                           if(item != instructorDetails){
                                               tmp.push(item);
                                           } 
                                        });
                                    }
                                    else{
                                        /* already doesn't have instructor stored */
                                        tmp = dataDC.Item.Instructors;
                                    }
                                }
                                else if(AccountVerified && !dataAccount.Item.AccountVerified){
                                    /* If there are no instructors already and you want to add one */
                                    tmp.push(instructorDetails);
                                }
                                
                                /*Update Dive Centre's info */
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
                                    responseBody = "Successfully updated instructor!";
                                    statusCode = 200;
                                }
                                catch(err){
                                    responseBody = "Unable to update instructors.";
                                    statusCode = 403;
                                }
                            }
                            catch(err){
                                responseBody = "Unable to find dive centre.";
                                statusCode = 403;
                            } 
                        }
                    }
                    catch(err){
                        responseBody = "Unable to update instructor's account.";
                        statusCode = 403;
                    } 
                }

            }catch(err){
                responseBody = "Unable to find instructor's account.";
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
