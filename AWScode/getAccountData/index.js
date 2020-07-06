'use strict'
const AWS = require('aws-sdk');
var s3 = new AWS.S3();
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const ddb = new AWS.DynamoDB({apiVersion:"2012-08-10"});
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    //properly formatted response
    let statusCode =0;

    let body = JSON.parse(event.body);
    var AccessToken = body.AccessToken;

    let responseBody = "";
    // var filePath = "profilephoto" + ItemType.substr(1, ItemType.length() );  + ".jpg";
    // var paramsImg = {Bucket: "profilephoto-imagedatabase-scubamate", Key: filePath };
    // s3.getObject(paramsImg, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else    responseBody = data;
    // });
    const guid = AccessToken.substring(0,36);

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
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": guid
        }
    }

    try {     
        const data = await documentClient.get(params).promise();
        
        if( data.Item.Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Item.Expires);
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
        responseBody = "Invalid Access Token ";
    }
    

    //Only proceed if access token is valid
    if(statusCode==0){
            const params = {
            TableName: "Scubamate",
            Key: {
            "AccountGuid": guid
            }
        }

        try{
            const data = await documentClient.get(params).promise();
            responseBody = data.Item;
            statusCode = 200;

        }catch(err){
            responseBody = "Unable to get account data";
            statusCode = 403;
        } 
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    };

    return response;
}
