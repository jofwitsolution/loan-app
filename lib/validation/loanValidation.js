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

module.exports.validateLoanRequest = validateLoanRequest;
