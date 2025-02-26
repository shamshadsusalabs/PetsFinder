const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    petLost: { type: Number, default: 0 }, // Pet kho gaya count
    petFound: { type: Number, default: 0 }, // Pet mil gaya count
   
  
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const Reward = mongoose.model('Reward', petSchema);

module.exports = Reward;
