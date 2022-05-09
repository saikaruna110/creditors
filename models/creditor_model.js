const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const fetch = require("node-fetch");
const https = require("https");
const uri = "mongodb+srv://" + process.env['mongo-username'] + ":" + process.env['mongo-password'] +"@cluster0.mmzsk.mongodb.net/credit-line?retryWrites=true&w=majority";
    
const creditorSchema = new mongoose.Schema({
    id: {type:Number, required: [true, "ID is required"]},
    creditorName: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    minPaymentPercentage: {type:Number},
    balance: {type:Number}
});

const Creditor = mongoose.model('creditors', creditorSchema);

async function connectToDB(){
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    var db = mongoose.connection;
    db.on('connected',() => {console.log("Connection with database is successful!")});
    db.on('error', console.error.bind(console, "Database connection error"));
}

async function performInitialDataLoad(){
    const resp = await fetch(process.env['test-data']);
    const creditorData = await resp.json();
    
    await Creditor.insertMany(creditorData)
    .then(val => console.log("Initial data load successful!"))
    .catch(err => console.log(err));
}

async function getAllCreditors(){
    return await Creditor.find();
}

//we would like to make this search case-insensitive
async function getCreditorByName(name){
    return await Creditor.find({creditorName: name});
}

//creates a creditor entry
async function createCreditor(creditor){
    return await Creditor.create(creditor)    
    .then(val => "Creditor created successfully!")
    .catch(err => err);
}

//update an existing creditor
async function updateCreditor(filterObj, newData){
    await Creditor.findOneAndUpdate(filterObj, newData, {upsert: true})    
    .then(val => "Updated successfully!")
    .catch(err => err);
}


module.exports = { connectToDB, performInitialDataLoad, getAllCreditors, getCreditorByName, createCreditor, updateCreditor }