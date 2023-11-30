let dbConnect = (cb) => {
  const mongoose = require('mongoose');

  mongoose.set("strictQuery", false)

  mongoose.connect(`mongodb+srv://root:marti08139110216@cluster0.rfmio2q.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`).then(() => {
    console.log("connection successful");
    cb()
  }).catch((error) => {
    console.log(error);
  });

}

module.exports = dbConnect


