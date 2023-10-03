export const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      next(new GlobalError({ message: err.message }));
    });
  };
};

export class GlobalError extends Error {
  constructor({ message, statusCode } = {}) {
    super(message);
    this.statusCode = statusCode;
  }
}
