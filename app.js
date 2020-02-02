const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
require('dotenv/config');

//Route import
const authRoute = require('./routes/auth.js');
const artefactRoute = require('./routes/item.js');

//Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/artefact', artefactRoute);

//Routes

app.get('/', (req, res) => {
    res.send('this is from get request!')
});


//connect to DB
mongoose.connect(process.env.DB_CONNECTION, { autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true}).then(()=> console.log("Db Connect")).catch(err => console.log(err));

//port for server
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));