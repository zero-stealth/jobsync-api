const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    JobName: {
      type: String,
      required: true,
    },
    JobTitle: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String, 
    },
    description: {
      type: String,
    },
    staff: {
      type: String,
    },
    salary: {
      type: String,
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
    },
    qualification: {
      type: Array,
    },
    roles: {
      type: Array,
    },
    company: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
