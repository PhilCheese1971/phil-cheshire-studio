const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const aiGatewayContent = await client.getEntry('5A7denL82ONyEQH41jPlMA');
  return aiGatewayContent;
};