'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {

    let body = JSON.parse(event.body);
    let AccessToken = body.AccessToken;
    const YearOfSearch = body.YearOfSearch;
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
        if(typeof data.Item.AccountType === "undefined"){
            statusCode = 403;
            responseBody = "Invalid Permissions" ;
        }
        else{
            //Account Valid
            /* Get List Of Dives */
            
            let filter = "Approved = :check";
            let expVals = {
                    ':check': true,
                };
                
            //specialise if year to search is given
            if(YearOfSearch !=="*"){
                filter += " AND begins_with(#diveDate, :diveDate)";
                expVals = {
                    ':check': true,
                    ':diveDate': YearOfSearch ,
                };
            }
            
            //specialise if dive site is given
            if(DiveSite !== "*"){
                if(YearOfSearch  !=="*" ){
                    filter += " AND begins_with(#diveDate, :diveDate) AND DiveSite = :diveSite";
                    expVals = {
                        ':check': true,
                        ':diveDate': YearOfSearch ,
                        ':diveSite': DiveSite,
                    };
                }
                else{
                    filter +=" AND DiveSite = :diveSite";
                    expVals = {
                        ':check': true,
                        ':diveSite': DiveSite,
                    };
                }
                
            }
            
            const paramsDives = {
                TableName: 'Dives',
                ProjectionExpression: "#diveDate", 
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
                let totalDives = 0;
                dataD.Items.forEach(function (item){
                    totalDives++;
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
                const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
                months.forEach(function (item){
                   if (!contains(addedMonths,item)){
                       let itemToReturn = {
                            "Month" : item,
                            "AmountOfDives" : 0
                        };
                        toReturn.push(itemToReturn);
                        addedMonths.push(item);
                   }
                });
                
                toReturn.sort((a, b) => a.Month - b.Month);
                toReturn[0].Month = "Jan";
                toReturn[1].Month = "Feb";
                toReturn[2].Month = "Mar";
                toReturn[3].Month = "Apr";
                toReturn[4].Month = "May";
                toReturn[5].Month = "Jun";
                toReturn[6].Month = "Jul";
                toReturn[7].Month = "Aug";
                toReturn[8].Month = "Sep";
                toReturn[9].Month = "Oct";
                toReturn[10].Month = "Nov";
                toReturn[11].Month = "Dec";
                
                var returnList = [];
                returnList.push({TotalNumberOfDives: totalDives, ReturnedList: toReturn});
                responseBody = returnList[0];
                statusCode = 200;
            }
            catch (err) {
                statusCode = 403;
                responseBody = "Unable to Find Dives ";
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
