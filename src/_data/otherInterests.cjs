const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const otherInterestsContent = await client.getEntry('4jM4PNxRSzQPffH5nJ51n5');
  return otherInterestsContent;
};