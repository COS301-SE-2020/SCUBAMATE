'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    /* To distiguish search: DS- Dive Sites, DT- Dive Type, DC- Dive Centre, C- Courses/Qualifications , S- Specialisation */
    const ItemType = body.ItemType+"-"; 
    /* Letters entered by user so far (in case of lookahead else must be * for full list) */
    const UserEntry = (body.UserEntry).toLowerCase(); 
    
    let filter = 'begins_with(#itemT , :itemT) AND contains(#itemT , :user)';
    let expressVal = {
            ':itemT': ItemType,
            ':user': UserEntry,
        };
        
    let pagination = true;
    if(UserEntry.toString().trim() === '*' && ItemType.toString().trim() != 'DT-'){
       filter = 'begins_with(#itemT , :itemT)';
       expressVal = {
            ':itemT': ItemType,
        };
        pagination = false;
    }
    
    const params = {
        TableName: 'DiveInfo',
        FilterExpression: filter,
        ExpressionAttributeNames: {
            '#itemT': 'ItemType',
        },
        ExpressionAttributeValues: expressVal,
    };
    
    let statusCode;
    let responseBody;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    
    try{
        const data = await documentClient.scan(params).promise();
        let tmp = [];
        
        if(pagination){
            const numOfItems = 10;
            for(let i=0;i<numOfItems;i++){
                if(data.Items[i]!=null){
                    tmp.push(data.Items[i].Name);
                }
            }
        }
        else{
            data.Items.forEach(function(item) {
                 tmp.push(item.Name);
            });
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
