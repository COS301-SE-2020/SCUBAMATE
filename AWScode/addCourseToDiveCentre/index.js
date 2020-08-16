'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const Name = body.Name;
    const Courses = body.Courses;
    

    const GuidSize = 36;
    const AccountGuid = AccessToken.substring(0,GuidSize);
    
    /* Verify AccessToken  */
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
        else if(data.Item.AccountType != "Admin"){
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges.";
        }
        /* Check that Account is linked to Dive Centre */
        else if(!data.Item.DiveCentre.localCompare(Name))
        {
            statusCode = 403;
            responseBody = "Account cannot modify this Dive Centre."
        }
        else{
            /*Retrieve list of existing courses*/  
            const ItemType = "DC-"+Name.toLowerCase();        
            const dParams = {
                TableName: "DiveInfo",
                Key: {
                    'ItemType' : ItemType
                }
            };  
            let existingCourses;
            try{    
                const centre = await documentClient.get(dParams).promise();
                existingCourses = centre.Item.Courses;

                /*Add new courses*/ 
                for(var i=0; i<Courses.size(); i++)
                {
                    existingCourses.push(Courses[i]);
                }
            }catch(err){
                responseBody =  "Centre doesn't exist. " + err;
                statusCode = 403;
            }
            
            /*Update courses in the database*/ 
            if(statusCode == undef)
            {
                const ItemType = "DC-"+Name.toLowerCase();
                const cParams = {
                    TableName: "DiveInfo",
                    Key: {
                        'ItemType' : ItemType,
                    },
                    UpdateExpression: 'set Courses = :c',
                    ExpressionAttributeValues: {
                        ':c' : existingCourses
                    }
                };
                
                try{
                    const d = await documentClient.update(cParams).promise();
                    responseBody =  "Successfully added courses to dive centre!";
                    statusCode = 200;
                }catch(err){
                    responseBody =  "Update failed. " + err;
                    statusCode = 403;
                }
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


