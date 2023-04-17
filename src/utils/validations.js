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

export const BloodGroup = [
  {
    ID:1,
    Name:"A+"
  },
  {
    ID:2,
    Name:"O+"
  },
  {
    ID:3,
    Name:"B+"
  },
  {
    ID:4,
    Name:"AB+"
  },
  {
    ID:5,
    Name:"A-"
  },
  {
    ID:6,
    Name:"O-"
  },
  {
    ID:7,
    Name:"B-"
  },
  {
    ID:8,
    Name:"AB-"
  },
]