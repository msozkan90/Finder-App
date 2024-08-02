const User = require("../models/User");
const elasticClient = require("../config/elasticClient");

const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (userId) => {
  return await User.findById(userId);
};

const updateUserProfile = async (userId, profileData) => {
  return await User.findByIdAndUpdate(userId, profileData, { new: true });
};

const findNearbyUsers = async (coordinates, maxDistance, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const users = await User.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates },
        $maxDistance: maxDistance
      }
    }
  })
  .skip(skip)
  .limit(limit);

  const totalUsers = await User.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates },
        distanceField: 'dist.calculated',
        maxDistance: maxDistance,
        spherical: true
      }
    },
    {
      $count: "count"
    }
  ]);

  const totalPages = Math.ceil((totalUsers[0] ? totalUsers[0].count : 0) / limit);

  return { users, totalPages };
};

const searchUsers = async (query) => {
  try {
    console.log(query);
    const response = await elasticClient.search({
      index: "users",
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: query,
                  fields: ["bio", "name", "email"],
                },
              },
            ],
          },
        },
      },
    });

    if (response && response.hits) {
      return response.hits.hits.map((hit) => {
        return {
          _id: hit._id,
          ...hit._source,
        };
      });
    } else {
      throw new Error("Unexpected Elasticsearch response format");
    }
  } catch (error) {
    console.error("Elasticsearch sorgu hatası:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserProfile,
  findNearbyUsers,
  searchUsers,
  findUserById,
};
