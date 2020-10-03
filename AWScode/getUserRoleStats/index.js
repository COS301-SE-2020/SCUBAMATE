'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken; 
    
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
    function contains(arr,search){
        let returnBool = false;
        arr.forEach(function(item) {
            if(item==search){
                returnBool=true;
            }
        });
        return returnBool;
    }
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    try {     
         /* Verify AccessToken  */
        const params = {
            TableName: "Scubamate",
            Key: {
                "AccountGuid": AccountGuid
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
        else if(data.Item.AccountType !== "SuperAdmin" && data.Item.AccountType !== "Admin" ){
            statusCode = 403;
            responseBody = "Invalid Permissions" ;
        }
        else{
           const paramsAccounts = {
                TableName: 'Scubamate',
                ProjectionExpression: "#accT", 
                FilterExpression: "EmailVerified = :check",
                ExpressionAttributeNames: {
                    '#accT': 'AccountType',
                },
                ExpressionAttributeValues: {
                    ':check': true,
                }
            };

            try{
                const dataA = await documentClient.scan(paramsAccounts).promise();
                let toReturn= [];
                let totalUsers = 0;
                const userRoles = ["Diver","Instructor","Admin","SuperAdmin"];
                userRoles.forEach(function (item){
                    toReturn.push({
                        "Role" : item,
                        "AmountOfUsers" : 0
                    });
                });
                dataA.Items.forEach(function (item){
                    totalUsers++;
                    let result = toReturn.filter(obj => {
                      return obj.Role === item.AccountType;
                    });
                    result[0].AmountOfUsers++;
                    
                });
                let sortedList = [];
                userRoles.forEach(function(item) {
                    let result = toReturn.filter(obj => {
                      return obj.Role === item;
                    });
                    sortedList.push(result[0]);
                });
                
                var returnList = [];
                returnList.push({TotalUsers: totalUsers, ReturnedList: sortedList});
                responseBody = returnList[0];
                statusCode = 200;
                
            }catch (err) {
                statusCode = 403;
                responseBody = "Could not find Statistics "+err;
            }
    
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token";
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
