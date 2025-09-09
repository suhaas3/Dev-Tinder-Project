const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50
  },
  lastName: {
    type: String
  },
  emailId: {
    type: String,
    lowercase: true, // Always convert `test` to lowercase
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 18
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("gender error :" + value);
      }
    }
  },
  about: {
    type: String,
    default: "This is default description",
  },
  skills: {
    type: [String]
  }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);