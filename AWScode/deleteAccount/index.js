'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event) => {
    //const body = JSON.parse(event.body);
    //const AccessToken = body.AccessToken;
    
    const AccessToken = event.AccessToken;
    
    let responseBody = "";
    let statusCode = 0;
    
    //s3 Testing
    
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    s3.deleteObject({
        Bucket : "profilephoto-imagedatabase-scubamate",
        Key: 'James.jpg'
    },function(err,data){console.log(err)});
    
    //end of s3 testing
    
    
    const scanParams = {
        TableName: "Scubamate",
        FilterExpression : "#ac = :ac",
        ExpressionAttributeNames:{
            '#ac' : 'AccessToken'
        },
        ExpressionAttributeValues:{
            ':ac' : AccessToken
        }
    };
    
    const data = await documentClient.scan(scanParams).promise();
    if (data.Items.length==0)
    {
        responseBody = "Error! AccessToken does not exist";
        statusCode = 404;
    }
    else
    {
        console.log("AccessToken does indeed exist");
        const AccountGuid = data.Items[0].AccountGuid;
        
        const diveScanParams = {
            TableName : "Dives",
            FilterExpression : "#ag = :ag",
            ExpressionAttributeNames:{
                '#ag' : 'AccountGuid'
            },
            ExpressionAttributeValues:{
                ':ag' : AccountGuid
            }
        };
        try{
        const divesData = await documentClient.scan(diveScanParams).promise();
        if (divesData.Items.length==0)
        {
            responseBody = "Deletion Success! Note that this account had no dives attached to it";
            statusCode = 200;
        }
        else
        {
            //TODO
            var i = 0;
           
            for (var i = 0; i<divesData.Items.length;i++)
            {
                var diveTing = divesData.Items[i].DiveID;
                console.log("Dive ID: "+diveTing);
                
                 const deleteParams = {
                    TableName: "Dives",
                    Key : {
                        DiveID: diveTing,
                        AccountGuid : AccountGuid
                    }
                };
                var deleteData = await documentClient.delete(deleteParams).promise();
                 
                 console.log("End of loop");
            }
            
            
            responseBody = "Account successfully deleted!";
            statusCode = 200;
        }
        }catch(err){console.log("uh oh");};
        
        
        const deleteParams2 = {
            TableName: "Scubamate",
            Key : {
                AccountGuid: AccountGuid
            }
        };
        var deleteData = await documentClient.delete(deleteParams2).promise();
        
    }
    
    
    // TODO implement
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
