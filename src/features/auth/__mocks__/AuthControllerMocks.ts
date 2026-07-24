import { throwlhos } from "../../../globals/Throwlhos.ts";

export const mockRegisterResponse = {
  token: "register-token",
  user: {
    id: "user-id",
    username: "lucas",
  },
};

export const mockLoginResponse = {
  token: "login-token",
  user: {
    id: "user-id",
    username: "lucas",
  },
};

export const invalidCredentialsError = throwlhos.err_unauthorized(
  "Invalid credentials",
);

export const usernameConflictError = throwlhos.err_conflict(
  "Username already taken",
  {
    user: "user-id",
  },
);

export const authValidationError = throwlhos.err_badRequest(
  "Fields username invalids (1)",
  [
    {
      field: "username",
      message: "Field is required",
      value: undefined,
    },
  ],
);

export const passingRules = {
  validate() {},
};

export const failingRules = {
  validate() {
    throw authValidationError;
  },
};

export class MockAuthService {
  register() {
    return Promise.resolve(mockRegisterResponse);
  }

  login() {
    return Promise.resolve(mockLoginResponse);
  }
}

export class MockAuthServiceInvalidCredentials {
  login() {
    return Promise.reject(invalidCredentialsError);
  }
}

export class MockAuthServiceUsernameConflict {
  register() {
    return Promise.reject(usernameConflictError);
  }
}

export class MockAuthServiceValidation {
  login() {
    return Promise.resolve({});
  }
}
