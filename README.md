# GovChain: Transparent Tender Tracker

**Tagline**: Blockchain for Transparent Tenders

GovChain is a blockchain-based web app designed to revolutionize government procurement. Built on the Sepolia testnet, it enables transparent tender creation, vendor applications, and progress tracking—ensuring trust and accountability with real-time updates.

---

## 🚀 Features

- **Tender Creation**: Admins post tenders with budgets and deadlines on-chain.  
- **Vendor Applications**: Vendors apply via MetaMask, selected transparently.  
- **Progress Tracking**: Milestones updated live with IPFS hashes.  
- **Public Verification**: Citizens audit tenders via a blockchain portal.  
- **Milestone Alerts**: Real-time deadline reminders for vendors.  
- **Progress Graphs**: Visual completion status for each tender.  
- **Vendor Ratings**: Rate vendors post-tender for quality assurance.

---

## 🛠 Tech Stack

| Component           | Technology                  |
|---------------------|-----------------------------|
| **Blockchain**      | Sepolia Testnet             |
| **Smart Contracts** | Solidity + Pinata (IPFS)    |
| **Frontend**        | React.js (Hosted on Vercel, WIP) |
| **Backend**         | Node.js + Socket.io (Hosted on Render) |
| **Database**        | MongoDB                     |
| **Image Storage**   | Cloudinary                  |

---

## 📜 Smart Contract Addresses (Sepolia Testnet)

| Contract   | Address                                    |
|------------|--------------------------------------------|
| **Vendor** | `0xad615f00968888b85f6359bbf65946aef6a02b13` |
| **Payment**| `0xA76e626368467D2757301c2078400918F2764df5` |
| **Tender** | `0x83d1120a76c604b775f1379bf5d636fef5d37caf` |

_Deployed on March 11-12, 2025 — check [Sepolia Explorer](https://sepolia.etherscan.io/) for live details._

---

## 🔄 How It Works

1. **Tender Posted**: Admin creates a tender on Sepolia blockchain.  
2. **Vendor Applies**: Vendors bid via MetaMask; admin selects one.  
3. **Progress Tracked**: Milestones updated with Pinata-stored hashes.  
4. **Public Verifies**: Citizens check progress via public portal.  
5. **Completion & Rated**: Tender finishes, vendor rated on-chain.

---

## ⚙️ Installation

### Prerequisites

- Node.js (v16+)
- MetaMask (configured for Sepolia testnet)
- MongoDB Atlas account
- Cloudinary API key and secret
- Pinata API key and secret

### Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/govchain.git
cd govchain

# Install dependencies
npm install

# Create a .env file in the root directory and add:
# MONGODB_URI=your_mongodb_connection_string
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# PINATA_API_KEY=your_pinata_api_key
# PINATA_SECRET_API_KEY=your_pinata_secret_key
# PRIVATE_KEY=your_wallet_private_key
# RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id

# Start the server
npm start

```
### Project Structure

govchain/
├── backend/ (Node.js + Socket.io + MongoDB + Cloudinary + Pinata)
├── contracts/ (Solidity smart contracts)
├── frontend/ (React.js frontend - Vercel hosted)
├── README.md
