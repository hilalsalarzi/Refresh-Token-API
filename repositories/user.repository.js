// repositories/user.repository.js
import User from '../models/users.model.js';

export default {
  findByEmail: (email) => User.findOne({ email }),
  findByRefreshToken: (refreshToken) => User.findOne({ refreshToken }),
  findByUsernameOrEmail: (username, email) =>
    User.find({ $or: [{ email }, { username }] }),
  findAll: () => User.find(),
  save: (user) => user.save(),
};
