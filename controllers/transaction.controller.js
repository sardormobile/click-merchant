const transactionService = require("../services/transaction.service");

class TransactionController {
  constructor(service) {
    service = transactionService;
  }
  async prepare(req, res, next) {
    try {
      const data = req.body;
      console.log(`prepare body: ${data}`)
      
      const result = await transactionService.prepare(data);

      res
        .set({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
        .send(result);
    } catch (err) {
      next(err);
    }
  }

  async complete(req, res, next) {
    try {
      const data = req.body;
      console.log(`complete body: ${data}`)
      const result = await transactionService.complete(data);

      res
        .set({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
        .send(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController(transactionService);
