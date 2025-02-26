const Reward = require('../Schema/Reward'); // Tumhara schema yahan import hoga
const mongoose = require('mongoose');
// 🟢 Create a new reward
exports.createReward = async (req, res) => {
    try {
        const reward = new Reward(req.body);
        await reward.save();
        res.status(201).json({ message: 'Reward created successfully', reward });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🔵 Get all rewards
exports.getAllRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().populate('userID');
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟡 Get single reward by ID
exports.getRewardById = async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id).populate('userID');
        if (!reward) {
            return res.status(404).json({ message: 'Reward not found' });
        }
        res.status(200).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟠 Update a reward
exports.calculateRewards = async function (req, res) {
    try {
        const userID = req.params.id;
        console.log("Received userID:", userID);

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: `Invalid userID format: ${userID}` });
        }

        console.log(`Fetching records for userID: ${userID}`);
        const records = await Reward.find({ userID });

        console.log("Fetched Records:", JSON.stringify(records, null, 2));

        let petLostCount = 0;
        let petFoundCount = 0;
        let totalRewards = 0;

        records.forEach((record, index) => {
            console.log(`Processing Record ${index + 1}:`, record);

            if (Number(record.petLost) > 0) {
                petLostCount++;
                console.log(`Incremented petLostCount: ${petLostCount}`);
            }

            if (Number(record.petFound) > 0) {
                petFoundCount++;
                console.log(`Incremented petFoundCount: ${petFoundCount}`);
            }

            // Add petLost and petFound values to totalRewards
            totalRewards += Number(record.petLost) + Number(record.petFound);
        });

        const totalMatchingPets = records.length;

        console.log(`Final Counts => petLostCount: ${petLostCount}, petFoundCount: ${petFoundCount}, Total Rewards: ${totalRewards}`);

        res.json({ totalMatchingPets, totalRewards, petLostCount, petFoundCount });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};