const validator = require('validator');

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

module.exports = {
  validateSignUpData,
  validateEditData
}