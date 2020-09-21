'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    /* Parameters that can be updated */
    const LogoPhoto = body.LogoPhoto;
    const Coords = body.Coords;
    const Description = body.Description;
    /*Parameter that can't */
    const Name = body.Name;

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
    const coordTest = /[-+]?[0-9]+\.?[0-9]+,[-+]?[0-9]+\.?[0-9]/;
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
        else if(Name.localeCompare(data.Item.DiveCentre) != 0)
        {
            statusCode = 403;
            responseBody = "Account cannot modify this Dive Centre. " + data.Item.DiveCentre + " " + Name;
        }
        else if(!coordTest.test(Coords)){
            statusCode = 403;
            responseBody = "Incorrect co-ordinate layout";
        }
        else{
            /* Edit dive centre basic info*/
            let logoLink;
            if(typeof LogoPhoto == "undefined"){
                /* Default image if none given */
                logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
            }
            else{
                /* data:image/png;base64, is send at the front of ProfilePhoto thus find the first , */
                const startContentType = LogoPhoto.indexOf(":")+1;
                const endContentType = LogoPhoto.indexOf(";");
                const contentType = LogoPhoto.substring(startContentType, endContentType);
                    
                const startExt = contentType.indexOf("/")+1;
                const extension = contentType.substring(startExt, contentType.length);
    
                const startIndex = LogoPhoto.indexOf(",")+1;
                
                const encodedImage = LogoPhoto.substring(startIndex, LogoPhoto.length);
                const decodedImage = Buffer.from(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
                  
                const filePath = "logophoto" + Name.toLowerCase().trim() + "."+extension;
                    
                logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;
                
                const paramsImage = {
                    "Body": decodedImage,
                    "Bucket": "imagedatabase-scubamate",
                    "Key": filePath,
                    "ContentEncoding": 'base64',
                    "ContentType" : contentType
                };
                    
                const s3 = new AWS.S3({apiVersion: '2006-03-01'});
                s3.putObject(paramsImage, function(err, data){
                    if(err) {
                        /* Default image if image upload fails */
                        logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                    }
                });
            }
            const ItemType = "DC-"+Name.toLowerCase();
            const dParams = {
                TableName: "DiveInfo",
                Key: {
                    'ItemType' : ItemType,
                },
                UpdateExpression: 'set LogoPhoto = :l, Coords = :c, Description = :d',
                ExpressionAttributeValues: {
                    ':c' : Coords,
                    ':l' :logoLink,
                    ':d': Description
                }
            };  
            
            try{
                const d = await documentClient.update(dParams).promise();
                responseBody =  "Successfully updated Dive Centre!";
                statusCode = 200;
            }catch(err){
                responseBody = "Update failed. " + err;
                statusCode = 403;
            }
        }
    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token. " + err + " This one? " + AccessToken;
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


/*
{
    "AccessToken" : "506b939b-6591-e60c-b340-948f1a0513191096d933219462874820d2720bf7d5f6851e6aedfaed1e73678c90d702345524da",
    "Name" : "Reefteach",
    "Coords": "-27.506939,32.654464",
    "Description": "Reefteach has knowledge of the reefs at Sodwana Bay and are the operator of choice for divers wishing to know more about the underwater environment. Reefteach staff have completed thousands of dives at Sodwana Bay and because they personally dive daily, they are in a position to show you the best Sodwana has to offer. All their dives are led by divemasters who have an extensive knowledge of the reefs, marine life and the ecology. Dive briefings are done using books in our marine reference library on the beach. In this way the divers know what marine life they can expect to see and to look out for. After the dive the reference books are used again to facilitate identification. Reefteach has a number of special routes that are not well known by other operators. In this way they dive pristine areas that are away from the crowds. Furthermore even on the well known dive sites the Reefteach staff knows where the rare fish and critters can be found. :)",
    "LogoPhoto" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAENUlEQVRoge3ZeahVVRTH8Y9TmjappVnaQEiDFWGURZNIEfVHZSEVRkRWGCVF2ESDSPNAg9UfUfmHDZChQUWSRoGVUVpRpGT1pDmprLBy6KmvP9Y+7Pvue0/ffV7v0XhfuHDP2ufu89tn773W2uvSTTfd/B84CtOxAL9gHdbj1TJF1cIIIbalg88X5UnrPIfiRyH4bzyB83CamJEWnFOauk7SH8uE2NexT0Xb08m+oARdNXOHEPsxdqqwH42NaMaoEnTVxP5YIwZyQoW9B95L9hkl6KqZF7XezBPEIC5KtlUYXJq6TnIiNuEfNMkDWixv/CtLU9dJeuJDIfZ29MHFWCEP6HP0LktgZ7lEiP1WeK2Cw8QstWBsw1XVyC74SYg9v6ptbrLPbrSornC3ELtIbOyCccm+Bgc0XlZtHIi1Ij4cU2HvhU/FQKaXoKtmXhJin6myX5Xs32NAo0V1RD+cidu0jgEnC7GrMazCPgi/pbYLG6SxQ4ZgEl4WSV/hQu9L7T3xUbLdVPXbGcn+jtZ7pmEcgZvxvljzhfiNWJq+L0/3Xpqum9C3oo9RIpfaiNENUZ0Yg0e0DlyFp3kFl2FvEchWpbZj8XP6fm5Vf/OT/al6ijxSeIzHMBVDK9p6YGaV+HUizT5L66BW8Jy8gVvwVlX72cn+p1iaW01PPCxH1Mq3PDHdc7mcxN2VBtEsNmp7DBIvpOhrg3hRBX3xVWq7rh6DINZ5Ifxxkag9Lwa2QXibeVpH4jfS9cSKfg7B9ViYflf5Uu6seuaNcsbbpx6D2FlMbQvOqGq7RT6dFWfpC1Lb1en6bTyIL6uE/4s3cY0IgpUMEy64vWd2mTGpw2XttPUXs7IeU9J9KzFNzokqP7/jBTHYPTbzzDnp/tfqMoLE8anTpe209Rf7oFms6c+0Fd+Eh0Se1JmU+wp5g1fP1FYxQA5gY6vaillYhMlidjaJ5XQtRtb4rPFyRWSbRPAiG/1LHHImCI/TnOxz5YA3pQv99xAOpOjvga2X3D698ay2y2aDSCsKD3RDF/oeJWaw6HNaHfRukXHC/c7G/bhVeJ9aBQwRJ8CFcmxaKXu8hnK6vJ7v3cK9vXGSCJRLtM67VouXM3CbKd0MY+Va06Md3LOf8EBz5DhUfNaKgDlJHGtL4Tg5WM2U0+p+OFXMzhJt05kmPCkcxa6NldyW0fhDCJslcjA4GN9pLXy1OHtMtp2drw/Hr3IFo1eyH4Qf5KB5D05Rp/yo3oyUyzPz5IPPCPncMV8sr+2W/fCNtmKH42v5CLrdFATaY7hcc31XFjtU/r9ikRI9T2cYLM7TLaJ8X4gdIg/iA+xWiroaKP4JWozdk21POcP9RElBrFaKYsCIdD1Q/GNUVMH3KklXzRTn5fHYVy7xLxdVkB2GqdpmuyuEA9ih6CXS8hWiMjJLnUoy3XTTTfn8B2YzXIOXs2bCAAAAAElFTkSuQmCC"
}
 */

