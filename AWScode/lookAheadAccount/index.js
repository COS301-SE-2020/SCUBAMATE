'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    const body = JSON.parse(event.body); 
    /* Indication of what to search for: Instructors and Divers(A) or just instructors  (I) */
    const ItemType = body.ItemType+"-"; 
    /* Letters entered by user so far */
    let UserEntry = body.UserEntry; 
    
    const validItemTypes = ["A-","I-"];
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
        /* Convert string to sentence case */
        
        let splitStr = UserEntry.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
          splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        splitStr.join(' ');
        let sentenceUE = splitStr.toString().trim();
        let filter = '#public = :public AND #email = :email AND (contains(#em , :em) OR contains(#fn , :fn) OR contains(#ln , :ln) OR contains(#fn , :fnu) OR contains(#ln , :lnu)) ';
        let exp = {
            '#em': 'Email',
            '#fn': 'FirstName',
            '#ln': 'LastName',
            '#public': 'PublicStatus',
            '#email':'EmailVerified'
        };
        let expVals = {
            ':em': UserEntry,
            ':fn': sentenceUE,
            ':ln': sentenceUE,
            ':fnu': UserEntry,
            ':lnu': UserEntry,
            ':public': true,
            ':email':true
        };
        if(ItemType.trim() ==="I-"){
            const Instructor = "Instructor";
            filter = '#accT = :accT AND #public = :public AND #email = :email AND #av = :av AND (contains(#em , :em) OR contains(#fn , :fn) OR contains(#ln , :ln) OR contains(#fn , :fnu) OR contains(#ln , :lnu)) ';
            exp = {
                '#em': 'Email',
                '#fn': 'FirstName',
                '#ln': 'LastName',
                '#public': 'PublicStatus',
                '#accT': 'AccountType',
                '#av':'AccountVerified',
                '#email':'EmailVerified'
            };
            expVals = {
                ':accT': Instructor,
                ':em': UserEntry,
                ':fn': sentenceUE,
                ':ln': sentenceUE,
                ':fnu': UserEntry,
                ':lnu': UserEntry,
                ':public': true,
                ':av': true,
                ':email':true
            };
        }
    
        const params = {
            TableName: 'Scubamate',
            FilterExpression: filter,
            ExpressionAttributeNames: exp,
            ExpressionAttributeValues: expVals,
        };
        const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
        try{
            const data = await documentClient.scan(params).promise();
            var tmp = [];
            const numOfItems = 10;
            
            for(let i=0;i<numOfItems;i++){
                if(data.Items[i]!=null){
                    if(ItemType.trim() ==="I-"){
                        tmp.push(data.Items[i].FirstName+ " "+ data.Items[i].LastName+" ("+data.Items[i].Email+") - "+data.Items[i].DiveCentre);
                    }
                    else{
                        tmp.push(data.Items[i].FirstName+ " "+ data.Items[i].LastName+" ("+data.Items[i].Email+")");
                        
                    }
                }
            }
            if(tmp.length == 0){
                responseBody = "No Results Found For: "+ UserEntry;
                statusCode = 404;
            }
            else{
                var returnList = [];
                returnList.push({ReturnedList: tmp});
                responseBody = returnList[0];
                statusCode = 200;
            }
            
        }catch(err){
            responseBody = "Unable to get data for "+UserEntry;
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
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    };

    return response;
};
