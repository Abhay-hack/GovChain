// backend/src/controllers/storageController.js

const storageService = require('../services/storageService');

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { storageType, ...options } = req.body; // Extract storageType and options
    const result = await storageService.uploadFile(req.file, storageType, options);
    res.status(200).json({ result });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function uploadJSON(req, res) {
  try {
    const { jsonData, storageType, ...options } = req.body;
    const result = await storageService.uploadJSON(jsonData, storageType, options);
    res.status(200).json({ result });
  } catch (error) {
    console.error('Upload JSON error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteFile(req, res){
    try{
        const {publicId, storageType, ...options} = req.body;
        const result = await storageService.deleteFile(publicId, storageType, options);
        res.status(200).json({result});
    } catch (error){
        console.error("Delete file error:", error);
        res.status(500).json({error: error.message});
    }
}

module.exports = {
  uploadFile,
  uploadJSON,
  deleteFile
};