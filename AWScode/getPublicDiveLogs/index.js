'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiVersion:"2012-08-10"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let responseBody = "";
    let statusCode =0;
    // let publicLogs = "";

    let body = JSON.parse(event.body)
    const AccessToken = body.AccessToken; 
    console.log(body.AccessToken);

    function compareDates(t,e)
    {
        console.log(t.getFullYear());
        if(t.getFullYear()<e.getFullYear())
        {   
            return false;
        }else if(t.getFullYear()>e.getFullYear())
        {
            return true;
        }

        if(t.getMonth()<e.getMonth())
        {
            return false;
        }else if(t.getMonth()>e.getMonth())
        {
            return true;
        }

        if(t.getDate()<e.getDate())
        {
            return false;
        }else if(t.getDate()>e.getDate())
        {
            return true;
        }

        if(t.getHours()<e.getHours())
        {
            return false;
        }else if(t.getHours()>e.getHours())
        {
            return true;
        }

        if(t.getMinutes()<e.getMinutes())
        {
            return false;
        }else if(t.getMinutes()>e.getMinutes())
        {
            return true;
        }

        if(t.getSeconds()<e.getSeconds())
        {
            return false;
        }else if(t.getSeconds()>e.getSeconds())
        {
            return true;
        }

        if(t.getMilliseconds()<e.getMilliseconds())
        {
            return false;
        }else if(t.getMilliseconds()>e.getMilliseconds())
        {
            return true;
        }

        return true;
    }

    //Verify AccessToken 
    try {
        const params = {
            TableName: "Scubamate",
            ProjectionExpression: "Expires,AccountGuid",
            FilterExpression: "#acc = :AccessToken",
            ExpressionAttributeNames:{
                "#acc" : "AccessToken"
            },
            ExpressionAttributeValues:{
                ":AccessToken" : AccessToken
            }
        };
            
        const data = await documentClient.scan(params).promise();
        if(data.Items[0].AccountGuid)
        {
            console.log("Account thing: " + data.Items[0].AccountGuid);
            var AccountGuid = data.Items[0].AccountGuid;
        }
        if( data.Items[0].Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Items[0].Expires);
            const today = new Date();
            console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if(compareDates(today,expiryDate))
            {
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
                
        }
            
        console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }
    

    //Only proceed if access token is valid
    if(statusCode==0){

        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "AccountGuid, DiveSiteLink, DiveDate, DivePublicStatus, Weather, TimeIn , TimeOut, Buddy",
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
            if(!dives.Items[0].AccountGuid)
            {
                responseBody = "No public dives found :(";
                statusCode = 404;
            }
            else{
                //now add the name and surname of the diver
                console.log("Scan succeeded.");
                var accounts = [];
                dives.Items.forEach(function(dive) {
                    console.log( dive.AccountGuid + " hmm");
                    accounts.push(dive.AccountGuid);
                });
                console.log("length: " + accounts.length)

                for(var i=0; i<accounts.length; i++)
                {
                    var item = "A" + accounts[i];
                    var accountParams = {
                        TableName: "Scubamate",
                        Key: {
                            "ItemType": item
                        }
                    }
                    
                    try{
                        var acc = await documentClient.get(accountParams).promise();
                        console.log(acc.Item.FirstName + " " + acc.Item.LastName); //Is stringset
                        if(i == 0)
                        {
                            responseBody += '{ "Public Dive Logs" : ['
                        }
                        else
                        {
                            responseBody += ",";
                        }
                        responseBody += '{ "FirstName" : "' + acc.Item.FirstName + '",' +
                                            '"LastName" : "' + acc.Item.LastName + '",' +
                                            '"DiveSiteLink" : "'  + dives.Items[i].DiveSiteLink + '",' +
                                            '"DiveDate" : "' + dives.Items[i].DiveDate + '",' +
                                            '"TimeIn" : "' + dives.Items[i].TimeIn + '",' +
                                            '"TimeOut" : "' + dives.Items[i].TimeOut + '",' +
                                            '"Buddy" : "' + dives.Items[i].Buddy + '",' +
                                            '"Weather" : "' + dives.Items[i].Weather + '"'  +
                                            '}';

                        if(i==accounts.length)
                        {
                            responseBody += ']}';
                        }

                
                    }catch(err){
                        responseBody = "Unable to get account";
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
    

                responseBody = JSON.parse(responseBody);
                statusCode = 200;
            }
        } 
        catch(err)
        {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2), );
            responseBody = "No public dives found " + err + " " + responseBody;
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

