const yup = require("yup");

async function validateUserWithdrawal(data) {
  const schema = yup.object().shape({
    withdrawalType: yup
      .string()
      .oneOf(["yawoo", "bank"])
      .required("You must specify withdrawal type")
      .label("Withdrawal Type"),
    bank: yup.string().label("Bank"),
    accountNumber: yup
      .number()
      .typeError("Account number must be a valid number")
      .test(
        "is-length",
        "Account number must be 10 digits",
        (value) => value.toString().length === 10
      )
      .required("You must provide account number")
      .label("Account Number"),
    amount: yup.number().required("Amount cannot be empty").label("Amount"),
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

module.exports.validateUserWithdrawal = validateUserWithdrawal;
