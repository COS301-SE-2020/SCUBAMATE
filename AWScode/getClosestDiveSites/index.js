'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context) => {
    let body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const Location = body.Location;

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
    
        }
        /*Only proceed if access token is valid*/
        else if (statusCode == undef){
            /*Retrieve all the Dive Sites */
            var siteParams = {
                TableName: "DiveInfo",
                ProjectionExpression: "#Name,Coords",
                FilterExpression: "begins_with(#ItemType, :sitePrefix)",
                ExpressionAttributeNames:{
                    "#ItemType" : "ItemType",
                    "#Name" : "Name"
                },
                ExpressionAttributeValues:{
                    ":sitePrefix" : "DS"
                }
            };

            try{
                const sites = await documentClient.scan(siteParams).promise();
                if(sites.Items.length==0){
                    responseBody = "No dive sites found";
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
                        delete site.Coords;
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
                    sites.Items.splice(3,sites.Items.length);

                    for(var i=0; i<3; i++)
                    {

                    }


                    responseBody = sites;
                    statusCode = 200;

                    // var distance = require('google-distance');
                    // await distance.get(
                    // {
                    //     origin: [Location],
                    //     destination: [sites.Items[0].Coords]
                    // }, function(err, data) {
                    //     if (err) return responseBody= err;
                    //      responseBody= data;
                    //     // if (err) {
                        //     responseBody = "google distance error: " + err;
                        //     statusCode = 403;
                        // }else{
                        //     responseBody = "got data";
                        //     if(data.length > 0){
                        //         sites.Items.Distance= data;
                        //     }else{
                        //         sites.Items.Distance = "undefined";
                        //     }
                        //     //responseBody = sites;
                        //     statusCode = 200;
                        // }
                    //});
                    // if(statusCode == undef)
                    // {
                    //     responseBody = sites;
                    //     statusCode = 200;
                    // }
                    
                        
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
    if(statusCode == undef)
                    {
                        responseBody = "hi";
                        statusCode = 200;
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
    "Locaton": "-25.921800, 28.161300"
}
*/
