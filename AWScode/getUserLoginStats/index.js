'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
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
        
        var accountParams = {
            TableName: "Scubamate",
            ProjectionExpression: "Expires"  
        };
        try {
            const accounts = await documentClient.scan(accountParams).promise();
            
            if(accounts.Items.length==0){
                responseBody = "No accounts found";
                statusCode = 404;
            }
            else{
                /*How many days ago did users log in?*/
                let days = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                let total = 0;
                let diff = 0;
                var date_diff_indays = function(date1, date2) {
                    let dt1 = new Date(date1);
                    let dt2 = new Date(date2);
                    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
                }

                accounts.Items.forEach(function(account) {
                    
                    diff = date_diff_indays(new Date(), account.Expires)
                    if(diff > 0){
                        days[diff] += 1;                       
                    }else{
                        days[14] += 1;
                    }
                    total++;
                })
                responseBody = '{ "DaysPassed" : [[';
                for(var i=1; i<16; i++)
                {
                    
                    if(i<15){
                        responseBody += '{ "Day" : "' +  i + ' days ago",' +
                                    '"Amount" : "' + days[i-1] + '"},';
                    }
                    else
                    {
                        responseBody += '{ "Day" : "More than 14 days ago",' +
                                    '"Amount" : "' + days[i-1] + '"}';
                    }
                } 
                responseBody += '],{ "Total" : "' + total + '"}]}';
                responseBody = JSON.parse(responseBody);
                statusCode = 200;      
             }
        } 
        catch(err){
            responseBody = "Scan error: Please report " + err + " " + responseBody;
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

