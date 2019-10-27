const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accomodationSchema = new Schema({
    startTime: {
        type: Date,
        required: true,
        default: function() {
          date = new Date();
          date.setHours(date.getHours()-7); 
          return date;
        }
    },
    endTime: {
        type: Date,
        required: true,
        default: function() {
            date = new Date();
            date.setHours(date.getHours()-7); 
            date.setDate(date.getDate() + 1);
            return date;
        }
    },
    peopleQuantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: function() {
            return "food";
        }
    },
})

const locationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    keyword: {
        type: String,
        required: true
    },
    accomodations: [accomodationSchema]
},{
    timestamps: true
});

const Locations = mongoose.model('Location', locationSchema);
const Accomodations = mongoose.model('Accomodation', accomodationSchema);

module.exports.locations = Locations;
module.exports.accomodations = Accomodations;