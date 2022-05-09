//var creditors = require('../models/creditor_model');
var assert = require("assert");

let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");
let creditors = require('../routes/creditors');
let should = chai.should();

chai.use(chaiHttp);

var expect = require('chai').expect;

describe('Creditors Test', function() {  
  describe('test for getAllCreditors', () => {
    it('it should GET all the creditors', (done) => {
      chai.request(creditors)
          .get('/creditors')
          .end((err, res) => {
                res.should.have.status(200);
                // res.body.should.be.a('array');
                // res.body.length.should.be.eql(0);
            done();
          });
    });
  }); 
})