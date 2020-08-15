'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


exports.handler = async (event,context) => {
    // TODO implement
    let statusCode = 0;
    let responseBody = "";
    
    const body = JSON.parse(event.body);
    const Name = body.Name;
    const CourseType = body.CourseType;
    const MinAgeRequired = body.MinAgeRequired;
    const QualificationType = body.QualificationType;
    const RequiredCourses = body.RequiredCourses;
    const SurveyAnswer = body.SurveyAnswer;
    
    const ItemType = "C-"+Name.toLowerCase();
    
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
