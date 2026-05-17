const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      "Plumbing",
      "Electrical",
      "Painting",
      "Joinery",
      "Carpentry",
      "Roofing",
      "Landscaping",
      "Other",
    ],
    default: "Other",
  },
  location: {
    type: String,
    trim: true,
  },
  contactName: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: "Please enter a valid email address",
    },
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed"],
    default: "Open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobRequest", jobRequestSchema);
