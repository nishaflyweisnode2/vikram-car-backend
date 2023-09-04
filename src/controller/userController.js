require('dotenv').config()
const userDb = require('../model/userModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const Auction = require('../model/auctionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const { addToFavouritesSchema, addMyBidSchema, getMyWinsSchema } = require('../validation/uservalidation');


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
const upload = multer({ storage: storage }).array('profileImage', 2);
// const upload = multer({ storage: storage, fieldname: 'profileImage' });

// upload image End


// const signup = async (req, res) => {
//     const { fullName, email, mobileNumber } = req.body;

//     try {
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
//         const existingMobile = await userDb.findOne({ mobileNumber })
//         if (existingMobile) {
//             return res.status(400).json({ status: 400, message: "Mobile Number already exists" });
//         }
//         const existingUser = await userDb.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ status: 400, message: "Email already exists" });
//         }

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();

//         const user = new userDb({
//             fullName,
//             email,
//             mobileNumber,
//             otp,
//             profileImage: '.',
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
//         // twilioClient.messages
//         //     .create({
//         //         body: `Your OTP for signup is: ${otp}`,
//         //         from: '+15739833421',
//         //         to: "+91" + mobileNumber,
//         //     })
//         //     .then((message) => {
//         //         console.log(`SMS sent with SID: ${message.sid}`);
//         //         res.status(201).json({ status: 201, message: "Signup successful", user, /*token*/ });
//         //     })
//         //     .catch((error) => {
//         //         console.error('Error sending SMS:', error);
//         //         res.status(500).json({ error: 'Failed to send OTP via SMS' });
//         //     });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to create user' });
//     }
// };

const signup = async (req, res) => {
    const { fullName, email, mobileNumber } = req.body;

    try {
        if (!isValidBody(req.body)) {
            return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        }
        if (!nameRegex.test(fullName)) {
            return res.status(406).json({ status: 406, message: "First name is not valid" });
        }
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        if (!isValid(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is required" });
        }
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is not valid" });
        }
        const existingMobile = await userDb.findOne({ mobileNumber })
        if (existingMobile) {
            return res.status(400).json({ status: 400, message: "Mobile Number already exists" });
        }
        const existingUser = await userDb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new userDb({
            fullName,
            email,
            mobileNumber,
            otp,
            profileImage: '.',
        });

        await user.save();

        // Commenting out the email sending logic
        // const mailOptions = {
        //     from: 'princegap001@gmail.com',
        //     to: email,
        //     subject: 'OTP for Signup',
        //     text: `Your OTP for signup is: ${otp}`
        // };
        // console.log("mailoptions", mailOptions);
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending OTP via email:', error);
        //         res.status(500).json({ error: 'Failed to send OTP via email' });
        //     } else {
        //         console.log('OTP sent successfully via email:', info.response);
        //         res.status(201).json({ status: 201, message: 'Signup successful', user });
        //     }
        // });

        res.status(201).json({ status: 201, message: 'Signup successful', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};


const verifyOTP = async (req, res) => {
    const UserId = req.params.userId
    const { otp } = req.body;

    try {
        const user = await userDb.findOne({ UserId });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }
        const payload = {
            userId: user._id,
            userType: user.userType,
        };
        const token = jwt.sign(payload, process.env.USER_SECRET_KEY);

        user.isVerified = true;
        await user.save();

        res.status(200).json({ status: 200, message: "OTP verified successfully", data: { token, user } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


// const resendOTP = async (req, res) => {
//     const { email } = req.body;

//     try {
//         if (!isValid(email)) {
//             return res.status(400).json({ status: 400, message: "Email is required" });
//         }
//         if (!emailRegex.test(email)) {
//             return res.status(406).json({ status: 406, message: "Email Id is not valid" });
//         }
//         const user = await userDb.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ status: 404, message: "User not found" });
//         }
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         user.otp = otp;
//         await user.save();

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
//                 // res.status(201).json({ status: 201, message: 'Signup successful', user });
//                 // sendOtpViaSMS(user.mobileNumber, otp, res);
//             }

//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to resend OTP' });
//     }
// };


const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        const user = await userDb.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        res.status(200).json({ status: 200, message: 'Resend OTP generated sucessfully', data: user.otp });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
};



const sendOtpViaSMS = (mobileNumber, otp, res) => {
    twilioClient.messages
        .create({
            body: `Your new OTP for signup is: ${otp}`,
            from: '+15739833421',
            to: "+91" + mobileNumber,
        })
        .then((message) => {
            console.log(`SMS sent with SID: ${message.sid}`);
            res.status(200).json({ status: 200, message: "OTP resent successfully" });
        })
        .catch((error) => {
            console.error('Error sending SMS:', error);
            res.status(500).json({ error: 'Failed to resend OTP via SMS' });
        });
};


// const login = async (req, res) => {
//   try {
//     const data = req.body;
//     const { mobileNumber, otp } = data;
//     if (!isValidBody(data)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
//     if (!isValid(mobileNumber)) {
//       return res.status(406).json({ status: 406, message: "Mobile Number is required" });
//     }
//     if (!mobileRegex.test(mobileNumber)) {
//       return res.status(406).json({ status: 406, message: "Mobile Number is not valid" });
//     }
//     if (!isValid(otp)) return res.status(400).json({ status: 400, message: "Otp is required" });

//     const user = await userDb.findOne({ mobileNumber });
//     if (!user) {
//       return res.status(401).json({ status: 401, message: "Invalid mobileNumber" });
//     }
//     if (user.otp !== otp) {
//       return res.status(401).json({ status: 401, message: "Invalid OTP" });
//     }
//     user.isVerified = true;
//     const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET_KEY);

//     // Fetch the list of available cities from the database or any data source
//     const availableCities = await fetchAvailableCities(); // Replace this with your actual data retrieval logic

//     await user.save();

//     return res.status(200).json({
//       status: 200,
//       message: "Login successful",
//       data: { user, token, availableCities }, // Include availableCities in the response
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Something went wrong' });
//   }
// };


const login = async (req, res) => {
    try {
        const data = req.body;
        const { mobileNumber } = data;
        if (!isValidBody(data)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        if (!isValid(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is required" });
        }
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is not valid" });
        }
        const user = await userDb.findOne({ mobileNumber });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid mobileNumber" });
        }
        user.isVerified = true;

        const availableCities = await City.find();


        await user.save();

        const obj = {
            ID: user._id,
            OTP: user.otp,
            mobileNumber: user.mobileNumber
        }

        return res.status(200).json({
            status: 200,
            message: "Sent OTP in Your Mobile",
            data: obj
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};




const selectCity = async (req, res) => {
    const { userId, selectedCityId } = req.body;
    try {
        if (!isValidBody(req.body)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        if (!isValid(userId)) {
            return res.status(406).json({ status: 406, message: "UserId is required" });
        }
        if (!isValid(selectedCityId)) {
            return res.status(406).json({ status: 406, message: "selectedId is required" });
        }
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        const selectedCity = await City.findById(selectedCityId);
        if (!selectedCity) {
            return res.status(404).json({ status: 404, message: "Selected city not found" });
        }

        user.selectedCity = selectedCity;
        await user.save();

        return res.status(200).json({ status: 200, message: "City selection saved successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to save city selection' });
    }
};



const addToFavourites = async (req, res) => {
    try {
        const { error } = addToFavouritesSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const { carId } = req.body;
        const userId = req.params.userId;
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
        }
        const user = await userDb.findById(userId);
        console.log("userid", userId);
        if (!user || user.length === 0) {
            return res.status(404).json({ status: 404, message: 'No user found for this userId' });
        }
        if (user.favouriteCars.includes(carId)) {
            return res.status(400).json({ status: 400, message: 'Car is already in your favorites' });
        }
        user.favouriteCars.push(carId);
        await user.save();

        res.status(200).json({ status: 200, message: 'Car added to favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add car to favorites' });
    }
};


const addMyBid = async (req, res) => {
    try {
        const { error } = addMyBidSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { auctionId, bidAmount } = req.body;
        const userId = req.params.userId;
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({ status: 404, message: 'Auction not found' });
        }
        const user = await userDb.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const carId = auction.car
        const checkCar = await Car.findById(carId)
        if (!checkCar) {
            return res.status(404).json({ status: 404, message: 'Car not found' });
        }
        const winnerId = auction.winner.toString();
        if (winnerId !== userId) {
            return res.status(404).json({ status: 404, message: 'User not found in auction' });
        }
        const existingBid = user.myBids.find((bid) => bid.car.toString() === carId.toString() && bid.auction.toString() === auctionId);
        console.log("existingBid", existingBid);
        if (existingBid) {
            return res.status(400).json({ status: 400, message: 'You have already placed a bid on this auction' });
        }
        if (bidAmount <= auction.highestBid) {
            return res.status(400).json({ status: 400, message: 'Your bid amount must be greater than the current highest bid' });
        }
        const newBid = {
            auction: auctionId,
            car: carId,
            bidAmount,
        };
        user.myBids.push(newBid);
        await user.save();

        res.status(200).json({ status: 200, message: 'Bid added successfully', bid: newBid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add bid' });
    }
};



// const getMyWins = async (req, res) => {
//     try {
//         const { error } = getMyWinsSchema.validate(req.params);
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }
//         const userId = req.params.userId;
//         const user = await userDb.findById(userId).populate({
//             path: 'myBids.auction',
//             populate: {
//                 path: 'car',
//                 model: 'Car',
//             },
//         });
//         if (!user) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }
//         const myWins = user.myBids.filter((bid) => bid.auction && bid.auction.winner && bid.auction.winner.toString() === userId);

//         res.status(200).json({ status: 200, wins: myWins });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch user wins' });
//     }
// };



const getMyWins = async (req, res) => {
    try {
        const { error } = getMyWinsSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const userId = req.params.userId;
        const user = await userDb.findById(userId).populate({
            path: 'myBids.auction',
            // populate: {
            //   path: 'car',
            //   model: 'Car',
            // },
        });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const myWins = user.myBids.filter((bid) => bid.auction && bid.auction.winner && bid.auction.winner.toString() === userId);
        const carIds = myWins.map((bid) => bid.car.toString());
        const cars = await Car.find({ _id: { $in: carIds } });

        res.status(200).json({ status: 200, wins: myWins, carIds, cars });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user wins' });
    }
};


const updateProfileImage = async (req, res) => {
    try {
        await upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ error: 'Error uploading Profile image', err });
            } else if (err) {
                return res.status(500).json({ error: 'An unknown error occurred', err });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: 400, message: 'No Profile image uploaded' });
            }

            const imageUrl = req.files[0].path;
            const userId = req.params.userId;

            const user = await userDb.findByIdAndUpdate(
                userId,
                { $push: { profileImage: { $each: [imageUrl], $position: 0 } } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ status: 404, message: 'User not found' });
            }

            const updatedProfileImages = user.profileImage || [];
            if (updatedProfileImages.length > 2) {
                return res.status(400).json({ status: 400, message: 'Maximum limit of 2 Profile images reached' });
            }

            return res.status(200).json({
                status: 200,
                message: 'Profile image updated successfully',
                user
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update Profile image' });
    }
};







module.exports = {
    signup,
    verifyOTP,
    resendOTP,
    login,
    selectCity,
    addToFavourites,
    addMyBid,
    getMyWins,
    updateProfileImage
};