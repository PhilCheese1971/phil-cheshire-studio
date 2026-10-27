require("dotenv").config();
const contentful = require('contentful')

module.exports = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN
});