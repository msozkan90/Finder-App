const db = {
  uri: process.env.MONGO_URI || '',
  host: process.env.DB_HOST || '',
  port: process.env.PORT || '',
};

const elasticSearch = {
  host: process.env.ELASTICSEARCH_HOST || '',
}

const jwtSecret = process.env.JWT_SECRET;

const redis = {
  host: process.env.REDIS_HOST || '',
  port: parseInt(process.env.REDIS_PORT || '0'),
};

const caching = {
  contentCacheDuration: parseInt(
    process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
  ),
};

module.exports = {
  db,
  elasticSearch,
  jwtSecret,
  redis,
  caching,
}