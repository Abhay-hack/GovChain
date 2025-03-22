// frontend/src/utils/ipfs.js
import { create } from 'ipfs-http-client';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${btoa(`${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_SECRET}`)}`,
  },
});

export const uploadToIPFS = async (file) => {
  const added = await ipfs.add(file);
  return added.path;
};