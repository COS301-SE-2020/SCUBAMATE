'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const synaptic = require('synaptic');
const Trainer = synaptic.Trainer;

//const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});


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
    
    /*
    let surfaceTemp = event.SurfaceTemp;
    let bottomTemp = event.BottomTemp;
    let depth = event.Depth;
    let waterType = event.WaterType;
    */

    
    
      documentClient.get(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      //console.log("Success", data.Item);
      let brody = JSON.parse(data.Item.AI);
      
      const testNetwork = synaptic.Network.fromJSON(brody);
      
      var trainingSet = [
        {
            input: [15,15,9,1],
            output: [2]
        },
        {
            input : [12,12,9,1],
            output : [1]
        },
        {
            input: [21,21,14,1],
            output : [0]
        }
    ];
    
    const trainer = new Trainer(testNetwork);
    trainer.train(trainingSet, {
        rate: .2,
        iterations: 20,
        error: .1,
        shuffle: true,
        log: 1,
        cost: Trainer.cost.CROSS_ENTROPY
    });
      
      //console.log(testNetwork.toJSON());
      //testNetwork.train();
      
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
    //console.log("rounded: " + rounded);
    //console.log("bruh moment: " + responseBody);

    
    
    
}
