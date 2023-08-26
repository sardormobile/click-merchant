const transactionModel = require("../models/transaction.model");

class TransactionRepo {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    await transactionModel.create(data);
  }

  async getById(transactionId) {
    return transactionModel.findById(transactionId);
  }

  async getByFilter(filter) {
    return transactionModel.findOne(filter);
  }

  async updateById(transactionId, update) {
    return transactionModel.findByIdAndUpdate(transactionId, update);
  }
}

module.exports = new TransactionRepo(transactionModel);
