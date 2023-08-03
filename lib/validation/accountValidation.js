const yup = require("yup");

async function validateAccount(data) {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(5)
      .max(50)
      .required("Account name is required.")
      .label("Account name"),
    accountBalance: yup
      .number()
      .min(100000)
      .required("Account balance is required.")
      .label("Account balance"),
    minLoan: yup
      .number()
      .min(0)
      .required("Minimum loan is required.")
      .label("Minimum loan"),
    maxLoan: yup
      .number()
      .min(0)
      .required("Maximum loan is required.")
      .label("Maximum loan"),
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

async function validateFund(data) {
  const schema = yup.object().shape({
    amount: yup
      .number()
      .min(20000, "The minimum fund should be 20000.")
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

async function validateAccountUpdate(data) {
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(5)
      .max(50)
      .required("Account name is required.")
      .label("Account name"),
    minLoan: yup
      .number()
      .min(0)
      .required("Minimum loan is required.")
      .label("Minimum loan"),
    maxLoan: yup
      .number()
      .min(0)
      .required("Maximum loan is required.")
      .label("Maximum loan"),
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

module.exports.validateAccount = validateAccount;
module.exports.validateAccountUpdate = validateAccountUpdate;
module.exports.validateFund = validateFund;
