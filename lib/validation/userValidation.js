const yup = require("yup");

async function validateSignup(data) {
  // Define the validation schema for the signup request body
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .min(2)
      .max(50)
      .required("First name is required.")
      .label("First name"),
    lastName: yup
      .string()
      .min(2)
      .max(50)
      .required("Last name is required.")
      .label("Last name"),
    password: yup
      .string()
      .min(10)
      .max(16)
      .required("Password is required")
      .label("Password"),
    email: yup
      .string()
      .max(50)
      .email("Provide a valid email")
      .required("Email is required")
      .label("Email"),
    phone: yup
      .string()
      .max(15)
      .required("Phone number is required")
      .label("Phone"),
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

async function validateLogin(data) {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Provide a valid email")
      .required("Email is required")
      .label("Email"),
    password: yup.string().required("Password is required").label("Password"),
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

module.exports.validateSignup = validateSignup;
module.exports.validateLogin = validateLogin;
