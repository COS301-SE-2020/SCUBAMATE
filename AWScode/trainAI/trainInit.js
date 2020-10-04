'use strict'

const synaptic = require('synaptic');
    
    //factors influencing:
    //Min Temperature
    //Max Temperature
    //Hours of Sun
    //Moon Age
    //Probability of Precipitation
    //Cloud coverage

    //factors producing:

    //0     poor
    //1     average
    //2     good
    //3     excellent


    const Layer= synaptic.Layer;
    const Network = synaptic.Network;
    const Trainer = synaptic.Trainer;

    const inputLayer = new Layer(6);
    const hiddenLayer1 = new Layer(10);
    const hiddenLayer2 = new Layer(10);
    const outputLayer = new Layer(1);

    inputLayer.project(hiddenLayer1);
    hiddenLayer1.project(hiddenLayer2);
    hiddenLayer2.project(outputLayer);

    const myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer1,hiddenLayer2],
        output: outputLayer
    });

    var trainingSet = [
        {
            input: [14,32,11.5,24,0,48], //Knysna heads
            output: [0]
        },
        {
            input : [10.1,18.8,8.8,24,2,29], //A Frame
            output : [1]
        },
        {
            input : [20,25,8,24,0,0], //Sodwana
            output : [2]
        },
        {
            input : [9,25,10,24,0,0], //Bass Lake
            output : [1]
        },
        {
            input : [11,23,9,25,0,0], //Hatfield
            output : [2]
        },
        {
            input : [16,32,9,25,47,84], //Uzivumbu
            output : [2]
        },
        {
            input : [11,17,6,25,9,4], //PE
            output : [1]
        },
        {
            input : [9,20,1,25,53,3], //Storms rivier
            output : [0]
        },
        {
            input : [12,20,4,25,8,11], //Plett
            output : [1]
        },
        {
            input : [12,20,3,25,8,11], //Groot bank
            output : [0]
        },
        {
            input : [14,20,3,25,10,12], //Jefferies Bay
            output : [0]
        },
        {
            input : [18,33,11,25,0,6], //Umzimai wall
            output : [3]
        },
        {
            input : [7,17,4,25,40,53], //Protea Rock
            output : [0]
        },
        {
            input : [9,26,11,25,0,0], //Marico Oog
            output : [2]
        },
        {
            input : [9,24,9,25,0,0], //Miracle Waters
            output : [2]
        },
        {
            input : [11,21,5,25,1,26], //Mossel Bay
            output : [1]
        },
        {
            input : [12,14,3,25,64,55], //Hermanus
            output : [0]
        },
        {
            input : [10,16,3,25,62,60], //Coral Gardens (False Bay)
            output : [2]
        },
        {
            input : [9,13,2,25,84,73], //Gordons Bay
            output : [0]
        },
        {
            input : [11,14,3,25,55,54], //Seal Island
            output : [2]
        },
        {
            input : [11,14,3,25,55,54], //Granger Bay Water Club (cpt)
            output : [0]
        },
        {
            input: [16,23,11.5,24,66,4], //Durban
            output : [2]
        }
    ];


    const trainer = new Trainer(myNetwork);
    trainer.train(trainingSet, {
        rate: .2,
        iterations: 20,
        error: .1,
        shuffle: true,
        log: 1,
        cost: Trainer.cost.CROSS_ENTROPY
    });
    

    var testies = myNetwork.toJSON();
                                                                                                                   
    console.log(JSON.stringify(myNetwork.toJSON()));
