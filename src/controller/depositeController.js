const SecurityDeposit = require('../model/depositeModel');
const User = require('../model/userModel');

const { createSecurityDepositValidationSchema } = require('../validation/depositeValidation');



const createSecurityDeposit = async (req, res) => {
    try {
        const { error } = createSecurityDepositValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }
        const { amount, biddingLimit } = req.body;
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const securityDeposit = new SecurityDeposit({
            user: userId,
            amount,
            biddingLimit
        });

        await securityDeposit.save();

        res.status(201).json({ status: 201, message: 'Security deposit created successfully', data: securityDeposit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Failed to create security deposit' });
    }
};



const buySecurityDeposit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { securityDepositId } = req.body

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }
        const securityDeposit = await SecurityDeposit.findById(securityDepositId);
        if (!securityDeposit) {
            return res.status(404).json({ status: 404, message: 'Security deposit not found' });
        }

        if (user.balance < securityDeposit.amount) {
            return res.status(400).json({ status: 400, message: 'Insufficient balance' });
        }

        user.balance -= securityDeposit.amount;
        securityDeposit.isBought = true;
        await Promise.all([user.save(), securityDeposit.save()]);

        res.status(200).json({ status: 200, message: 'Security deposit bought successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to buy security deposit' });
    }
};





module.exports = {
    createSecurityDeposit,
    buySecurityDeposit
};
