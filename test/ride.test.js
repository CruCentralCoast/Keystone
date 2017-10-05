var should = require('chai').should(),
    supertest = require('supertest'),
    api = supertest('http://localhost:3002'),
    keystone = require('keystone');

describe('/rides', function() {
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
                fcm_id: "foobar"
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
        describe('/', function() {
            it('return all the rides', function(done) {
                api.get('/api/rides')
                    .expect(200)
                    .expect(function(res) {
                        res.body[0].should.have.property('driverName', 'Test');
                    })
                    .end(done);
            });
        });
        describe('/:id', function() {
            it('return a specific ride', function(done) {
                api.get('/api/rides/' + ride._id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('driverName', 'Test');
                    })
                    .end(done);
            });
        });  
        describe('/enumValues/:key', function() {
            it('gets the enum values for direction', function(done) {
                api.get('/api/rides/enumValues/direction')
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.lengthOf(3).and.be.instanceof(Array);
                    })
                    .end(done);
            });
        });  
    });
	
    describe('POST', function() {
        describe('/', function() {
            it('add a new ride', function(done) {
                api.post('/api/rides')
                    .send({
                        event: event._id,
                        driverName: "Test",
                        driverNumber: "1234567890",
                        fcm_id: "foobar"
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
                api.post('/api/rides/find?select=driverNumber')
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
                api.post('/api/rides/search')
                    .expect(200, function() {
                        done();
                    });
            });
        });
        
        describe('/:id/passenger', function() {
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
                });
            });
            
            afterEach(function(done) {
                var Passenger = keystone.list('Passenger').model;
                
                Passenger.remove({}, function() {
                    done();
                });
            });
            
            it('adds a passenger to a specific ride', function(done) {
                api.post('/api/rides/' + ride._id + '/passengers')
                    .send({
                        passenger_id: passenger._id
                    })
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('passengers').with.lengthOf(1);
                    })
                    .end(done);
            });
        });
    });
	
    describe('PATCH', function() {
        describe('/:id', function() {
            it('changes data for a ride', function(done) {
                api.patch('/api/rides/' + ride._id)
                    .send({
                        driverName: 'New Name'
                    })
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('driverName', 'New Name');
                    })
                    .end(done);
            });
        });
    });
	
    describe('DELETE', function() {
        describe('/:id', function() {
            it('drops an entire ride', function(done) {
                api.delete('/api/rides/' + ride._id)
                    .expect(204)
                    .expect(function(res) {
                        res.body.should.be.empty;
                    })
                    .end(done);
            });
        });
		
        describe('/passengers/:id', function() {
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
                });
            });

            afterEach(function(done) {
                var Passenger = keystone.list('Passenger').model;

                Passenger.remove({}, function() {
                    done();
                });
            });

            it('removes a passenger from a specific ride', function(done) {
                api.delete('/api/rides/' + ride._id + '/passengers/' + passenger._id)
                    .expect(200)
                    .expect(function(res) {
                        res.body.should.have.property('passengers').with.lengthOf(0);
                    })
                    .end(done);
            });
        });
		
		
    });
});

