const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { authMiddleware } = require('../middleware/auth.middleware');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
// Create Razorpay order
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: 'EVT-' + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// POST /api/payment/verify-and-book
// Verify payment and create booking
router.post('/verify-and-book', authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      eventTitle,
      eventDate,
      showtime,
      venue,
      city,
      seats,
      seatNumbers,
      category,
      totalAmount,
      discount,
      finalAmount,
      promoCode,
      paymentMethod,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Payment verified successfully
    // Generate booking ID
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `EVT-${year}-${random}`;

    // Create booking in database
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      showDate: eventDate,
      showTime: showtime,
      seats: seatNumbers,
      totalAmount: finalAmount,
      promoCode: promoCode || '',
      discount: discount || 0,
      status: 'confirmed',
      bookingId: bookingId,
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      paymentMethod: 'Razorpay',
    });

    // Return ticket object
    const ticket = {
      bookingId,
      eventTitle,
      eventDate,
      showtime,
      venue,
      city,
      seats,
      seatNumbers,
      category,
      finalAmount,
      paymentId: razorpay_payment_id,
      bookedAt: booking.createdAt,
    };

    res.json({
      success: true,
      message: 'Payment verified and booking created',
      ticket,
    });
  } catch (error) {
    console.error('Verify and book error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment and create booking',
      error: error.message,
    });
  }
});

module.exports = router;
