const mongoose = require("mongoose");
const { TransactionStatus } = require("../enums/transaction.enum");

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    merchant_trans_id: {//merchant_trans_id//user_id
      type: String,
      required: true,
    },
    additional_param3: {//product_id
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    create_time: {
      type: Number,
      default: Date.now(),
    },
    perform_time: {
      type: Number,
      default: 0,
    },
    cancel_time: {
      type: Number,
      default: 0,
    },
    prepare_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("transaction", transactionSchema);
