const client = require("../lib/contentful.cjs");

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const banners = await client.getEntries({
    content_type: 'websitesHomeCaseStudyBanner'
  });
  return banners.items;
};