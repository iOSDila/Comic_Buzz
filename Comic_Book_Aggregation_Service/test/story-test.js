const mongoose = require('mongoose');
require('../models/users.model');
require('../models/story-jobs.model');
const user = mongoose.model('users');
const storyJob = mongoose.model('storyJobs');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('----------Stories----------', () => {
    beforeEach((done) => { //Before each test we empty the database
        // user.remove({ username: "scott" }, (err) => {
        done();
        // });
    });
    afterEach((done) => { //After each test we remove already created dummy data
        // user.remove({ username: "scott" }, (err) => {
        done();
        // });
    });

    /*
     * Test the /GET route for given username
     */
    describe("GET /", () => {
        it("it should GET a story job when given the job id", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/stories/jobs/2ce5ea60-04ad-11ea-b3a2-59adc12f09a3')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('Object');
                    done();
                });
        });
    });

    /*
     * Test the /GET route for get last story given username
     */
    describe("GET /", () => {
        it("it should GET the last story job when given the username", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/stories/last_saved/users/mido')
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
        it("it should GET all the stories for a given username", (done) => {
            chai.request(server)
                .get('/aggregation-service/api/stories/jobs/users/mido')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    /*
    * Test the /PUT route
    */
    describe('/PUT story job status', () => {
        it('it should UPDATE a story job status given the job id and the status', (done) => {
            let newStoryJob = new storyJob(
                {
                    job_id: "ad478bc0-f7d6-11e9-bd33-b1634306fb56",
                    status: "in_progress",
                    username: "mido",
                    saveStory: false,
                    storyName: "panel223"
                });
            newStoryJob.save((err, newStoryJob) => {
                chai.request(server)
                    .put('/aggregation-service/api/stories/jobs/static-job-id-for-sole-jobs/status/done')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        done();
                    });
            });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ', () => {
        it('it should segment balloons', (done) => {

            chai.request(server)
                .post('/aggregation-service/api/balloon_segmentation/start')
                .type('form')
                .attach('image', 'test/assets/images/3-10.jpg', '3-10.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ', () => {
        it('it should recognise characters', (done) => {
            chai.request(server)
                .post('/aggregation-service/api/CCR/start')
                .type('form')
                .attach('image', 'test/assets/images/3-10.jpg', '3-10.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ', () => {
        it('it should detect objects', (done) => {
            chai.request(server)
                .post('/aggregation-service/api/COD/start')
                .type('form')
                .attach('image', 'test/assets/images/3-10.jpg', '3-10.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ', () => {
        it('it should recognize texts', (done) => {
            chai.request(server)
                .post('/aggregation-service/api/OCR/start')
                .type('form')
                .attach('image', 'test/assets/images/3-10.jpg', '3-10.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
        * Test the /POST route
        */
    describe('/POST ', () => {
        it('it should segment panels', (done) => {
            chai.request(server)
                .post('/aggregation-service/api/panel_segmentation/start')
                .type('form')
                .attach('image', 'test/assets/images/newPage.jpg', 'newPage.jpg')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST ', () => {
        it('it should convert text to speech', (done) => {
            chai.request(server)
                .post('/aggregation-service/api/TTS/start')
                .send({
                    text: "Lion king"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

});
