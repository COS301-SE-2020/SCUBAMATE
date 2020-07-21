'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {

    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const FirstName = body.FirstName;
    const LastName = body.LastName;
    const DateOfBirth = body.DateOfBirth;
    const ProfilePhoto = body.ProfilePhoto;
    const PublicStatus = body.PublicStatus;

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
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(data.Item.Expires){
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            if(compareDates(today,expiryDate))
            {
                responseBody = "Access Token Expired!";
                statusCode = 403;
            }  
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }
    /* Put new image */
    /* data:image/png;base64, is send at the front of ProfilePhoto thus find the first , */
    const startContentType = ProfilePhoto.indexOf(":")+1;
    const endContentType = ProfilePhoto.indexOf(";");
    const contentType = ProfilePhoto.substring(startContentType, endContentType);
    
    const startExt = contentType.indexOf("/")+1;
    const extension = contentType.substring(startExt, contentType.length);
    
    const startIndex = ProfilePhoto.indexOf(",")+1;
    
    const encodedImage = ProfilePhoto.substring(startIndex, ProfilePhoto.length);
    const decodedImage = Buffer.from(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
  
    const filePath = "profilephoto" + AccountGuid + "."+extension;
    
    let profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;

    const paramsImage = {
      "Body": decodedImage,
      "Bucket": "profilephoto-imagedatabase-scubamate",
      "Key": filePath,
      "ContentEncoding": 'base64',
      "ContentType" : contentType
    };
    
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    s3.putObject(paramsImage, function(err, data){
        if(err) {
            responseBody = "Could not update image.";
            statusCode = 500;
        }
    });
    
    
    /* Only update account if access token is verified */
    if(statusCode==undef){
        const params = {
            TableName: "Scubamate",
            Key: {
                'AccountGuid' : AccountGuid,
            },
            UpdateExpression: 'set FirstName = :f, LastName = :l, DateOfBirth = :d, PublicStatus = :ps, ProfilePhoto = :pl',
            ExpressionAttributeValues: {
                ':f' : FirstName,
                ':l' :LastName,
                ':d': DateOfBirth,
                ':ps': PublicStatus,
                ':pl': profileLink
            }
        };
        try{
            const data = await documentClient.update(params).promise();
            responseBody = "Successfully updated account!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable to update account."+ err +" ";
            statusCode = 403;
        } 
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
