const adminAuth = (req, res, next) => {
  //Login for If the admin Authorized or not
  const token = 'abcd';
  const isAuthenticate = token === 'abcd';

  if (isAuthenticate) {
     next();
  } else {
    res.status(404).send("UnAuthorized request!");
  }
}

const userAuth = (req, res, next) => {
  //Login for If the admin Authorized or not
  const token = 'abcd';
  const isAuthenticate = token === 'abcd';

  if (isAuthenticate) {
     next();
  } else {
    res.status(404).send("UnAuthorized request!");
  }
}


module.exports = {
  adminAuth,
  userAuth
}