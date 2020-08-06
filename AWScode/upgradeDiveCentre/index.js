'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const AccountGuid = body.AccountGuid;
    const LogoPhoto = body.LogoPhoto;
    const Coords = body.Coords;
    const Description = body.Description;
    const Name = body.Name;
    const Courses = body.Courses;
    const Instructors = body.Instructors;
    const DiveSites = body.DiveSites;

    
    const GuidSize = 36;
    const guid = AccessToken.substring(0,GuidSize);
    
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
                "AccountGuid": guid
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
        else if(data.Item.AccountType != "SuperAdmin"){
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges";
        }
        else{
            /*Upgrade dive centre account to admin*/
            const typeParams = {
                TableName: "Scubamate",
                Key:{
                    "AccountGuid": AccountGuid
                },
                UpdateExpression: "set AccountType = :type ",
                // ConditionExpression: "AccountType != 'SuperAdmin' ",
                ExpressionAttributeValues:{
                    ":type": "Admin"
                },
                ReturnValues:"UPDATED_NEW"
            };
            
            console.log("Attempting a conditional update...");
            documentClient.update(typeParams, function(err, data) {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    statusCode = 403;
                    responseBody = "update error: " + err;
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                }
            })

            /*Add new dive centre*/
            if(statusCode == undef)
            {
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
            
                const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
                const ItemType = "DC-"+Name.toLowerCase();
                const params = {
                    TableName: "DiveInfo",
                    Item: {
                        ItemType : ItemType,
                        Coords : Coords,
                        Description : Description,
                        LogoPhoto : logoLink,
                        Name : Name,
                        AccountGuid : AccountGuid,
                        Courses: Courses,
                        Instructors: Instructors,
                        DiveSites: DiveSites
                    }
                };
        
                try{
                    const data = await documentClient.put(params).promise();
                    responseBody = "Successfully added Dive Center!";
                    statusCode = 201;
                }catch(err){
                    responseBody = "Unable to create account";
                    statusCode = 403;
                }
            }
        }            
    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token? " + err ;
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


