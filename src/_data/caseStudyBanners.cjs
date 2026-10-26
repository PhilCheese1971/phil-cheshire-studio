const contentful = require('contentful')

const client = contentful.createClient({
  space: uktepak5k90i,
  accessToken: XI0jg7Q9IcwHS-so35lE5c9m4fORVFWzIYqfyvSCMqA,
  environment: 'master'
});

module.exports = async () => {
  // 11ty will catch errors automatically if this fails
  const banners = await client.getEntries({
    content_type: 'websitesHomeCaseStudyBanner'
  });
  return banners.items;
};