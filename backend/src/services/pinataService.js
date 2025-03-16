// backend/src/services/pinataService.js
const axios = require('axios');
const fs = require('fs'); // For file uploads
const config = require('../config');

const pinataApiKey = config.pinata.apiKey;
const pinataApiSecret = config.pinata.apiSecret;

const uploadJsonToPinata = async (jsonData, options = {}) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataApiSecret,
        },
        params: options, // Allows to pass options to the api call.
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        `Pinata API error: ${error.response.status} - ${error.response.data.error.details}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Pinata API error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Pinata API error: ${error.message}`);
    }
  }
};

const uploadFileToPinata = async (filePath, options = {}) => {
  try {
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataApiSecret,
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
         params: options,
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
     if (error.response) {
      throw new Error(
        `Pinata API error: ${error.response.status} - ${error.response.data.error.details}`
      );
    } else if (error.request) {
      throw new Error('Pinata API error: No response received');
    } else {
      throw new Error(`Pinata API error: ${error.message}`);
    }
  }
};

module.exports = {
  uploadJsonToPinata,
  uploadFileToPinata,
};