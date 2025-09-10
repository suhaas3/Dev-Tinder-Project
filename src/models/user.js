const mongoose = require('mongoose');
const validator = require('validator');
const { default: isURL } = require('validator/lib/isURL');

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
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email:'+value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Invalid password");
      }
    }
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
  photoUrl: {
    type: String,
    default: "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo URL");
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