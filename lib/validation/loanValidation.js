const yup = require("yup");

async function validateLoanRequest(data) {
  const schema = yup.object().shape({
    amount: yup
      .number()
      .min(0, "Amount cannot be less than 0.")
      .required("Amount cannot be empty.")
      .label("Amount"),
  });

  try {
    const validationData = await schema.validate(data);
    // console.log(validationData);
    return null;
  } catch (error) {
    console.log(error.errors[0]);
    return error?.errors[0];
  }
}

async function validateLoanRefund(data) {
  const schema = yup.object().shape({
    amount: yup
      .number()
      .min(0, "Amount cannot be less than 0.")
      .required("Amount cannot be empty.")
      .label("Amount"),
  });

  try {
    const validationData = await schema.validate(data);
    // console.log(validationData);
    return null;
  } catch (error) {
    console.log(error.errors[0]);
    return error?.errors[0];
  }
}

async function validateLoanAction(data) {
  const schema = yup.object().shape({
    action: yup
      .string()
      .oneOf(["declined", "accepted"])
      .required("Action is required.")
      .label("Action"),
    comment: yup.string().required("Comment is required.").label("Comment"),
  });

  try {
    const validationData = await schema.validate(data);
    // console.log(validationData);
    return null;
  } catch (error) {
    console.log(error.errors[0]);
    return error?.errors[0];
  }
}

module.exports.validateLoanRequest = validateLoanRequest;
module.exports.validateLoanAction = validateLoanAction;
module.exports.validateLoanRefund = validateLoanRefund;
