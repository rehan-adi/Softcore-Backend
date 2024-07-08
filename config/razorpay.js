import Razorpay from 'razorpay';

const instance = new Razorpay({
  key_id: 'rzp_test_123',
  key_secret: 'secret',
});

export default instance;
