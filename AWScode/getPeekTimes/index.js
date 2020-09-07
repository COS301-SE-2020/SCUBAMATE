 'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    let body = JSON.parse(event.body);
    let AccessToken = body.AccessToken;
    const DiveSite = body.DiveSite;
    const YearOfSearch  = body.YearOfSearch;
    
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
            let filter = "begins_with(DiveID, :check)";
            let expVals = {
                    ':check': "D",
                };
                
            //specialise if year to search is given
            if(YearOfSearch !=="*"){
                filter = "begins_with(#diveDate, :diveDate)";
                expVals = {
                    ':diveDate': YearOfSearch ,
                };
            }
            
            //specialise if dive site is given
            if(DiveSite !== "*"){
                if(YearOfSearch  !=="*" ){
                    filter =" begins_with(#diveDate, :diveDate) AND DiveSite = :diveSite";
                    expVals = {
                        ':diveDate': YearOfSearch ,
                        ':diveSite': DiveSite,
                    };
                }
                else{
                    filter =" DiveSite = :diveSite";
                    expVals = {
                        ':diveSite': DiveSite,
                    };
                }
                
            }
            const paramsDives = {
                TableName: 'Dives',
                ProjectionExpression: "#diveDate, TimeIn", 
                FilterExpression: filter,
                ExpressionAttributeNames: {
                    '#diveDate': 'DiveDate',
                },
                ExpressionAttributeValues: expVals
            };

            try{
                const dataD = await documentClient.scan(paramsDives).promise();
                let toReturn = [];
                let addedTimes = [];
                const hourLength = 2;
                let totalDives = 0;
                dataD.Items.forEach(function (item){
                    totalDives++;
                    let Hour = item.TimeIn.substring(0, hourLength);
                    item.Hour=Hour;
                    if(contains(addedTimes,Hour)){
                        //If hour has been added already
                        let result = toReturn.filter(obj => {
                          return obj.Hour === Hour;
                        });
                        result[0].AmountOfDives++;
                    }
                    else{
                        //Hour not added yet
                        let itemToReturn = {
                            "Hour" : Hour,
                            "AmountOfDives" : 1
                        };
                        toReturn.push(itemToReturn);
                        addedTimes.push(Hour);
                    }
                });
                
                var returnList = [];
                returnList.push({TotalNumberOfDives: totalDives, ReturnedList: toReturn});
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
