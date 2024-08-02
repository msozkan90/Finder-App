const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const elasticClient = require("../config/elasticClient");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    avatarImages: [String],
    bio: String,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number],
    },
  },
  {
    _id: true,
    collection: "users",
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.index({ location: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.post("save", async function (doc) {
  console.log("saved document:");
  await elasticClient.index({
    index: "users",
    id: doc._id.toString(),
    body: {
      name: doc.name,
      email: doc.email,
      bio: doc.bio,
      location: doc.location,
    },
  });
});

userSchema.post("findOneAndUpdate", async function (doc) {
  await elasticClient.update({
    index: "users",
    id: doc._id.toString(),
    body: {
      doc: {
        name: doc.name,
        email: doc.email,
        bio: doc.bio,
        location: doc.location,
      },
    },
  });
});

userSchema.post("findOneAndDelete", async function (doc) {
  await elasticClient.delete({
    index: "users",
    id: doc._id.toString(),
  });
});

module.exports = mongoose.model("User", userSchema);
