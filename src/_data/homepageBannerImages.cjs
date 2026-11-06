const client = require("../lib/contentful.cjs");

const ids = [
  "4JMhr1xfXkHKpvnluTMidM",
  "1E2JYa9Aq8BXCydYKyUTBC",
  "4tyfijNPB1jYJAsjrPbEjC",
];



module.exports = async () => {
  const res = await client.getAssets({ "sys.id[in]": ids.join(",") });
  const images = ids
    .map((id) => res.items.find((asset) => asset.sys.id === id))
    .filter(Boolean);
  return images;
};