'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const ItemType = body.ItemType+"-";
    const Location = body.Location;

    const validItemTypes = ["DS-","DC-"];
    function contains(arr,search){
        let returnBool = false;
        arr.forEach(function(item) {
            if(item==search){
                returnBool=true;
            }
        });
        return returnBool;
    }

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
    function distanceCalc(lat1, lon1, lat2, lon2){
        const R = 6371e3; // earths radius
        const theta1 = lat1 * Math.PI/180; //for latitude
        const theta2 = lat2 * Math.PI/180; //for latitude
        const thetaDiff = (lat2-lat1) * Math.PI/180; //for latitude
        const longDiff = (lon2-lon1) * Math.PI/180; //for longitude
        
        const a = Math.sin(thetaDiff/2) * Math.sin(thetaDiff/2) + Math.cos(theta1) * Math.cos(theta2) * Math.sin(longDiff/2) * Math.sin(longDiff/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; 
        return d;
    }
    /* Verify AccessToken  */
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": AccountGuid
        },
        ProjectionExpression : "AccessToken, Expires"
    };
    let responseBody;
    const undef = 0;
    let statusCode = undef;
    
    try {     
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if(compareDates( new Date(),new Date(data.Item.Expires))){
            responseBody = "Access Token Expired!";
            statusCode = 403;
    
        }else if(!contains(validItemTypes, ItemType)){
            responseBody = "Invalid item type : Can only be DS or DC";
            statusCode = 403;
        }
        /*Only proceed if access token is valid*/
        else if (statusCode == undef){
            /*Retrieve all the Dive Sites */
            let projection = "#Name, Description, Coords, LogoPhoto"
            if(ItemType == "DC-"){
                projection =  "#Name, Description, Coords, LogoPhoto, Courses, Instructors, DiveSites"
            }
            var siteParams = {
                TableName: "DiveInfo",
                ProjectionExpression: projection,
                FilterExpression: "begins_with(#ItemType, :sitePrefix)",
                ExpressionAttributeNames:{
                    "#ItemType" : "ItemType",
                    "#Name" : "Name"
                },
                ExpressionAttributeValues:{
                    ":sitePrefix" : ItemType
                }
            };

            try{
                const sites = await documentClient.scan(siteParams).promise();
                if(sites.Items.length==0){
                    responseBody = "No dive sites/centres found";
                    statusCode = 404;
                }
                else{
                    /*Calculate the distance between the user location and the dive site */
                    let comma = Location.indexOf(',');
                    const lat1 = Location.substring(0,comma);
                    const lon1 = Location.substring(comma+1,Location.length);
                    sites.Items.forEach(function(site) {
                        let pos = site.Coords.indexOf(",");
                        let lat2= site.Coords.substring(0,pos);
                        let lon2= site.Coords.substring(pos+1,site.Coords.length);
                        site.Distance = distanceCalc(lat1,lon1,lat2,lon2);
                    });
                    
                    /*Sorts the data according to the distances */
                    for(var i=0; i<sites.Items.length; i++)
                    {
                        let closest = sites.Items[i].Distance;
                        let index = i;
                        for(var j=i; j<sites.Items.length; j++)
                        {
                            if(closest > sites.Items[j].Distance){
                                closest = sites.Items[j].Distance;
                                index = j;
                            }
                        }
                        let temp = sites.Items[index];
                        sites.Items[index] = sites.Items[i];
                        sites.Items[i] = temp;
                        
                    }
                    /*Refine array to return the top 3 elements in the array */
                    sites.Items.splice(3,sites.Items.length);

                    for(var i=0; i<3; i++)
                    {
                        /*Calculate the average rating of the dive sites */
                        if(ItemType.localeCompare("DS-") == 0){
                            delete sites.Items[i].Distance;
                            let DiveSite = sites.Items[i].Name;
                            const diveParams = {
                                TableName: "Dives",
                                ProjectionExpression: "Rating",
                                FilterExpression: "#site = :site AND #app = :app", 
                                ExpressionAttributeNames:{
                                    "#site" : "DiveSite",
                                    "#app" : "Approved"
                                },
                                ExpressionAttributeValues:{
                                    ':site': DiveSite,
                                    ":app" : true
                                }
                            };
                            const dives = await documentClient.scan(diveParams).promise();
                            if(dives.Items.length>0){
                                let total = dives.Items.length;
                                let ratings = 0;
                                dives.Items.forEach(function(dive) {
                                    if(dive.Rating != undefined)
                                    {
                                        ratings += dive.Rating;
                                    }
                                });
                                let average = ratings/total;
                                average = average.toFixed(2);
                                sites.Items[i].Rating = average;
                            }
                            else{
                                sites.Items[i].Rating = "N/A";
                            } 
                        }            
                        /*Add image to each dive site or centre*/
                        //Get Image of dive and add it 
                        let imageToGet = "https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                        if(typeof sites.Items[i].LogoPhoto !=="undefined"){
                            imageToGet = sites.Items[i].LogoPhoto;
                        }
                        const startIndex = (imageToGet).lastIndexOf("/")+1;
                        let filePath = (imageToGet).substring(startIndex, (imageToGet).length);
            
                        let paramsImg = {"Bucket": "imagedatabase-scubamate", "Key": filePath };
                        let returnImg;
            
                        const s3 = new AWS.S3({httpOptions: { timeout: 2000 }});
                        try{
                            const binaryFile = await s3.getObject(paramsImg).promise();
                            const startIndexContentType = (imageToGet).lastIndexOf(".")+1;
                            const contentType = imageToGet.substring(startIndexContentType, imageToGet.length);
                            let base64Image = "data:image/"+contentType+";base64," +binaryFile.Body.toString('base64'); 
                            returnImg = base64Image;
                        }
                        catch(err){
                            returnImg = "N/A";
                        }
                        sites.Items[i].LogoPhoto = returnImg;
                    }
                    responseBody = sites;
                    statusCode = 200;              

                }
            }
            catch(err){
                responseBody = "Unexpected scan error " + err;
                statusCode = 403;
            }
        }

    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token " + err;
    }

    /*Final response to be sent back*/
    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    };

    return response;

};

/*
{
    "AccessToken":"f8251ce7-1e21-2f9b-967c-f5040bc9220900a7634d811893c31123e03d4e4fc6fdfd8050df6af1f2a8834c73d3134b26e8e1",
    "ItemType":"DC",
    "Location": "-25.921800, 28.161300"
}
*/
