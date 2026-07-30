export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || "LastKey",

  apiBaseUrl: (() => {
    const rawUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8080/api/v1";

    // Clean trailing slashes if any
    const cleanUrl = rawUrl.replace(/\/+$/, "");

    // Automatically append /api/v1 if it is missing from the URL
    return cleanUrl.endsWith("/api/v1") ? cleanUrl : `${cleanUrl}/api/v1`;
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