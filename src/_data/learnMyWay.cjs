const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const learnMyWayContent = await client.getEntry('6psoGLQ5O0go3e7102AvnP');
  return learnMyWayContent;
};