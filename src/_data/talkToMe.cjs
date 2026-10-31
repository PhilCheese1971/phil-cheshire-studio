const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const talkToMeContent = await client.getEntry('3z2mclUSvHYdOu9XeR0LIB');
  return talkToMeContent;
};