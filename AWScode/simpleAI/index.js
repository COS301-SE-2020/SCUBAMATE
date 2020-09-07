'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const synaptic = require('synaptic');

exports.handler = function(event,context,callback) {
    
    let statusCode = 200;
    //let responseBody = result[0];
    let responseBody = "";
    var rounded =-1;
  
  
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
    let params = {
        TableName: 'DiveInfo',
        Key : {
          'ItemType' : 'AI-Network'
        }
    };
    
    //let data = await documentClient.get(params).promise();
    //let brody = JSON.parse(data);
    
    let surfaceTemp = event.SurfaceTemp;
    let bottomTemp = event.BottomTemp;
    let depth = event.Depth;
    let waterType = event.WaterType;
    
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
