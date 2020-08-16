'use strict'
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
        else if( data.Item.AccountType != "Instructor" ){
            responseBody = "Not Allowed to View Page.";
            statusCode = 403;
        }
        else{
            /* Is Instructor now to find it's Unverified Courses */
            const paramsCourses = {
                TableName: "Dives",
                ProjectionExpression: " DiveID,AirTemp,Approved,BottomTemp,Buddy, DiveDate, #dep, Description, DiveSite,DiveTypeLink,InstructorLink,SurfaceTemp,TimeIn,TimeOut,Visibility,Weather,DivePublicStatus", 
                FilterExpression: 'contains(#dt , :dt) AND #dv = :dv',
                ExpressionAttributeNames: {
                    '#dt': 'DiveTypeLink',
                    '#dv': 'DiveVerified',
                    "#dep":"Depth"
                },
                ExpressionAttributeValues: {
                    ':dt': "Course",
                    ':dv': false,
                },
            };
            try{
                const dataC = await documentClient.scan(paramsCourses).promise();
                if(dataC.length == 0 ){
                    responseBody = "No Courses Need to be Verified";
                    statusCode = 404;
                }
                else {
                    let tmp = [];
                    const search = data.Item.FirstName + " "+ data.Item.LastName+" ("+data.Item.Email+") - "+data.Item.DiveCentre;
                    dataC.Items.forEach(function (item) {
                        if(typeof item.InstructorLink != undefined && contains(item.InstructorLink, search)){
                            tmp.push(item);    
                        }
                        
                    });
                    if(tmp.length ==0){
                        responseBody = "No Courses Need to be Verified";
                        statusCode =404;
                        
                    }
                    else{
                        let returnList = [];
                        returnList.push({UnverifiedCourses: tmp});
                        responseBody = returnList[0];
                        statusCode =200;
                    }
                }
            
            }
            catch(err){
                statusCode = 403;
                responseBody = "Could not find courses. "+err;
            }
            statusCode =200;
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token"+err;
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
