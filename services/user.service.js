// services/user.service.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export default {
  register: async ({ username, age, email, course, password }) => {
    const existing = await userRepository.findByUsernameOrEmail(username, email);
    if (existing.length > 0) {
      throw new Error('username or email already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new (await import('../models/users.model.js')).default({
      username,
      age,
      email,
      course,
      password: hashedPassword,
    });

    await userRepository.save(user);
    return { message: 'Student registered successfully' };
  },

  login: async (email, password) => {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await userRepository.save(user);

    return tokens;
  },

  refreshToken: async (refreshToken) => {
    if (!refreshToken) throw new Error('No token provided');

    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new Error('Forbidden');

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
        if (err) return reject(new Error('Forbidden'));

        const accessToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );

        resolve({ accessToken });
      });
    });
  },

  getAllUsers: async () => {
    return userRepository.findAll();
  },

  logout: async (refreshToken) => {
    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user) throw new Error('User not found or already logged out');

    user.refreshToken = undefined;
    await userRepository.save(user);
    return { message: 'Logged out successfully' };
  },
};
