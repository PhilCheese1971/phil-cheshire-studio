const client = require("../lib/contentful.cjs");

module.exports = async () => {
  const images = await client.getAssets({ "sys.id[in]": "4JMhr1xfXkHKpvnluTMidM,1E2JYa9Aq8BXCydYKyUTBC,4tyfijNPB1jYJAsjrPbEjC" });
  return images.items;
};