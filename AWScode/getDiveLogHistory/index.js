'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body)
    const AccessToken = body.AccessToken;

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
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(data.Item.Expires){
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            if(compareDates(today,expiryDate)){
                responseBody = "Access Token Expired!";
                statusCode = 403;
            }  
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }
    
    /*Only proceed if access token is valid*/
    if(statusCode==0){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "DiveID, AccountGuid,Buddy, DiveTypeLink, DiveSite, DiveDate, Weather, TimeIn , TimeOut",
            FilterExpression: "#acc = :acc",
            ExpressionAttributeNames:{
                "#acc" : "AccountGuid"
            },
            ExpressionAttributeValues:{
                ":acc" : AccountGuid,
            }
        };
        
        try{
            /*search for all the dive logs */
            const dives = await documentClient.scan(diveParams).promise();
            
            if((typeof dives.Items !== 'undefined') && dives.Items.length >0)
            {
                let sortedByDate = [];
                const resultLength = dives.Items.length;

                /*Sort according to dates */
                responseBody = '{ "PrivateDiveLogs" : [';
                for(var i=0; i<resultLength; i++)
                {
                    let earliestDate= new Date(dives.Items[i].DiveDate);
                    let index = i;
                    for(var j=i; j<resultLength; j++)
                    {
                        let check = new Date(dives.Items[j].DiveDate);
                        if(compareDates(check,earliestDate))
                        {
                            earliestDate = check;
                            index = j;
                        }
                    }
                    let temp = dives.Items[index];
                    dives.Items[index] = dives.Items[i];
                    dives.Items[i] = temp;

                    responseBody += '{ "DiveID" : "' +  dives.Items[i].DiveID + '",' +
                                        '"DiveSite" : "' +  dives.Items[i].DiveSite + '",' +
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
                    if(i != resultLength-1)
                    {
                        responseBody += ',';
                    }
                }
                responseBody += ']}';    

                /*Constuct JSON object */
                responseBody = JSON.parse(responseBody);
                statusCode = 201; 

            }
            else{
                responseBody = "No diver logs found";
                statusCode = 404;
            }
        }catch(err){
            responseBody = "No diver logs found " + err + "   ====>" + check;
            statusCode = 404;
        } 
    }

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
