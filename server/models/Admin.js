import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },

  role: { type: String, default: "admin" },

  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageBooks: { type: Boolean, default: true },
    manageRequests: { type: Boolean, default: true },
    manageReports: { type: Boolean, default: true }
  },

  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },

  security: {
    failedLogins: { type: Number, default: 0 },
    lockUntil: { type: Date }
  },

  activityLogs: [
    {
      action: String,
      details: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.model("Admin", adminSchema);
