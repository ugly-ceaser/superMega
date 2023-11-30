const mongoose = require('mongoose');

const AdminSchema =  new mongoose.Schema({
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
         default:"admin",
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
    lastRegisterdSupervisor:{
        type: Mixed,
        default:null
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Supervisor;
