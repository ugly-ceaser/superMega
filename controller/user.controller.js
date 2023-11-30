
const userModel = require('../model/userModel');
const depositModel = require('../model/depositModel');
const withdrawalModel = require('../model/withdrawalModel');
const supervisorModel = require('../model/supervisorModel')
const sendMail = require('../utils/mailer');





const getSupervisorMail = ()=>{
  const userId = req.params.userId;

  const user = userModel.findOne({userId});

  if(!user){
    return {
      success: false,
      message: 'User not found'
  }

  }

  const userSupervisorId  = user.supervisor

  const superObject = supervisorModel.findOne({userSupervisorId})

  if(!superObject){

    return {
      success: false,
      message: 'Supervisor not found'
  }

  }else{
     return {
      success: true,
      message: superObject.email
  }
  }

}


const fetchUserDetails = async (req, res) => 
{
    const userId =  req.params.userId ;
   // console.log(userId)

    const userDetails = await userModel.findOne({userId})

   // console.log(userDetails)

    if(!userDetails){
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    
    }else{
        return res.status(200).json({
            success: true,
            message: userDetails
        })      
}

}

const updateUserDetails = async (req, res) => {
    const userData = req.body;
    const updateFields = {};
  
    // Check if userData.username is provided and not empty
    if (userData.username) {
      updateFields.username = userData.username;
    }
  
    // Check if userData.email is provided and not empty
    if (userData.email) {
      updateFields.email = userData.email;
    }
  
    // Check if userData.phone is provided and not empty
    if (userData.phone) {
      updateFields.phone = userData.phone;
    }
  
    if (Object.keys(updateFields).length === 0) {
      // No valid fields to update
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }
  
    try {
      // Check if the user exists
      const existingUser = await userModel.findOne({ userId: userData.userId });
  
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      // Update the specified fields
      Object.assign(existingUser, updateFields);
      const updatedUser = await existingUser.save();
  
      return res.status(200).json({
        success: true,
        message: 'User details updated successfully',
        updatedUser: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };



const depositHandler = async (req, res) => {
  try {
    const depositData = req.body;

    const userObj = await userModel.findOne({ userId: depositData.userId });

    if (!userObj) {
      return res.status(404).json({
        success: false,
        message: 'User not found for the given userId',
      });
    }

    const userName = userObj.username;

    const deposit = await depositModel.create({
      userId: depositData.userId,
      amount: depositData.amount,
      transactionId: depositData.transactionId,
      package: depositData.package,
      username: userName,
    });

    const updatedUser = await userModel.findOneAndUpdate(
      { userId: depositData.userId },
      { $set: { package: depositData.package } },
      { new: true }
    );

    if (deposit) {

      const email = getSupervisorMail()
      if(email.success){
        let superEmail = email.message
      }else{
        let superEmail = "sampleGmail.com"
      }
      await sendMail(superEmail, `Deposit: ${depositData.amount}`, `${depositData.amount} was sent to your account by ${userName}, confirm and approve`);
    }

    res.status(201).json({
      success: true,
      data: {
        deposit,
        updatedUser,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDeposits = async (req, res) => {
  try {
    
    const userId =  req.params.userId ;
  // console.log(userId)

    
    const deposits = await depositModel.find({ userId });

    // console.log(deposits)

    res.status(200).json({
      success: true,
      message :deposits});
  } catch (error) {
    console.error('Error while fetching deposits:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' });
  }
};

const getTotalDeposit = async (req, res) => {
  try {
    // Retrieve the user ID from the session
    const userId = req.params.userId;

    // Fetch all deposits for the particular user based on the user ID
    const deposits = await depositModel.find({ userId,status: 'approved' });

    // Calculate the total amount deposited by the user
    let totalAmount = 0;
    deposits.forEach((deposit) => {
      totalAmount += parseFloat(deposit.amount);
    });

    res.status(200).json({ 
      success: true,
      message:totalAmount });
  } catch (error) {
    console.error('Error while fetching total deposit:', error);
    res.status(500).json({ 
      success:false,
      message:  error });
  }
};



const withdrawalHandler = async (req, res) => {
  try {

    const withdrawObject = req.body

    const user_id = withdrawObject.userId

    console.log(`user_id : ${user_id}`)

    const user_obj = await  userModel.findOne({userId:user_id})
    console.log(user_obj)
    withdrawObject.username = user_obj.username
    console.log(withdrawObject)
    const withdrawal = await withdrawalModel.create(withdrawObject);

    if (withdrawal) {
      const email = getSupervisorMail()
      if(email.success){
        let superEmail = email.message
      }else{
        let superEmail = "sampleGmail.com"
      }
      await sendMail(superEmail,`withdrawal:${withdrawObject.amount}`,`${withdrawObject.amount} request was made , confirm and approve`);
    }
    res.status(201).json({
      success: true,
      data: withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllWithdrawals = async (req, res) => {
  try {
    const userId = req.params.userId;
    const withdrawals = await withdrawalModel.find({ userId });
    res.status(200).json({
      success: true,
      message: withdrawals,
    });
  } catch (error) {
    console.error('Error while fetching withdrawals:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getTotalWithdrawal = async (req, res) => {
  try {
    const userId = req.params.userId;
    const withdrawals = await withdrawalModel.find({ userId, status: 'approved' });

    let totalAmount = 0;
    withdrawals.forEach((withdrawal) => {
      totalAmount += parseFloat(withdrawal.amount);
    });

    res.status(200).json({
      success: true,
      message: totalAmount,
    });
  } catch (error) {
    console.error('Error while fetching total withdrawal:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


  
  
  



module.exports = {
    updateUserDetails,
    fetchUserDetails,

    depositHandler,
    getAllDeposits,
    getTotalDeposit,

    withdrawalHandler,
    getAllWithdrawals,
    getTotalWithdrawal
  
   
  };

