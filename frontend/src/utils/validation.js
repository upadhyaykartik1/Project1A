export const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
export const validateAadhaar = (aad) => /^[2-9]{1}[0-9]{11}$/.test(aad);
export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);