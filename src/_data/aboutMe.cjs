const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const aboutContent = await client.getEntry('1qH20UVAK5asJx9PoQeoBJ');
  return aboutContent;
};