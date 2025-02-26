const { validationResult } = require("express-validator");
const LostPet = require("../Schema/LostPet");

// Create Lost Pet Report
// Create Lost Pet Report
exports.createLostPet = async (req, res) => {
  console.log("Step 1: Received request at /createLostPet");
  console.log("Step 2: Request Body:", req.body);
  
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Step 3: Validation Failed", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("Step 4: Normalizing object...");
    const petData = Object.assign({}, req.body);
    console.log("Step 5: Normalized Data:", petData);

    console.log("Step 6: Creating new LostPet instance...");
    const newPet = new LostPet(petData);
    console.log("Step 7: NewPet instance created but not saved yet:", newPet);

    console.log("Step 8: Saving newPet to the database...");
    await newPet.save();
    console.log("Step 9: Pet saved successfully!", newPet);

    return res.status(201).json({ message: "Lost pet reported successfully", data: newPet });
  } catch (error) {
    console.error("Step 10: Error Saving:", error);
    return res.status(500).json({ error: error.message });
  }
};


// Get All Lost Pets
exports.getAllLostPets = async (req, res) => {
  try {
    const pets = await LostPet.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: pets.length, data: pets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Single Lost Pet by ID
exports.getLostPetById = async (req, res) => {
  try {
    const pet = await LostPet.findById(req.params.id);
    if (!pet) return res.status(404).json({ error: "Lost pet not found" });

    return res.status(200).json({ data: pet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Lost Pet Report
exports.updateLostPet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedPet = await LostPet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPet) return res.status(404).json({ error: "Lost pet not found" });

    return res.status(200).json({ message: "Lost pet updated successfully", data: updatedPet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Lost Pet Report
exports.deleteLostPet = async (req, res) => {
  try {
    const deletedPet = await LostPet.findByIdAndDelete(req.params.id);
    if (!deletedPet) return res.status(404).json({ error: "Lost pet not found" });

    return res.status(200).json({ message: "Lost pet report deleted successfully" });
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
    const updatedPet = await LostPet.findByIdAndUpdate(
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


