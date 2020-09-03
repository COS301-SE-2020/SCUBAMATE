'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccountGuid = body.AccountGuid;
    const FirstName = body.FirstName;
    const LastName = body.LastName;
    const Email = body.Email;
    const DateOfBirth = body.DateOfBirth;
    const ProfilePhoto = body.ProfilePhoto;
    const Password = body.Password;
    const PublicStatus = body.PublicStatus;
    
    const AccountType = "Instructor";
    const InstructorNumber = body.InstructorNumber;
    const DiveCentre = body.DiveCentre;
    
    const CompletedCourses = body.CompletedCourses;
    
    const crypto = require('crypto');
    const hash = crypto.pbkdf2Sync(Password, Email, 1000, 64, 'sha512').toString('hex');
    
    
    /*Email duplicate checking*/
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
    
    let dupFlag = false;
    let responseBody;
    let statusCode;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    try{
        const dataEmail = await documentClient.scan(emailParams).promise();
        if (dataEmail.Items.length !=0 )
        {
            statusCode = 403;
            responseBody = "Email already taken";
            dupFlag = true;
        }
        
    }catch(err){
        responseBody = "Email could not be checked.";
        dupFlag = true;
    }
    function contains(arr,search){
        let returnBool = false;
        arr.forEach(function(item) {
            if(item==search){
                returnBool=true;
            }
        });
        return returnBool;
    }
    if(!dupFlag){
        
        /* Check Qualification */
            
        const paramsCourse = {
            TableName: "DiveInfo",
            FilterExpression: 'begins_with(#itemT , :itemT) AND #qualT = :qualT',
            ExpressionAttributeNames: {
                '#itemT': 'ItemType',
                '#qualT' : 'QualificationType'
            },
            ExpressionAttributeValues: {
                ':itemT': "C-",
                ':qualT': "Instructor",
            }
        };
        try{
            const dataQ = await documentClient.scan(paramsCourse).promise();
            let qualified = false;
            if(typeof CompletedCourses == "undefined"){
                responseBody = "Invalid Request Body."
                statusCode = 400;
            }
            else{
                CompletedCourses.forEach(function(item) {
                    /*For each completed course
                    Check if it is in the courses retrieved
                    */
                    if(contains(dataQ.Items, item.Name)){
                        qualified = true;
                    }
                });
                if(qualified){
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
                            /* Default image if image upload fails */
                            profileLink ="https://profilephoto-imagedatabase-scubamate.s3.af-south-1.amazonaws.com/image2.jpg";
                        }
                    });
                    
                    const params = {
                        TableName: "Scubamate",
                        Item: {
                            AccountGuid : AccountGuid,
                            AccountType: AccountType, 
                            FirstName: FirstName,
                            InstructorNumber : InstructorNumber,
                            LastName: LastName, 
                            Email: Email, 
                            DateOfBirth: DateOfBirth,
                            DiveCentre : DiveCentre,
                            Password: hash, 
                            ProfilePhoto: profileLink,
                            PublicStatus: PublicStatus,
                            EmailVerified: false,
                            AccountVerified: false,
                            CompletedCourses: CompletedCourses
                        }
                    };
                
                    try{
                        const data = await documentClient.put(params).promise();
                        responseBody = "Successfully added account!";
                        statusCode = 201;
                    }catch(err){
                        responseBody = "Unable to create account";
                        statusCode = 403;
                    }
                }
                else{
                    responseBody = "Incorrect qualification to be an instructor.";
                    statusCode = 404;
                }
            }
            
        }catch(err){
            responseBody = "Unable to check qualification verified : "+err;
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


