'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    /* Parameters that can be updated */
    const LogoPhoto = body.LogoPhoto;
    const Coords = body.Coords;
    const Description = body.Description;
    /*Parameter that can't */
    const Name = body.Name;

    const GuidSize = 36;
    const AccountGuid = AccessToken.substring(0,GuidSize);
    
    /* Verify AccessToken  */
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
        else if(data.Item.AccountType != "Admin"){
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges.";
        }
        /* Check that Account is linked to Dive Centre */
        else if(!data.Item.DiveCentre.localCompare(Name))
        {
            statusCode = 403;
            responseBody = "Account cannot modify this Dive Centre."
        }
        else{
            /* Edit dive centre basic info*/
            /* data:image/png;base64, is send at the front of ProfilePhoto thus find the first , */
            const startContentType = LogoPhoto.indexOf(":")+1;
            const endContentType = LogoPhoto.indexOf(";");
            const contentType = LogoPhoto.substring(startContentType, endContentType);
                
            const startExt = contentType.indexOf("/")+1;
            const extension = contentType.substring(startExt, contentType.length);

            const startIndex = LogoPhoto.indexOf(",")+1;
            
            const encodedImage = LogoPhoto.substring(startIndex, LogoPhoto.length);
            const decodedImage = Buffer.from(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
              
            const filePath = "logophoto" + Name + "."+extension;
                
            let logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;
            
            const paramsImage = {
                "Body": decodedImage,
                "Bucket": "imagedatabase-scubamate",
                "Key": filePath,
                "ContentEncoding": 'base64',
                "ContentType" : contentType
            };
                
            const s3 = new AWS.S3({apiVersion: '2006-03-01'});
            s3.putObject(paramsImage, function(err, data){
                if(err) {
                    /* Default image if image upload fails */
                    logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                }
            });
                     
            const dParams = {
                TableName: "DiveInfo",
                Key: {
                    'AccountGuid' : AccountGuid,
                },
                UpdateExpression: 'set LogoPhoto = :l, Coords = :c, Description = :d',
                ExpressionAttributeValues: {
                    ':c' : Coords,
                    ':l' :LogoPhoto,
                    ':d': Description
                }
            };  
            
            try{
                const d = await documentClient.update(dParams).promise();
                responseBody =  "Successfully updated Dive Centre!";
                statusCode = 200;
            }catch(err){
                responseBody =  "Account doesn't exist (update)" + err;
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


