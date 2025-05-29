import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nick_name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "employer"], default: "employee" },
  companyName: { type: String },
  country: { type: String, default: "" },
  language: { type: String, default: "" },
  photo: { type: String, default: "" },
  resume: { type: String, default: "" },
  resumeFile: {
    data: Buffer,
    contentType: String,
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  experiences: [
    {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      startDate: { type: String, default: "" },
      endDate: { type: String, default: "" },
      location: { type: String, default: "" }
    }
  ],
  savedJobs: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
  ],
  appliedJobs: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }
  ],
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
});

const User = mongoose.model("User", userSchema);
export default User;
