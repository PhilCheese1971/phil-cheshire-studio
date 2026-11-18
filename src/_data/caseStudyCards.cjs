const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const cards = await client.getEntries({
    content_type: 'websitesHomeCaseStudyBanner',
    order: '-sys.createdAt'
  });
  return cards.items;
};