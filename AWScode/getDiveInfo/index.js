'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    //properly formatted response
    let statusCode =0;
    let body = JSON.parse(event.body);
    var ItemType = body.ItemType; //Would be DS- Dive Sites, DT- Dive Type, DC- Dive Centre
    const UserEntry = body.UserEntry; //Letters entered by user so far (in case of lookahead else must be *)
    
    let responseBody = "";
    
    if(UserEntry.toString().trim() != '*'){
       ItemType = ItemType+"-"+UserEntry;
    }
    const params = {
        TableName: 'Scubamate',
        FilterExpression: 'begins_with(#itemT , :itemT)',
        ExpressionAttributeNames: {
            '#itemT': 'ItemType',
        },
        ExpressionAttributeValues: {
            ':itemT': ItemType,
        },
    };

    try{
        const data = await documentClient.scan(params).promise();
        var tmp = [];
        data.Items.forEach(function(item) {
            tmp.push(item.Name);
        });
        if(tmp.length == 0){
            responseBody = "No Results Found For: "+UserEntry;
            statusCode = 404;
        }
        else{
            var returnList = [];
            returnList.push({ReturnedList: tmp});
            responseBody = returnList[0];
            statusCode = 200;
        }
        
    }catch(err){
        responseBody = "Unable to get data ";
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }

    return response;
}
