const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const videoHeading1Content = await client.getEntry('3ZsgIZtSpYEZSkpo7IpF7n');
  return videoHeading1Content;
};