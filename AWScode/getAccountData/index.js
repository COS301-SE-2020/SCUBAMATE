'use strict';
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
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else{
            //Account is valid
            const AccountType = data.Item.AccountType;
            const startIndex = (data.Item.ProfilePhoto).lastIndexOf("/")+1;
            let filePath = (data.Item.ProfilePhoto).substring(startIndex, (data.Item.ProfilePhoto).length);
            
            let paramsImg = {"Bucket": "profilephoto-imagedatabase-scubamate", "Key": filePath };
            
            const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
            try{
                const binaryFile = await s3.getObject(paramsImg).promise();
                const startIndexContentType = (data.Item.ProfilePhoto).lastIndexOf(".")+1;
                const contentType = data.Item.ProfilePhoto.substring(startIndexContentType, data.Item.ProfilePhoto.length);
                let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                if(AccountType.trim() === "Instructor"||AccountType.trim() === "Admin"){
                    /*Now get the Dive Centre's image to display */
                    let imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                    if(data.Item.AccountVerified){
                        const paramsDC = {
                            TableName: "DiveInfo",
                            ProjectionExpression: "LogoPhoto",
                            Key: {
                            "ItemType": "DC-"+data.Item.DiveCentre.toLowerCase()
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
                    data.Item.LogoPhoto = returnImg;
                }
                
                data.Item.ProfilePhoto = base64Image;
                responseBody = data.Item;
            }
            catch(err){
                data.Item.ProfilePhoto = "N/A";
                responseBody = data.Item;
            }
            delete data.Item.AccountGuid; 
            delete data.Item.AccessToken; 
            delete data.Item.AccountType; 
            delete data.Item.Expires; 
            delete data.Item.Password;
            statusCode = 200;
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Unable to Find Account";
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
};
