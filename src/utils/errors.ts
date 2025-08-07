import { AuthError } from "next-auth";

export class InvalidLoginError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}
export class InvalidEmailPasswordError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}
export class InactiveAccountError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}
