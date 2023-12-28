const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const user = require('../../database/model/user.model'); // Import the User model

router.route('/signin').post(authController.signin);
router.route('/register').post(authController.register);

// New route for fetching users
router.route('/users').get(async (req, res) => {
  try {
    const users = await user.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
