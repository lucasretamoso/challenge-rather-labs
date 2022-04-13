export class UnexpectedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedException';
  }
}