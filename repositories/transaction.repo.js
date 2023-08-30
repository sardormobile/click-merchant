const transactionModel = require("../models/transaction.model");

class TransactionRepo {
  constructor(model) {
    this.model = transactionModel;
  }

  async create(data) {
    await this.model.create(data);
  }

  async getById(transactionId) {
    //return transactionModel.findById(transactionId.toString());
    return transactionModel.findOne({id:transactionId});
  }

  async getByFilter(filter) {
    return transactionModel.findOne(filter);
  }

  async updateById(transactionId, update) {
    return transactionModel.findOneAndUpdate({id:transactionId}, update);
  }
}

module.exports = new TransactionRepo(transactionModel);
