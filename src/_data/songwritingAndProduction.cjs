const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const songwritingContent = await client.getEntry('xwZVe56nIOobReNI5J21a');
  return songwritingContent;
};