'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body);
    const AccountGuid = body.AccountGuid;
    const AccountType = "Diver";
    const FirstName = body.FirstName;
    const LastName = body.LastName;
    const Email = body.Email;
    
    const DateOfBirth = body.DateOfBirth;
    const ProfilePhoto = body.ProfilePhoto;
    const Password = body.Password;
    const PublicStatus = body.PublicStatus;
    
    const Qualification = body.Qualification;
    const Specialisation = body.Specialisation;
    
    //hashes the password using the Email as a salt
    var crypto = require('crypto');
    var hash = crypto.pbkdf2Sync(Password, Email, 1000, 64, 'sha512').toString('hex');
    
    /* data:image/png;base64, is send at the front of ProfilePhoto thus find the first , */
    const startContentType = ProfilePhoto.indexOf(":")+1;
    const endContentType = ProfilePhoto.indexOf(";");
    const contentType = ProfilePhoto.substring(startContentType, endContentType);
    
    const startExt = contentType.indexOf("/")+1;
    const extension = contentType.substring(startExt, contentType.length);
    
    const startIndex = ProfilePhoto.indexOf(",")+1;
    const encodedImage = ProfilePhoto.substring(startIndex, ProfilePhoto.length);
    const decodedImage = Buffer.from(encodedImage, 'base64');
    const filePath = "profilephoto" + AccountGuid + "."+extension;
    let profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;
    const paramsImage = {
      "Body": decodedImage,
      "Bucket": "profilephoto-imagedatabase-scubamate",
      "Key": filePath,
      "Content-Type" : contentType
    };
    
    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    s3.upload(paramsImage, function(err, data){
        if(err) {
            profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/image2.jpg";
        }
    });
    
    
    //
    //Email checking
    const emailParams = {
        TableName: "Scubamate",
        ProjectionExpression: "Email",
        FilterExpression: "#em = :email",
        ExpressionAttributeNames:{
            "#em" : "Email"
        },
        ExpressionAttributeValues:{
            ":email" : Email
        }
    };
    
    
    
    var flag = false;
    
    try{
        const ryker = await documentClient.scan(emailParams).promise();
        var maily = ryker.Items[0].Email;
        if (maily)
        {
            statusCode = 403;
            responseBody = "Email already taken";
            flag = true;
        }
        
    }catch(err){
        
    }
    
    const params = {
        TableName: "Scubamate",
        Item: {
            AccountGuid : AccountGuid,
            AccountType: AccountType, 
            FirstName: FirstName,
            LastName: LastName, 
            Email: Email, 
            DateOfBirth: DateOfBirth,
            Password: hash, 
            ProfilePhoto: profileLink,
            PublicStatus: PublicStatus,
            Qualification: Qualification,
            Specialisation: Specialisation,
            EmailVerified: false,
            AccountVerified: false
        }
    }

    try{
        if (!flag)
        {
            const data = await documentClient.put(params).promise();
            responseBody = "Successfully added account!";
            statusCode = 201;
        }
    }catch(err){
        if (!flag)
        {
        responseBody = "Unable to create account";
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
    }
    return response;
    
}


