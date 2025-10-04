const mongoose = require('mongoose');
const validator = require('validator');
const { default: isURL } = require('validator/lib/isURL');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        throw new Error('Invalid Email:' + value);
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
    type: [String],
    required: false,
    validate: {
      validator: function (val) {
        // If not provided, or empty, allow it
        if (!val || val.length === 0) return true;

        // Otherwise enforce 3–9 skills
        return Array.isArray(val) && val.length >= 3 && val.length <= 9;
      },
      message: "Skills must be between 3 and 9"
    }
  }


},
  { timestamps: true })

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJwt = async function () {

  const user = this;

  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$790", { expiresIn: '10h' });

  return token;
}

userSchema.methods.verifyPassword = async function (password) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(password, this.password);

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);