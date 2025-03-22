// frontend/src/utils/web3.js
import { ethers } from 'ethers'; // Direct import
import TenderContract from '../contracts/TenderContract.json';

const TENDER_CONTRACT_ADDRESS = process.env.REACT_APP_TENDER_CONTRACT_ADDRESS;

export const getTenderContract = (provider) => {
  return new ethers.Contract(TENDER_CONTRACT_ADDRESS, TenderContract.abi, provider.getSigner());
};

export const fetchTenderDetails = async (provider, tenderId) => {
  const contract = getTenderContract(provider);
  const tender = await contract.getTender(tenderId);
  return {
    id: tender[0].toNumber(),
    employer: tender[1],
    descriptionHash: tender[2],
    budget: ethers.formatEther(tender[3]), // Updated from ethers.utils.formatEther
    deadline: tender[4].toNumber(),
    isOpen: tender[5],
  };
};

export const getPaymentStatus = async (provider, tenderId) => {
  const contract = getTenderContract(provider);
  const status = await contract.getPaymentStatus(tenderId); // Hypothetical
  return status;
};

export const blacklistVendor = async (provider, vendorAddr) => {
  const contract = getTenderContract(provider);
  const tx = await contract.blacklistVendor(vendorAddr);
  await tx.wait();
};