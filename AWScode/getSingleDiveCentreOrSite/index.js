'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    /* To distiguish search: DS- Dive Sites or DC- Dive Centre */
    const ItemType = body.ItemType+"-"; 
    /* Name of Dive Centre/Site */
    const Name = (body.Name).toLowerCase();
    const validItemTypes = ["DS-","DC-"];
    function contains(arr,search){
        let returnBool = false;
        arr.forEach(function(item) {
            if(item==search){
                returnBool=true;
            }
        });
        return returnBool;
    }
    
    let statusCode;
    let responseBody;
    if(contains(validItemTypes, ItemType)){
        let projection = "#name, #loc,  Description, Coords, LogoPhoto";
        if(ItemType == "DC-"){
           projection =  "#name, #loc, Description, Coords, LogoPhoto, Courses, Instructors, DiveSites";
        }
        const params = {
            TableName: 'DiveInfo',
            ProjectionExpression: projection, 
            ExpressionAttributeNames: {
                '#name' : 'Name',
                '#loc' : 'Location'
            },
            Key: {
                'ItemType' : ItemType + Name.toLowerCase()
            }     
        };
        const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
        
        try{
            const data = await documentClient.get(params).promise();
            
            if(typeof data.Item.LogoPhoto == "undefined"){
                data.Item.LogoPhoto = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
            }
            
            const startIndex = (data.Item.LogoPhoto).lastIndexOf("/")+1;
            let filePath = (data.Item.LogoPhoto).substring(startIndex, (data.Item.LogoPhoto).length);
            
            let paramsImg = {"Bucket": "imagedatabase-scubamate", "Key": filePath };
            
            const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
            try{
                const binaryFile = await s3.getObject(paramsImg).promise();
                const startIndexContentType = (data.Item.LogoPhoto).lastIndexOf(".")+1;
                const contentType = data.Item.LogoPhoto.substring(startIndexContentType, data.Item.LogoPhoto.length);
                let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                
                data.Item.LogoPhoto = base64Image
            }
            catch(err){
                data.Item.LogoPhoto = "N/A";
            }
            responseBody = data.Item;
            statusCode = 200;
            
            
        }catch(err){
            responseBody = "Unable to get data: "+err;
            statusCode = 403;
        }
    }
    else{
        responseBody = "Invalid Request.";
        statusCode = 403;
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
