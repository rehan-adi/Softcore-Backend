import razorpay from '../config/razorpay.js';
import userModel from '../models/Blog_user.model.js';
import crypto from 'crypto';
import paymentModel from '../models/payment.model.js';

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: Number(amount * 100),
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ data: order });
    console.log(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error!', error: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest('hex');

    const isAuthentic = expectedSign === razorpay_signature;

    // Condition
    if (isAuthentic) {
      const payment = new paymentModel({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      // Save Payment
      await payment.save();

      res.json({
        message: 'Payement Successfully',
      });
    }
  } catch (error) {
    console.error('Error updating premium status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
