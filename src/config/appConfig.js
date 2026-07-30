export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || "LastKey",

  apiBaseUrl: (() => {
    let rawUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8080/api/v1";

    // Clean all trailing slashes
    rawUrl = rawUrl.trim().replace(/\/+$/, "");

    // Ensure it ends with /api/v1 without duplication
    if (rawUrl.endsWith("/api/v1")) {
      return rawUrl;
    }
    return `${rawUrl}/api/v1`;
  })(),

  environment:
    import.meta.env.VITE_APP_ENV || "development",

  tokenKeys: {
    accessToken: "lastkey_access_token",
    refreshToken: "lastkey_refresh_token",
    user: "lastkey_user",
  },

  pagination: {
    defaultPage: 0,
    defaultPageSize: 10,
  },

  upload: {
    maxFileSize: 10 * 1024 * 1024,

    allowedMimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  },
};