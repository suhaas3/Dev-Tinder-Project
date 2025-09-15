const validator = require('validator');
const User = require('../models/user');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("please enter a strong password!")
  }
}

const validateEditData = (req) => {
  const allowedUpdates = ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"];

  const isAllowedEdit = Object.keys(req.body).every((k) => allowedUpdates.includes(k));

  return isAllowedEdit;
}

const validateEditPassword = (req) => {
  const allowedEditFields = ["password"];

  const isEditPassword = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k)
  )

  return isEditPassword;
}

const validateEmailForPasswordChange = async (req) => {

  try {
    const { emailId } = req.body;

     if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid!");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Not found mail!");
    }

    req.user = user;
  } catch (err) {
    res.status(400).send("ERROR: "+err.message);
  }
}

module.exports = {
  validateSignUpData,
  validateEditData,
  validateEditPassword,
  validateEmailForPasswordChange
}