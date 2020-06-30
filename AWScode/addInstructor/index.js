'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

//Adding new instructor
    let body = JSON.parse(event.body);
    
    const InstructorNumber = body.InstructorNumber;
    const DiveCentre = body.DiveCentre;
    
    const AccountGuid = body.AccountGuid;
    const FirstName = body.FirstName;
    const LastName = body.LastName;
    const Email = body.Email;
    const DateOfBirth = body.DateOfBirth;
    const ProfilePhoto = body.ProfilePhoto;
    const Password = body.Password;
    const PublicStatus = body.PublicStatus;
    
    const ItemType = "A"+AccountGuid;
    const AccountType = "Instructor";
    
    //James time
    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(Password).digest('hex');
    
    /*
    var hash = "";
    //hashes the password using the Email as a salt
    crypto.pbkdf2(Password,Email, 100000, 64, 'sha512', (err, derivedKey) =>{
        if (err) throw err;
        hash = derivedKey.toString('hex');
    });
    */
    
    //Profile Photo
    //Read content from the file
    let encodedImage = "data:image/jpg;base64," +ProfilePhoto;
    let decodedImage = Buffer.from(encodedImage, 'base64');
    var filePath = "profilephoto" + AccountGuid + ".jpg";
    let profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;
    var paramsImage = {
      "Body": decodedImage,
      "Bucket": "profilephoto-imagedatabase-scubamate",
      "Key": filePath, 
      "Content-Type": "image/jpg"
    };
    
    s3.upload(paramsImage, function(err, data){
        if(err) {
            profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/image2.jpg";
        }
    });
    var paramsImg = {Bucket: 'profilephoto-imagedatabase-scubamate', Key: filePath, Body: decodedImage};
   
    await s3.getSignedUrl('putObject', paramsImg, function (err, url) {
        if(!err){
            console.log('The URL is', url,". ");
            profileLink = url;
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
            ItemType : ItemType,
            AccountGuid : AccountGuid,
            AccountType: AccountType, 
            FirstName: FirstName,
            InstructorNumber : InstructorNumber,
            LastName: LastName, 
            Email: Email, 
            DateOfBirth: DateOfBirth,
            DiveCentre : DiveCentre,
            Password: hash, //James time
            ProfilePhoto: profileLink,
            PublicStatus: PublicStatus,
        }
    }

    try{
        if (!flag)
        {
        const data = await documentClient.put(params).promise();
        }
        if (!flag)
        {
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
