// backend/src/controllers/paymentController.js
const paymentService = require('../services/paymentService');
const Payment = require('../models/payment'); // Assuming you have a Payment model

const fundTender = async (req, res) => {
  try {
    const { tenderId, amount } = req.body;
    await paymentService.fundTender(tenderId, amount);
    res.status(200).send('Tender funded');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTenderFunds = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const funds = await paymentService.getTenderFunds(tenderId);
    res.status(200).json(funds);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const releasePayment = async (req, res) => {
  try {
    const { tenderId, vendorAddr, amount } = req.body;
    await paymentService.releasePayment(tenderId, vendorAddr, amount);
    res.status(200).send('Payment released');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const applyPenalty = async (req, res) => {
  try {
    const { tenderId, vendorAddr } = req.params;
    const { penaltyAmount } = req.body;
    await paymentService.applyPenalty(tenderId, vendorAddr, penaltyAmount);
    res.status(200).send('Penalty applied');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).send('Payment not found');
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  fundTender,
  getTenderFunds,
  releasePayment,
  applyPenalty,
  getAllPayments,
  getPaymentById,
};