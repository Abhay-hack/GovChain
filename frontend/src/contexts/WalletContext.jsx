// frontend/src/contexts/WalletContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setProvider(web3Provider);
        console.log('Wallet connected:', accounts[0]);
      } catch (error) {
        console.error('Wallet connection failed:', error);
        alert('Failed to connect wallet: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};