const contentful = require('contentful');
require("dotenv").config();

module.exports = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});