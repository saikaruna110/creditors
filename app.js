const express = require('express');
const app = express();

//load env vars
const env = require('dotenv');
const config = env.config();
process.env = {...process.env, ...config.parsed}

//connect to mongodb
const creditorModel = require("./models/creditor_model");
creditorModel.connectToDB();

//run only to load the initial test data
// creditorModel.performInitialDataLoad();

app.use(express.json());

const creditors = require("./routes/creditors");
app.use('/api', creditors);

const port = process.env.PORT || 3000;

app.listen(port, console.log("Server listening on port: " + port));

module.exports = app;
