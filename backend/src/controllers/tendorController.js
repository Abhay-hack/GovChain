// backend/src/controllers/tendorController.js
const tenderService = require('../services/tendorService');
const Tender = require('../models/tendor');
const Bid = require('../models/bidModel'); // Assuming you have a Bid model

const createTender = async (req, res) => {
  try {
    const { descriptionHash, budget, deadline, requiredCerts } = req.body;
    await tenderService.createTender(req.user.address, descriptionHash, budget, deadline, requiredCerts, req.user.address);
    res.status(201).send('Tender created');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const verifyTender = async (req, res) => {
  try {
      const {transactionHash} = req.body;
      //Verify the transaction using web3.
      const web3 = await require("../services/web3Service").getWeb3();
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      if(receipt && receipt.status){
          res.status(200).send("transaction verified");
      } else {
          res.status(400).send("transaction failed or not found");
      }

  } catch (error) {
      res.status(500).send(error.message);
  }
}

const getTender = async (req, res) => {
  try {
    const tender = await tenderService.getTender(req.params.tenderId);
    res.status(200).json(tender);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTenderFromDB = async (req, res) => {
  try {
    const tender = await tenderService.getTenderFromDatabase(req.params.tenderId);
    if (!tender) {
      return res.status(404).send('Tender not found in Database');
    }
    res.status(200).json(tender);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({});
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const updateData = req.body;
    const updatedTender = await Tender.findOneAndUpdate({ id: tenderId }, updateData, { new: true });
    if (!updatedTender) {
      return res.status(404).send('Tender not found');
    }
    res.status(200).json(updatedTender);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const awardTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { winnerAddress } = req.body;

    const updatedTender = await Tender.findOneAndUpdate(
      { id: tenderId },
      { winner: winnerAddress, isOpen: false },
      { new: true }
    );

    if (!updatedTender) {
      return res.status(404).send('Tender not found');
    }

    res.status(200).json(updatedTender);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const submitBid = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { amount, bidDetails } = req.body;
    const newBid = new Bid({
      tenderId: tenderId,
      vendorAddress: req.user.address,
      amount: amount,
      bidDetails: bidDetails,
    });
    await newBid.save();
    res.status(201).send('Bid submitted');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBidsForTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const bids = await Bid.find({ tenderId: tenderId });
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  createTender,
  verifyTender,
  getTender,
  getTenderFromDB,
  getAllTenders,
  updateTender,
  awardTender,
  submitBid,
  getBidsForTender,
};