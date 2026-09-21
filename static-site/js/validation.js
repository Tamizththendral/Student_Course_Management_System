// validation.js — reusable field-level validation rules and messages.
// Each validator returns "" (valid) or a human-readable error message.

export function validateRequired(value, label = "This field") {
  if (!value || !value.trim()) return `${label} is required.`;
  return "";
}

export function validateName(value) {
  const required = validateRequired(value, "Full name");
  if (required) return required;
  if (value.trim().length < 3) return "Full name must be at least 3 characters.";
  if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) return "Full name can only contain letters and spaces.";
  return "";
}

export function validateEmail(value) {
  const required = validateRequired(value, "Email");
  if (required) return required;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value.trim())) return "Enter a valid email address.";
  return "";
}

export function validatePhone(value) {
  const required = validateRequired(value, "Phone number");
  if (required) return required;
  const digitsOnly = value.replace(/\D/g, "");
  if (digitsOnly.length !== 10) return "Enter a valid 10-digit phone number.";
  return "";
}

export function validatePassword(value) {
  const required = validateRequired(value, "Password");
  if (required) return required;
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
}

export function validateConfirmPassword(value, original) {
  const required = validateRequired(value, "Password confirmation");
  if (required) return required;
  if (value !== original) return "Passwords do not match.";
  return "";
}

export function validateIdentifier(value) {
  return validateRequired(value, "Email or username");
}

/**
 * Validates a form given a map of { fieldName: value } and a matching
 * map of { fieldName: validatorFn(value, ...extraArgs) }.
 * Returns { isValid, errors: { fieldName: message } }.
 */
export function runValidators(entries) {
  const errors = {};
  let isValid = true;
  for (const [field, { value, validator, extra }] of Object.entries(entries)) {
    const message = extra !== undefined ? validator(value, extra) : validator(value);
    if (message) {
      errors[field] = message;
      isValid = false;
    }
  }
  return { isValid, errors };
}
