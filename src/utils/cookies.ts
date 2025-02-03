import { Response } from 'express';

export const addTokenToCookies = (
  res: Response,
  token: string,
  expiresAt: Date,
) => {
  return res.cookie('accessToken', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    expires: expiresAt,
  });
};

export const deleteTokenFromCookies = (res) => {
  res.status(200).clearCookie('accessToken');
};
