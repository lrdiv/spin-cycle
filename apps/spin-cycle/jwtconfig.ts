import 'dotenv/config';

export const jwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '60s' },
};
