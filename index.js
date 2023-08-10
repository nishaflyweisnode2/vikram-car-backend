require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const routes = require('./src/routes/userRoutes');
const carRoutes = require('./src/routes/carRoutes');
const auctionRoutes = require('./src/routes/auctionRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const sellCarRoutes = require('./src/routes/sellCarRoutes');
const rtoServiceRoutes = require('./src/routes/rtoServiceRoutes');
const transportRoutes = require('./src/routes/transportRoutes');
const spareRoutes = require('./src/routes/spareRoutes');
const contactUsRoutes = require('./src/routes/contactUsRoutes');
const requestCallBackRoutes = require('./src/routes/requestCallBackRoutes');
const termAndConditionRoutes = require('./src/routes/termAndConditionRoutes');
const subscriptionRoutes = require('./src/routes/suscriptionRoutes');
const offerRoutes = require('./src/routes/offerRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');
const depositeRoutes = require('./src/routes/depositeRoutes');



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
app.use('/brand', brandRoutes);
app.use('/sellCar', sellCarRoutes);
app.use('/rtoService', rtoServiceRoutes);
app.use('/transport', transportRoutes);
app.use('/spare', spareRoutes);
app.use('/contactUs', contactUsRoutes);
app.use('/callBack', requestCallBackRoutes);
app.use('/condition', termAndConditionRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/offer', offerRoutes);
app.use('/vendor', vendorRoutes);
app.use('/deposite', depositeRoutes);





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
