import { check, validationResult } from "express-validator";

export const validateOTP = (fieldName) => {
  return [
    check(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`OTP is required.`)
      .isNumeric()
      .withMessage(`OTP must be numeric.`)
      .isLength({ min: 6, max: 6 })
      .withMessage(`$OTP must be 6 digits.`)
      .escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = errors.errors.map((element) => element.msg).join("\n");
        return res.json({
          status: "failed",
          message: error,
        });
      }
      next();
    },
  ];
};

export const validatePhone = (fieldName) => {
  return [
    check(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`${fieldName} is required.`),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = errors.errors.map((element) => element.msg).join("\n");

        return res.json({
          status: "failed",
          message: error,
        });
      }
      next();
    },
  ];
};

export const validateName = (fieldName) => {
  return [
    check(fieldName)
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
      .withMessage("Invalid name format. Only letters and spaces allowed.")
      .custom((value) => {
        const names = value.trim().split(" ");
        if (names.length < 2) {
          throw new Error("Please provide both first and last name");
        }
        return true;
      }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = errors.errors.map((element) => element.msg).join("\n");
        return res.json({
          status: "failed",
          message: error,
        });
      }
      next();
    },
  ];
};

export const validateString = (fieldName) => [
  check(fieldName)
    .notEmpty()
    .withMessage("Input string is required")
    .isString()
    .withMessage("Input must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors
        .array()
        .map((element) => element.msg)
        .join("\n");
      return res.json({
        status: "failed",
        message: error,
      });
    }
    next();
  },
];
