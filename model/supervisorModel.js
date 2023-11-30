const mongoose = require('mongoose');

const SupervisorSchema =  new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    fullname:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
         type:String,
         default:"supervisor",
         required: true

    },
    status:{
        type: String,
        default: "active"
    },
    statusUpdateDate:{
        type:Date,

    },
    numberOfClients:{
        type: Number,
        default:0

    },
    lastRegisterdUser:{
        type: Mixed,
        default:null
    }
});

const Supervisor = mongoose.model('Supervisor', SupervisorSchema);

module.exports = Supervisor;
