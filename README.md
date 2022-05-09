# creditors

Requirements:
Please design and implement a web API using node.js to have following features:
1. Get all creditor data with total balance and average min pay percentage
2. Get creditor data by creditor name
3. Add a new creditor entry
4. Update an existing creditor entry (partial or full update)
5. Implement credit analysis endpoint to return data that meet following criteria:
a. Creditor balance should be over 2000
b. Creditor min pay percentage shouldn’t exceed 29.99%
Bonus Credit: Make it as a lambda function in AWS
Initial test data can be found here:
https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json


============================================================================================================================

This is a simple node.js application that retrieves creditors data, stores the data in a mongoDB database and provides a simple API to perform CRUD operations.

NOTE: To run this application, you would need a .env file that stores access key and secret to AWS SDK and username/password to MongoDB instance.

1. To make the development easy, I have used nodemon and configured a script as below:

"scripts": {
  "server": "nodemon app.js"
}

So, to start the server, navigate to the /creditors directory and run the following command in the command line:
npm run server

2. I have provided an initial setup to perform initial load to load test data into the MongoDB database. This is just a one time deal. The following code in the app.js 
will perform the initial load. For the subsequent runs, you would not need to keep running this. (In retrospect, I should have created this as an endpoint so that it 
does not have to be commented/uncommented in the code.)

//run only to load the initial test data
// creditorModel.performInitialDataLoad();

3. I used Mongoose to model my application data and here's a quick look snapshot of my schema definition for the provided test data:
mongoose.Schema({
    id: {type:Number, required: [true, "ID is required"]},
    creditorName: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    minPaymentPercentage: {type:Number},
    balance: {type:Number}
});

4. My application has just one data model (creditor_model.js) and one router(creditors.js). Ideally I would keep the data model separate from the CRUD operations 
by creating a database service file to handle all database operations. This will create that separation of concerns, but since our application is a very simple app
with just one Model and one Mongo Collection, I let creditor_model.js handle database operations as well.

5. I setup .env file, which should have the following keys to run this application:
aws-access-key = ###
aws-secret = ###
aws-region = ###

test-data = https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json

mongo-username = ###
mongo-password = ###

PORT = 4200

6. This is a simple REST API with the following endpoints (I will add RAML at somepoint describing the endpoints, but this should help in the meantime):
GET /api/creditors: returns all creditors
GET /api/creditorsWithTotalBalance: returns all creditors with total balance and average min pay percentage 
GET /api/creditorsByName?name=AMEX: takes in a query parameter called 'name' and returns creditors that match the name
POST /api/creditor: takes a payload with content-type="application/json" and creates a new Creditor document in the creditors collection
PUT /api/creditor?id=10: takes a payload with content-type="application/json" and an id query param to update an existing Creditor document. If the document matching the
id is not found, it creates one.
GET /api/creditAnalysis: returns creditors with balance > 2000 and min pay percentage <= 29.99% (This has been created as a FAAS using AWS Lambdas)
