class CustomAPIError extends Error {
  public statusCode: number;

  constructor(message) {
    super(message);
  }
}

export default CustomAPIError;
