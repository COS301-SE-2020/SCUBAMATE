'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


exports.handler = async (event,context) => {
    // TODO implement
    let statusCode = 0;
    let responseBody = "";
    
    /*
    const AccessToken = event.AccessToken;
    const Name = event.Name;
    const CourseType = event.CourseType;
    const MinAgeRequired = event.MinAgeRequired;
    const QualificationType = event.QualificationType;
    const RequiredCourses = event.RequiredCourses;
    const SurveyAnswer = event.SurveyAnswer;
    */
    
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const Name = body.Name;
    const CourseType = body.CourseType;
    const MinAgeRequired = body.MinAgeRequired;
    const QualificationType = body.QualificationType;
    const RequiredCourses = body.RequiredCourses;
    const SurveyAnswer = body.SurveyAnswer;
    
    
    
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
    
    
    const params1 = {
            TableName: "Scubamate",
            Key: {
                "AccountGuid": AccountGuid
            }
        };
        const data = await documentClient.get(params1).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else if(data.Item.AccountType != "Admin" && data.Item.AccountType != "SuperAdmin"){
            console.log(data.Item.AccountType);
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges";
        }
        else
        {
            const ItemType = "C-"+Name.toLowerCase();
            
            const params = {
                TableName: "DiveInfo",
                Item : {
                    ItemType : ItemType,
                    Name : Name,
                    CourseType: CourseType,
                    MinAgeRequired : MinAgeRequired,
                    QualificationType : QualificationType,
                    RequiredCourses : RequiredCourses,
                    SurveyAnswer : SurveyAnswer
                }
            };
            
            try {
                const data2 = await documentClient.put(params).promise();
                statusCode = 200;
                responseBody = "Successfully added the course!";
            }catch(err){
                statusCode = 403;
                responseBody = "Error, could not succesfully add the course";
            }
    
        }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(responseBody),
    };
    return response;
};
