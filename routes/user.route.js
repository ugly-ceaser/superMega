const{fetchUserDetails,updateUserDetails} = require('../controller/userProfile.controller');
const router = require('express').Router();

router.get('/:userId',fetchUserDetails) // fetch user details
router.post('/update',updateUserDetails); // update user details


module.exports = router
