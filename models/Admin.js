const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    JobName: {
      type: String,
      required: true,
    },
    JobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String, 
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    staff: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    qualification: {
      type: Array,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
