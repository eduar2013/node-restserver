require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/usuario'));


mongoose.connect(process.env.URLBD, (err, res) => {

    if (err) throw err;

    console.log("base de datos on LINE");

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto`, process.env.PORT);
})