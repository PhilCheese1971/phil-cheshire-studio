const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const videoContent = await client.getEntry('3ZsgIZtSpYEZSkpo7IpF7n');
  return videoContent;
};