const mongoose = require('mongoose');

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://DevTinderProject:UM1p5bUmJ06PUuDt@cluster0.eqbstqy.mongodb.net/devTinder"
  )
}

module.exports = {
  connectDb
}