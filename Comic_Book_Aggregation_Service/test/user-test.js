const mongoose = require('mongoose');
require('../models/users.model');
const user = mongoose.model('users');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('----------USERS----------', () => {
    beforeEach((done) => { //Before each test we empty the database
        user.remove({ username: "scott" }, (err) => {
            done();
        });
    });
    afterEach((done) => { //After each test we remove already created dummy data
        user.remove({ username: "scott" }, (err) => {
            done();
        });
    });

    /*
     * Test the /GET route for given username
     */
    describe("GET /", () => {
        it("it should GET the user when given the username", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/users/usernames/tay')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('Object');
                    done();
                });
        });
    });

    /*
    * Test the /GET route for given phone number
    */
    describe("GET /", () => {
        it("it should GET user when given the phone number", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/users/phone_numbers/0772729728')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('Object');
                    done();
                });
        });
    });

    /*
    * Test the /GET route
    */
    describe("GET /", () => {
        it("it should GET all the users", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/users/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST users', () => {
        it('it should not POST an user without username, phone_num, email, password', (done) => {
            let user = {
                name: "Scott",
                username: "scott",
                phone_num: "0774757457",
                email: "scott@gmail.com",
                password: "scott123",
                role: "General User",
                birth_date: "26-08-1995",
            };
            chai.request(server)
                .post('/aggregation-service/api/users/addUser')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('username');
                    res.body.should.have.property('phone_num');
                    res.body.should.have.property('role');
                    res.body.should.have.property('birth_date');
                    res.body.should.have.property('email');
                    res.body.should.have.property('password');
                    done();
                });
        });
    });

    /*
    * Test the /POST route negative
    */
    describe('/POST users -negative', () => {
        it('it should not POST an user without username, phone_num, email, password', (done) => {
            let user = {
                name: "styles",
                phone_num: "0774828457",
                email: "styles@gmail.com",
                password: "styles123",
                role: "General User",
                birth_date: "28-08-1995",
            };
            chai.request(server)
                .post('/aggregation-service/api/users/addUser')
                .send(user)
                .end((err, res) => {
                    res.body.message.should.be.eql("users validation failed: username: Path `username` is required.");
                    done();
                });
        });
    });

    /*
    * Test the /PUT route
    */
    describe('/PUT user', () => {
        it('it should UPDATE a user given the username', (done) => {
            let newUser = new user(
                {
                    username: "scott",
                    name: "Scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .put('/aggregation-service/api/users/updateUser')
                    .send({
                        username: "scott",
                        name: "Scotty",
                        phone_num: "0774757467",
                        email: "scott@gmail.com",
                        password: "scott123",
                        role: "General User",
                        birth_date: "07-08-1995",
                    })
                    .end((err, res) => {
                        res.body.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('Object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT route negative
    */
    describe('/PUT user - negative', () => {
        it('it should not UPDATE a user without the username', (done) => {
            let newUser = new user(
                {
                    name: "Scott",
                    username: "scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .put('/aggregation-service/api/users/updateUser')
                    .send({
                        name: "Scotty",
                        phone_num: "0774757467",
                        email: "scott@gmail.com",
                        password: "scott123",
                        role: "General User",
                        birth_date: "07-08-1995",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT route
    */
    describe('/PUT password', () => {
        it('it should UPDATE the password given the username', (done) => {
            let newUser = new user(
                {
                    username: "scott",
                    name: "Scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .put('/aggregation-service/api/users/updatePassword')
                    .send({
                        username: "scott",
                        password: "scott1234",
                    })
                    .end((err, res) => {
                        res.body.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('Object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT route
    */
    describe('/PUT password - negative', () => {
        it('it should UPDATE the password given the username', (done) => {
            let newUser = new user(
                {
                    username: "scott",
                    name: "Scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .put('/aggregation-service/api/users/updatePassword')
                    .send({
                        password: "scott1234",
                    })
                    .end((err, res) => {
                        res.body.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('Object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /DELETE route
    */
    describe('/DELETE user', () => {
        it('it should DELETE the user given the username', (done) => {
            let newUser = new user(
                {
                    username: "scott",
                    name: "Scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .delete('/aggregation-service/api/users/deleteUser/scott')
                    .end((err, res) => {
                        res.body.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('Object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /DELETE route
    */
    describe('/DELETE user -negative', () => {
        it('it should not DELETE the user without the username', (done) => {
            let newUser = new user(
                {
                    username: "scott",
                    name: "Scott",
                    phone_num: "0774757457",
                    email: "scott@gmail.com",
                    password: "scott123",
                    role: "General User",
                    birth_date: "07-08-1995",
                });
            newUser.save((err, newUser) => {
                chai.request(server)
                    .delete('/aggregation-service/api/users/deleteUser/')
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });
});
