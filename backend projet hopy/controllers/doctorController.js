const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    let docs;
    if (!req.locals) {
      docs = await Doctor.find({ isDoctor: true }).populate("userId");
    } else {
      docs = await Doctor.find({ isDoctor: true })
        .find({
          _id: { $ne: req.locals },
        })
        .populate("userId");
    }

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get doctors");
  }
};

const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

const applyfordoctor = async (req, res) => {
  try {
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      return res.status(400).send("Application already exists");
    }

    const doctor = Doctor({ ...req.body.formDetails, userId: req.locals });
    const result = await doctor.save();

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    res.status(500).send("Unable to submit application");
  }
};

const acceptdoctor = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );

    const notification = await Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });

    await notification.save();

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    res.status(500).send("Error while sending notification");
  }
};

const rejectdoctor = async (req, res) => {
  try {
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );
    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });

    const notification = await Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });

    await notification.save();

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    res.status(500).send("Error while rejecting application");
  }
};

const deletedoctor = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete doctor");
  }
};

// Add these controller methods

// Get Doctor Availability
const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }

    return res.status(200).json({
      isAvailable: doctor.isAvailable
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get doctor availability");
  }
};

// Set Doctor Unavailable
const setDoctorUnavailable = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { isAvailable: false },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).send("Doctor not found");
    }

    return res.status(200).json({
      message: "Doctor marked as unavailable",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to update doctor availability");
  }
};

// Set Doctor Available
const setDoctorAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { isAvailable: true },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).send("Doctor not found");
    }

    return res.status(200).json({
      message: "Doctor marked as available",
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to update doctor availability");
  }
};


// Get all unique specializations
const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    return res.status(200).json(specializations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to get specializations");
  }
};

// Filter doctors by specialization
const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    const doctors = await Doctor.find({ 
      specialization,
      isAvailable: true 
    }).populate("userId");
    
    return res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to filter doctors");
  }
};
// Update the exports at the bottom
module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
  getDoctorAvailability,  // Make sure this is included
  setDoctorUnavailable,
  
  setDoctorAvailable, getAllSpecializations,
  getDoctorsBySpecialization
  
};