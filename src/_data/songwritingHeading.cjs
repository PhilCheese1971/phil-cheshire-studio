const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const songwritingHeading1Content = await client.getEntry('21UTr3nQhObL0hEMAFdstx');
  return songwritingHeading1Content;
};