export const ValidateMobile = (mobile) => {
  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(mobile);
};

export const ValidateFullName = (fullName) => {
    const re = /^[a-zA-Z ]+$/;
    return re.test(fullName);
};


export const NullOrEmpty = (param) => {
  if (param === undefined || param === null || param === "") {
    return true;
  } else {
    return false;
  }
};

