require('dotenv').config()
const vendorDb = require('../model/vendorModel');
const City = require('../model/cityModel');
const Car = require('../model/carModel');
const Auction = require('../model/auctionModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');

const { signupValidationSchema, addToFavouritesSchema, workProfileUpdateSchema, documentsUpdateSchema } = require('../validation/vendorValidation');


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



const signup = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, password, confirmPassword } = req.body;
        const { error } = signupValidationSchema.validate({
            fullName,
            email,
            mobileNumber,
        });
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        if (!isValidBody(req.body)) {
            return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        }
        if (!nameRegex.test(fullName)) {
            return res.status(406).json({ status: 406, message: "First name is not valid" });
        }
        if (!isValid(fullName)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
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
        const existingMobile = await vendorDb.findOne({ mobileNumber })
        if (existingMobile) {
            return res.status(400).json({ status: 400, message: "Mobile Number already exists" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(406).json({ status: 406, message: "Password is not valid" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: 400, message: "Password and Confirm Password must match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await vendorDb.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "Email already exists" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new vendorDb({
            fullName,
            email,
            mobileNumber,
            password: hashedPassword,
            otp,
            documents: {
                phone: '...',
                email: '...',
                name: '...',
            },
        });

        await user.save();

        //nodemailer
        const mailOptions = {
            from: 'princegap001@gmail.com',
            to: email,
            subject: 'OTP for Signup',
            text: `Your OTP for signup is: ${otp}`
        };
        console.log("mailoptions", mailOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP via email:', error);
                res.status(500).json({ error: 'Failed to send OTP via email' });
            } else {
                console.log('OTP sent successfully via email:', info.response);
                res.status(201).json({ status: 201, message: 'Signup successful', user });
            }
        });

        // twilio
        twilioClient.messages
            .create({
                body: `Your OTP for signup is: ${otp}`,
                from: '+15739833421',
                to: "+91" + mobileNumber,
            })
            .then((message) => {
                console.log(`SMS sent with SID: ${message.sid}`);
                res.status(201).json({ status: 201, message: "Signup successful", user, /*token*/ });
            })
            .catch((error) => {
                console.error('Error sending SMS:', error);
                res.status(500).json({ error: 'Failed to send OTP via SMS' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};


const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        const user = await vendorDb.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }
        user.isVerified = true;
        await user.save();

        res.status(200).json({ status: 200, message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
};


const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        const user = await vendorDb.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: 'princegap001@gmail.com',
            to: email,
            subject: 'OTP for Signup',
            text: `Your OTP for signup is: ${otp}`
        };
        console.log("mailoptions", mailOptions);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP via email:', error);
                res.status(500).json({ error: 'Failed to send OTP via email' });
            } else {
                console.log('OTP sent successfully via email:', info.response);
                // res.status(201).json({ status: 201, message: 'Signup successful', user });
                sendOtpViaSMS(user.mobileNumber, otp, res);
            }

        });

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


const loginWithMobile = async (req, res) => {
    try {
        const data = req.body;
        const { mobileNumber, otp } = data;
        if (!isValidBody(data)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        if (!isValid(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is required" });
        }
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(406).json({ status: 406, message: "Mobile Number is not valid" });
        }
        if (!isValid(otp)) return res.status(400).json({ status: 400, message: "Otp is required" });

        const user = await vendorDb.findOne({ mobileNumber });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid mobileNumber" });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }
        user.isVerified = true;

        const availableCities = await City.find();

        const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET_KEY);

        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: { user, token, availableCities },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};


const loginWithEmail = async (req, res) => {
    try {
        const data = req.body;
        const { email, password, otp } = data;
        if (!isValidBody(data)) return res.status(400).json({ status: 400, message: "Body can't be empty, please enter some data" });
        if (!isValid(email)) {
            return res.status(400).json({ status: 400, message: "Email is required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(406).json({ status: 406, message: "Email Id is not valid" });
        }
        if (!isValid(otp)) return res.status(400).json({ status: 400, message: "Otp is required" });
        // const existingUser = await vendorDb.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ status: 400, message: "Email already exists" });
        // }
        if (!passwordRegex.test(password)) {
            return res.status(406).json({ status: 406, message: "Password is not valid" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ status: 400, message: "Password and Confirm Password must match" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await vendorDb.findOne({ mobileNumber });
        if (!user) {
            return res.status(401).json({ status: 401, message: "Invalid mobileNumber" });
        }
        if (user.otp !== otp) {
            return res.status(401).json({ status: 401, message: "Invalid OTP" });
        }
        user.isVerified = true;

        const availableCities = await City.find();

        const token = jwt.sign({ userId: user._id }, process.env.USER_SECRET_KEY);

        await user.save();

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: { user, token, availableCities },
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
        const user = await vendorDb.findById(userId);
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
        const user = await vendorDb.findById(userId);
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


const updateWorkProfile = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { workProfile } = req.body;

        if (!workProfile) {
            return res.status(400).json({ status: 400, message: 'workProfile is required' });
        }
        const { error } = workProfileUpdateSchema.validate(workProfile);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const checkCity = await City.findById(workProfile.selectYourCity);
        console.log("checkcity", checkCity);
        if (!checkCity) {
            return res.status(404).json({ status: 404, message: 'City not found' });
        }

        const vendor = await vendorDb.findByIdAndUpdate(
            vendorId,
            { workProfile },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ status: 404, message: 'Vendor not found' });
        }

        res.status(200).json({ status: 200, message: 'Work profile updated successfully', vendor });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update work profile' });
    }
};


const updateDocuments = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { documents } = req.body;

        if (!documents) {
            return res.status(400).json({ status: 400, message: 'Documents data is required' });
        }

        const { error } = documentsUpdateSchema.validate(documents);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const vendor = await vendorDb.findByIdAndUpdate(
            vendorId,
            { documents },
            { new: true }
        );

        if (!vendor) {
            return res.status(404).json({ status: 404, message: 'Vendor not found' });
        }

        res.status(200).json({ status: 200, message: 'Documents updated successfully', vendor });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update documents' });
    }
};










module.exports = {
    signup,
    verifyOTP,
    resendOTP,
    loginWithMobile,
    loginWithEmail,
    selectCity,
    addToFavourites,
    updateWorkProfile,
    updateDocuments
};