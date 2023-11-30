const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username:{
      type:String,
      default: "new user"
    },
    transactionId: {
      type: String,
      required: true,
      Unique: [true, 'please enter a unique transaction'],
    },
    description: {
      type: String,
      required: false,
    },
    amount: {
      type: String,
      required: [true, 'Please specify the deposit amount'],
    },
    status: {
      type: String,
      default: 'pending',
    }
   
  },
  {
    timestamps: true,
  }
);

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
