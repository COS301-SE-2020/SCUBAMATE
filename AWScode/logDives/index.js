'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    let body = JSON.parse(event.body);
    const DiveID = body.DiveID;
    const AccessToken = body.AccessToken;
    const AirTemp = body.AirTemp;
    const BottomTemp = body.BottomTemp;
    const Buddy = body.Buddy;
    const DiveDate = body.DiveDate;
    const Depth = body.Depth;
    const Description = body.Description;
    const DiveSite = body.DiveSite;
    const DiveTypeLink = body.DiveTypeLink;
    const InstructorLink = body.InstructorLink;
    const SurfaceTemp = body.SurfaceTemp;
    const TimeIn = body.TimeIn;
    const TimeOut = body.TimeOut;
    const Visibility = body.Visibility;
    const Weather = body.Weather;
    const DivePublicStatus = body.DivePublicStatus;
    const isCourse = body.isCourse;
    const Rating = body.Rating;
    const WaterType = body.WaterType;
    
    const guid = AccessToken.substring(0,36);

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
    //Verify AccessToken 
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": guid
        }
    };
    
    let responseBody;
    const undef =0;
    let statusCode =undef;
    try {     
        const data = await documentClient.get(params).promise();
        if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token." ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else{
            let diveLink = DiveTypeLink;
            if(isCourse){
                diveLink = DiveTypeLink + " Course";
                if(typeof InstructorLink == "undefined" || InstructorLink.length ==0){
                    statusCode = 400;
                    responseBody = "Instructors needed for course";
                }
            }
            if(Rating <0 || Rating >5){
                responseBody = "Invalid Rating";
                statusCode = 403;
            }
            let dsImage = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
            const paramsCheck = {
                TableName: "DiveInfo",
                Key: {
                    "ItemType": "DS-"+DiveSite.toLowerCase()
                },
                ProjectionExpression : "LogoPhoto"
            };
            try {     
                const dataCheck = await documentClient.get(paramsCheck).promise();
                if(typeof dataCheck === "undefined"||typeof dataCheck.Item === "undefined"){
                    statusCode = 403;
                    responseBody = DiveSite+" Invalid Dive Site.";
                }
                else{
                    dsImage = dataCheck.Item.LogoPhoto;
                }
            }
            catch(err){
                statusCode = 403;
                responseBody = "Invalid Dive Site. "+err;
            }
            
            /* Only log the dive if above is verified */
            if(statusCode==undef){
                let Approved = true;
                if(isCourse){
                    Approved = false;
                }
                Weather[2] = Weather[2].toLowerCase();
                const params = {
                    TableName: "Dives",
                    Item: {
                        DiveID : DiveID,
                        AccountGuid : guid,
                        AirTemp : AirTemp,
                        Approved: Approved, 
                        BottomTemp: BottomTemp,
                        Buddy: Buddy, 
                        DiveDate: DiveDate, 
                        Depth: Depth+"m",
                        Description: Description, 
                        DiveSite: DiveSite,
                        DiveTypeLink: diveLink,
                        InstructorLink: InstructorLink,
                        SurfaceTemp: SurfaceTemp,
                        TimeIn: TimeIn,
                        TimeOut: TimeOut,
                        Visibility: Visibility+"m",
                        Weather: Weather,
                        DivePublicStatus: DivePublicStatus,
                        DiveVerified: false,
                        Rating: Rating,
                        AITraining : false,
                        DiveImage : dsImage,
                        WaterType: WaterType
                    }
                };
                try{
                    const Divedata = await documentClient.put(params).promise();
                    let currProgress = (data.Item.GoalProgress)+1;
                    let goal = data.Item.Goal;
                    let achievements = [];
                    let completed = false;
                    
                    if(typeof data.Item.Achievements !=="undefined"){
                        achievements = data.Item.Achievements;
                    }
                    if(currProgress==goal){
                        completed = true;
                        
                        switch(goal) {
                          case 1:
                            goal = 5; //Goes to 5
                            achievements.push("Completed First Dive!");
                            break;
                          case 5:
                            goal = 10; //Goes to 10
                            achievements.push("Completed Five Dives!");
                            break;
                          case 10:
                            goal = 25; //Goes to 25
                            achievements.push("Completed Ten Dives!");
                            break;
                          case 25:
                            goal = 50; //Goes to 50
                            achievements.push("Completed Twenty Five Dives!");
                            break;
                          case 50:
                            goal = 100; //Goes to 100
                            achievements.push("Completed Fifty Dives!");
                            break;
                          case 100:
                            if(!contains(achievements, "Completed A Hundred Dives!")){
                                achievements.push("Completed A Hundred Dives!");   
                            }
                            break; 
                          
                        }
                    }
                    else{
                        if(goal===100){ //Keep goal full
                            currProgress =100;
                        }
                    }
                    const paramsUpdate = {
                        TableName: "Scubamate",
                        Key: {
                            AccountGuid: guid
                        },
                        UpdateExpression: "set GoalProgress = :gp, Goal = :g, Achievements = :a",
                        ExpressionAttributeValues:{
                            ":gp": currProgress,
                            ":g":goal,
                            ":a":achievements,
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    
                    try{
                        const updateStatement = await documentClient.update(paramsUpdate).promise();
                        if(completed){
                            responseBody = "Dive successfully logged! Goal Reached! New Goal: "+goal+" Dives";
                        }
                        else{
                            responseBody = "Dive successfully logged!";
                        }
                        statusCode = 201;
                    }catch(err){
                        statusCode = 404;
                        responseBody = "Dive Log Failed: "+err;
                    } 
                    
                    
                }catch(err){
                    responseBody = "Unable to log dive " + err;
                    statusCode = 403;
                } 
            }
        }

    } catch (error) {
        statusCode = 403;
        responseBody = "Invalid Access Token "+error;
    }
    
    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true
        },
        body : JSON.stringify( responseBody),
        isBase64Encoded: false
    };

    return response;

};
