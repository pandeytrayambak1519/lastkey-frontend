import axiosClient from "./axiosClient";

export const authApi = {
  register(registrationData) {
    return axiosClient.post(
      "/api/v1/auth/register",
      registrationData,
    );
  },

  login(credentials) {
    return axiosClient.post(
      "/api/v1/auth/login",
      credentials,
    );
  },

  verifyEmail(verificationData) {
    return axiosClient.post(
      "/api/v1/auth/verify-email",
      verificationData,
    );
  },

  resendVerificationOtp(email) {
    return axiosClient.post(
      "/api/v1/auth/resend-verification-otp",
      {
        email,
      },
    );
  },

  forgotPassword(email) {
    return axiosClient.post(
      "/api/v1/auth/forgot-password",
      {
        email,
      },
    );
  },

  resetPassword(resetData) {
    return axiosClient.post(
      "/api/v1/auth/reset-password",
      resetData,
    );
  },

  refreshToken(refreshToken) {
    return axiosClient.post(
      "/api/v1/auth/refresh-token",
      {
        refreshToken,
      },
    );
  },

  logout(refreshToken) {
    return axiosClient.post(
      "/api/v1/auth/logout",
      {
        refreshToken,
      },
    );
  },
};