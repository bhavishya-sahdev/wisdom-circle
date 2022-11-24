/* eslint-disable prettier/prettier */
import { sign, JwtPayload } from 'jsonwebtoken';

const generateJwt = (payload: JwtPayload) => {
  return `Bearer ${sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: '3 days',
  })}`;
};

export default generateJwt;
