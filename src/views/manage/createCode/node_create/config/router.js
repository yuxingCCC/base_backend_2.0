module.exports = function router(router) {
  router.use("/api/createCode", require("../routers/api/createTable"));
  router.use("/api/automation", require("../routers/api/automation"));
};