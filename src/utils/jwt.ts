import jwt from 'jsonwebtoken';

export const generateAccessToken = <P extends Record<string, any>>(
  payload: P,
  expiresIn: string | number = new Date(
    Date.now() + Number(process.env.JWT_ACCESS_EXPIRES_IN) * 1000,
  ).getTime(),
) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });

export const verifyAccessToken = <P>(token: string): P =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET) as P;

export const decodeAccessToken = <P>(token: string): P =>
  jwt.decode(token) as P;
