class ValidationException extends Error {
  private detailedErrors: Array<string>;

  constructor(errors: Array<string>) {
    super('Error al crear usuario.');
    this.detailedErrors = errors;
  }

  public getDetailedErrors(): Array<string> {
    return this.detailedErrors;
  }
}

export default ValidationException;
