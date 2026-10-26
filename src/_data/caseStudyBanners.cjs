const contentful = require('contentful')

const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
  environment: 'master'
})

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const banners = await client.getEntries({
    content_type: 'websitesHomeCaseStudyBanner'
  });
  console.log(banners.length)
  return banners.items;
};