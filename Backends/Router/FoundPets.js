const express = require("express");
const { body, param } = require("express-validator");
const FountPetController = require("../Controller/FoundPets");
const { uploadImage } = require('../Middileware/multer');
const router = express.Router();
const authMiddleware = require('../Middileware/authMiddileWare');

// Validation Rules
const validateFoundPet = [
  body("lastSeen").isISO8601().withMessage("Invalid date format"),
  body("ownerName").notEmpty().withMessage("Owner name is required"),
  body("contactName").notEmpty().withMessage("Contact name is required"),
  body("location").notEmpty().withMessage("Location is required"),
  body("details").notEmpty().withMessage("Details are required"),
  body("image").notEmpty().withMessage("Image is required"),

  // Optional Fields (will not throw errors if missing or empty)


  body("Importedbreed")
    .optional({ checkFalsy: true })
    .isIn([
     "Other", "Labrador", "Rottweiler", "German Shepherd", "Pomeranian", "Spitz",
      "Shih Tzu", "Beagle", "Pit Bull", "American Bully", "Pakistani Bully",
      "Golden Retriever", "Dalmatian", "Pug", "Other"
    ])
    .withMessage("Invalid breed"),

  body("Indianbreed")
    .optional({ checkFalsy: true })
    .isIn([
      "Indie", "Indie Mix", "Lab Mix", "Rottweiler Mix", "Doberman Mix", 
      "German Shepherd Mix", "Pom Mix", "Spitz Mix", "Other"
    ])
    .withMessage("Invalid breed"),

 
  
  body("gender").optional({ checkFalsy: true }).isIn(["Male", "Female"]).withMessage("Invalid gender"),
  
  body("sterilised").optional({ checkFalsy: true }).isIn(["Yes", "No"]).withMessage("Invalid sterilised value"),
  
  body("earClip").optional({ checkFalsy: true }).isIn(["Left", "Right"]).withMessage("Invalid ear clip value"),
  
  body("tailCut").optional({ checkFalsy: true }).isIn(["Yes", "No"]).withMessage("Invalid tail cut value"),
  
  body("leg").optional({ checkFalsy: true }).isIn([
    "4 Legs", "3 Legs", "Limp (Indian)", "Limp (Imported)", 
    "Front Leg (Indian)", "Front Leg (Imported)"
  ]).withMessage("Invalid leg value"),

  body("size").optional({ checkFalsy: true }).isIn(["Big", "Small"]).withMessage("Invalid size value"),
  
  body("body").optional({ checkFalsy: true }).isIn(["Fat", "Thin", "Medium"]).withMessage("Invalid body value"),
  
  body("colour").optional({ checkFalsy: true }).isIn([
    "White", "White & Black", "Brown", "White & Brown", "Reddish", "Patches"
  ]).withMessage("Invalid colour"),
  
  body("noseColour").optional({ checkFalsy: true }).isIn(["Black", "Pink", "Red", "Spots"]).withMessage("Invalid nose colour"),
  
  body("eyeColour").optional({ checkFalsy: true }).isIn(["Black", "Brown", "Other"]).withMessage("Invalid eye colour"),
  
  body("injury").optional({ checkFalsy: true }).isIn(["Yes", "No"]).withMessage("Invalid injury value"),
  
 
  body("userId").isMongoId().withMessage("Invalid userId"), // User ID Validation
];

// Routes
router.post("/create", authMiddleware, uploadImage, validateFoundPet, FountPetController.createFoundPet);
router.get("/getAll", authMiddleware, FountPetController.getAllFoundPets);
router.get("/:id", param("id").isMongoId().withMessage("Invalid ID"), FountPetController.getFoundPetById);
router.put("/:id", param("id").isMongoId().withMessage("Invalid ID"), validateFoundPet, FountPetController.updateFoundPet);
router.delete("/:id", param("id").isMongoId().withMessage("Invalid ID"), FountPetController.deleteFoundPet);
router.put("/update-match/:_id", FountPetController.updateMatchStatus);
router.get("/matching-pets/:userId", FountPetController.getMatchingPets);
module.exports = router;
