const Offer = require('../model/offerModei');
const userDb = require('../model/userModel');
const Car = require('../model/carModel');

const { createOfferSchema, updateOfferSchema } = require('../validation/offerValidation');


// video upload function start 
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});
// upload image Start
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images/image",
        allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
    },
});
const upload = multer({ storage: storage })
// upload image End


const createOffer = async (req, res) => {
    try {
        const { error } = createOfferSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { user, car, amount, description } = req.body;
        let image = "";

        if (req.file) {
            image = req.file.path;
        }

        const checkUser = await userDb.findById(user);
        if (!checkUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const checkCar = await Car.findById(car);
        if (!checkCar) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
        }
        const offer = new Offer({
            user,
            car,
            image,
            amount,
            description,
        });
        await offer.save();

        res.status(201).json({
            status: 201,
            message: 'Offer created successfully',
            offer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create offer' });
    }
};



const getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.status(200).json({ status: 200, offers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
};



// const updateOffer = async (req, res) => {
//     try {
//         const { error } = updateOfferSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }

//         const offerId = req.params.offerId;

//         const existingOffer = await Offer.findById(offerId);
//         if (!existingOffer) {
//             return res.status(404).json({ status: 404, message: 'Offer not found' });
//         }

//         const fieldsToUpdate = {};

//         if (req.body.user) {
//             const checkUser = await userDb.findById(req.body.user);
//             if (!checkUser) {
//                 return res.status(404).json({ status: 404, message: 'User not found' });
//             }
//             fieldsToUpdate.user = req.body.user;
//         }

//         if (req.body.car) {
//             const checkCar = await Car.findById(req.body.car);
//             if (!checkCar) {
//                 return res.status(404).json({ status: 404, message: 'Car not found' });
//             }
//             fieldsToUpdate.car = req.body.car;
//         }

//         if (req.body.amount) {
//             fieldsToUpdate.amount = req.body.amount;
//         }

//         if (req.body.description) {
//             fieldsToUpdate.description = req.body.description;
//         }

//         if (req.file) {
//             fieldsToUpdate.image = req.file.path;
//         }

//         Object.assign(existingOffer, fieldsToUpdate);

//         await existingOffer.save();

//         res.status(200).json({
//             status: 200,
//             message: 'Offer updated successfully',
//             offer: existingOffer,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to update offer' });
//     }
// };






module.exports = {
    createOffer,
    upload,
    getAllOffers,
    // updateOffer
};
