const crypto = require("crypto");

const environments = require("../config/environments");

exports.checkClickSignature = (data, signString) => {
  const {
    transId,
    serviceId,
    productId,
    prepareId,
    amount,
    action,
    signTime,
  } = data;

  const CLICK_SECRET_KEY = environments.CLICK_SECRET_KEY;
console.log(`userId: ${productId}`)
  const checkedPrepareId = prepareId || "";
  const signature = `${transId}${serviceId}${CLICK_SECRET_KEY}${productId}${checkedPrepareId}${amount}${action}${signTime}`;
  const signatureHash = crypto
    .createHash("md5")
    .update(signature)
    .digest("hex");
    console.log(`signatureHash: ${signatureHash}`);
    console.log(`signString: ${signString}`);
  return signatureHash === signString;
};
