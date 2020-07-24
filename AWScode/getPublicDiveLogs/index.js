'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiVersion:"2012-08-10"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    /*
    Retrieves AccessToken 
    */
    let body = JSON.parse(event.body)
    const AccessToken = body.AccessToken; 
    console.log(body.AccessToken);
    const guidLength = 36;
    const guid = AccessToken.substring(0,guidLength);
    
    let responseBody = "";
    let statusCode =0;

    /*
        Verify Access Token
    */
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": guid
        }
    }
    
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

    try {     
        const data = await documentClient.get(params).promise();
        
        /* check if it's undefined */
        if(typeof data.Item !== 'undefined' && data.Item){ 
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if((data.Item.AccessToken).toString().trim() != AccessToken){
                statusCode = 403;
                responseBody = "Invalid Access Token" ;
            }
            if(compareDates(today,expiryDate)){
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
        }
        else
        {
            statusCode = 403;
            responseBody = "Invalid Access Token";   
        }
            
        console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token. " + error;
    }

    /*
    Only proceed if access token is valid
    */
    if(statusCode==0){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "AccountGuid, DiveSite, DiveDate, DivePublicStatus, DiveTypeLink, Weather, TimeIn , TimeOut, Buddy",
            FilterExpression: "#acc = :acc",
            ExpressionAttributeNames:{
                "#acc" : "DivePublicStatus"
            },
            ExpressionAttributeValues:{
                ":acc" : true,
            }
        };

        try {
            console.log("Scanning...");
            const dives = await documentClient.scan(diveParams).promise();
            if(dives.Items.length==0){
                responseBody = "No public dives found :(";
                statusCode = 404;
            }
            else{
                /*now add the name and surname of the diver*/
                console.log("Scan succeeded.");
                var accounts = [];
                dives.Items.forEach(function(dive) {
                    console.log( dive.AccountGuid + " hmm");
                    accounts.push(dive.AccountGuid);
                });
                console.log("length: " + accounts.length)

                for(var i=0; i<accounts.length && statusCode==0; i++) {
                    let account = accounts[i];
                    var accountParams = {
                        TableName: "Scubamate",
                        Key: {
                            "AccountGuid": account
                        }
                    }
                    
                    try{
                        let acc = await documentClient.get(accountParams).promise();
                        console.log(acc.Item.FirstName + " " + acc.Item.LastName); 
                        if(i == 0){
                            responseBody += '{ "PublicDiveLogs" : ['
                        }
                        else{
                            responseBody += ",";
                        }
                        responseBody += '{ "FirstName" : "' + acc.Item.FirstName + '",' +
                                            '"LastName" : "' + acc.Item.LastName + '",' +
                                            '"DiveSite" : "'  + dives.Items[i].DiveSite + '",' +
                                            '"DiveDate" : "' + dives.Items[i].DiveDate + '",' +
                                            '"DiveType" : "' + dives.Items[i].DiveTypeLink + '",' +
                                            '"TimeIn" : "' + dives.Items[i].TimeIn + '",' +
                                            '"TimeOut" : "' + dives.Items[i].TimeOut + '",' +
                                            '"Buddy" : "' + dives.Items[i].Buddy + '",' +
                                            '"Weather" : [';
                                            
                        for(var j=0; j<dives.Items[i].Weather.length; j++){
                            if(j == 0){
                                responseBody += '"' + dives.Items[i].Weather[j] + '"';
                            }
                            else{
                                responseBody += ',"' + dives.Items[i].Weather[j] + '"';
                            }
                        }
                        responseBody += ']}';

                        if(i==accounts.length-1){
                            responseBody += ']}';
                        }
                
                    }catch(err){
                        var temp = responseBody;
                        responseBody = temp + " Unable to get account." ;
                        statusCode = 403;
                        
                    }
                    // statusCode = 200;
                }
    
                // continue scanning if we have more movies, because
                // scan can retrieve a maximum of 1MB of data
                // if (typeof data.LastEvaluatedKey != "undefined") {
                //     console.log("Scanning for more...");
                //     diveParams.ExclusiveStartKey = data.LastEvaluatedKey;
                //     documentClient.scan(diveParams, onScan);
                // }
    
                if(statusCode == 0){    
                    responseBody = JSON.parse(responseBody);
                    statusCode = 200;
                }
            }
        } 
        catch(err){
            if(statusCode == 0){
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2), );
                responseBody = "No public dives found " + err + " " + responseBody;
                statusCode = 404;
            }
        }
        
    }   
    
  
    /*
    Final response to be sent back
    */
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

