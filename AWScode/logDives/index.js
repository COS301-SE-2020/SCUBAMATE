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
            let dsImage = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png"
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
                var timestamp = new Date();
                var yy = timestamp.getFullYear();
                if(yy < 10)
                {
                    yy = "0" + yy;
                }
                var mm = timestamp.getMonth() + 1;
                if(mm < 10)
                {
                    mm = "0" + mm;
                }
                var dd = timestamp.getDate();
                if(dd < 10)
                {
                    dd = "0" + dd;
                }
                var hh = timestamp.getUTCHours() + 2;
                if(hh < 10)
                {
                    hh = "0" + hh;
                }
                var mins = timestamp.getMinutes();
                if(mins < 10)
                {
                    mins = "0" + mins;
                }
                var ss = timestamp.getSeconds();
                if(ss < 10)
                {
                    ss = "0" + ss;
                }
                var ms = timestamp.getMilliseconds();
                var now = yy + "/" + mm + "/" + dd + " " + hh + ":" + mins + ":" + ss + ":" + ms;
                
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
                        TimeStamp : now,
                        Visibility: Visibility+"m",
                        Weather: Weather,
                        DivePublicStatus: DivePublicStatus,
                        DiveVerified: false,
                        Rating: Rating,
                        AITraining : false,
                        DiveImage : dsImage
                    }
                };
                try{
                    const Divedata = await documentClient.put(params).promise();
                    if(typeof data.Item.Goal != "undefined"){
                        const params = {
                            TableName: "Scubamate",
                            Key: {
                                AccountGuid: guid
                            },
                            UpdateExpression: "set GoalProgress = :gp",
                            ExpressionAttributeValues:{
                                ":gp": (data.Item.GoalProgress+1)
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        
                        try{
                            const updateStatement = await documentClient.update(params).promise();
                            responseBody = "Dive successfully logged! ";
                            statusCode = 201;
                        }catch(err){
                            statusCode = 404;
                            responseBody = "Dive Logged but Updating Goal Failed: "+err;
                        } 
                    }
                    else{
                        responseBody = "Dive successfully logged! ";
                        statusCode = 201;
                    }
                    
                }catch(err){
                    responseBody = "Unable log dive " + err;
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
