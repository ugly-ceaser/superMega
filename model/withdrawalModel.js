const mongoose = require('mongoose');



const withdrawalSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        username:{
            type:String,
            default:"ser"
        },
        amount:{
            type: String,
            required:[ true,"   please specify a Phone number"]
        },
        status:{
            type: String,
            default: "pending"
        },
        walletAdress:{
            type: String,
            required:[ true," please specify a wallet address"]
        },
        coin:{
            type: String,
            required:false,
            default:"USDT"
        }
       
    },
    {
        timestamps: true
    }       
)


const withdrawal = mongoose.model('withdrawal', withdrawalSchema) 

module.exports = withdrawal