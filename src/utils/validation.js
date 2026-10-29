const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Each function returns an error message, or "" when the value is valid.

export function validateUsername(value) {
  const username = value.trim();
  if (!username) return "Username is required.";
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 20) return "Username must be 20 characters or fewer.";
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address.";
  return "";
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return "";
}

export function validateFullName(value) {
  const fullName = value.trim();
  if (!fullName) return "Full name is required.";
  if (fullName.length < 2) return "Full name must be at least 2 characters.";
  return "";
}

// Login only needs the password to be filled in.
export function validateLoginPassword(value) {
  if (!value) return "Password is required.";
  return "";
}