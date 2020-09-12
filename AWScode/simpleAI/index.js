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
    let responseBody = "";
    var rounded =-1;
    var data;
    var locKey = 0;
    
    var minTemp = 0;
    var maxTemp = 0;
    var hoursOfSun = 0.0;
    var moonAge = 0;
    //var windSpeed = 0.0;
    var probPrec = 0;
    var cloudCover = 0;
    
    
    var forecastInfo;
  
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    let params = {
        TableName: 'DiveInfo',
        Key : {
          'ItemType' : 'AI-Network'
        }
    };
    
    
    const DiveSite = event.DiveSite;
    const date = event.Date;
    
    var thenDate = new Date(date);
    var nowDate = new Date();
    
    var diff = thenDate.getTime()-nowDate.getTime();
    var difday = Math.ceil( diff / (1000 * 3600 * 24));
    
    console.log("Difference between the two days: " + difday);
    
    //***********************
      
    
    
    //let dfn = 
    
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
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
         // console.log("chuny: " + chunk);
         console.log(data);
        //locKey = data.Key;
        
        });
        responseBody = data;
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log("WInkle dinkle?");
          //console.log(data.Key);
          locKey = JSON.parse(data).Key;
          console.log("Key tings: "+locKey);
          
          //******* Bad idea
          
          console.log("Location Key mad tings " + locKey);
      url = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/";
      url += locKey;
      url += "?apikey=pnzaIiEPX1k1KIxtqWME5FJvAwA1PATz&language=en-us&details=true&metric=true";
      
      
            https.get(url, (resp) => {
              data = '';
            
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                data += chunk;
               // console.log("chuny: " + chunk);
               //console.log(data);
              //locKey = data.Key;
              
              });
              //responseBody = data;
            
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                console.log("Pinkly do?");
                //console.log(data.Key);
                //locKey = JSON.parse(data).Key;
                //console.log("Key tings: "+locKey);
                forecastInfo = JSON.parse(data).DailyForecasts[difday];
                minTemp = forecastInfo.Temperature.Minimum.Value;
                maxTemp = forecastInfo.Temperature.Maximum.Value;
                hoursOfSun = forecastInfo.HoursOfSun;
                moonAge = forecastInfo.Moon.Age;
                //windSpeed = forecastInfo.Wind.Speed.Value;
                probPrec = forecastInfo.Day.PrecipitationProbability;
                cloudCover = forecastInfo.Day.CloudCover;
                
                
                console.log("Min Temp: " + minTemp);
                console.log("Max Temo: " + maxTemp);
                console.log("Hours of Sun: " + hoursOfSun);
                console.log("Moon Age: " + moonAge);
                //console.log("Wind Speed: " + windSpeed);
                console.log("Prec prob: " + probPrec);
                console.log("cloudCover: " + cloudCover);
                //console.log(forecastInfo);
                
              });
            
            }).on("error", (err) => {
              console.log("Error: " + err.message);
            });
          
          
          
          
          
          //********** end of bad idea
          
          
          
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
      
      
      
      
      
     
     //****************************** end of locationKey request
     
     
     
     
     
     
     
     
     
     
     
     console.log("Min Temp: " + minTemp);
                console.log("Max Temo: " + maxTemp);
                console.log("Hours of Sun: " + hoursOfSun);
                console.log("Moon Age: " + moonAge);
                //console.log("Wind Speed: " + windSpeed);
                console.log("Prec prob: " + probPrec);
                console.log("cloudCover: " + cloudCover);
     
     
     
     var response = {
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
      
      
    }
    });
    
    
    
    //let data = await documentClient.get(params).promise();
    //let brody = JSON.parse(data);
    
    /*
    let surfaceTemp = event.SurfaceTemp;
    let bottomTemp = event.BottomTemp;
    let depth = event.Depth;
    let waterType = event.WaterType;
    */
    
    
    
    
    /*
    let body = JSON.parse(event.body);
    const surfaceTemp = body.SurfaceTemp;
    const bottomTemp = body.BottomTemp;
    const depth = body.Depth;
    let waterType = body.WaterType;
    
    
    var water;
    if (waterType==="Fresh")
    {
         water = 0;
    }
    else
    {
       water = 1;
    }
    
    
      documentClient.get(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data.Item);
      let brody = JSON.parse(data.Item.AI);
      
      
      const testNetwork = synaptic.Network.fromJSON(brody);
      
      
      
      let result = testNetwork.activate([surfaceTemp,bottomTemp,depth,water]);
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
      
      responseBody = {"Visibility: " : vis};
      
      
      */
      
  //});
    console.log("rounded: " + rounded);
    console.log("bruh moment: " + responseBody);
  
    //let brody = event;
    //console.log(brody);
    
 
    
    /*
    const Layer= synaptic.Layer;
    const Network = synaptic.Network;
    const Trainer = synaptic.Trainer;
  
    const inputLayer = new Layer(4);
    const hiddenLayer = new Layer(4);
    const outputLayer = new Layer(4);
  
    //inputLayer.project(hiddenLayer);
    //hiddenLayer.project(outputLayer);

    const myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
  
    var trainingSet = [
      {
        input: [0,0],
        output: [0]
      },
      {
        input: [0,1],
        output: [1]
      },
      {
        input: [1,0],
        output: [1]
      },
      {
        input: [1,1],
        output: [0]
      },
    ];

  console.log("Here");
    const trainer = new Trainer(myNetwork);
    trainer.train(trainingSet, {
        rate: .2,
        iterations: 20,
        error: .1,
        shuffle: true,
        log: 1,
        cost: Trainer.cost.CROSS_ENTROPY
    });
    */
    //console.log(myNetwork.activate(testSet[0].input));
    //console.log(testSet[0].output);

    
    
    //let responseBody = "Successful test";
    //let responseBody = myNetwork.toJSON();
    //console.log(JSON.stringify(responseBody));
    
    
    
}
