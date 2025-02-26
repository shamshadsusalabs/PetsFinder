const mongoose = require("mongoose");

const FoundPetSchema = new mongoose.Schema({
  name: { type: String },  // Optional
  Indianbreed: { 
    type: String, 
    enum: [
      "Indie", "Indie Mix", "Lab Mix", "Rottweiler Mix", "Doberman Mix", 
      "German Shepherd Mix", "Pom Mix", "Spitz Mix", "Other"
    ], 
    required: false,
    set: v => v === "" ? undefined : v
  },  
  Importedbreed: { 
    type: String, 
    enum: [
      "Labrador", "Rottweiler", "German Shepherd", "Pomeranian", "Spitz", 
      "Shih Tzu", "Beagle", "Pit Bull", "American Bully", "Pakistani Bully", 
      "Golden Retriever", "Dalmatian", "Pug", "Other"
    ], 
    required: false,
    set: v => v === "" ? undefined : v
  },  

  lastSeen: { type: Date, required: true },  // * Required
  location: { type: String, required: true }, // * Required

  ownerName: { type: String, required: true }, // * Required
  contactName: { type: String, required: true }, // * Required
  gender: { type: String, enum: ["Male", "Female"], required: false, set: v => v === "" ? undefined : v },  
  sterilised: { type: String, enum: ["Yes", "No"], required: false, set: v => v === "" ? undefined : v },  
  earClip: { type: String, enum: ["Left", "Right"], required: false, set: v => v === "" ? undefined : v },  
  tailCut: { type: String, enum: ["Yes", "No"], required: false, set: v => v === "" ? undefined : v },  
  leg: { 
    type: String, 
    enum: [
      "4 Legs", "3 Legs", "Limp (Indian)", "Limp (Imported)", 
      "Front Leg (Indian)", "Front Leg (Imported)", "Other"
    ], 
    required: false,
    set: v => v === "" ? undefined : v
  },  
  size: { type: String, enum: ["Big", "Small", "Other"], required: false, set: v => v === "" ? undefined : v },  
  body: { type: String, enum: ["Fat", "Thin", "Medium", "Other"], required: false, set: v => v === "" ? undefined : v },  
  colour: { 
    type: String, 
    enum: ["White", "White & Black", "Brown", "White & Brown", "Reddish", "Patches", "Other"], 
    required: false,
    set: v => v === "" ? undefined : v
  },  
  noseColour: { type: String, enum: ["Black", "Pink", "Red", "Spots", "Other"], required: false, set: v => v === "" ? undefined : v },  
  eyeColour: { type: String, enum: ["Black", "Brown", "Other"], required: false, set: v => v === "" ? undefined : v },  
  injury: { type: String, enum: ["Yes", "No"], required: false, set: v => v === "" ? undefined : v },  
  underTreatment: { type: String, enum: ["Yes", "No"], required: false, set: v => v === "" ? undefined : v },  

  image: { type: String, required: true },  // * Required
  match: { type: Boolean, default: false },  // Optional
  details: { type: String, required: true },  // * Required
  rewards: { type: Number } , // Optional
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("FoundPet", FoundPetSchema);
