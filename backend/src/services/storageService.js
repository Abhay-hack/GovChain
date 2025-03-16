// backend/src/services/storageService.js

const cloudinaryService = require('./cloudinaryService');
const pinataService = require('./pinataService');
const fs = require('fs').promises; // For file system operations

async function uploadFile(file, storageType, options = {}) {
  try {
    if (storageType === 'cloudinary') {
      return await cloudinaryService.uploadImageToCloudinary(file, options);
    } else if (storageType === 'pinata') {
      // Pinata requires a file path, so if file is a buffer, write it to a temp file.
      if (file.buffer) {
        const tempFilePath = `/tmp/${Date.now()}-${file.originalname}`;
        await fs.writeFile(tempFilePath, file.buffer);
        const ipfsHash = await pinataService.uploadFileToPinata(tempFilePath, options);
        await fs.unlink(tempFilePath); // Clean up temp file
        return ipfsHash;
      } else if (file.path){
        return await pinataService.uploadFileToPinata(file.path, options);
      } else {
        throw new Error("File must contain either a buffer or a path when uploading to Pinata.");
      }
    } else {
      throw new Error('Invalid storage type');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function uploadJSON(jsonData, storageType, options = {}) {
  try {
    if (storageType === 'pinata') {
      return await pinataService.uploadJsonToPinata(jsonData, options);
    } else {
      throw new Error('JSON uploads are currently only supported for Pinata');
    }
  } catch (error) {
    console.error('Error uploading JSON:', error);
    throw error;
  }
}

async function deleteFile(publicId, storageType, options = {}){
    try{
        if (storageType === 'cloudinary'){
            return await cloudinaryService.deleteImageFromCloudinary(publicId, options);
        } else {
            throw new Error("Delete operations are currently only supported for cloudinary");
        }
    } catch (error){
        console.error("Error deleting file:", error);
        throw error;
    }
}

module.exports = {
  uploadFile,
  uploadJSON,
  deleteFile
};