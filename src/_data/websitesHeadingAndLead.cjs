const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const webContent = await client.getEntry('3ZyzQeMZuEPyMQvpBB092Z');
  return webContent;
};