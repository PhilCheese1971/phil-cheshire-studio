const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const panels = await client.getEntries({
    content_type: 'filmAndVideoHomePanel',
    order: 'sys.createdAt'
  });
  return panels.items;
};