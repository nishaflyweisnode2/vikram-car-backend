require('dotenv').config()
const vendorDb = require('../model/vendorModel');
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const Auction = require('../model/auctionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const LimitModel = require('../model/limitModel');
const mongoose = require('mongoose');


const { signupValidationSchema, addToFavouritesSchema, workProfileUpdateSchema, documentsUpdateSchema, searchValidationSchema } = require('../validation/vendorValidation');


const { nameRegex, passwordRegex, emailRegex, mobileRegex, objectId, isValidBody, isValid, isValidField } = require('../validation/commonValidation')

// twilio start
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);
// teilio end

// nodemailer start
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});


// image upload function start 
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
const upload = multer({ storage: storage }).array('panCardImage', 3);
const upload1 = multer({ storage: storage }).array('aadharCardImage', 3);
const upload2 = multer({ storage: storage }).array('otherDocumentImage', 3);
// upload image End


// const signup = async (req, res) => {
//     try {
//         const { fullName, email, mobileNumber, password, confirmPassword } = req.body;
//         const { error } = signupValidationSchema.validate({
//             fullName,
//             email,
//             mobileNumber,
//         });
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }
//         if (!isValidBody(req.body)) {
//             return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
//         }
//         if (!nameRegex.test(fullName)) {
//             return res.status(406).json({ status: 406, message: "First name is not valid" });
//         }
//         if (!isValid(fullName)) {
//             return res.status(400).json({ status: 400, message: "Email is required" });
//         }
//         if (!isValid(email)) {
//             return res.status(400).json({ status: 400, message: "Email is required" });
//         }
//         if (!emailRegex.test(email)) {
//             return res.status(406).json({ status: 406, message: "Email Id is not valid" });
//         }
//         if (!isValid(mobileNumber)) {
//             return res.status(406).json({ status: 406, message: "Mobile Number is required" });
//         }
//         if (!mobileRegex.test(mobileNumber)) {
//             return res.status(406).json({ status: 406, message: "Mobile Number is not valid" });
//         }
//         const existingMobile = await vendorDb.findOne({ mobileNumber })
//         if (existingMobile) {
//             return res.status(400).json({ status: 400, message: "Mobile Number already exists" });
//         }
//         if (!passwordRegex.test(password)) {
//             return res.status(406).json({ status: 406, message: "Password is not valid" });
//         }
//         if (password !== confirmPassword) {
//             return res.status(400).json({ status: 400, message: "Password and Confirm Password must match" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const existingUser = await vendorDb.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ status: 400, message: "Email already exists" });
//         }

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         const user = new vendorDb({
//             fullName,
//             email,
//             mobileNumber,
//             password: hashedPassword,
//             otp,
//             documents: {
//                 phone: '...',
//                 email: '...',
//                 name: '...',
//             },
//         });

//         await user.save();

//         //nodemailer
//         const mailOptions = {
//             from: 'princegap001@gmail.com',
//             to: email,
//             subject: 'OTP for Signup',
//             text: `Your OTP for signup is: ${otp}`
//         };
//         console.log("mailoptions", mailOptions);

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending OTP via email:', error);
//                 res.status(500).json({ error: 'Failed to send OTP via email' });
//             } else {
//                 console.log('OTP sent successfully via email:', info.response);
//                 res.status(201).json({ status: 201, message: 'Signup successful', user });
//             }
//         });

//         // twilio
//         twilioClient.messages
//             .create({
//                 body: `Your OTP for signup is: ${otp}`,
//                 from: '+15739833421',
//                 to: "+91" + mobileNumber,
//             })
//             .then((message) => {
//                 console.log(`SMS sent with SID: ${message.sid}`);
//                 res.status(201).json({ status: 201, message: "Signup successful", user, /*token*/ });
//             })
//             .catch((error) => {
//                 console.error('Error sending SMS:', error);
//                 res.status(500).json({ error: 'Failed to send OTP via SMS' });
//             });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to create user' });
//     }
// };


exports.signup = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const { error } = signupValidationSchema.validate({
            email,
            password,
            confirmPassword
        });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        if (!isValidBody(req.body)) {
            return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        }
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }

        let hashedPassword = null;
        if (password && confirmPassword) {
            if (!passwordRegex.test(password)) {
                return res.status(406).json({ status: 406, message: "Password is not valid" });
            }
            if (password !== confirmPassword) {
                return res.status(400).json({ status: 400, message: "Password and Confirm Password must match" });
            }
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const existingUser = await vendorDb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new vendorDb({
            email,
            password: hashedPassword,
            otp,
        });

        await user.save();

        return res.status(201).json({ status: 201, message: 'Signup successful', user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
};


exports.loginWithEmail = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;
        if (!isValidBody(data)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(406).json({ status: 406, message: "Password is not valid" });
        }

        const user = await vendorDb.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid Email ID" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: 401, message: "Invalid Password" });
        }

        user.isVerified = true;

        const payload = {
            _id: user._id,
        };
        const token = jwt.sign(payload, process.env.VENDOR_SECRET_KEY/*, { expiresIn: '1h' }*/);
        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: { token, user, },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};


exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        if (!cars) {
            return res.status(404).json({ status: 404, message: 'No car found' })
        }
        return res.status(200).json({
            status: 200,
            message: 'Successfully retrieved all cars',
            cars,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve cars' });
    }
};


exports.getNewCars = async (req, res) => {
    try {
        const newCars = await Car.find().sort({ createdAt: -1 });

        return res.status(200).json({
            status: 200,
            message: 'Successfully retrieved new cars',
            newCars,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve new cars' });
    }
};


exports.getUsedCars = async (req, res) => {
    try {
        const usedCars = await Car.find({ isUsed: true }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: 200,
            message: 'Successfully retrieved used cars',
            usedCars,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve used cars' });
    }
};


exports.searchCars = async (req, res) => {
    try {
        const { error } = searchValidationSchema.validate(req.query);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { category, brand, model, location, pricerange } = req.query;
        let query = {};

        if (category === 'NewCar') {
            query.isUsed = false;
        } else if (category === 'UsedCar') {
            query.isUsed = true;
        }
        if (brand) {
            const foundBrand = await Car.findOne({ "brand.name": brand });
            if (!foundBrand) {
                return res.status(404).json({ status: 404, message: 'Brand not found' });
            }
            query.brand = foundBrand.brand;
        }
        if (model) {
            query.model = model;
        }
        if (location) {
            query.city = location;
        }
        if (pricerange) {
            const [minPrice, maxPrice] = pricerange.split('-').map(Number);
            query.price = { $gte: minPrice, $lte: maxPrice };
        }
        const cars = await Car.find(query).populate('brand').exec();
        if (!cars || cars.length === 0) {
            return res.status(404).json({ status: 404, message: 'No cars found' });
        }
        return res.status(200).json({
            status: 200,
            message: 'Car search results',
            cars,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search for cars' });
    }
};


exports.getAllUser = async (req, res) => {
    try {
        const user = await userDb.find();
        if (!user) {
            return res.status(404).json({ status: 404, message: 'No User found' })
        }
        return res.status(200).json({
            status: 200,
            message: 'Successfully retrieved all user',
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve user' });
    }
};


exports.getLatestUser = async (req, res) => {
    try {
        const latestUser = await userDb.find().sort({ createdAt: -1 }).limit(100);

        if (!latestUser || latestUser.length === 0) {
            return res.status(404).json({ status: 404, message: 'No user found' });
        }

        return res.status(200).json({
            status: 200,
            message: 'Successfully retrieved the latest user',
            user: latestUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve the latest user' });
    }
};


exports.getAllCity = async (req, res) => {
    try {
        const cities = await City.find();
        if (!cities || cities.length === 0) {
            return res.status(404).json({ status: 404, message: "No cities found" });
        }

        return res.status(200).json({ status: 200, data: cities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch cities' });
    }
};


exports.createLimit = async (req, res) => {
    try {
        const { from, to, limit } = req.body;

        const limitInstance = new LimitModel({ from, to, limit });
        const validationError = limitInstance.validateSync();
        if (validationError) {
            return res.status(400).json({ status: 400, message: validationError.message });
        }

        await limitInstance.save();

        return res.status(201).json({ status: 201, message: 'Limit created successfully', data: limitInstance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Failed to create limit' });
    }
};

exports.getLimits = async (req, res) => {
    try {
        const limits = await LimitModel.find();

        return res.status(200).json({ status: 200, data: limits });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Failed to retrieve limits' });
    }
};

exports.updateLimit = async (req, res) => {
    try {
        const limitId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(limitId)) {
            return res.status(400).json({ status: 400, message: 'Invalid limit ID format' });
        }

        const { from, to, limit } = req.body;

        const limitInstance = new LimitModel({ from, to, limit });
        const validationError = limitInstance.validateSync();
        if (validationError) {
            return res.status(400).json({ status: 400, message: validationError.message });
        }

        const updatedLimit = await LimitModel.findByIdAndUpdate(
            limitId,
            { from, to, limit },
            { new: true }
        );

        if (!updatedLimit) {
            return res.status(404).json({ status: 404, message: 'No limit found for the given ID' });
        }

        return res.status(200).json({ status: 200, message: 'Limit updated successfully', data: updatedLimit });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Failed to update limit' });
    }
};

exports.deleteLimit = async (req, res) => {
    try {
        const limitId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(limitId)) {
            return res.status(400).json({ status: 400, message: 'Invalid limit ID format' });
        }

        const deletedLimit = await LimitModel.findByIdAndDelete(limitId);

        if (!deletedLimit) {
            return res.status(404).json({ status: 404, message: 'No limit found for the given ID' });
        }

        return res.status(200).json({ status: 200, message: 'Limit deleted successfully', data: deletedLimit });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: 'Failed to delete limit' });
    }
};








