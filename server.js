const express = require("express");
require('dotenv').config();
const app = express()
const port = process.env.PORT;
const {DBConnection} = require("./config/db");
const budgetRoutes = require('./routes/budgetRoutes')
const morgan = require("morgan")
const cors = require("cors")

if(process.env.MODE === 'development') app.use(morgan('dev'))

DBConnection();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/v1/budget', budgetRoutes);

app.listen(port,()=>{
  console.log('app is listening')
});

module.exports = app;