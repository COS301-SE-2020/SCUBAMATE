'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken; 
    /* Qualification and Specialisation of user */
    const Qualification = body.Qualification; 
    const Specialisation = body.Specialisation; 
    
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
        else if(!data.Item.AccountVerified){
            statusCode = 403;
            responseBody = "Account Not Verified by Admin - Ask your Dive Centre to Verify";
        }
        else if(!data.Item.EmailVerified){
            statusCode = 403;
            responseBody = "Account Email Not Verified - Can't Upgrade Until Email Is Verified";
        }
        else{
            /* Get List Of Qualification Courses which can be taken by this level */
            const paramsCourse = {
                TableName: 'DiveInfo',
                FilterExpression: 'begins_with(#itemT , :itemT) AND #QNeeded = :qual',
                ExpressionAttributeNames: {
                    '#itemT': 'ItemType',
                    '#QNeeded': 'QualificationNeeded',
                },
                ExpressionAttributeValues: {
                    ':itemT': "C-",
                    ':qual': Qualification,
                }
            };

            try{
                const dataC = await documentClient.scan(paramsCourse).promise();
                let tmpQ = [];
                let tmpS = [];
                dataC.Items.forEach(function(item) {
                    tmpQ.push(item.Name);
                });
                if(tmpQ.length == 0){
                    tmpQ = "No Qualification Courses Found";
                }
                /* Get List Of Specialisation Courses which can be taken by this level */
                const paramsSCourse = {
                    TableName: 'DiveInfo',
                    FilterExpression: 'begins_with(#itemT , :itemT)',
                    ExpressionAttributeNames: {
                        '#itemT': 'ItemType',
                    },
                    ExpressionAttributeValues: {
                        ':itemT': "S-",
                    }
                };
    
                try{
                    const dataS = await documentClient.scan(paramsSCourse).promise();
                    
                    dataS.Items.forEach(function(item) {
                        let itemName = item.Name;
                        let itemQualAllowed = item.QualificationsAllowed;
                        /*For each specialization
                        * check if one of them is the 
                        * same as account's then
                        * check qualifications allowed
                        * then add name of specialization*/
                        if(!contains(Specialisation,itemName)){
                            itemQualAllowed.forEach(function(qualAllowed) {
                                if((qualAllowed==Qualification) && !contains(tmpS,itemName)){
                                    tmpS.push(itemName);
                                }
                            });
                        }
                            
                    });
                    if(tmpS.length == 0){
                        tmpS = "No Specialisation Courses Found";
                    }
                    let returnList = [];
                    returnList.push({QualificationCourses: tmpQ});
                    returnList.push({SpecialisationCourses: tmpS});
                    responseBody = returnList;
                    statusCode = 200;
                }catch(err){
                    responseBody = "Unable to find new courses"+err;
                    statusCode = 403;
                }
                  
            }catch(err){
                responseBody = "Unable to find new courses"+err;
                statusCode = 403;
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
