const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const goodThingsNetworkContent = await client.getEntry('3G5lyOq8YCmoLpGkjFHxNN');
  return goodThingsNetworkContent;
};