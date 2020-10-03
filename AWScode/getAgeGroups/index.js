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
    function getAge(dob){
        let today = new Date();
        let birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age--;
        }
        return age;
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
        else if(data.Item.AccountType !== "SuperAdmin" && data.Item.AccountType !== "Admin"){
            statusCode = 403;
            responseBody = "Invalid Permissions" ;
        }
        else{
           const paramsAccounts = {
                TableName: 'Scubamate',
                ProjectionExpression: "#dob", 
                FilterExpression: "EmailVerified = :check",
                ExpressionAttributeNames: {
                    '#dob': 'DateOfBirth',
                },
                ExpressionAttributeValues: {
                    ':check': true,
                }
            };

            try{
                const dataA = await documentClient.scan(paramsAccounts).promise();
                let toReturn = [];
                let addedAgeGroups =[];
                const ageGroups = ["Under 10","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-89","90-99","Above 100"];
                dataA.Items.forEach(function (item){
                    let currAge = Math.floor(getAge(item.DateOfBirth)/10);
                    if(currAge >10){
                        currAge = 10;
                    }
                    let AgeGroup = ageGroups[currAge];
                    if(contains(addedAgeGroups,AgeGroup)){
                        //If AgeGroup has been added already
                        let result = toReturn.filter(obj => {
                          return obj.AgeGroup === AgeGroup;
                        });
                        result[0].AmountOfUsers++;
                    }
                    else{
                        //AgeGroup not added yet
                        let itemToReturn = {
                            "AgeGroup" : AgeGroup,
                            "AmountOfUsers" : 1
                        };
                        toReturn.push(itemToReturn);
                        addedAgeGroups.push(AgeGroup);
                    }
                    
                });
                
                ageGroups.forEach(function (item){
                   if (!contains(addedAgeGroups,item)){
                       let itemToReturn = {
                            "AgeGroup" : item,
                            "AmountOfUsers" : 0
                        };
                        toReturn.push(itemToReturn);
                        addedAgeGroups.push(item);
                   }
                });
                //Sorting
                
                let sortedList = [];
                ageGroups.forEach(function(item) {
                    let result = toReturn.filter(obj => {
                      return obj.AgeGroup === item;
                    });
                    sortedList.push(result[0]);
                });
                
                
                var returnList = [];
                returnList.push({ReturnedList: sortedList});
                responseBody = returnList[0];
                statusCode = 200;
                
            }catch (err) {
                statusCode = 403;
                responseBody = "Could not find Statistics ";
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
