const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');
const { elasticSearch } = require('../config/config');

dotenv.config();

const client = new Client({
  node: elasticSearch.host,
});

module.exports = client;
