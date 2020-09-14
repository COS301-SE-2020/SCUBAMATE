'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const synaptic = require('synaptic');

exports.handler = function(event,context,callback) {
    
    /*
        New prediction vectors:
        Minimum temperature
        Maximum temperature
        Hours of sun
        Moon age
        Wind speed
        Probability of precipitation
        Cloud cover
    
    */
    
    
    
    let statusCode = 200;
    //let responseBody = result[0];
    var responseBody;
    var rounded =-1;
    var data;
    var locKey = 0;
    
    var minTemp = 0;
    var maxTemp = 0;
    var hoursOfSun = 0.0;
    var moonAge = 0;
    var windSpeed = 0.0;
    var probPrec = 0;
    var cloudCover = 0;
    var response;
    
    
    var forecastInfo;
  
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    let params = {
        TableName: 'DiveInfo',
        Key : {
          'ItemType' : 'AI-Network'
        }
    };
    
    
    //const DiveSite = event.DiveSite;
    //const date = event.Date;
    const anatomy = JSON.parse(event.body);
    const date = anatomy.Date;
    const DiveSite = anatomy.DiveSite;
    
    
    var thenDate = new Date(date);
    var nowDate = new Date();
    
    var diff = thenDate.getTime()-nowDate.getTime();
    var difday = Math.ceil( diff / (1000 * 3600 * 24));
    console.log("difday" + difday);
    
    if (difday >4 || difday<0)
    {
      responseBody = "Cannot predict more than 4 days in the future, or in the past";
      response = {
                  statusCode: 403,
                  headers: {
                      "Access-Control-Allow-Origin" : "*",
                      "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
                      "Access-Control-Allow-Credentials" : true,
                      "Content-Type" : "application/json"
                  },
                  body: JSON.stringify(responseBody),
              };
              
              callback(null, response);
    }
    
    
    let locParams = {
        TableName: "DiveInfo",
        FilterExpression: "#n = :n",
        ExpressionAttributeNames:{
          '#n' : 'Name',
          
        },
        ExpressionAttributeValues:{
            ':n' : DiveSite
        }
    };
    
    
    documentClient.scan(locParams, function(err, data1) {
    if (err) {
      console.log("Error", err);
    } else {
     
     
     let ting = data1.Items[0].Coords;
     console.log("TingTing: " +  ting);
     var coar =  ting.split(",");
     var lat = coar[0];
     var long = coar[1];
     
     console.log("Lattitude: " + lat);
     console.log("Longitude: " + long);

     
     
     //**************************************************************Start of locationKey request
      const https = require('https');
      var url;
      url = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=pnzaIiEPX1k1KIxtqWME5FJvAwA1PATz&q=';
      url += lat;
      url+="%2C";
      url+=long;
      url += "&language=en-us&details=false&toplevel=true";
      https.get(url, (resp) => {
        data = '';
        console.log("Here")

        resp.on('data', (chunk) => {
          data += chunk;

         console.log(data);
        
        });
      
        resp.on('end', () => {
          console.log("WInkle dinkle?");

          locKey = JSON.parse(data).Key;
          console.log("Key tings: "+locKey);

          
          console.log("Location Key mad tings " + locKey);
      url = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";
      url += locKey;
      url += "?apikey=pnzaIiEPX1k1KIxtqWME5FJvAwA1PATz&language=en-us&details=true&metric=true";
      
            https.get(url, (resp) => {
              data = '';
            

              resp.on('data', (chunk) => {
                data += chunk;

              
              });

              resp.on('end', () => {

                forecastInfo = JSON.parse(data).DailyForecasts[difday];
                minTemp = forecastInfo.Temperature.Minimum.Value;
                maxTemp = forecastInfo.Temperature.Maximum.Value;
                hoursOfSun = forecastInfo.HoursOfSun;
                moonAge = forecastInfo.Moon.Age;
                probPrec = forecastInfo.Day.PrecipitationProbability;
                cloudCover = forecastInfo.Day.CloudCover;
                
                
                console.log("Min Temp: " + minTemp);
                console.log("Max Temo: " + maxTemp);
                console.log("Hours of Sun: " + hoursOfSun);
                console.log("Moon Age: " + moonAge);
                console.log("Prec prob: " + probPrec);
                console.log("cloudCover: " + cloudCover);
                
                                                                                  documentClient.get(params, function(err, data5) {
                                                                      if (err) {
                                                                        console.log("Error", err);
                                                                      } else {
                                                                        //console.log("Success", data.Item);
                                                                        let brody = JSON.parse(data5.Item.AI);
                                                                        
                                                                        
                                                                        const testNetwork = synaptic.Network.fromJSON(brody);
                                                                        
                                                                        
                                                                        
                                                                        let result = testNetwork.activate([minTemp,maxTemp,hoursOfSun,moonAge,probPrec,cloudCover]);
                                                                        console.log("Result: " + result[0]);
                                                                        
                                                                        rounded = Math.round(result[0]);
                                                                        
                                                                        var vis;
                                                                        switch (rounded)
                                                                        {
                                                                            case 0:
                                                                              vis = "Poor";
                                                                              break;
                                                                            case 1:
                                                                              vis = "Average";
                                                                              break;
                                                                            case 2:
                                                                              vis = "Good";
                                                                              break;
                                                                            case 3:
                                                                              vis = "Excellent";
                                                                              break;
                                                                            default:
                                                                              vis = "Average";
                                                                        }
                                                                        console.log("Visibility: "+  vis);
                                                                        responseBody = {"Visibility" : vis};
                                                                        
                                                                        
                                                                        
                                                                      }
                                                                      
                                                                      
                                                                      response = {
                                                                      statusCode: statusCode,
                                                                      headers: {
                                                                          "Access-Control-Allow-Origin" : "*",
                                                                          "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
                                                                          "Access-Control-Allow-Credentials" : true,
                                                                          "Content-Type" : "application/json"
                                                                      },
                                                                      body: JSON.stringify(responseBody),
                                                                  };
                                                                  
                                                                  callback(null, response);
                                                                      
                                                                    });
                                                                    
                                                                    
                                                                  
                                                                    
                                                                    
                
                
                
                
              });
            
            }).on("error", (err) => {
              console.log("Error: " + err.message);
            });
          

          
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
      
     
     console.log("Min Temp: " + minTemp);
                console.log("Max Temo: " + maxTemp);
                console.log("Hours of Sun: " + hoursOfSun);
                console.log("Moon Age: " + moonAge);
                //console.log("Wind Speed: " + windSpeed);
                console.log("Prec prob: " + probPrec);
                console.log("cloudCover: " + cloudCover);
    
      
      
    }
    });
    
    
      
    console.log("rounded: " + rounded);
    console.log("bruh moment: " + responseBody);
    
    
    
}
