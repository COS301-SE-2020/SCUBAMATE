'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


exports.handler = async (event,context) => {
    // TODO implement
    let statusCode = 0;
    let responseBody = "";
    
    /*
    const Name = event.Name;
    const CourseType = event.CourseType;
    const MinAgeRequired = event.MinAgeRequired;
    const QualificationType = event.QualificationType;
    const RequiredCourses = event.RequiredCourses;
    const SurveyAnswer = event.SurveyAnswer;
    */
    const body = JSON.parse(event.body);
    const Name = body.Name;
    const CourseType = body.CourseType;
    const MinAgeRequired = body.MinAgeRequired;
    const QualificationType = body.QualificationType;
    const RequiredCourses = body.RequiredCourses;
    const SurveyAnswer = body.SurveyAnswer;
    
    
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
        const data = await documentClient.put(params).promise();
        statusCode = 200;
        responseBody = "Successfully added the course!";
        }catch(err){
            statusCode = 403;
            responseBody = "Error, could not succesfully add the course"
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
