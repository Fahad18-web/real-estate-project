import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.ACCESS_TOKEN_SECRET || 'default_access_secret',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};
