'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    /* To distiguish search: DS- Dive Sites or DC- Dive Centre */
    const ItemType = body.ItemType+"-"; 
    /* Letters entered by user so far (in case of lookahead search else must be * for full list) */
    const UserEntry = (body.UserEntry).toLowerCase(); 
    /* Page number to display - starting with Page 1*/
    const PageNum = body.PageNum; 
    const validItemTypes = ["DS-","DC-","C-"];
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
    let check = true;
    if(ItemType == "C-" && UserEntry!="*"){
        check = false;
    }
    if(check && PageNum>=1 && contains(validItemTypes, ItemType)){
        
        let filter = 'begins_with(#itemT , :itemT) AND contains(#itemT , :user)';
        let expressVal = {
                ':itemT': ItemType,
                ':user': UserEntry,
            };
            
        if(UserEntry.toString().trim() === '*'){
           filter = 'begins_with(#itemT , :itemT)';
           expressVal = {
                ':itemT': ItemType,
            };
        }
        let project = "#name, Description, LogoPhoto, #loc";
        let expName = {
                '#itemT': 'ItemType',
                '#name' : 'Name',
                '#loc': 'Location'
            };
        if(ItemType == "C-"){
            project = "#name, Description, CourseType";
            filter = 'begins_with(#itemT , :itemT)';
            expName = {
                '#itemT': 'ItemType',
                '#name' : 'Name'
            };
        }
        
        const params = {
            TableName: 'DiveInfo',
            ProjectionExpression: project, 
            FilterExpression: filter,
            ExpressionAttributeNames: expName,
            ExpressionAttributeValues: expressVal,
        };
        const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
        
        try{
            const data = await documentClient.scan(params).promise();
            let tmp = [];
            
            const numOfItems = 6;
            const start = (PageNum-1)*numOfItems ;
            
            /*Show next n items for current page */
            for(let i=start;i<numOfItems+start;i++){
                if(data.Items[i]!=null){
                    if(ItemType != "C-"){
                        if(typeof data.Items[i].LogoPhoto == "undefined"){
                            data.Items[i].LogoPhoto = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                        }
                        
                        const startIndex = (data.Items[i].LogoPhoto).lastIndexOf("/")+1;
                        let filePath = (data.Items[i].LogoPhoto).substring(startIndex, (data.Items[i].LogoPhoto).length);
                        
                        let paramsImg = {"Bucket": "imagedatabase-scubamate", "Key": filePath };
                        
                        const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
                        try{
                            const binaryFile = await s3.getObject(paramsImg).promise();
                            const startIndexContentType = (data.Items[i].LogoPhoto).lastIndexOf(".")+1;
                            const contentType = data.Items[i].LogoPhoto.substring(startIndexContentType, data.Items[i].LogoPhoto.length);
                            let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                            
                            data.Items[i].LogoPhoto = base64Image;
                        }
                        catch(err){
                            data.Items[i].LogoPhoto = "N/A";
                        }
                    }
                    tmp.push(data.Items[i]);
                }
            }
            
            if(tmp.length == 0){
                responseBody = "No Results Found For: "+UserEntry;
                statusCode = 404;
            }
            else{
                let returnList = [];
                returnList.push({ReturnedList: tmp});
                responseBody = returnList[0];
                 statusCode = 200;
             }
            
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
