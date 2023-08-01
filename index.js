require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const routes = require('./src/routes/userRoutes');
const carRoutes = require('./src/routes/carRoutes')
const auctionRoutes = require('./src/routes/auctionRoutes')



const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URI = process.env.DB_URI;



mongoose.set('strictQuery', true)

app.get("/", (req, res) => {
    res.json("Hello !! TESTING DB Updated")
});


mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.use('/user', routes);
app.use('/car', carRoutes);
app.use('/auction', auctionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
