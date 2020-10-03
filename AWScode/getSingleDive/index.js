'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    const body = JSON.parse(event.body);
    const DiveID = body.DiveID; 
    const AccessToken = body.AccessToken; 
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
    
    
    /* Continue if Access Token Valid */
    if(statusCode==undef){
        var diveParams = {
            TableName: "Dives",
            FilterExpression: "#acc = :acc AND #di = :di",
            ExpressionAttributeNames:{
                "#acc" : "AccountGuid",
                "#di" : "DiveID"
            },
            ExpressionAttributeValues:{
                ":acc" : AccountGuid,
                ":di" : DiveID,
            }
        };
        
        try{
            /* Search for Dive */
            var searchResult = await documentClient.scan(diveParams).promise();
            if(searchResult.Items.length == 0){
                responseBody = "Could not find dive.";
                statusCode = 404;
            }
            else{
                //Get Image of dive and add it 
                let imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                if(typeof searchResult.Items[0].DiveImage !=="undefined"){
                    imageToGet = searchResult.Items[0].DiveImage;
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
                searchResult.Items[0].DiveImage = returnImg;
                delete searchResult.Items[0].DiveID;
                delete searchResult.Items[0].DiveVerified;
                delete searchResult.Items[0].AccountGuid;
                delete searchResult.Items[0].AITraining;
                delete searchResult.Items[0].Approved;
                responseBody = searchResult.Items[0];
                statusCode = 200;
            }
            
        }catch(err){
            responseBody = "Could not find dive.";
            statusCode = 404;
        } 
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true
        },
        body :  JSON.stringify(responseBody),
        isBase64Encoded: false
    };
    return response;

};

