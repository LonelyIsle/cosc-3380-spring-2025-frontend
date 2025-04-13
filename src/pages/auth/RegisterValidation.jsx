function Validation(email, password, passwordcheck) {
  let error = {};
  let emailPattern = /^.+@.+$/;
  let passwordPattern = /^[a-zA-Z0-9]+$/;

  // Trim whitespace
  const trimmedPassword = password.trim();
  const trimmedPasswordCheck = passwordcheck.trim();

  if (passwordcheck !== undefined && trimmedPassword !== trimmedPasswordCheck) {
    error.passwordcheck = "Passwords do not match";
  } else {
    error.passwordcheck = "";
  }

  if (password === "") {
    error.password = "Password should not be empty";
  } else if (!passwordPattern.test(trimmedPassword)) {
    error.password = "Password should not be empty";
  } else {
    error.password = "";
  }

  if (email === "") {
    error.email = "Email should not be empty";
  } else if (!emailPattern.test(email)) {
    error.email = "Email doesn't fit criteria";
  } else {
    error.email = "";
  }

  return error;
}

export default Validation;
