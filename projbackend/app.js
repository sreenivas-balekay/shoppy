require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// my routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

//DB connect
mongoose.connect(process.env.DATABASE, {})
.then(() => {
    console.log('DB is Connected')
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);


// port
const port = process.env.PORT || 8000;

// starting a server

app.listen(port, () => {
    console.log('port is listning 8000');
})
