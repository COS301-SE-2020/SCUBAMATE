'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken; 
    const Q1 = (body.Q1).toUpperCase(); 
    const Q2 = (body.Q2).toUpperCase(); 
    const Q3 = (body.Q3).toUpperCase(); 
    const Q4 = (body.Q4).toUpperCase(); 
    const Q5 = (body.Q5).toUpperCase(); 
    
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
        else{
            const options = ["A","B","C","D","E"];
            const optionsCount = [0,0,0,0,0];
            const optionNum = options.length;
            for(let i = 0; i<optionNum;i++){
                if(Q1 == options[i]){
                    optionsCount[i]++;
                }
                if(Q2 == options[i]){
                    optionsCount[i]++;
                }
                if(Q3 == options[i]){
                    optionsCount[i]++;
                }
                if(Q4 == options[i]){
                    optionsCount[i]++;
                }
                if(Q5 == options[i]){
                    optionsCount[i]++;
                }
            }
            let maxCount = Number.MIN_SAFE_INTEGER;
            let finalChoice;
            for(let i = 0; i<optionNum;i++){
                if(optionsCount[i]> maxCount){
                    maxCount = optionsCount[i];
                    finalChoice = options[i];
                }
            }
            
            /* Get List Of Courses */
            const paramsCourse = {
                TableName: 'DiveInfo',
                ProjectionExpression: "#name,MinAgeRequired, RequiredCourses, CourseType, Description", 
                FilterExpression: "contains(#itemT, :itemT) AND #survey = :survey",
                ExpressionAttributeNames: {
                    '#itemT': 'ItemType',
                    '#name':"Name",
                    "#survey" : "SurveyAnswer"
                },
                ExpressionAttributeValues: {
                    ':itemT': "C-",
                    ':survey': finalChoice
                }
            };

            try{
                const dataC = await documentClient.scan(paramsCourse).promise();
                responseBody = dataC;
                statusCode = 200;
                
            }catch (err) {
                statusCode = 403;
                responseBody = "Could not get courses. ";
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
