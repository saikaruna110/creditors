const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const https = require("https");
const { getAllCreditors, getCreditorByName, createCreditor, updateCreditor } = require("../models/creditor_model");

var aws = require('aws-sdk');

/*
 * GET /creditors route to retrieve all the creditors.
 */
router.get('/creditors', async(req,res) => {
    const result = await getAllCreditors();

    await res.send(result);
});

/*
 * GET /creditorsWithTotalBalance route to retrieve all the creditors, the total balance and average minPaymentPercentage.
 */
router.get('/creditorsWithTotalBalance', async(req,res) => {
    const result = await getAllCreditors();
    var totalBalance = 0;
    var totalMinPayPercentage = 0;

    result.map((item)=>{
        totalBalance += item.balance;
        totalMinPayPercentage += item.minPaymentPercentage;
    })
    var avgMinPayPercentage = totalMinPayPercentage/result.length;

    await res.send({creditors: result, totalBalance: totalBalance, avgMinPayPercentage: avgMinPayPercentage});
});

/*
 * GET /creditorsByName route to retrieve a creditor by name
 */
router.get('/creditorsByName', async(req,res) => {
    const name = req.query.name ? req.query.name.toUpperCase() : '';
    var result = {};

    if(name.length <= 0){
        result["error"] = "Parameter creditor name is required!";
    }
    else{
        result = await getCreditorByName(name);
    }

    await res.send(result);
});

/*
 * POST /creditor route to add a new creditor entry
 */
router.post('/creditor', async(req, res) => { 
    var result = {};

    if(Object.keys(req.body).length <= 0){
        result["error"] = "At least ID is required!";
    }
    else{   
        result = await createCreditor(req.body);
    }

    await res.send(result);
});

/*
 * PUT /creditor route to add a new creditor entry
 */
router.put('/creditor', async(req, res) => {
    var result = {};

    if(Object.keys(req.query).length <= 0 && Object.keys(req.body).length <= 0){
        result["error"] = "Provide ID and fields to be updated!";
    }else{
        if(Object.keys(req.query).length <= 0){
            result["error"] = "ID is required!";
        }else{
            if(Object.keys(req.body).length <= 0){
                result["error"] = "Provide fields to be updated!";
            }else{
                const filterObj = req.query      
                result = await updateCreditor(filterObj, req.body);  
            }
        }
    }  

    await res.send(result);
});

/*
 * GET /creditAnalysis route to return data that meet following criteria:
        a. Creditor balance should be over 2000
        b. Creditor min pay percentage shouldn’t exceed 29.99%

        LAMBDA Function
 */
router.get('/creditAnalysis', async(req, res) => {
    const allCreditors = await getAllCreditors();
    aws.config.update({accessKeyId: process.env['aws-access-key'], secretAccessKey: process.env['aws-secret'], region: process.env['aws-region']});

    var lambda = new aws.Lambda();
    var params = {FunctionName: "creditAnalysisLambda", Payload: JSON.stringify({"allCreditors": allCreditors})};

    await lambda.invoke(params, (err, response) => {
        if(err)  res.send(err);
        else res.send(response);
    });
});

module.exports = router;