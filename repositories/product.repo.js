const productModel = require("../models/product.model");

class ProductRepo {
  constructor(model) {
    this.model = model;
  }

  async getById(productId) {
    return productModel.findById(productId);
  }
}

module.exports = new ProductRepo(productModel);
