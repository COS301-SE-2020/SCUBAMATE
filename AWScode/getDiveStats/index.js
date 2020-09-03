 'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    let body = JSON.parse(event.body);
    let AccessToken = body.AccessToken;
    const YearToSearch = body.YearToSearch;
    const DiveSite = body.DiveSite;
    
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
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        if(data.Item.AccountType != "Admin" && data.Item.AccountType != "SuperAdmin"){
            statusCode = 403;
            responseBody = "Invalid Permissions" ;
        }
        else{
            //Account Valid
            /* Get List Of Dives */
            let filter = "begins_with(#diveDate, :diveDate)";
            let expVals = {
                    ':diveDate': YearToSearch,
                };
            if(DiveSite !== "*"){
                filter+=" AND DiveSite = :diveSite";
                expVals = {
                    ':diveDate': YearToSearch,
                    ':diveSite': DiveSite,
                };
            }
            const paramsDives = {
                TableName: 'Dives',
                ProjectionExpression: "DiveDate", 
                FilterExpression: filter,
                ExpressionAttributeNames: {
                    '#diveDate': 'DiveDate',
                },
                ExpressionAttributeValues: expVals
            };

            try{
                const dataD = await documentClient.scan(paramsDives).promise();
                let toReturn = [];
                let addedMonths = [];
                const lengthOfYear = 5;
                dataD.Items.forEach(function (item){
                    let Month = item.DiveDate.substring(lengthOfYear, lengthOfYear+2);
                    item.Month=Month;
                    if(contains(addedMonths,Month)){
                        //If month has been added already
                        let result = toReturn.filter(obj => {
                          return obj.Month === Month;
                        });
                        result[0].AmountOfDives++;
                    }
                    else{
                        //Month not added yet
                        let itemToReturn = {
                            "Month" : Month,
                            "AmountOfDives" : 1
                        };
                        toReturn.push(itemToReturn);
                        addedMonths.push(Month);
                    }
                });
                var returnList = [];
                returnList.push({ReturnedList: toReturn});
                responseBody = returnList[0];
                statusCode = 200;
            }
            catch (err) {
                statusCode = 403;
                responseBody ="Unable to Find Dives: "+err;
            }
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Unable to Find Information";
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
