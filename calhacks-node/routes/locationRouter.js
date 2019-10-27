const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Models = require('../models/models.js');

const locationRouter = express.Router();

locationRouter.use(bodyParser.json());
locationRouter.use(bodyParser.urlencoded({     
    extended: true
})); 

function calculate_distance(zip1, zip2){
    //Calculate distance between two zip codes
    return Math.abs(zip1 - zip2);
}

function chooseAccomodation(accomodations) {
    // Return index of the earliest accomodation
    var current_date = new Date();
    current_date.setHours(current_date.getHours()-7); 
    var active_accomodation = [];
    for (accomodation of accomodations) {
        if (accomodation.startTime <= current_date){
            active_accomodation.push(accomodation);
        }
    }
    var soon_date = active_accomodation[0].endTime;
    var soon_accomodation = active_accomodation[0];
    for (accomodation of active_accomodation){
        if (accomodation.endTime < soon_date){
            soon_date = accomodation.endTime;
            soon_accomodation = accomodation;
        }
    }
    var index = -1;
    for (var i = 0; i < accomodations.length; i += 1) {
        if (accomodations[i] === soon_accomodation) {
            index = i;
        }
    }
    console.log(index);
    return index;
}

locationRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    Models.locations.find({})  //get all locations
    .then((locations) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(locations);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, (req, res, next) => { //creating location
    console.log(req.body);
    Models.locations.create(req.body)
    .then((location) => {
        console.log('Location created ', location);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(location.id);  //send location ID to front-end
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {  //deleting all locations
    Models.locations.remove({})
    .then((resp) => {
        console.log('All locations deleted');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

locationRouter.route('/login/:username/:keyword')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => { //logging in
    var username = req.params.username;
    var keyword = req.params.keyword;
    console.log(username, keyword);
    Models.locations.findOne({"username": username})
    .then((location) => {
        if (location != null) {
            if (location.keyword == keyword) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(location.id);  //send location ID to front-end
            }
            else {
                res.statusCode = 403;
                console.log('Incorrect keyword');
                res.json();
            }
        }
        else {
            res.statusCode = 403;
            console.log('No location with such username found');
            res.json();
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

locationRouter.route('/:locationId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, (req, res, next) => {  //creating an accomodation
    console.log(req.body);
    var locationId = req.params.locationId;
    Models.locations.findById(locationId)
    .then((location) => {
        if (location == null) {
            res.statusCode = 403;
            console.log('Incorrect location');
            res.json();
        }
        else {
            dict = req.body;
            console.log(req.body.startTime, req.body.endTime, req.body.peopleQuantity, req.body.description);
            dict['location'] = location;
            Models.accomodations.create(dict)
            .then((accomodation) => {
                console.log('Accomodation created');
                var new_array = location.accomodations.slice();
                new_array.push(accomodation);
                Models.locations.updateOne({ _id: locationId }, { $set: {"accomodations": new_array} })
                .then((resp) => {
                    console.log('Accomodation updated', resp);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(accomodation);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

locationRouter.route('/decrement/:locationId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.put(cors.corsWithOptions, (req, res, next) => {  //editing and accomodation
    var locationId = req.params.locationId;
    Models.locations.findById(locationId)
    .then((location) => {
        if (location == null) {
            res.statusCode = 403;
            console.log('Location not found');
            res.json();
        }
        else {            
            var accomodation_index = chooseAccomodation(location.accomodations);
            var accomodationId = location.accomodations[accomodation_index]._id;
            var new_people = location.accomodations[accomodation_index].peopleQuantity - 1;
            Models.accomodations.updateOne({ _id: accomodationId }, { $set: {"peopleQuantity": new_people} })
            .then((resp) => {
                console.log(resp);
                console.log('Accomodation decremented');
                if (new_people === 0) {
                    Models.accomodations.findOneAndDelete({_id: accomodationId})
                    .then((respo) => {
                        console.log('Accomodation deleted');
                        var arr_cpy = location.accomodations.slice();
                        var accomodations_arr = arr_cpy.slice(accomodation_index) + arr_cpy.slice(accomodation_index + 1);
                        var accomodations_arr = [];
                        Models.locations.updateOne({_id: locationId }, { $set: {"accomodations": accomodations_arr} })
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json();
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }, (err) => next(err))
                .catch((err) => next(err));
                } 
                else {
                    var accomodations_arr = location.accomodations.slice();
                    accomodations_arr[accomodation_index].peopleQuantity -= 1;
                    Models.locations.updateOne({_id: locationId }, { $set: {"accomodations": accomodations_arr}})
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

locationRouter.route('/find-locations/:zipCode')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    var zip = req.params.zipCode;
    console.log(zip);
    Models.locations.find({})
    .then((locations) => {
        console.log(locations instanceof Array);
        var locations_cpy = locations.slice();
        function helper(loc) {
            var current_time = new Date();
            current_time.setHours(current_time.getHours() - 7);
            for (accom of loc.accomodations) {
                if (accom.startTime < current_time && current_time < accom.endTime) {
                    return true;
                }
            }
            return false;
        }
        for (i in locations_cpy) {
            if (locations_cpy[i].accomodations.length == 0 || !helper(locations_cpy[i])) {
                //locations.remove(elem);
                locations[i] = null;
            }
        }
        locations = locations.filter(location => location !== null);

        locations.sort(function(a, b) {
            var distance1 = calculate_distance(a.zipCode, zip);
            var distance2 = calculate_distance(b.zipCode, zip);
            return Math.sign(distance1 - distance2);
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var array_to_return = null;
        if (locations.length > 5) {
            array_to_return = locations.slice(5);
        }
        else {
            array_to_return = locations;
        }
        res.json(array_to_return);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = locationRouter;