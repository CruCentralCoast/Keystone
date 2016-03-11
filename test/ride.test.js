var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3002'),
    keystone = require('keystone');

describe('/ride', function() {
    var event, ride;
    
    beforeEach(function(done){
        var Event = keystone.list('Event').model;
        var Ride = keystone.list('Ride').model;
        
        
        Event.create({
            name: "Test Event"
        }, function(err, e) {
            event = e;
            Ride.create({
                event: event._id,
                driverName: "Test",
                driverNumber: "1234567890",
                gcm_id: "foobar"
            }, function(err, r) {
                ride = r;
                done();
            });
        });
    });
    
    afterEach(function(done) {
        var Event = keystone.list('Event').model;
        var Ride = keystone.list('Ride').model;

        Event.remove({}, function() {
            Ride.remove({}, function() {
                done();
            });
        });      
    });
    
    describe('GET', function() {
        describe('/list', function() {
            it('return all the rides', function(done) {
                api.get('/api/ride/list')
                    .expect(200)
                    .expect(function(res) {
                        res.body[0].should.have.property('driverName', 'Test');
                    })
                    .end(done);
            });
        });
        describe('/:id', function() {
            it('return a specific ride', function(done) {
                api.get('/api/ride/' + ride._id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('driverName', 'Test');
                    })
                    .end(done);
            });
        });  
        describe('/enumValues/:key', function() {
            it('gets the enum values for direction', function(done) {
                api.get('/api/ride/enumValues/direction')
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.lengthOf(3).and.be.instanceof(Array);
                    })
                    .end(done);
            });
        });  
    });
    describe('POST', function() {
        describe('/create', function() {
            it('add a new ride', function(done) {
                api.post('/api/ride/create')
                    .send({
                        event: event._id,
                        driverName: "Test",
                        driverNumber: "1234567890",
                        gcm_id: "foobar"
                    })
                    .expect(201)
                    .expect(function(res) {
                        res.body.should.have.property('event', String(event._id));
                    })
                    .end(done);
            });
        });
        describe('/find', function() {
            it('select only the driver\'s number', function(done) {
                api.post('/api/ride/find?select=driverNumber')
                    .expect(200)
                    .expect(function(res) {
                        res.body[0].should.be.have.property('driverNumber', '1234567890')
                            .and.should.not.have.property('driverName');
                    })
                    .end(done);
            });
        });
        describe('/search', function() {
            it('successfully returns ride', function(done) {
                api.post('/api/ride/search')
                    .expect(200, function(res) {
                        done();
                    });
            });
        });
        describe('/update', function() {
            it('changes data for a ride', function(done) {
                api.post('/api/ride/update')
                    .send({
                        _id: ride._id,
                        driverName: 'New Name'
                    })
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('driverName', 'New Name');
                    })
                    .end(done);
            });
        });
        describe('/addPassenger', function() {
            var passenger;
            
            beforeEach(function(done) {
                var Passenger = keystone.list('Passenger').model;
                
                Passenger.create({
                    name: 'Test Passenger',
                    phone: '1234567890',
                    direction: 'both'
                }, function(err, p) {
                    passenger = p;
                    done();
                })
            });
            
            afterEach(function(done) {
                var Passenger = keystone.list('Passenger').model;
                
                Passenger.remove({}, function() {
                    done();
                })
            });
            
            it('adds a passenger to a specific ride', function(done) {
                api.post('/api/ride/addPassenger')
                    .send({
                        ride_id: ride._id,
                        passenger_id: passenger._id
                    })
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('passengers').which.lengthOf(1);
                    })
                    .end(done)
            });
        });
        describe('/dropPassenger', function() {
            var passenger;
            
            beforeEach(function(done) {
                var Passenger = keystone.list('Passenger').model;
                
                Passenger.create({
                    name: 'Test Passenger',
                    phone: '1234567890',
                    direction: 'both'
                }, function(err, p) {
                    passenger = p;
                    done();
                })
            });
            
            afterEach(function(done) {
                var Passenger = keystone.list('Passenger').model;
                
                Passenger.remove({}, function() {
                    done();
                })
            });
            
            it('removes a passenger from a specific ride', function(done) {
                api.post('/api/ride/dropPassenger')
                    .send({
                        ride_id: ride._id,
                        passenger_id: passenger._id
                    })
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('passengers').which.lengthOf(0);
                    })
                    .end(done)
            });
        });
        describe('/dropRide', function() {
            it('drops an entire ride', function(done) {
                api.post('/api/ride/dropRide')
                    .send({
                        ride_id: ride._id
                    })
                    .expect(204)
                    .expect(function(res) {
                        res.body.should.be.empty;
                    })
                    .end(done)
            });
        });
    });
});

