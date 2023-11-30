
const depositModel = require('../model/depositModel')
const userModel = require('../model/userModel');
const adminModel = require('../model/adminModel');

const getAllUsers = async (req, res) => {

    const supervisorId = req.params.userId;


  try {
    const users = await userModel.find();

    const myUsers = users.filter(user=> user.supervisor == supervisorId) 

    if(!myUsers){

        res.status(400).json({
            success: false,
            message: "No User Found",
          });

    }
    res.status(200).json({
      success: true,
      myUsers,
    });
  } catch (error) {
    console.error('Error while fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



const getTotalNumberOfUsers = async (req, res) => {
    try {
      const totalUsers = await userModel.countDocuments();
      res.status(200).json({
        success: true,
        totalUsers,
      });
    } catch (error) {
      console.error('Error while fetching total number of users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  const deleteUserByUserId = async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const deletedUser = await userModel.findOneAndDelete({ userId });
  
      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error while deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };


const updateUserProfit = async (req, res) => {
  try {
   
    const userId = req.params.userId;

    //console.log(userId);
    
    const amount = req.params.amount;

    const profit = parseFloat(amount)


   

  
    // Fetch the user from the database
    const existingUser = await userModel.findOne({userId:userId});

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate the updated profit by adding to the previous profit
    const updatedProfit = existingUser.profit + profit;

    // Update the user's profit in the database
    await userModel.findOneAndUpdate({userId:userId}, { profit: updatedProfit });

    res.status(200).json({
      success: true,
      message: 'User profit updated successfully',
    });
  } catch (error) {
    console.error('Error while updating user profit:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const fetchAllDeposits = async (req, res) => {
    try {
      const deposits = await depositModel.find();
  
  
      res.status(200).json({
        success: true,
        deposits: deposits,
      });
    } catch (error) {
      console.error('Error while fetching all deposits:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };


  const fetchAllPendingDeposits = async (req, res) => {
    try {
      const deposits = await depositModel.find({ status: "pending" });
  
  
  
      let allPendingDeposits = deposits
  
      //console.log(allPendingDeposits);
  
      res.status(200).json({
        success: true,
        allPendingDeposits,
      });
    } catch (error) {
      console.error('Error while fetching all deposits:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  const getTotalDeposit = async (req, res) => {
    try {
      // Fetch all deposits with 'approved' status
      const deposits = await depositModel.find({ status: 'approved' });
  
      // Calculate the total amount of all approved deposits
      let totalAmount = 0;
      deposits.forEach((deposit) => {
        totalAmount += parseFloat(deposit.amount);
      });
  
      res.status(200).json({
        success: true,
        totalAmount,
      });
    } catch (error) {
      console.error('Error while fetching total deposit:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  
  const handleDeposit = async (req, res) => {
    const transactionId = req.params.transactionId;
    const status = req.params.status;
  
    
  
  
  
    try {
      const deposit = await depositModel.findOneAndUpdate(
        { transactionId }, // Use transactionId to find the document
        { $set: { status } },
        { new: status }
      );
  
      if (deposit.description?.toLowerCase() === "initial" && status?.toLowerCase() != "declined") {
  
        // console.log("TRANS ID: ", transactionId);
  
        const userDeposit = await depositModel.findOne({ transactionId })
  
        const userId = userDeposit?.userId
  
        //console.log(userId);
  
        const UserInitDepo = await userModel.findOne({ userId })
  
        //console.log(UserInitDepo)
  
  
  
        const initialDeposit = true
  
        const updateUserInitDepo = await userModel.findOneAndUpdate(
          { userId },
          { $set: { initialDeposit } },
          { new: initialDeposit }
        )
  
        if (!updateUserInitDepo) {
  
          return res.status(404).json({
            success: false,
            message: 'initialDeposit not changed',
          });
  
        }
  
      }
  
      if (!deposit) {
        return res.status(404).json({
          success: false,
          message: 'Deposit not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Deposit ${status === 'approved' ? 'approved' : 'declined'} successfully`,
        data: deposit,
      });
    } catch (error) {
      console.error('Error while handling deposit:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  
  const depositUser = async (req, res) => {
    try {
      const depositObject = req.body;
  
      let Data = {}; // Initialize the Data object
      Data.userId = depositObject.userId;
      Data.amount = depositObject.amount;
      Data.transactionId = depositObject.transactionId;
      Data.package = depositObject.package
  
      const deposit = await depositModel.create(Data);
  
      const id = Data.userId;
      const updatedUser = await userModel.findOneAndUpdate(
        { userId: id }, // Use _id instead of id
        { $set: { package: Data.package } }, // Update the user package data
        { new: true }
      );
  
      res.status(201).json({
        success: true,
        data: {
          deposit,
          updatedUser, // Include the updated user in the response
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  
  const handleInitDepo = async (req, res) => {
    const transactionId = req.params.transactionId;
    const description = req.params.description;
    const newuserId = req.params.userId;
  
    try {
      const deposit = await depositModel.findOneAndUpdate(
        { transactionId }, // Use transactionId to find the document
        { $set: { status } },
        { new: true }
      );
  
      if (!deposit) {
        return res.status(404).json({
          success: false,
          message: 'Deposit not found',
        });
      }
  
  
      const updateUserInitDepo = await userModel.findOneAndUpdate(
        { userId },
        { $set: { initialDeposit } },
        { new: true }
      )
      if (!updateUserInitDepo) {
        return res.status(404).json({
          success: false,
          message: 'user status update failed',
        });
  
      }
  
      res.status(200).json({
        success: true,
        message: `Deposit ${status === 'approved' ? 'approved' : 'declined'} successfully`,
        data: deposit,
      });
    } catch (error) {
      console.error('Error while handling deposit:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  
  
  };
  
  const fetchInitDepo = async (req, res) => {
  
    try {
      const deposits = await depositModel.find();
  
  
      var initDeposits = deposits.filter(deposit => deposit.description == "initial")
  
      res.status(200).json({
        success: true,
        initDeposits,
      });
    } catch (error) {
      console.error('Error while fetching all deposits:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  
  }





module.exports = { 
  getAllUsers,
  updateUserProfit,
  getTotalNumberOfUsers,
  deleteUserByUserId,
  adminLogin,
  getAllBasicUsers,
  getAllPremiumUsers,
  getAllAdvanceUsers };
