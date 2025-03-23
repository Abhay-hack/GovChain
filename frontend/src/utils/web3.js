import { ethers } from "ethers";
import TenderContract from "../contracts/TenderContract.json";

const TENDER_CONTRACT_ADDRESS =
  process.env.REACT_APP_TENDER_CONTRACT_ADDRESS || import.meta.env.VITE_TENDER_CONTRACT_ADDRESS;

if (!TENDER_CONTRACT_ADDRESS) {
  throw new Error("Tender contract address is missing! Check your .env file.");
}

// ✅ Get provider
export const getProvider = () => {
  if (typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum);
  }
  console.error("MetaMask not installed! Using fallback provider.");
  return new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_ID");
};

// ✅ Get contract (read-only)
export const getTenderContractReadOnly = (provider) => {
  return new ethers.Contract(TENDER_CONTRACT_ADDRESS, TenderContract.abi, provider);
};

// ✅ Get contract (with signer for transactions)
export const getTenderContractWithSigner = async (provider) => {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = await provider.getSigner();
    return new ethers.Contract(TENDER_CONTRACT_ADDRESS, TenderContract.abi, signer);
  } catch (error) {
    console.error("User not connected to wallet:", error);
    throw new Error("Please connect your wallet to interact with the contract.");
  }
};

// ✅ Connect wallet
export const connectWallet = async () => {
  if (!window.ethereum) throw new Error("MetaMask is not installed!");

  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);
  if (accounts.length === 0) throw new Error("No account connected!");

  localStorage.setItem("connectedWallet", accounts[0]);
  return accounts[0];
};

// ✅ Validate wallet before transactions
export const validateWallet = async () => {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  const connectedWallet = localStorage.getItem("connectedWallet");

  if (!accounts.length) throw new Error("No wallet connected!");
  if (connectedWallet && accounts[0].toLowerCase() !== connectedWallet.toLowerCase()) {
    throw new Error(`⚠️ Please switch back to wallet: ${connectedWallet}`);
  }
  return accounts[0];
};

// ✅ Fetch Tender Details
export const fetchTenderDetails = async (provider, tenderId) => {
  try {
    if (!provider) throw new Error("Ethereum provider is missing!");
    const contract = getTenderContractReadOnly(provider);

    const tender = await contract.getTender(tenderId);
    console.log("Fetched Tender:", tender);

    return {
      id: tender.id.toNumber(),
      employer: tender.employer,
      descriptionHash: tender.descriptionHash,
      budget: ethers.formatEther(tender.budget),
      deadline: tender.deadline.toNumber(),
      requiredCerts: tender.requiredCerts,
      winner: tender.winner,
      isOpen: tender.isOpen,
      milestoneCount: tender.milestoneCount.toNumber(),
    };
  } catch (error) {
    console.error("Error fetching tender details:", error);
    throw new Error("Failed to fetch tender details.");
  }
};


// ✅ Upload Tender
export const uploadTender = async (provider, tenderData) => {
  try {
    await validateWallet();
    console.log("Uploading Tender to Contract:", tenderData);

    const contract = await getTenderContractWithSigner(provider);
    const tx = await contract.createTender(
      tenderData.descriptionHash,
      ethers.parseEther(tenderData.budget.toString()), // Ensure correct format
      tenderData.deadline,
      tenderData.requiredCerts || [],
      { gasLimit: 300000 }
    );

    console.log("Transaction Sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction Mined:", receipt);

    return receipt;
  } catch (error) {
    console.error("❌ Error Uploading Tender:", error);
    throw new Error("Failed to upload tender. Check if you are the contract owner.");
  }
};




// ✅ Get Payment Status
export const getPaymentStatus = async (provider, tenderId) => {
  try {
    const contract = getTenderContractReadOnly(provider);
    return await contract.getPaymentStatus(tenderId);
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw new Error("Failed to fetch payment status.");
  }
};

// ✅ Blacklist Vendor
export const blacklistVendor = async (provider, vendorAddr) => {
  try {
    await validateWallet();
    if (!ethers.isAddress(vendorAddr)) throw new Error("Invalid vendor address!");

    const contract = await getTenderContractWithSigner(provider);
    const tx = await contract.blacklistVendor(vendorAddr, { gasLimit: 100000 });
    await tx.wait();

    console.log(`Vendor ${vendorAddr} successfully blacklisted.`);
    return true;
  } catch (error) {
    console.error("Error blacklisting vendor:", error);
    throw new Error("Failed to blacklist vendor. Ensure you have sufficient balance and permissions.");
  }
};
