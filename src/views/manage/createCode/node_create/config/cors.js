module.exports = corsConfigs = {
  exposeHeaders: ["WWW-Authenticate", "Server-Authorization", "Date"],
  maxAge: 100,
  credentials: true,
  allowMethods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
  accessControlAllowOrigin: "*",
  allowHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Custom-Header",
      "anonymous",
      "Browser",
  ],
};