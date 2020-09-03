'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const PageNum = body.PageNum;

    const GuidSize = 36;
    const AccountGuid = AccessToken.substring(0,GuidSize);

    
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

    /* Verify AccessToken  */
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": AccountGuid
        },
        ProjectionExpression : "AccessToken, Expires"
    };
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(compareDates( new Date(),new Date(data.Item.Expires))){
            responseBody = "Access Token Expired!";
            statusCode = 403;
    
        }
        else if(PageNum<1){
            responseBody = "Invalid Page Number.";
            statusCode = 403;
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }

    /*Only proceed if access token is valid*/
    if(statusCode==undef){
        var diveParams = {
            TableName: "Dives",
            ProjectionExpression: "AccountGuid, DiveSite, DiveDate, DiveTypeLink, Weather, TimeIn , TimeOut, Buddy, Rating, DiveImage",
            FilterExpression: "#acc = :acc AND #app = :app",
            ExpressionAttributeNames:{
                "#acc" : "DivePublicStatus",
                "#app" : "Approved"
            },
            ExpressionAttributeValues:{
                ":acc" : true,
                ":app" : true
            }
        };

        try {
            const dives = await documentClient.scan(diveParams).promise();
            
            if(dives.Items.length==0){
                responseBody = "No public dives found :(";
                statusCode = 404;
            }
            else{
                /*now add the name and surname of the diver*/
                var accounts = [];
                dives.Items.forEach(function(dive) {
                    accounts.push(dive.AccountGuid);
                });
                 for(let i=0; i<accounts.length; i++) {
                    const accountParams = {
                        TableName: "Scubamate",
                        Key: {
                            "AccountGuid": accounts[i]
                        },
                        ProjectionExpression : "EmailVerified, FirstName, LastName"
                    };
                    try{
                        let acc = await documentClient.get(accountParams).promise(); 
                        /*If account email isn't verified, don't add it to the public dive list */
                        if(acc.Item.EmailVerified){
                            dives.Items[i].FirstName = acc.Item.FirstName;
                            dives.Items[i].LastName = acc.Item.LastName;                          
                        }
                        else{
                            //Email not verified for account, so remove the item
                            dives.Items.splice(i, 1);
                        }
                        
                    }catch(err){
                        //Cannot find account, so remove the item
                        dives.Items.splice(i, 1);
                    }
                 }
                    
                /*sort the dives by date*/
                const sortedDives = dives.Items.sort((a, b) => new Date(b.DiveDate) - new Date(a.DiveDate));
                
                const numOfItems = 6;
                const start = (PageNum-1)*numOfItems ;
                let toReturn =[];
                /*Show next n items for current page */
                for(let i=start;i<numOfItems+start;i++){
                    if(sortedDives[i]!=null){
                        //Get Image of dive and add it 
                        let imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                        if(typeof sortedDives[i].DiveImage !=="undefined"){
                            imageToGet = sortedDives[i].DiveImage;
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
                        sortedDives[i].DiveImage = returnImg;
                        
                        toReturn.push(sortedDives[i]);
                    }
                }
                responseBody = toReturn;
                statusCode = 200;
             }
        } 
        catch(err){
            responseBody = "No public dives found " + err;
            statusCode = 404;
        }
        
    }   
  
    /*Final response to be sent back*/
    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    };

    return response;

};

