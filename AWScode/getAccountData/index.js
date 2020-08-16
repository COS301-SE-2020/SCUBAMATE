'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    let body = JSON.parse(event.body);
    let AccessToken = body.AccessToken;
    
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
            if(compareDates(today,expiryDate)){
                responseBody = "Access Token Expired!";
                statusCode = 403;
            }  
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }
    /* Only update account if access token is verified */
    if(statusCode==undef){
        const params = {
            TableName: "Scubamate",
            Key: {
            "AccountGuid": AccountGuid
            }
        };

        try{
            const data = await documentClient.get(params).promise();
            
            const AccountType = data.Item.AccountType;
            let incompleteResponse ={
                "AccountVerified": data.Item.AccountVerified,
                "DateOfBirth": data.Item.DateOfBirth,
                "Email": data.Item.Email,
                "EmailVerified": data.Item.EmailVerified,
                "FirstName": data.Item.FirstName,
                "LastName": data.Item.LastName,
                "PublicStatus": data.Item.PublicStatus,
                "CompletedCourses": data.Item.CompletedCourses,
                "ProfilePhoto":"N/A"
            };
            if(AccountType.trim() === "Instructor"){
                incompleteResponse ={
                    "AccountVerified": data.Item.AccountVerified,
                    "DateOfBirth": data.Item.DateOfBirth,
                    "Email": data.Item.Email,
                    "EmailVerified": data.Item.EmailVerified,
                    "FirstName": data.Item.FirstName,
                    "LastName": data.Item.LastName,
                    "PublicStatus": data.Item.PublicStatus,
                    "DiveCentre": data.Item.DiveCentre,
                    "InstructorNumber": data.Item.InstructorNumber,
                    "CompletedCourses,": data.Item.CompletedCourses,
                    "ProfilePhoto":"N/A"
                };
            }
            const startIndex = (data.Item.ProfilePhoto).lastIndexOf("/")+1;
            let filePath = (data.Item.ProfilePhoto).substring(startIndex, (data.Item.ProfilePhoto).length);
            
            let paramsImg = {"Bucket": "profilephoto-imagedatabase-scubamate", "Key": filePath };
            
            const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
            try{
                const binaryFile = await s3.getObject(paramsImg).promise();
                const startIndexContentType = (data.Item.ProfilePhoto).lastIndexOf(".")+1;
                const contentType = data.Item.ProfilePhoto.substring(startIndexContentType, data.Item.ProfilePhoto.length);
                let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                if(AccountType.trim() === "Instructor"){
                    /*Now get the Dive Centre's image to display */
                    let imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                    if(data.Item.AccountVerified){
                        const paramsDC = {
                            TableName: "DiveInfo",
                            ProjectionExpression: "LogoPhoto",
                            Key: {
                            "ItemType": "DC-"+data.Item.DiveCentre
                            }
                        };
                        try{
                            const dataDC = await documentClient.get(paramsDC).promise();
                            imageToGet = dataDC.Item.LogoPhoto;
                        }
                        catch(err){
                            /*Couldn't get image - use default image */
                            imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                        }
                    }
                    const startIndex = (imageToGet).lastIndexOf("/")+1;
                    let filePath = (imageToGet).substring(startIndex, (imageToGet).length);
                    
                    let paramsImg = {"Bucket": "imagedatabase-scubamate", "Key": filePath };
                    let returnImg;
                    
                    const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
                    try{
                        const binaryFile = await s3.getObject(paramsImg).promise();
                        const startIndexContentType = (imageToGet).lastIndexOf(".")+1;
                        const contentType = imageToGet.substring(startIndexContentType, imageToGet.length);
                        let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                        
                        returnImg = base64Image;
                    }
                    catch(err){
                        returnImg = "N/A";
                    }
                    
                    let completeResponse ={
                        "AccountVerified": data.Item.AccountVerified,
                        "DateOfBirth": data.Item.DateOfBirth,
                        "Email": data.Item.Email,
                        "EmailVerified": data.Item.EmailVerified,
                        "FirstName": data.Item.FirstName,
                        "LastName": data.Item.LastName,
                        "PublicStatus": data.Item.PublicStatus,
                        "DiveCentre": data.Item.DiveCentre,
                        "InstructorNumber": data.Item.InstructorNumber,
                        "CompletedCourses": data.Item.CompletedCourses,
                        "ProfilePhoto": base64Image,
                        "LogoPhoto":returnImg
                    };
                    responseBody = completeResponse;
                }
                else{
                    let completeResponse ={
                        "AccountVerified": data.Item.AccountVerified,
                        "DateOfBirth": data.Item.DateOfBirth,
                        "Email": data.Item.Email,
                        "EmailVerified": data.Item.EmailVerified,
                        "FirstName": data.Item.FirstName,
                        "LastName": data.Item.LastName,
                        "PublicStatus": data.Item.PublicStatus,
                        "CompletedCourses": data.Item.CompletedCourses,
                        "ProfilePhoto": base64Image
                    };
                    responseBody = completeResponse;
                }
            }
            catch(err){
                responseBody = incompleteResponse;
            }
            
            statusCode = 200;

        }catch(err){
            responseBody = "Unable to get account data "+err;
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
