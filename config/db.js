const mongoose = require('mongoose')

exports.DBConnection = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
      console.log('DB connected')
    })
    .catch((error)=>{
      console.log('error connection to DB')
    });
};