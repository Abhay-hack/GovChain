const tenderService = require('../services/tendorService');
const Tender = require('../models/tendor');
const Bid = require('../models/bidModel'); 
// Assuming you have a Bid model

const createTender = async (employer, descriptionHash, budget, deadline, requiredCerts) => {
  try {
    console.log("Creating Tender on Blockchain...");

    const web3 = await require("../services/web3Service").getWeb3();
    const contractAddress = "process.env.TENDER_CONTRACT_ADDRESS";
    const abi = require("../services/tenderAbi.json"); // Ensure you have the ABI JSON
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    const gasEstimate = await contract.methods.createTender(
      descriptionHash, web3.utils.toWei(budget.toString(), "ether"), deadline, requiredCerts
    ).estimateGas({ from: employer });

    const tx = await contract.methods.createTender(
      descriptionHash, web3.utils.toWei(budget.toString(), "ether"), deadline, requiredCerts
    ).send({ from: employer, gas: gasEstimate });

    console.log("Tender Created - Transaction Hash:", tx.transactionHash);

    const tenderCount = await contract.methods.getTenderCount().call();
    const tenderId = parseInt(tenderCount) - 1;

    console.log("Tender ID from Contract:", tenderId);

    const newTender = new Tender({
      id: tenderId,
      employer,
      descriptionHash,
      budget,
      deadline,
      requiredCerts,
      isOpen: true
    });

    await newTender.save();
    return newTender;
  } catch (error) {
    console.error("❌ Error creating tender:", error);
    throw new Error("Failed to create tender on blockchain.");
  }
};

const verifyTender = async (req, res) => {
  try {
    const { transactionHash } = req.body;
    const web3 = await require("../services/web3Service").getWeb3();

    let receipt;
    for (let i = 0; i < 10; i++) { // Retry up to 10 times
      receipt = await web3.eth.getTransactionReceipt(transactionHash);
      if (receipt) break;
      console.log(`Waiting for transaction ${transactionHash} to be mined...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (receipt && receipt.status) {
      res.status(200).json({ message: "Transaction verified successfully", receipt });
    } else {
      res.status(400).json({ error: "Transaction failed or not found" });
    }
  } catch (error) {
    console.error("❌ Error verifying transaction:", error);
    res.status(500).json({ error: error.message });
  }
};


const getTender = async (req, res) => {
  try {
    const tender = await tenderService.getTender(req.params.tenderId);
    res.status(200).json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTenderFromDB = async (req, res) => {
  try {
    const tender = await tenderService.getTenderFromDatabase(req.params.tenderId);
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found in Database' });
    }
    res.status(200).json(tender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTenders = async (req, res) => {
  try {
    console.log("Fetching all tenders from DB & Blockchain...");
    const tendersDB = await Tender.find({});
    const web3 = await require("../services/web3Service").getWeb3();
    const contractAddress = "YOUR_CONTRACT_ADDRESS";
    const abi = require("../services/tenderAbi.json");
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    const tenderCount = await contract.methods.getTenderCount().call();
    let tendersOnChain = [];

    for (let i = 0; i < tenderCount; i++) {
      const tender = await contract.methods.getTender(i).call();
      tendersOnChain.push({
        id: i,
        employer: tender.employer,
        budget: web3.utils.fromWei(tender.budget, "ether"),
        deadline: tender.deadline,
        requiredCerts: tender.requiredCerts,
        winner: tender.winner,
        isOpen: tender.isOpen
      });
    }

    console.log(`Fetched ${tendersDB.length} tenders from DB & ${tendersOnChain.length} from Blockchain`);
    res.status(200).json([...tendersDB, ...tendersOnChain]);
  } catch (error) {
    console.error("❌ Error fetching tenders:", error);
    res.status(500).json({ error: error.message });
  }
};


const updateTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const updateData = req.body;

    const updatedTender = await Tender.findByIdAndUpdate(tenderId, updateData, { new: true });

    if (!updatedTender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.status(200).json(updatedTender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const awardTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { winnerAddress } = req.body;

    const updatedTender = await Tender.findByIdAndUpdate(
      tenderId,
      { winner: winnerAddress, isOpen: false },
      { new: true }
    );

    if (!updatedTender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    res.status(200).json({ message: 'Tender awarded successfully', tender: updatedTender });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitBid = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { amount, bidDetails } = req.body;
    
    // Check if the vendor already submitted a bid
    const existingBid = await Bid.findOne({ tenderId, vendorAddress: req.user.address });
    if (existingBid) {
      return res.status(400).json({ error: 'You have already submitted a bid for this tender' });
    }

    const newBid = new Bid({
      tenderId,
      vendorAddress: req.user.address,
      amount,
      bidDetails,
    });

    await newBid.save();
    res.status(201).json({ message: 'Bid submitted successfully', bid: newBid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidsForTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const bids = await Bid.find({ tenderId });

    if (bids.length === 0) {
      return res.status(404).json({ error: 'No bids found for this tender' });
    }

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
