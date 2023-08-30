const transactionRepo = require("../repositories/transaction.repo");
const userRepo = require("../repositories/user.repo");
const productRepo = require("../repositories/product.repo");

const {
  ClickError,
  ClickAction,
  TransactionStatus,
} = require("../enums/transaction.enum");

const { checkClickSignature } = require("../helpers/check-signature.helper");

class TransactionService {
  constructor(repo, userRepo, productRepo) {
    this.repo = repo;
    this.userRepo = userRepo;
    this.productRepo = productRepo;
  }

  async prepare(data) {
    //console.log(`prepare body: ${JSON.stringify(data, null, 3)}`)
    const {
      click_trans_id: transId,
      service_id: serviceId,
      merchant_trans_id: userId,
      additional_param3: productId,
      //merchant_trans_id: productId,//userId,
      //merchant_trans_id: userId,//additional_param3
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
    } = data;

    const signatureData = {
      transId,
      serviceId,
      userId,
      amount,
      action,
      signTime,
    };

    const checkSignature = checkClickSignature(signatureData, signString);
    if (!checkSignature) {
      return {
        error: ClickError.SignFailed,
        error_note: "Invalid sign",
      };
    }

    if (parseInt(action) !== ClickAction.Prepare) {
      return {
        error: ClickError.ActionNotFound,
        error_note: "Action not found",
      };
    }
    const user = await userRepo.getById(userId);
    if (!user) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      };
    }

    if (productId.length > 24) return {
      error: ClickError.UserNotFound,//BadRequest,
      error_note: "Product not found",
    };

    const product = await productRepo.getById(productId);
    if (!product) {
      return {
        error: ClickError.UserNotFound,//BadRequest,
        error_note: "Product not found",
      };
    }

    const isAlreadyPaid = await transactionRepo.getByFilter({
      userId,
      productId,
      status: TransactionStatus.Paid,
    });
    if (isAlreadyPaid) {
      return {
        error: ClickError.AlreadyPaid,
        error_note: "Already paid",
      };
    }

    if (parseInt(amount) !== product.price) {
      return {
        error: ClickError.InvalidAmount,
        error_note: "Incorrect parameter amount",
      };
    }

    const transaction = await transactionRepo.getById(transId);
    if (transaction && transaction.status === TransactionStatus.Canceled) {
      return {
        error: ClickError.TransactionCanceled,
        error_note: "Transaction canceled",
      };
    }

    const time = new Date().getTime();
    
    
    await transactionRepo.create({
      id: transId,
      merchant_trans_id: userId,
      additional_param3: productId,
      status: TransactionStatus.Pending,
      create_time: time,
      amount,
      prepare_id: time,
    });

    return {
      click_trans_id: transId,
      merchant_trans_id: userId,
      merchant_prepare_id: time,
      error: ClickError.Success,
      error_note: "Success",
    };
  }

  async complete(data) {
    //console.log(`complete body: ${JSON.stringify(data, null, 3)}`)
    const {
      click_trans_id: transId,
      service_id: serviceId,
      merchant_trans_id: userId,
      additional_param3: productId,
      //merchant_trans_id: productId,//userId,
      //merchant_trans_id: userId,//additional_param3
      merchant_prepare_id: prepareId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
      error,
    } = data;

    const signatureData = {
      transId,
      serviceId,
      userId,
      prepareId,
      amount,
      action,
      signTime,
    };

    const checkSignature = checkClickSignature(signatureData, signString);
    if (!checkSignature) {
      return {
        error: ClickError.SignFailed,
        error_note: "Invalid sign",
      };
    }

    if (parseInt(action) !== ClickAction.Complete) {
      return {
        error: ClickError.ActionNotFound,
        error_note: "Action not found",
      };
    }
    
    const user = await userRepo.getById(userId);
    if (!user) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      };
    }
    const product = await productRepo.getById(productId);
    if (!product) {
      return {
        error: ClickError.UserNotFound,//BadRequest,
        error_note: "Product not found",
      };
    }

    const isPrepared = await transactionRepo.getByFilter({
      prepare_id: prepareId,
    });
    if (!isPrepared) {
      return {
        error: ClickError.TransactionNotFound,
        error_note: "Transaction not found",
      };
    }
    
    const transaction = await transactionRepo.getById(transId);
    if (transaction && transaction.status === TransactionStatus.Canceled) {
      return {
        error: ClickError.TransactionCanceled,
        error_note: "Transaction canceled",
      };
    }

    if (parseInt(amount) !== product.price) {
      return {
        error: ClickError.InvalidAmount,
        error_note: "Incorrect parameter amount",
      };
    }
    const isAlreadyPaid = await transactionRepo.getByFilter({
      merchant_trans_id:userId,
      additional_param3:productId,
      status: TransactionStatus.Paid,
    });
    if (isAlreadyPaid) {
      return {
        error: ClickError.AlreadyPaid,
        error_note: "Already paid",
      };
    }

    const time = new Date().getTime();

    if (error < 0) {
      await transactionRepo.updateById(transId, {
        status: TransactionStatus.Canceled,
        cancel_time: time,
      });

      return {
        error: ClickError.TransactionNotFound,
        error_note: "Transaction not found",
      };
    }

    await transactionRepo.updateById(transId, {
      status: TransactionStatus.Paid,
      perform_time: time,
    });

    return {
      click_trans_id: transId,
      merchant_trans_id: userId,
      merchant_confirm_id: time,
      error: ClickError.Success,
      error_note: "Success",
    };
  }
}

module.exports = new TransactionService(transactionRepo, userRepo, productRepo);
