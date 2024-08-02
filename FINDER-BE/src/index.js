const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const redisClient = require('./config/redisClient');
const initializeSocket = require('./config/socket');
const genericErrorHandler  = require('./middlewares/errorMiddleware');
const { db } = require('./config/config');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(db.uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.use(genericErrorHandler);

io.on('connection', (socket) => {
  console.log('New client connected with socket id:', socket.id);

  socket.on('register', async (userId) => {
    console.log(`Register event received for user id: ${userId}`);
    if (!redisClient.isReady) {
      console.error('Redis client is not ready');
      return;
    }
    try {
      await redisClient.set(userId, socket.id);
      console.log(`User ${userId} registered with socket id ${socket.id}`);
    } catch (err) {
      console.error('Redis set error:', err);
    }
  });

  socket.on('like', async (data) => {
    console.log(`Like event received with data:`, data);
    if (!redisClient.isReady) {
      console.error('Redis client is not ready');
      return;
    }
    try {
      const receiverSocketId = await redisClient.get(data.receiverId);
      console.log(`Like event: receiverSocketId=${receiverSocketId}`);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification', { message: 'You have a new like!', messageType: "like", });
        console.log(`Notification sent to socket id ${receiverSocketId}`);
      } else {
        console.log(`No socket id found for user ${data.receiverId}`);
      }
    } catch (err) {
      console.error('Redis get error:', err);
    }
  });

  socket.on('dislike', async (data) => {
    console.log(`Dislike event received with data:`, data);
    if (!redisClient.isReady) {
      console.error('Redis client is not ready');
      return;
    }
    try {
      const receiverSocketId = await redisClient.get(data.receiverId);
      console.log(`Dislike event: receiverSocketId=${receiverSocketId}`);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification', { message: 'You have a new Dislike!', messageType: "dislike", });
        console.log(`Notification sent to socket id ${receiverSocketId}`);
      } else {
        console.log(`No socket id found for user ${data.receiverId}`);
      }
    } catch (err) {
      console.error('Redis get error:', err);
    }
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected with socket id:', socket.id);
    if (!redisClient.isReady) {
      console.error('Redis client is not ready');
      return;
    }
    try {
      await redisClient.del(socket.id);
    } catch (err) {
      console.error('Redis delete error:', err);
    }
  });
});

const PORT = db.port || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
