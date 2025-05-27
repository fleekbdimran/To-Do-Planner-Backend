//Load environment variables first
require('dotenv').config();

const express = require('express');
const router = require('./src/routes/api');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MongoDB Connection
const userName = "chowdhuryimran262";
const password = "chowdhuryimran262";
const databaseName = "todoplanner";

const uri = `mongodb+srv://${userName}:${password}@cluster0.mmoqs.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;
const options = { autoIndex: true };

mongoose.connect(uri, options)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

//API Routes
app.use('/api/v1', router);

//Catch-all 404
app.use((req, res) => {
  res.status(200).send({ message: 'Not Found' });
});

module.exports = app;
