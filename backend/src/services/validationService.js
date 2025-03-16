// backend/src/services/validationService.js

const Joi = require('joi');

const validate = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8),
  role: Joi.string().valid('vendor', 'employee'),
  address: Joi.string(),
  name: Joi.string(),
});

const tenderSchema = Joi.object({
  descriptionHash: Joi.string().required(),
  budget: Joi.number().min(0).required(),
  deadline: Joi.date().iso().required(),
  requiredCerts: Joi.array().items(Joi.string()).required(),
  // Add other tender fields as needed
});

const bidSchema = Joi.object({
  tenderId: Joi.string().required(), // Or Joi.number() depending on your tenderId type
  amount: Joi.number().min(0).required(),
  bidDetails: Joi.object().optional()
  // Add other bid fields as needed
});

const disputeSchema = Joi.object({
  tenderId: Joi.string().required(),
  vendorAddr: Joi.string().required(),
  disputeDescription: Joi.string().required(),
  evidenceHashes: Joi.array().items(Joi.string()).optional(),
  // Add other dispute fields as needed
});

const milestoneSchema = Joi.object({
  tenderId: Joi.string().required(),
  milestoneName: Joi.string().required(),
  description: Joi.string().required(),
  dueDate: Joi.date().iso().required(),
  // Add other milestone fields as needed
});

const ratingSchema = Joi.object({
  tenderId: Joi.string().required(),
  vendorAddr: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  // Add other rating fields as needed
});

const notificationSchema = Joi.object({
    userId: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required(),
    relatedItemId: Joi.string().optional(),
});

module.exports = {
  validate,
  userSchema,
  tenderSchema,
  bidSchema,
  disputeSchema,
  milestoneSchema,
  ratingSchema,
  notificationSchema,
};