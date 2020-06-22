'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
//const s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const AccountType = body.AccountType;
    const FirstName = body.FirstName;
    const LastName = body.LastName;
    const Email = body.Email;
    const DateOfBirth = body.DateOfBirth;
    const ProfilePhoto = body.ProfilePhoto;
    const PublicStatus = body.PublicStatus;
    
    //Verify AccessToken 
    try {
        const params = {
            TableName: "Scubamate",
            ProjectionExpression: "Expires,AccountGuid",
            FilterExpression: "#acc = :AccessToken",
            ExpressionAttributeNames:{
                "#acc" : "AccessToken"
            },
            ExpressionAttributeValues:{
                ":AccessToken" : AccessToken
            }
        };
        
        const data = await documentClient.scan(params).promise();
        if(data.Items[0].AccountGuid)
        {
            console.log("Account thing: " + data.Items[0].AccountGuid);
            var AccountGuid = data.Items[0].AccountGuid;
        }
        if( data.Items[0].Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Items[0].Expires);
            const today = new Date();
            console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if(compareDates(today,expiryDate))
            {
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
            
        }
        
        console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token";
    }
    
    
    
    // Only update account if access token is verified
    if(statusCode==0){
    
        //update profile image 
        var profileLink = ProfilePhoto; //to be added later
        var ItemType = "A"+ AccountGuid;
        
            //
            //Email checking - adjust for updating 
            
            // const emailParams = {
            //     TableName: "Scubamate",
            //     ProjectionExpression: "Email",
            //     FilterExpression: "#em = :email",
            //     ExpressionAttributeNames:{
            //         "#em" : "Email"
            //     },
            //     ExpressionAttributeValues:{
            //         ":email" : Email
            //     }
            // };
            
            // var flag = false;
            
            // try{
            //     const ryker = await documentClient.scan(emailParams).promise();
            //     var maily = ryker.Items[0].Email;
            //     if (maily)
            //     {
            //         statusCode = 403;
            //         responseBody = "Email already taken.";
            //         flag = true;
            //     }
                
            // }catch(err){
                
            // }
        
        
        const params = {
            TableName: "Scubamate",
            Item: {
                ItemType : ItemType,
                AccountGuid : AccountGuid,
                AccountType: AccountType, 
                FirstName: FirstName,
                LastName: LastName, 
                Email: Email, 
                DateOfBirth: DateOfBirth,
               // Password: hash, //James time
                ProfilePhoto: profileLink,
                PublicStatus: PublicStatus
            }
        }
        try{
            const data = await documentClient.put(params).promise();
            responseBody = "Successfully updated account!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable to update account.";
            statusCode = 403;
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
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }
    return response;
    
}
function compareDates(t,e)
    {
        console.log(t.getFullYear());
        if(t.getFullYear()<e.getFullYear())
        {   
            return false;
        }else if(t.getFullYear()>e.getFullYear())
        {
            return true;
        }

        if(t.getMonth()<e.getMonth())
        {
            return false;
        }else if(t.getMonth()>e.getMonth())
        {
            return true;
        }

        if(t.getDate()<e.getDate())
        {
            return false;
        }else if(t.getDate()>e.getDate())
        {
            return true;
        }

        if(t.getHours()<e.getHours())
        {
            return false;
        }else if(t.getHours()>e.getHours())
        {
            return true;
        }

        if(t.getMinutes()<e.getMinutes())
        {
            return false;
        }else if(t.getMinutes()>e.getMinutes())
        {
            return true;
        }

        if(t.getSeconds()<e.getSeconds())
        {
            return false;
        }else if(t.getSeconds()>e.getSeconds())
        {
            return true;
        }

        if(t.getMilliseconds()<e.getMilliseconds())
        {
            return false;
        }else if(t.getMilliseconds()>e.getMilliseconds())
        {
            return true;
        }

        return true;
    }


