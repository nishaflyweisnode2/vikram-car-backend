require('dotenv').config()
const Subscription = require('../model/subscriptionModel');
const userDb = require('../model/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { createSubscriptionSchema, buySubscriptionSchema } = require('../validation/subscriptionValidation');



const createSubscription = async (req, res) => {
    try {
        const { error } = createSubscriptionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { price, time, description } = req.body;

        const subscription = new Subscription({
            price,
            time,
            description
        });
        await subscription.save();

        res.status(201).json({
            status: 201,
            message: 'Subscription created successfully',
            subscription,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
};



// const buySubscription = async (req, res) => {
//     try {
//         const { error } = buySubscriptionSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ status: 400, message: error.details[0].message });
//         }
//         const { user, subscriptionId } = req.body;

//         const checkUser = await userDb.findById(user);
//         if (!checkUser) {
//             return res.status(404).json({ status: 404, message: 'User not found' });
//         }

//         const subscription = await Subscription.findById(subscriptionId);
//         if (!subscription) {
//             return res.status(404).json({ status: 404, message: 'Subscription not found' });
//         }

//         subscription.user = checkUser;
//         subscription.status = 'subscribed';
//         await subscription.save();

//         res.status(200).json({ status: 200, message: 'Subscription purchased successfully', subscription });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to purchase subscription' });
//     }
// };



const buySubscription = async (req, res) => {
    try {
        const { error } = buySubscriptionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { user, subscriptionId } = req.body;

        const checkUser = await userDb.findById(user);
        if (!checkUser) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ status: 404, message: 'Subscription not found' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: subscription.price * 100,
            currency: 'usd',
            metadata: {
                subscriptionId: subscriptionId,
                userId: checkUser._id
            }
        });

        subscription.user = checkUser;
        subscription.status = 'subscribed';
        await subscription.save();

        checkUser.subscription = subscriptionId;
        await checkUser.save();

        res.status(200).json({ status: 200, message: 'Subscription purchased successfully', subscription, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to purchase subscription' });
    }
};


const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ status: 'subscribed' }).populate('user');
        res.status(200).json({ status: 200, subscriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
};





module.exports = {
    createSubscription,
    buySubscription,
    getAllSubscriptions
};
