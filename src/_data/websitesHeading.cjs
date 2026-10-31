const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const webHeading1Content = await client.getEntry('3ZyzQeMZuEPyMQvpBB092Z');
  return webHeading1Content;
};