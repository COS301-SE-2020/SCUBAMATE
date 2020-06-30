'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    //properly formatted response
    let statusCode =0;
    let body = JSON.parse(event.body); 
    var ItemType = body.ItemType; //Instructors and Divers or just instructors  (A / I)
    const UserEntry = body.UserEntry; //Letters entered by user so far 
    
    let responseBody = "";
    let filter = 'begins_with(#itemT , :itemT) AND #pub = :pub AND (contains(#em , :em) OR contains(#fn , :fn) OR contains(#ln , :ln))';
    let exp = {
        '#itemT' : 'ItemType',
        '#em': 'Email',
        '#fn': 'FirstName',
        '#ln': 'LastName',
        '#pub': 'PublicStatus',
    }
    let expVals = {
        ':itemT' : ItemType,
        ':em': UserEntry,
        ':fn': UserEntry,
        ':ln': UserEntry,
        ':pub': true,
    }
    if(ItemType.trim() ==="I"){
        var Instructor = "Instructor";
        filter = 'begins_with(#itemT , :itemT) AND #accT = :accT AND #pub = :pub AND (contains(#em , :em) OR contains(#fn , :fn) OR contains(#ln , :ln))';
        exp = {
            '#itemT' : 'ItemType',
            '#em': 'Email',
            '#fn': 'FirstName',
            '#ln': 'LastName',
            '#pub': 'PublicStatus',
            '#accT': 'AccountType',
        }
        expVals = {
            ':itemT' : "A",
            ':accT': Instructor,
            ':em': UserEntry,
            ':fn': UserEntry,
            ':ln': UserEntry,
            ':pub': true,
        }
    }

    const params = {
        TableName: 'Scubamate',
        FilterExpression: filter,
        ExpressionAttributeNames: exp,
        ExpressionAttributeValues: expVals,
    };

    try{
        const data = await documentClient.scan(params).promise();
        var tmp = [];
        data.Items.forEach(function(item) {
            tmp.push(item.FirstName+ " "+ item.LastName+" ("+item.Email+")");
        });
        if(tmp.length == 0){
            responseBody = "No Results Found For: "+UserEntry +", will be stored as text.";
            statusCode = 404;
        }
        else{
            var returnList = [];
            returnList.push({ReturnedList: tmp});
            responseBody = returnList[0];
            statusCode = 200;
        }
        
    }catch(err){
        responseBody = "Unable to get data for "+UserEntry+" "+err;
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
