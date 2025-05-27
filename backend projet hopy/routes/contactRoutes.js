// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  sendContactMessage,
  getAllContactMessages,
  getContactMessage,
  markAsRead,
  deleteContactMessage,
} = require("../controllers/contactController");

// Public route - no auth required to send message
router.post("/", sendContactMessage);

// Protected routes - require admin auth
router.get("/", auth, getAllContactMessages);
router.get("/:id", auth, getContactMessage);
router.put("/:id/read", auth, markAsRead);
router.delete("/:id", auth, deleteContactMessage);

module.exports = router;