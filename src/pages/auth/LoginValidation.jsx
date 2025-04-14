function Validation(email, password) {
  let error = {}; //an object that we will store errors in
  let emailPattern = /^.+@.+$/;
  let passwordPattern = /^[a-zA-Z0-9]+$/;

  if (email === "") {
    error.email = "This field is required";
  } //if email is blank this error message will appear
  else if (!emailPattern.test(email)) {
    error.email = "Email didn't match";
  } //if email is not empty but incorrect this error message will appear
  else {
    error.email = "";
  }

  if (password === "") {
    error.password = "Password should not be empty";
  } //if password is blank this error message will appear
  else if (!passwordPattern.test(password)) {
    error.password = "Password didn't match";
  } //if password wrong this error message will appear
  else {
    error.password = "";
  }

  return error;
}

export default Validation;
