const redis = require('redis');
const { redis : redisConfig } = require('../config/config');

const redisURL = `redis://${redisConfig.host}:${redisConfig.port}`;

const client = redis.createClient({ url: redisURL });

client.on('connect', () => console.log('Cache is connecting'));
client.on('ready', () => console.log('Cache is ready'));
client.on('end', () => console.log('Cache disconnected'));
client.on('reconnecting', () => console.log('Cache is reconnecting'));
client.on('error', (e) => console.log(e));

(async () => {
  await client.connect();
})();

process.on('SIGINT', async () => {
  await client.disconnect();
});

module.exports = client;