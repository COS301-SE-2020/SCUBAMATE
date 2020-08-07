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
    function getAge(dob){
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age--;
        }
        return age;
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
        else{
            /* Get Range Type for Courses */
            let courseType;
            let age =getAge(data.Item.DateOfBirth);
            let filter = 'begins_with(#itemT , :itemT) AND MinAgeRequired <= :age AND (QualificationType = :qType';
            let expAttrValues;
                
            /* To decide between diver/instructor/youth, check age */
            if(age>=12){
                if(typeof data.Item.CompletedCourses == "undefined"){
                    /* The diver has done no courses and thus can't be an instructor. */
                    filter += ")";
                    courseType = "Diver";
                    expAttrValues = {
                        ':itemT': "C-",
                        ':age' : age,
                        ':qType': courseType
                    }
                }
                else{
                    /* Qualified to do instructor or diver */
                    filter += " OR QualificationType = :qType2)";
                    expAttrValues = {
                        ':itemT': "C-",
                        ':age' : age,
                        ':qType': "Diver",
                        ':qType2': "Instructor"
                    };
                }
            }
            else if(age>=10){
                /* Diver is younger than 12 and older than 10 - can be a diver/youth*/
                filter += " OR QualificationType = :qType2)";
                expAttrValues = {
                    ':itemT': "C-",
                    ':age' : age,
                    ':qType': "Youth",
                    ':qType2': "Diver"
                };
            }
            else{
                /* Diver is younger than 10 - can only be a youth*/
                filter += ")";
                courseType = "Youth";
                expAttrValues = {
                    ':itemT': "C-",
                    ':age' : age,
                    ':qType': courseType
                }
            }
            
            /* Get List Of Courses */
            const paramsCourse = {
                TableName: 'DiveInfo',
                ProjectionExpression: "#name,MinAgeRequired, RequiredCourses, CourseType, QualificationType", 
                FilterExpression: filter,
                ExpressionAttributeNames: {
                    '#itemT': 'ItemType',
                    '#name':"Name"
                },
                ExpressionAttributeValues: expAttrValues
            };

            try{
                const dataC = await documentClient.scan(paramsCourse).promise();
                let tmp = [];
                /* Shorten array to return */
                let tmpCulled =[];
                let requiredCourses =[];
                dataC.Items.forEach(function(item) {
                    if(typeof data.Item.CompletedCourses == "undefined"){
                        /*Only push courses that don't require other courses */
                        if(item.RequiredCourses==null){
                            tmpCulled.push(item);
                        }
                    }
                    else if(!contains(data.Item.CompletedCourses, item.Name)){
                        /*If user hasn't done the course */
                        tmp.push(item);
                        requiredCourses.push(item.RequiredCourses);
                    }
                });
                
                if(tmpCulled.length == 0 && tmp.length == 0){
                    tmpCulled= "No Courses Found.";
                }
                else if(typeof data.Item.CompletedCourses != "undefined"){
                    /*All courses added that person hasn't done */
                    /* Check if they can do the course */
                    requiredCourses.forEach(function(item, index){
                        if(item==null || contains(data.Item.CompletedCourses, item)){
                            tmpCulled.push(tmp[index]);
                        }
                    });
                }
                let returnList = [];
                returnList.push({Courses: tmpCulled});
                responseBody = returnList[0];
                statusCode = 200;
                  
            }catch(err){
                responseBody = "Unable to find new courses: "+err;
                statusCode = 403;
            } 
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
