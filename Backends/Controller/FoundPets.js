const { validationResult } = require("express-validator");
const FoundPets = require("../Schema/FoundPet");
const LostPets = require("../Schema/LostPet");
// Create Lost Pet Report
exports.createFoundPet = async (req, res) => {
  console.log("Step 1: Route hit!"); 
  console.log("Request Body:", req.body); // Debugging ke liye

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Step 2: Validation Failed!", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const petData = Object.assign({}, req.body);
    const newPet = new FoundPets(petData);
    await newPet.save();
    return res.status(201).json({ message: "Found pet reported successfully", data: newPet });
  } catch (error) {
    console.error("Step 10: Error Saving:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get All Lost Pets
exports.getAllFoundPets = async (req, res) => {
  try {
    const pets = await FoundPets.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: pets.length, data: pets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Single Lost Pet by ID
exports.getFoundPetById = async (req, res) => {
  try {
    const pet = await FoundPets.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Found pet not found" });

    return res.status(200).json({ data: pet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Lost Pet Report
exports.updateFoundPet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPet = await FoundPets.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPet) return res.status(404).json({ error: "Found pet not found" });

    return res.status(200).json({ message: "Found pet updated successfully", data: updatedPet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Lost Pet Report
exports.deleteFoundPet = async (req, res) => {
  try {
    const deletedPet = await FoundPets.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ error: "Found pet not found" });

    return res.status(200).json({ message: "Found pet report deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.updateMatchStatus = async (req, res) => {
  try {
    

    const { _id } = req.params; // Get pet ID from request params
   

    const { match } = req.body; // Get match status from request body
   

    // Validate match status (should be Boolean)
    if (typeof match !== "boolean") {
    
      return res.status(400).json({ message: "Invalid match value, expected true or false" });
    }

    

    // Find pet by ID and update match status
    const updatedPet = await FoundPets.findByIdAndUpdate(
      _id,
      { match: match },
      { new: true } // Return updated document
    );

    if (!updatedPet) {
     
      return res.status(404).json({ message: "Pet not found" });
    }

   
    res.json({ message: "Match status updated successfully", data: updatedPet });
  } catch (error) {
  
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMatchingPets = async (req, res) => {
  try {
    const { userId } = req.params;

    // Pehle user ke pets nikal lo
    const [userFoundPets, userLostPets] = await Promise.all([
      FoundPets.find({ userId }).lean(),
      LostPets.find({ userId }).lean(),
    ]);

    const userPets = [...userFoundPets, ...userLostPets];
    if (userPets.length === 0) {
      return res.status(404).json({ message: "No pets found for this user." });
    }

    // Matching conditions ready karo
    const fields = [
      "Indianbreed", "Importedbreed", "eyeColour", "colour", "gender",
      "size", "body", "noseColour", "injury",
      "sterilised", "earClip", "tailCut", "leg"
    ];

    const matchConditions = userPets.flatMap((pet) => {
      return fields.map((field) => ({ [field]: pet[field] }));
    });

    // Dusre logon ke pets fetch karo, apne userId wale hatao
    const [allFoundPets, allLostPets] = await Promise.all([
      FoundPets.find({ $or: matchConditions, userId: { $ne: userId } }).lean(),
      LostPets.find({ $or: matchConditions, userId: { $ne: userId } }).lean(),
    ]);

    // Filter karo jo kam se kam 3 fields match karte hain
    const allPets = [...allFoundPets, ...allLostPets];
    const matchingPets = allPets.filter((pet) => {
      return userPets.some((userPet) => {
        let matchCount = fields.reduce((count, field) => {
          return count + (pet[field] === userPet[field] ? 1 : 0);
        }, 0);
        return matchCount >= 3;
      });
    });

    return res.status(200).json({ count: matchingPets.length, data: matchingPets });
  } catch (error) {
    console.error("Error finding matching pets:", error);
    return res.status(500).json({ error: error.message });
  }
};
