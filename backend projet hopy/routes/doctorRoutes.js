const express = require("express");
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");

const doctorRouter = express.Router();

// Existing routes
doctorRouter.get("/getalldoctors", doctorController.getalldoctors);
doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);
doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);
doctorRouter.put("/deletedoctor", auth, doctorController.deletedoctor);
doctorRouter.put("/acceptdoctor", auth, doctorController.acceptdoctor);
doctorRouter.put("/rejectdoctor", auth, doctorController.rejectdoctor);

// New availability routes
doctorRouter.get("/availability/:id", doctorController.getDoctorAvailability);
doctorRouter.put("/set-unavailable/:id", auth, doctorController.setDoctorUnavailable);
doctorRouter.put("/set-available/:id", auth, doctorController.setDoctorAvailable);
// Add these routes
doctorRouter.get("/specializations", doctorController.getAllSpecializations);
doctorRouter.get("/specialization/:specialization", doctorController.getDoctorsBySpecialization);
module.exports = doctorRouter;