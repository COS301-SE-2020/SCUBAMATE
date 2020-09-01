'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

const synaptic = require('synaptic');

exports.handler = function(event,context,callback) {
  
    
    const Layer= synaptic.Layer;
    const Network = synaptic.Network;
    const Trainer = synaptic.Trainer;
  
    const inputLayer = new Layer(784);
    const hiddenLayer = new Layer(100);
    const outputLayer = new Layer(10);
  
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

    var testSet = [
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
    ]
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

    console.log(myNetwork.activate(testSet[0].input));
    console.log(testSet[0].output);
    
    let statusCode = 200;
    let responseBody = "Successful test";
    
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
