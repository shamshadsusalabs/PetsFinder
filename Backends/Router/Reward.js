const express = require('express');
const router = express.Router();
const rewardController = require('../Controller/Reward');
const  authMiddleware  = require('../Middileware/authMiddileWare');
// 🟢 Create a new reward
router.post('/rewards',authMiddleware, rewardController.createReward);

// 🔵 Get all rewards
// router.get('/rewards', rewardController.getAllRewards);

// // 🟡 Get a single reward by ID
// router.get('/rewards/:id', rewardController.getRewardById);

// // 🟠 Update a reward by ID
// router.put('/rewards/:id', rewardController.updateReward);

// // 🔴 Delete a reward by ID
// router.delete('/rewards/:id', rewardController.deleteReward);
router.get('/rewards/:id',authMiddleware, rewardController.calculateRewards);
module.exports = router;
