const mongoose = require('mongoose');
const User = require('../models/User');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { db } = require('../config/config');

dotenv.config();

mongoose.connect(db.uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const createFakeUser = () => {
  return new User({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'SecurePassword123',
    avatarImages: [faker.image.avatar()],
    bio: faker.lorem.sentence(),
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(faker.location.longitude()),
        parseFloat(faker.location.latitude())
      ]
    }
  });
};

const createBulkUsers = async (numUsers) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = createFakeUser();
    users.push(user.save());
  }
  await Promise.all(users);
  console.log(`${numUsers} users created`);
};

createBulkUsers(500)
  .then(() => mongoose.disconnect())
  .catch(err => console.error('Error creating users:', err));
