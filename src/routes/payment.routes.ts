import express from 'express';
import { createOrder, verifyOrder } from '../controllers/payment.js';

const paymentRoute = express.Router();

paymentRoute.post('/create-order', createOrder);
paymentRoute.post('/payment/success', verifyOrder);

export default paymentRoute;
