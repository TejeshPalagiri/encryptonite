const mongoose = require("mongoose");
const {
  encryptWithSalt,
  decryptWithSalt,
} = require("../services/crypto.service");

const credentialSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  domain_url: {
    type: String,
  },
  user_name: {
    type: String,
  },
  password: {
    type: String,
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_by: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  expiry: {
    type: Date,
  },
  retrieved_count: {
    type: Number,
    default: 0,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true
  },
  last_accessed_at: {
    type: Date
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}
);

credentialSchema.methods.encryptPassword = function (salt) {
  this.password = encryptWithSalt(this.password, salt);
};

credentialSchema.methods.decryptPassword = function (salt) {
  return decryptWithSalt(this.password, salt);
};

module.exports = mongoose.model("Credentials", credentialSchema);
